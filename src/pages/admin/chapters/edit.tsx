import { useMutation, useQuery } from "@apollo/client";
import Button from "src/shared/components/Button";
import List from "src/shared/components/List";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import MarkdownEditor from "src/shared/components/MarkdownEditor";
import Select from "src/shared/components/Select";
import TextInput from "src/shared/components/TextInput";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import useRouterParam from "src/shared/hooks/useRouterParam";
import { PopulatedChapter } from "src/modules/chapters/interfaces/chapter.interface";
import { CREATE_CHAPTER } from "src/modules/chapters/queries/create-chapter.query";
import { DELETE_CHAPTER } from "src/modules/chapters/queries/delete-chapter.query";
import { FIND_CHAPTERS_DETAILED } from "src/modules/chapters/queries/find-chapers-detailed";
import { UPDATE_CHAPTER } from "src/modules/chapters/queries/update-chapter.query";
import { Tutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { FIND_TUTORIALS_DETAILED } from "src/modules/tutorials/queries/find-tutorials-detailed.query";
import { FIND_TUTORIALS } from "src/modules/tutorials/queries/find-tutorials.query";
import { useSystem } from "src/modules/system/system.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useMemo } from "react";
import { PATHS } from "src/shared/constants/paths.constant";
import withAdmin from "src/shared/wrappers/withAdmin";

const ChapterEditPage: NextPage = () => {
  const chapterId = useRouterParam("chapterId");
  const tutorialId = useRouterParam("tutorialId");
  const { injectDialogue, addMessage } = useSystem();
  const router = useRouter();

  const findChapter = useQuery<{ chapters: Array<PopulatedChapter> }>(
    FIND_CHAPTERS_DETAILED,
    {
      variables: {
        where: {
          uuid: chapterId,
        },
      },
      skip: !chapterId,
    }
  );

  const chapterToUpdate = useMemo(
    () => findChapter.data?.chapters[0],
    [findChapter.data]
  );

  const findAllTutorials = useQuery<{ tutorials: Array<Tutorial> }>(
    FIND_TUTORIALS,
    { fetchPolicy: "network-only" }
  );

  const [createChapter, createChapterResult] = useMutation(CREATE_CHAPTER);
  const [updateChapter, updateChapterResult] = useMutation(UPDATE_CHAPTER);
  const [deleteChapter, deleteChapterResult] = useMutation(DELETE_CHAPTER);

  function handleCreateOrUpdate(e: FormEvent<any>) {
    e.preventDefault();

    const body = {
      title: e.currentTarget.title.value,
      tutorialUuid: e.currentTarget.tutorial.value,
      markdown: e.currentTarget.markdown.value,
    };

    if (chapterToUpdate) {
      updateChapter({
        variables: {
          where: {
            uuid: chapterToUpdate.uuid,
          },
          connect: {
            tutorial: {
              where: {
                node: {
                  uuid: body.tutorialUuid,
                },
              },
            },
          },
          disconnect: {
            tutorial: {
              where: {
                node_NOT: {
                  uuid: body.tutorialUuid,
                },
              },
            },
          },
          update: {
            title: body.title,
            markdown: body.markdown,
          },
        },
        //TODO replace with cache update
        refetchQueries: [
          {
            query: FIND_TUTORIALS_DETAILED,
            variables: {
              where: {
                uuid: body.tutorialUuid,
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
          {
            query: FIND_CHAPTERS_DETAILED,
            variables: {
              where: { uuid: chapterId },
            },
          },
        ],
      })
        .then((res) => {
          if (res.data) {
            addMessage({ message: "Successfully Updated Chapter" });
            router.push(
              `${PATHS.adminTutorialsEdit.href}?tutorialId=${res.data.updateChapters.chapters[0].tutorial.uuid}`
            );
          }
        })
        .catch((err) => {
          addMessage({ message: "Failed To Update Chapter" });
        });
      return;
    }

    createChapter({
      variables: {
        input: [
          {
            title: body.title,
            markdown: body.markdown,
            tutorial: {
              connect: {
                where: {
                  node: {
                    uuid: body.tutorialUuid,
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
          query: FIND_TUTORIALS_DETAILED,
          variables: {
            where: {
              uuid: body.tutorialUuid,
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
          addMessage({ message: "Successfully Created Chapter" });
          router.push(
            `${PATHS.adminTutorialsEdit.href}?tutorialId=${res.data.createChapters.chapters[0].tutorial.uuid}`
          );
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Delete Chapter" });
      });
  }

  function handleDeletion() {
    if (!chapterToUpdate) {
      return addMessage({ message: "Couldn't Find Chapter" });
    }

    deleteChapter({
      variables: {
        where: {
          uuid: chapterId,
        },
      },
      //TODO replace with cache update
      refetchQueries: [
        {
          query: FIND_TUTORIALS_DETAILED,
          variables: {
            where: {
              uuid: chapterToUpdate.tutorial?.uuid,
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
          addMessage({ message: "Successfully Deleted Chapter" });
          router.replace(
            `${PATHS.adminTutorialsEdit.href}?tutorialId=${chapterToUpdate.tutorial?.uuid}`
          );
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Delete Chapter" });
      });
  }

  const path = useMemo(() => {
    const _path = [PATHS.admin, PATHS.adminCourses];

    if (chapterToUpdate) {
      if (chapterToUpdate?.tutorial?.course) {
        _path.push(
          {
            href: `${PATHS.adminCoursesEdit.href}?courseId=${chapterToUpdate.tutorial.course.uuid}`,
            title: `Edit Course: ${chapterToUpdate?.tutorial?.course.title}`,
          },
          {
            href: `${PATHS.adminTutorialsEdit.href}?tutorialId=${chapterToUpdate.tutorial.uuid}`,
            title: `Edit Tutorial: ${chapterToUpdate?.tutorial?.title}`,
          }
        );
      }
      _path.push({
        href: `${PATHS.adminChaptersEdit.href}?chapterId=${chapterToUpdate.uuid}`,
        title: `Edit Chapter: ${chapterToUpdate.title}`,
      });
    } else {
      //TODO
    }

    return _path;
  }, [chapterToUpdate]);

  return (
    <DashboardLayout
      path={path}
      title={chapterId ? <>Edit Chapter</> : <>Create Chapter</>}
      loading={
        findAllTutorials.loading || (chapterId ? findChapter.loading : false)
      }
    >
      {chapterToUpdate && (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() =>
              injectDialogue({
                message: `You are about to delete the chapter: "${chapterToUpdate.title}"`,
                onConfirm: handleDeletion,
              })
            }
          >
            🗑️ Delete Chapter
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/tutorials/${chapterToUpdate.tutorial?.uuid}`)
            }
          >
            📄 Show Page
          </Button>
        </div>
      )}
      {chapterId && !chapterToUpdate ? (
        <h5>Couldn't find Chapter</h5>
      ) : (
        <>
          <form onSubmit={handleCreateOrUpdate}>
            <LoadingOverlay
              loading={
                createChapterResult.loading ||
                updateChapterResult.loading ||
                deleteChapterResult.loading
              }
            >
              <List title="Details">
                <TextInput
                  required
                  label="Title"
                  name="title"
                  defaultValue={chapterToUpdate?.title}
                />
                <MarkdownEditor
                  label="Markdown"
                  name="markdown"
                  defaultValue={chapterToUpdate?.markdown}
                />

                <Select
                  label="Tutorial"
                  name="tutorial"
                  required
                  defaultValue={
                    chapterToUpdate?.tutorial?.uuid || tutorialId || ""
                  }
                >
                  <option disabled value={""}>
                    Select a Tutorial
                  </option>
                  {findAllTutorials.data?.tutorials.map((tutorial) => (
                    <option key={tutorial.uuid} value={tutorial.uuid}>
                      {tutorial.title}
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
        </>
      )}
    </DashboardLayout>
  );
};

export default withAdmin(ChapterEditPage);
