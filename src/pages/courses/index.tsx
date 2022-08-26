import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { useAuth } from "src/modules/auth/auth.context";
import { NextPage } from "next";
import List from "src/shared/components/List";
import { useRouter } from "next/router";
import ListEntry from "src/shared/components/ListEntry";
import { useQuery } from "@apollo/client";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import { Course } from "src/modules/courses/interfaces/course.interface";

const CoursesPage: NextPage = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<{ courses: Array<Course> }>(
    FIND_COURSES,
    {
      variables: {
        where: {
          participants_SOME: {
            uuid: user?.uuid || null,
          },
        },
      },
    }
  );
  const router = useRouter();
  return (
    <DashboardLayout
      path={[{ title: "Courses", href: "/courses" }]}
      title={<>Your Courses</>}
      loading={loading}
      error={error}
    >
      <List>
        {data?.courses?.map((course) => (
          <ListEntry
            title={course.title}
            key={course.uuid}
            onClick={() => router.push(`/courses/${course.uuid}`)}
          />
        ))}
      </List>
    </DashboardLayout>
  );
};

export default CoursesPage;
