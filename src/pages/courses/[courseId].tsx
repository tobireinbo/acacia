import { useMutation, useQuery } from "@apollo/client";
import AdminContainer from "src/shared/components/AdminContainer";
import Button from "src/shared/components/Button";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import Markdown from "src/shared/components/Markdown";
import TextLink from "src/shared/components/TextLink";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import useRouterParam from "src/shared/hooks/useRouterParam";
import { useAuth } from "src/modules/auth/auth.context";
import ParticipantsList from "src/shared/components/ParticipantsList";
import { PopulatedCourse } from "src/modules/courses/interfaces/course.interface";
import { FIND_COURSES_DETAILED } from "src/modules/courses/queries/find-courses-detailed";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import { UPDATE_COURSE } from "src/modules/courses/queries/update-course.query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

const CoursePage: NextPage = () => {
  const courseId = useRouterParam("courseId");
  const { data, loading, error } = useQuery<{
    courses: Array<PopulatedCourse>;
  }>(FIND_COURSES_DETAILED, {
    variables: {
      where: {
        uuid: courseId,
      },
    },
  });
  const router = useRouter();

  const path = useMemo(() => {
    const _path = [{ title: "Courses", href: "/courses" }];
    if (data?.courses[0]) {
      _path.push({
        title: data?.courses[0].title,
        href: `/courses/${data?.courses[0].uuid}`,
      });
    }
    return _path;
  }, [data]);
  return (
    <DashboardLayout
      path={path}
      title={
        <>
          {data?.courses[0]?.title}
          <AdminContainer>
            <TextLink href={`/admin/courses/edit?courseId=${courseId}`}>
              edit
            </TextLink>
          </AdminContainer>
        </>
      }
      loading={loading}
      error={error}
    >
      {!data ? (
        <h3>Course Not Found</h3>
      ) : (
        <div className="flex w-full">
          <div className="basis-2/3 border-r border-stone-200 dark:border-stone-800 pr-4 mr-4">
            <List title="Tutorials" noEntriesLabel="No Tutorials Yet">
              {data.courses[0]?.tutorials?.map((tutorial) => (
                <ListEntry
                  key={tutorial.uuid}
                  title={tutorial.title}
                  subtitle={tutorial.description}
                  onClick={() => router.push(`/tutorials/${tutorial.uuid}`)}
                />
              ))}
            </List>
          </div>
          <div className="basis-1/3 space-y-8">
            <ParticipationButton course={data.courses[0]} />

            <List title="About" hideViewSelector>
              <Markdown src={data.courses[0]?.description} />
            </List>

            <List title="Lecturer" hideViewSelector>
              <ParticipantsList
                participants={
                  data.courses[0]?.lecturer ? [data.courses[0]?.lecturer] : []
                }
              />
            </List>
            <List title="Participants" hideViewSelector>
              <ParticipantsList participants={data.courses[0]?.participants} />
            </List>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoursePage;

const ParticipationButton: React.FC<{ course: PopulatedCourse }> = ({
  course,
}) => {
  const { user } = useAuth();

  const isParticipating = useMemo(() => {
    return course.participants.some((p) => p.uuid === user?.uuid);
  }, [user, course]);

  const [updateCourse, updateCourseResult] = useMutation(UPDATE_COURSE);

  function handleClick() {
    if (user) {
      const connectPayload = {
        participants: [
          {
            where: {
              node: {
                uuid: user.uuid,
              },
            },
          },
        ],
      };

      const connectDisconnect = isParticipating
        ? { disconnect: connectPayload }
        : { connect: connectPayload };
      updateCourse({
        variables: {
          where: {
            uuid: course.uuid,
          },
          ...connectDisconnect,
        },
        refetchQueries: [
          {
            query: FIND_COURSES_DETAILED,
            variables: {
              where: {
                uuid: course.uuid,
              },
            },
          },
          {
            query: FIND_COURSES,
            variables: {
              where: {
                participants_SOME: {
                  uuid: user.uuid,
                },
              },
            },
          },
        ],
      });
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={isParticipating ? "primary-light" : "primary"}
      loading={updateCourseResult.loading}
    >
      {isParticipating ? "Leave This Course" : "Participate"}
    </Button>
  );
};
