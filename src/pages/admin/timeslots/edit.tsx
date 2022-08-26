import { useMutation, useQuery } from "@apollo/client";
import { useSystem } from "src/modules/system/system.context";
import useRouterParam from "src/shared/hooks/useRouterParam";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { PopulatedTimeslot } from "src/modules/timeslots/interfaces/timeslot.interface";
import { FormEvent, useMemo } from "react";
import Button from "src/shared/components/Button";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import List from "src/shared/components/List";
import { CREATE_TIMESLOT } from "src/modules/timeslots/queries/create-timeslot.query";
import { UPDATE_TIMESLOT } from "src/modules/timeslots/queries/update-timeslot.query";
import { DELETE_TIMESLOT } from "src/modules/timeslots/queries/delete-timeslot.query";
import { PATHS } from "src/shared/constants/paths.constant";
import { FIND_TIMESLOTS_DETAILED } from "src/modules/timeslots/queries/find-timeslots-detailed.query";
import { dateHelper } from "src/shared/helper/date.helper";
import { Location } from "src/modules/locations/interfaces/location.interface";
import { FIND_LOCATIONS } from "src/modules/locations/queries/find-locations.query";
import Select from "src/shared/components/Select";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import { Course } from "src/modules/courses/interfaces/course.interface";
import TextInput from "src/shared/components/TextInput";
import { DateTime } from "neo4j-driver";
import { FIND_COURSES_DETAILED } from "src/modules/courses/queries/find-courses-detailed";
import Checkbox from "src/shared/components/Checkbox";
import withAdmin from "src/shared/wrappers/withAdmin";

