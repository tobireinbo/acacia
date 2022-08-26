import { Reference, useMutation, useQuery } from "@apollo/client";
import Button from "src/shared/components/Button";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import TextInput from "src/shared/components/TextInput";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import useRouterParam from "src/shared/hooks/useRouterParam";
import {
  Course,
  PopulatedCourse,
} from "src/modules/courses/interfaces/course.interface";
import { CREATE_COURSE } from "src/modules/courses/queries/create-course.query";
import { DELETE_COURSE } from "src/modules/courses/queries/delete-course.query";
import { useAuth } from "src/modules/auth/auth.context";
import { useSystem } from "src/modules/system/system.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useMemo } from "react";
import Select from "src/shared/components/Select";
import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { FIND_PUBLIC_USERS } from "src/modules/users/queries/find-public-users.query";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import { FIND_COURSES_DETAILED } from "src/modules/courses/queries/find-courses-detailed";
import { UPDATE_COURSE } from "src/modules/courses/queries/update-course.query";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import MarkdownEditor from "src/shared/components/MarkdownEditor";
import { PATHS } from "src/shared/constants/paths.constant";
import { dateHelper } from "src/shared/helper/date.helper";
import IconButton from "src/shared/components/IconButton";
import { produce } from "immer";
import withAdmin from "src/shared/wrappers/withAdmin";
import UsersSearch from "src/shared/components/UsersSearch";

