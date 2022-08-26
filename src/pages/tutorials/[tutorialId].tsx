import { useQuery } from "@apollo/client";
import Accordion from "src/shared/components/Accordion";
import AdminContainer from "src/shared/components/AdminContainer";
import Markdown from "src/shared/components/Markdown";
import TextLink from "src/shared/components/TextLink";
import DashboardLayout, {
  DashboardLayoutProps,
} from "src/shared/layouts/DashboardLayout";
import useRouterParam from "src/shared/hooks/useRouterParam";
import { PopulatedTutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { FIND_TUTORIALS_DETAILED } from "src/modules/tutorials/queries/find-tutorials-detailed.query";
import { NextPage } from "next";
import { useMemo } from "react";

const TutorialPage: NextPage = () => {
  const tutorialId = useRouterParam("tutorialId");
  const chapterId = useRouterParam("chapterId");
  const { data, loading, error } = useQuery<{
    tutorials: Array<PopulatedTutorial>;
  }>(FIND_TUTORIALS_DETAILED, {
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
  });

  const tutorialPath = useMemo<DashboardLayoutProps["path"]>(() => {
    const path = [{ title: "Courses", href: "/courses" }];
    if (!data) {
      return;
    }
    if (data?.tutorials[0]?.course) {
      path.push({
        title: data?.tutorials[0]?.course?.title,
        href: `/courses/${data?.tutorials[0]?.course?.uuid}`,
      });
    }
    path.push({
      title: data?.tutorials[0]?.title,
      href: `/tutorials/${data?.tutorials[0]?.uuid}`,
    });

    return path;
  }, [data]);

  return (
    <DashboardLayout
      path={tutorialPath}
      title={
        <>
          {data?.tutorials[0]?.title}
          <AdminContainer>
            <TextLink href={`/admin/tutorials/edit?tutorialId=${tutorialId}`}>
              edit
            </TextLink>
          </AdminContainer>
        </>
      }
      loading={loading}
      error={error}
    >
      {!data ? <h3>Tutorial Not Found</h3> : <div></div>}
      <Accordion
        defaultIndex={
          chapterId
            ? data?.tutorials[0].chapters.findIndex(
                (chapter) => chapter.uuid === chapterId
              )
            : undefined
        }
        fullscreenable
        entries={
          data?.tutorials[0]?.chapters?.map((chapter, index) => ({
            title: chapter.title,
            element: (
              <>
                {chapter.markdown ? (
                  <div className="w-full flex flex-col items-center">
                    <Markdown src={chapter.markdown} className="w-[75ch]" />
                  </div>
                ) : (
                  <p>No Content</p>
                )}
              </>
            ),
          })) || []
        }
        lazy={false}
      />
    </DashboardLayout>
  );
};

export default TutorialPage;