const TimeslotEditPage: NextPage = () => {
  const router = useRouter();
  const timeslotId = useRouterParam("timeslotId");
  const courseId = useRouterParam("courseId");
  const { injectDialogue, addMessage } = useSystem();

  const findTimeslot = useQuery<{ timeslots: Array<PopulatedTimeslot> }>(
    FIND_TIMESLOTS_DETAILED,
    {
      variables: {
        where: {
          uuid: timeslotId || null,
        },
      },
      skip: !timeslotId,
    }
  );

  const timeslotToUpdate = useMemo(() => {
    return findTimeslot.data?.timeslots[0];
  }, [findTimeslot.data]);

  const timeslotToUpdateTitle = useMemo(() => {
    return (
      timeslotToUpdate &&
      dateHelper.isoToFormat(timeslotToUpdate?.startDate, {
        include: { hour: true, minute: true },
      })
    );
  }, [timeslotToUpdate]);

  const findAllLocations = useQuery<{ locations: Array<Location> }>(
    FIND_LOCATIONS,
    {
      fetchPolicy: "network-only",
      variables: {
        options: {
          limit: null,
          offset: null,
        },
      },
    }
  );
  const findAllCourses = useQuery<{ courses: Array<Course> }>(FIND_COURSES);

  const [createTimeslot, createTimeslotResult] = useMutation(CREATE_TIMESLOT);
  const [updateTimeslot, updateTimeslotResult] = useMutation(UPDATE_TIMESLOT);
  const [deleteTimeslot, deleteTimeslotResult] = useMutation(DELETE_TIMESLOT);

  function handleCreateOrUpdate(e: FormEvent<any>): void {
    e.preventDefault();

    const body = {
      startDate: e.currentTarget.startDate.value + "Z", //!Hacky
      endDate: e.currentTarget.endDate.value + "Z", //!Hacky
      reoccuring: e.currentTarget.reoccuring.checked,
      locationUuid: e.currentTarget.location.value,
      courseUuid: e.currentTarget.course.value,
    };

    if (timeslotToUpdate) {
      updateTimeslot({
        variables: {
          where: {
            uuid: timeslotToUpdate.uuid,
          },
          update: {
            startDate: body.startDate,
            endDate: body.endDate,
            reoccuring: body.reoccuring,
          },
          diconnect: {
            location: {
              where: {
                node_NOT: {
                  uuid: body.locationUuid,
                },
              },
            },
            course: {
              where: {
                node_NOT: {
                  uuid: body.courseUuid,
                },
              },
            },
          },
          connect: {
            location: {
              where: {
                node: {
                  uuid: body.locationUuid,
                },
              },
            },
            course: {
              where: {
                node: {
                  uuid: body.courseUuid,
                },
              },
            },
          },
        },
        //TODO replace with cache update
        refetchQueries: [
          {
            query: FIND_TIMESLOTS_DETAILED,
            variables: {
              where: {
                uuid: timeslotId || null,
              },
            },
          },
          {
            query: FIND_COURSES_DETAILED,
            variables: {
              where: {
                uuid: body.courseUuid,
              },
            },
          },
        ],
      })
        .then((res) => {
          if (res.data) {
            addMessage({ message: "Successfully Updated Timeslot" });
            router.push(
              `${PATHS.adminCoursesEdit.href}?courseId=${
                res.data.updateTimeslots?.timeslots[0]?.course?.uuid || ""
              }`
            );
          }
        })
        .catch((err) => {
          addMessage({ message: "Failed To Update Timeslot" });
        });
      return;
    }

    createTimeslot({
      variables: {
        input: [
          {
            startDate: body.startDate,
            endDate: body.endDate,
            reoccuring: body.reoccuring,
            location: {
              connect: {
                where: {
                  node: {
                    uuid: body.locationUuid,
                  },
                },
              },
            },
            course: {
              connect: {
                where: {
                  node: {
                    uuid: body.courseUuid,
                  },
                },
              },
            },
          },
        ],
      },
      //TODO replace with cache update
      refetchQueries: [
        {
          query: FIND_COURSES_DETAILED,
          variables: {
            where: {
              uuid: body.courseUuid,
            },
          },
        },
      ],
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Created Timeslot" });
          router.push(
            `${PATHS.adminCoursesEdit.href}?courseId=${
              res.data.createTimeslots?.timeslots[0]?.course?.uuid || ""
            }`
          );
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Create Timeslot" });
      });
  }

  function handleDeletion() {
    if (!timeslotToUpdate) {
      return addMessage({ message: "Timeslot Not Found" });
    }

    deleteTimeslot({
      variables: {
        where: {
          uuid: timeslotToUpdate.uuid,
        },
      },
      //TODO replace with cache update
      refetchQueries: [
        {
          query: FIND_COURSES_DETAILED,
          variables: {
            where: {
              uuid: timeslotToUpdate.course?.uuid || null,
            },
          },
        },
      ],
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Deleted Timeslot" });
          router.replace(
            `${PATHS.adminCoursesEdit.href}?courseId=${timeslotToUpdate.course?.uuid}`
          );
        }
      })
      .catch(() => addMessage({ message: "Failed To Delete Timeslot" }));
  }
  const path = useMemo(() => {
    const _path = [PATHS.admin, PATHS.adminCourses];

    if (timeslotToUpdate) {
      _path.push(
        {
          title: "Edit Course: " + timeslotToUpdate.course?.title,
          href: `${PATHS.adminCoursesEdit.href}?courseId=${
            timeslotToUpdate.course?.uuid || ""
          }`,
        },
        {
          title: "Edit Timeslot: " + timeslotToUpdateTitle,
          href: `${PATHS.adminTimeslotsEdit.href}?timeslotId=${timeslotId}`,
        }
      );
    } else {
      const findCourse = findAllCourses.data?.courses.find(
        (c) => c.uuid === courseId
      );
      _path.push(
        {
          title: "Edit Course: " + findCourse?.title,
          href: `${PATHS.adminCoursesEdit.href}?courseId=${
            findCourse?.uuid || ""
          }`,
        },
        {
          title: PATHS.adminTimeslotsEdit.title,
          href: `${PATHS.adminTimeslotsEdit.href}?courseId=${courseId}`,
        }
      );
    }

    return _path;
  }, [timeslotToUpdate, courseId, findAllCourses]);

  return (
    <DashboardLayout
      path={path}
      title={timeslotId ? <>Edit Timeslot</> : <>Create Timeslot</>}
      loading={
        findAllCourses.loading ||
        findAllLocations.loading ||
        (timeslotId ? findTimeslot.loading : false)
      }
    >
      {timeslotToUpdate && (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() =>
              injectDialogue({
                message: `You are about to delete the course: "${timeslotToUpdateTitle}". Are you sure?`,
                onConfirm: handleDeletion,
              })
            }
          >
            🗑️ Delete Timeslot
          </Button>
        </div>
      )}
      {timeslotId && !timeslotToUpdate ? (
        <h5>Couldn't find Timeslot</h5>
      ) : (
        <>
          <form onSubmit={handleCreateOrUpdate}>
            <LoadingOverlay
              loading={
                deleteTimeslotResult.loading ||
                createTimeslotResult.loading ||
                updateTimeslotResult.loading
              }
            >
              <List title="Details">
                <TextInput
                  label="Start Date*"
                  type={"datetime-local"}
                  required
                  name="startDate"
                  defaultValue={timeslotToUpdate?.startDate.split("Z")[0] || ""} //!Hacky Solution which removes timezone information
                />
                <TextInput
                  label="End Date*"
                  type={"datetime-local"}
                  required
                  name="endDate"
                  defaultValue={timeslotToUpdate?.endDate.split("Z")[0] || ""} //! Same as above
                />

                <Checkbox
                  label="Reoccuring"
                  name="reoccuring"
                  defaultChecked={timeslotToUpdate?.reoccuring || false}
                />
                <Select
                  name="location"
                  required
                  label="Location*"
                  defaultValue={timeslotToUpdate?.location?.uuid || ""}
                >
                  <option disabled value={""}>
                    Select a Location
                  </option>
                  {findAllLocations.data?.locations.map((location) => (
                    <option key={location.uuid} value={location.uuid}>
                      {location.title}
                    </option>
                  ))}
                </Select>
                <Select
                  name="course"
                  required
                  label="Course*"
                  defaultValue={
                    timeslotToUpdate?.course?.uuid || courseId || ""
                  }
                >
                  <option disabled value={""}>
                    Select a Course
                  </option>
                  {findAllCourses.data?.courses.map((course) => (
                    <option key={course.uuid} value={course.uuid}>
                      {course.title}
                    </option>
                  ))}
                </Select>

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

export default withAdmin(TimeslotEditPage);
