import { Reference, useMutation, useQuery } from "@apollo/client";
import { useSystem } from "src/modules/system/system.context";
import useRouterParam from "src/shared/hooks/useRouterParam";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  PopulatedLocation,
  Location,
} from "src/modules/locations/interfaces/location.interface";
import { FormEvent, useMemo } from "react";
import Button from "src/shared/components/Button";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import List from "src/shared/components/List";
import TextInput from "src/shared/components/TextInput";
import { CREATE_LOCATION } from "src/modules/locations/queries/create-location.query";
import { UPDATE_LOCATION } from "src/modules/locations/queries/update-location.query";
import { DELETE_LOCATION } from "src/modules/locations/queries/delete-location.query";
import { PATHS } from "src/shared/constants/paths.constant";
import { FIND_LOCATIONS_DETAILED } from "src/modules/locations/queries/find-locations-detailed.query";
import { produce } from "immer";
import withAdmin from "src/shared/wrappers/withAdmin";

const LocationEditPage: NextPage = () => {
  const router = useRouter();
  const locationId = useRouterParam("locationId");
  const { injectDialogue, addMessage } = useSystem();

  const findLocation = useQuery<{ locations: Array<PopulatedLocation> }>(
    FIND_LOCATIONS_DETAILED,
    {
      variables: {
        where: {
          uuid: locationId,
        },
      },
      skip: !locationId,
    }
  );

  const locationToUpdate = useMemo(() => {
    return findLocation.data?.locations[0];
  }, [findLocation.data]);

  const [createLocation, createLocationResult] = useMutation<{
    createLocations: { locations: Array<Location> };
  }>(CREATE_LOCATION);
  const [updateLocation, updateLocationResult] = useMutation<{
    updateLocations: {
      locations: Array<PopulatedLocation>;
    };
  }>(UPDATE_LOCATION);
  const [deleteLocation, deleteLocationResult] = useMutation(DELETE_LOCATION);

  function handleCreateOrUpdate(e: FormEvent<any>): void {
    e.preventDefault();

    const body = {
      title: e.currentTarget.title.value,
    };

    if (locationToUpdate) {
      updateLocation({
        variables: {
          where: {
            uuid: locationToUpdate.uuid,
          },
          update: {
            title: body.title,
          },
        },
        update: (cache, { data }) => {
          const updatedLocation = data?.updateLocations.locations[0];
          if (!updatedLocation) {
            return;
          }
          cache.modify({
            fields: {
              locations: (cachedLocations: Array<PopulatedLocation> = []) => {
                return produce(cachedLocations, (draft) => {
                  const index = draft.findIndex(
                    (l) => l.uuid === updatedLocation.uuid
                  );
                  draft[index] = updatedLocation;
                });
              },
            },
          });
        },
      })
        .then((res) => {
          if (res.data) {
            addMessage({ message: "Successfully Updated Location" });
            router.push(PATHS.adminLocations.href);
          }
        })
        .catch((err) => {
          addMessage({ message: "Failed To Update Location" });
        });
      return;
    }

    createLocation({
      variables: {
        input: [
          {
            title: body.title,
          },
        ],
      },
      update: (cache, { data }) => {
        const newLocation = data?.createLocations.locations[0];
        if (!newLocation) {
          return;
        }
        cache.modify({
          fields: {
            locations: (cachedLocations = []) => {
              return [...cachedLocations, newLocation];
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Created Location" });
          router.push(PATHS.adminLocations.href);
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Create Location: " });
      });
  }

  function handleDeletion() {
    if (!locationToUpdate) {
      return addMessage({ message: "Location Not Found" });
    }

    deleteLocation({
      variables: {
        where: {
          uuid: locationToUpdate.uuid,
        },
      },
      update: (cache) => {
        cache.modify({
          fields: {
            locations: (cachedLocations, { readField }) => {
              return cachedLocations.filter(
                (locationRef: Reference) =>
                  locationToUpdate.uuid !== readField("uuid", locationRef)
              );
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Deleted Location" });
          router.replace(PATHS.adminLocations.href);
        }
      })
      .catch(() => addMessage({ message: "Failed To Delete Location" }));
  }

  const path = useMemo(() => {
    const _path = [PATHS.admin, PATHS.adminLocations];

    if (locationToUpdate) {
      _path.push({
        title: "Edit Location: " + locationToUpdate.title,
        href: `${PATHS.adminLocationsEdit.href}?locationId=${locationId}`,
      });
    } else {
      _path.push(PATHS.adminLocationsEdit);
    }

    return _path;
  }, [locationToUpdate]);

  return (
    <DashboardLayout
      path={path}
      title={locationId ? <>Edit Location</> : <>Create Location</>}
      loading={locationId ? findLocation.loading : false}
    >
      {locationToUpdate && (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() =>
              injectDialogue({
                message: `You are about to delete the course: "${locationToUpdate?.title}". Are you sure?`,
                onConfirm: handleDeletion,
              })
            }
          >
            🗑️ Delete Location
          </Button>
        </div>
      )}
      {locationId && !locationToUpdate ? (
        <h5>Couldn't find Location</h5>
      ) : (
        <>
          <form onSubmit={handleCreateOrUpdate}>
            <LoadingOverlay
              loading={
                deleteLocationResult.loading ||
                createLocationResult.loading ||
                updateLocationResult.loading
              }
            >
              <List title="Details">
                <TextInput
                  required
                  name="title"
                  label="Title*"
                  defaultValue={locationToUpdate?.title}
                />
                <div className="flex space-x-2">
                  <Button>Save</Button>
                  <Button
                    variant="plain"
                    type="button"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </List>
            </LoadingOverlay>
          </form>
        </>
      )}
    </DashboardLayout>
  );
};

export default withAdmin(LocationEditPage);
