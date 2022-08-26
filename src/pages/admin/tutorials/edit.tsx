import { useMutation, useQuery } from "@apollo/client";
import Button from "src/shared/components/Button";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import Select from "src/shared/components/Select";
import TextInput from "src/shared/components/TextInput";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import useRouterParam from "src/shared/hooks/useRouterParam";
import {
  Course,
  PopulatedCourse,
} from "src/modules/courses/interfaces/course.interface";
import { FIND_COURSES_DETAILED } from "src/modules/courses/queries/find-courses-detailed";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import { PopulatedTutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { CREATE_TUTORIAL } from "src/modules/tutorials/queries/create-tutorial.query";
import { DELETE_TUTORIAL } from "src/modules/tutorials/queries/delete-tutorial.query";
import { FIND_TUTORIALS_DETAILED } from "src/modules/tutorials/queries/find-tutorials-detailed.query";
import { UPDATE_TUTORIAL } from "src/modules/tutorials/queries/update-tutorial.query";
import { useSystem } from "src/modules/system/system.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useMemo } from "react";
import withAdmin from "src/shared/wrappers/withAdmin";
import { PATHS } from "src/shared/constants/paths.constant";
import IconButton from "src/shared/components/IconButton";
import { produce } from "immer";

const TutorialEditPage: NextPage = () => {
  const router = useRouter();
  const courseId = useRouterParam("courseId");
  const tutorialId = useRouterParam("tutorialId");
  const { injectDialogue, addMessage } = useSystem();

  const findTutorial = useQuery<{ tutorials: Array<PopulatedTutorial> }>(
    FIND_TUTORIALS_DETAILED,
    {
      variables: {
        where: {
          uuid: tutorialId,
        },
        chaptersOptions: {
          sort: [
            {
              createdAt: "ASC",
            },
          ],
        },
      },
      skip: !tutorialId,
    }
  );

  const findAllCourses = useQuery<{ courses: Array<Course> }>(FIND_COURSES, {
    fetchPolicy: "network-only",
  });

  const tutorialToUpdate = useMemo(
    () => findTutorial.data?.tutorials[0],
    [findTutorial.data]
  );

  const [createTutorial, createTutorialResult] = useMutation<{
    createTutorials: { tutorials: Array<PopulatedTutorial> };
  }>(CREATE_TUTORIAL);
  const [updateTutorial, updateTutorialResult] = useMutation(UPDATE_TUTORIAL);
  const [deleteTutorial, deleteTutorialResult] = useMutation(DELETE_TUTORIAL);

  function handleCreateOrUpdate(e: FormEvent<any>) {
    e.preventDefault();

    const body = {
      title: e.currentTarget.title.value,
      description: e.currentTarget.description.value,
      courseUuid: e.currentTarget.course.value,
    };

    if (tutorialToUpdate) {
      updateTutorial({
        variables: {
          where: {
            uuid: tutorialToUpdate.uuid,
          },
          connect: {
            course: {
              where: {
                node: {
                  uuid: body.courseUuid,
                },
              },
            },
          },
          disconnect: {
            course: {
              where: {
                node_NOT: {
                  uuid: body.courseUuid,
                },
              },
            },
          },
          update: {
            title: body.title,
            description: body.description,
          },
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
          {
            query: FIND_TUTORIALS_DETAILED,
            variables: {
              where: {
                uuid: tutorialId || null,
              },
              chaptersOptions: {
                sort: [
                  {
                    createdAt: "ASC",
                  },
                ],
              },
            },
          },
        ],
      })
        .then((res) => {
          if (res.data) {
            addMessage({ message: "Successfully Updated Tutorial" });
            router.push(
              `${PATHS.adminCoursesEdit.href}?courseId=${res.data.updateTutorials.tutorials[0].course.uuid}`
            );
          }
        })
        .catch((err) => {
          addMessage({ message: "Failed To Update Tutorial" });
        });
      return;
    }

    createTutorial({
      variables: {
        input: [
          {
            title: body.title,
            description: body.description,
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
      update: (cache, { data }) => {
        const newTutorial = data?.createTutorials.tutorials[0];
        if (!newTutorial) {
          return;
        }
        cache.modify({
          fields: {
            courses: (cachedCourses: Array<PopulatedCourse> = []) => {
              return produce(cachedCourses, (draft) => {
                const index = draft.findIndex(
                  (c) => c.uuid === newTutorial.course?.uuid
                );
                const found = draft[index];
                draft[index] = {
                  ...found,
                  tutorials: found.tutorials && [
                    ...found.tutorials,
                    newTutorial,
                  ],
                };
              });
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Created Tutorial" });
          router.push(
            `${PATHS.adminCoursesEdit.href}?courseId=${res.data?.createTutorials?.tutorials[0].course?.uuid}`
          );
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Create Tutorial" });
      });
  }

  function handleDeletion() {
    if (!tutorialToUpdate) {
      return addMessage({ message: "Couldn't Find Tutorial" });
    }
    deleteTutorial({
      variables: {
        where: {
          uuid: tutorialId,
        },
        delete: {
          chapters: [{}],
        },
      },
      refetchQueries: [
        {
          query: FIND_COURSES_DETAILED,
          variables: {
            where: {
              uuid: tutorialToUpdate.course?.uuid,
            },
          },
        },
      ],
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Deleted Tutorial" });
          router.replace(
            `${PATHS.adminCoursesEdit.href}?courseId=${tutorialToUpdate.course?.uuid}`
          );
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Delete Tutorial" });
      });
  }

  const path = useMemo(() => {
    const _path = [PATHS.admin, PATHS.adminCourses];

    if (tutorialToUpdate) {
      _path.push(
        {
          title: "Edit Course: " + tutorialToUpdate.course?.title,
          href: `${PATHS.adminCoursesEdit.href}?courseId=${tutorialToUpdate.course?.uuid}`,
        },
        {
          title: "Edit Tutorial: " + tutorialToUpdate.title,
          href: `${PATHS.adminTutorialsEdit.href}?tutorialId=${tutorialId}`,
        }
      );
    } else if (courseId) {
      const findCourse = findAllCourses.data?.courses.find(
        (c) => c.uuid === courseId
      );
      _path.push(
        {
          title: `Edit Course: ${findCourse?.title}`,
          href: `${PATHS.adminCoursesEdit.href}?courseId=${findCourse?.uuid}`,
        },
        {
          title: "Create Turotial",
          href: `${PATHS.adminTutorialsEdit.href}?courseId=${courseId}`,
        }
      );
    }

    return _path;
  }, [tutorialToUpdate, courseId, findAllCourses]);

  return (
    <DashboardLayout
      path={path}
      title={tutorialId ? <>Edit Tutorial</> : <>Create Tutorial</>}
      loading={
        findAllCourses.loading || (tutorialId ? findTutorial.loading : false)
      }
    >
      {tutorialToUpdate && (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() =>
              injectDialogue({
                message: `You are about to delete the tutorial: "${tutorialToUpdate.title}". Are you sure?`,
                onConfirm: handleDeletion,
              })
            }
          >
            🗑️ Delete Tutorial
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/tutorials/${tutorialToUpdate.uuid}`)}
          >
            📄 Show Page
          </Button>
        </div>
      )}
      {tutorialId && !tutorialToUpdate ? (
        <h5>Couldn't find Tutorial</h5>
      ) : (
        <>
          <form onSubmit={handleCreateOrUpdate}>
            <LoadingOverlay
              loading={
                createTutorialResult.loading ||
                updateTutorialResult.loading ||
                deleteTutorialResult.loading
              }
            >
              <List title="Details">
                <TextInput
                  required
                  label="Title*"
                  name="title"
                  defaultValue={tutorialToUpdate?.title}
                />
                <TextInput
                  required
                  label="Description*"
                  name="description"
                  defaultValue={tutorialToUpdate?.description}
                />
                <Select
                  label="Course*"
                  name="course"
                  required
                  defaultValue={
                    tutorialToUpdate?.course?.uuid || courseId || ""
                  }
                >
                  <option disabled value={""}>
                    Select a Course
                  </option>
                  {findAllCourses.data?.courses.map((course) => (
                    <option value={course.uuid} key={course.uuid}>
                      {course.title}
                    </option>
                  ))}
                </Select>

                <div className="flex space-x-2">
                  <Button>Save</Button>
                  <Button
                    onClick={() => router.back()}
                    variant="plain"
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </List>
            </LoadingOverlay>
          </form>

          {tutorialToUpdate && (
            <List initialView="grid" title="Chapters">
              {tutorialToUpdate.chapters?.map((chapter, index) => (
                <ListEntry
                  title={chapter.title}
                  onClick={() =>
                    router.push(
                      `${PATHS.adminChaptersEdit.href}?chapterId=${chapter.uuid}`
                    )
                  }
                  subtitle={"Chapter " + (index + 1)}
                  key={chapter.uuid}
                />
              ))}
              <IconButton
                variant="plain"
                onClick={() =>
                  router.push(
                    `${PATHS.adminChaptersEdit.href}?tutorialId=${tutorialToUpdate?.uuid}`
                  )
                }
                icon={["fas", "add"]}
              >
                Add Chapter
              </IconButton>
            </List>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default withAdmin(TutorialEditPage);