const CourseEditPage: NextPage = () => {
  const router = useRouter();
  const courseId = useRouterParam("courseId");
  const { injectDialogue, addMessage } = useSystem();
  const { user } = useAuth();

  const findCourse = useQuery<{ courses: Array<PopulatedCourse> }>(
    FIND_COURSES_DETAILED,
    {
      variables: {
        where: {
          uuid: courseId,
        },
      },
      skip: !courseId,
    }
  );

  const courseToUpdate = useMemo(() => {
    return findCourse.data?.courses[0];
  }, [findCourse.data]);

  const findAllAdmins = useQuery<{ users: Array<PublicUser> }>(
    FIND_PUBLIC_USERS,
    {
      fetchPolicy: "network-only",
      variables: {
        where: {
          isAdmin: true,
        },
      },
    }
  );
  const [createCourse, createCourseResult] = useMutation<{
    createCourses: { courses: Array<Course> };
  }>(CREATE_COURSE);
  const [updateCourse, updateCourseResult] = useMutation<{
    updateCourses: {
      courses: Array<PopulatedCourse>;
    };
  }>(UPDATE_COURSE);
  const [deleteCourse, deleteCourseResult] = useMutation(DELETE_COURSE);

  function handleCreateOrUpdate(e: FormEvent<any>) {
    e.preventDefault();

    if (!user) {
      return;
    }

    const body = {
      title: e.currentTarget.title.value,
      description: e.currentTarget.description.value,
      lecturerUuid: e.currentTarget.lecturer.value,
    };

    if (courseToUpdate) {
      updateCourse({
        variables: {
          where: {
            uuid: courseToUpdate.uuid,
          },
          connect: {
            lecturer: {
              where: {
                node: {
                  uuid: body.lecturerUuid,
                },
              },
            },
          },
          disconnect: {
            lecturer: {
              where: {
                node_NOT: {
                  uuid: body.lecturerUuid,
                },
              },
            },
          },
          update: {
            title: body.title,
            description: body.description,
          },
        },
        update: (cache, { data }) => {
          const updatedCourse = data?.updateCourses.courses[0];
          if (!updatedCourse) {
            return;
          }
          cache.modify({
            fields: {
              courses: (cachedCourses: Array<PopulatedCourse> = []) => {
                return produce(cachedCourses, (draft) => {
                  const index = draft.findIndex(
                    (c) => c.uuid === updatedCourse.uuid
                  );
                  draft[index] = updatedCourse;
                });
              },
            },
          });
        },
      })
        .then((res) => {
          if (res.data) {
            addMessage({ message: "Successfully Updated Course" });
            router.push(PATHS.adminCourses.href);
          }
        })
        .catch((err) => {
          addMessage({ message: "Failed To Update Course" });
        });
      return;
    }

    createCourse({
      variables: {
        input: [
          {
            title: body.title,
            description: body.description,
            lecturer: {
              connect: {
                where: {
                  node: {
                    uuid: user.uuid,
                  },
                },
              },
            },
          },
        ],
      },
      update: (cache, { data }) => {
        const newCourse = data?.createCourses.courses[0];
        if (!newCourse) {
          return;
        }
        cache.modify({
          fields: {
            courses: (cachedCourses = []) => {
              return [...cachedCourses, newCourse];
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Created Course" });
          router.push(PATHS.adminCourses.href);
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Create Course" });
      });
  }

  function handleDeletion() {
    if (!courseToUpdate) {
      return addMessage({ message: "Couldn't Find Course" });
    }
    deleteCourse({
      variables: {
        where: {
          uuid: courseId,
        },
        delete: {
          tutorials: [
            {
              delete: {
                chapters: [{}],
              },
            },
          ],
        },
      },
      update: (cache) => {
        cache.modify({
          fields: {
            courses: (cachedCourses, { readField }) => {
              return cachedCourses.filter(
                (courseRef: Reference) =>
                  courseToUpdate.uuid !== readField("uuid", courseRef)
              );
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Delete Course" });
          router.replace(PATHS.adminCourses.href);
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Delete Course" });
      });
  }

  const path = useMemo(() => {
    const _path = [PATHS.admin, PATHS.adminCourses];

    if (courseToUpdate) {
      _path.push({
        title: "Edit Course: " + courseToUpdate.title,
        href: `${PATHS.adminCoursesEdit.href}?courseId=${courseId}`,
      });
    } else {
      _path.push(PATHS.adminCoursesEdit);
    }

    return _path;
  }, [courseToUpdate]);

  return (
    <DashboardLayout
      path={path}
      title={courseId ? <>Edit Course</> : <>Create Course</>}
      loading={courseId ? findCourse.loading || findAllAdmins.loading : false}
    >
      {courseToUpdate && (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() =>
              injectDialogue({
                message: `You are about to delete the course: "${courseToUpdate?.title}". Are you sure?`,
                onConfirm: handleDeletion,
              })
            }
          >
            🗑️ Delete Course
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push(`/courses/${courseToUpdate?.uuid}`)}
          >
            📄 Show Page
          </Button>
        </div>
      )}
      {courseId && !courseToUpdate ? (
        <h5>Couldn't find Course</h5>
      ) : (
        <>
          <form onSubmit={handleCreateOrUpdate}>
            <LoadingOverlay
              loading={
                createCourseResult.loading ||
                updateCourseResult.loading ||
                deleteCourseResult.loading
              }
            >
              <List title="Details">
                <TextInput
                  label="Title*"
                  defaultValue={courseToUpdate?.title}
                  name="title"
                  required
                />

                <MarkdownEditor
                  defaultValue={courseToUpdate?.description}
                  name="description"
                  label={"Description"}
                />

                <UsersSearch
                  label="Lecturer*"
                  name="lecturer"
                  required
                  defaultUser={courseToUpdate?.lecturer}
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

          {courseToUpdate && (
            <>
              <List initialView="grid" title="Tutorials">
                {courseToUpdate.tutorials?.map((tutorial) => (
                  <ListEntry
                    onClick={() =>
                      router.push(
                        `${PATHS.adminTutorialsEdit.href}?tutorialId=${tutorial.uuid}`
                      )
                    }
                    title={tutorial.title}
                    subtitle={tutorial.description}
                    key={tutorial.uuid}
                  />
                ))}
                <IconButton
                  icon={["fas", "add"]}
                  onClick={() =>
                    router.push(
                      `${PATHS.adminTutorialsEdit.href}?courseId=${courseId}`
                    )
                  }
                  variant="plain"
                >
                  Add Tutorial
                </IconButton>
              </List>
              <List title="Timeslots" initialView="grid">
                {courseToUpdate.timeslots.map((timeslot) => (
                  <ListEntry
                    onClick={() =>
                      router.push(
                        `${PATHS.adminTimeslotsEdit.href}?timeslotId=${timeslot.uuid}`
                      )
                    }
                    title={dateHelper.isoToFormat(timeslot.startDate, {
                      include: { hour: true, minute: true },
                    })}
                    key={timeslot.uuid}
                  />
                ))}
                <IconButton
                  icon={["fas", "add"]}
                  variant="plain"
                  onClick={() =>
                    router.push(
                      `${PATHS.adminTimeslotsEdit.href}?courseId=${courseToUpdate.uuid}`
                    )
                  }
                >
                  Add Timeslot
                </IconButton>
              </List>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default withAdmin(CourseEditPage);
