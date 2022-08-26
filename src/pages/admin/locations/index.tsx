import { useQuery } from "@apollo/client";
import { FIND_LOCATIONS } from "src/modules/locations/queries/find-locations.query";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { NextPage } from "next";
import { Location } from "src/modules/locations/interfaces/location.interface";
import { useRouter } from "next/router";
import IconButton from "src/shared/components/IconButton";
import { PATHS } from "src/shared/constants/paths.constant";
import { PAGINATION_OPTIONS } from "src/shared/constants/pagination.constant";
import withAdmin from "src/shared/wrappers/withAdmin";

const AdminLocationsOverviewPage: NextPage = () => {
  const router = useRouter();
  const findLocations = useQuery<{ locations: Array<Location> }>(
    FIND_LOCATIONS,
    {
      variables: {
        options: {
          limit: PAGINATION_OPTIONS.limit,
          offset: 0,
        },
      },
    }
  );

  return (
    <DashboardLayout
      title={<>All Locations</>}
      path={[PATHS.admin, PATHS.adminLocations]}
      loading={findLocations.loading}
      error={findLocations.error}
    >
      <List
        initialView="grid"
        loadMore={{
          action: () =>
            findLocations.fetchMore({
              variables: {
                options: {
                  limit: PAGINATION_OPTIONS.limit,
                  offset: findLocations.data?.locations.length,
                },
              },
            }),
          end: false,
        }}
      >
        {findLocations.data?.locations.map((location) => (
          <ListEntry
            title={location.title}
            key={location.uuid}
            onClick={() =>
              router.push(
                `${PATHS.adminLocationsEdit.href}?locationId=${location.uuid}`
              )
            }
          />
        ))}
        <IconButton
          variant="plain"
          icon={["fas", "add"]}
          onClick={() => router.push(PATHS.adminLocationsEdit.href)}
        >
          Add Location
        </IconButton>
      </List>
    </DashboardLayout>
  );
};

export default withAdmin(AdminLocationsOverviewPage);
