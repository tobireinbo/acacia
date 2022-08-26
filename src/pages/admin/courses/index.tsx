import { useQuery } from "@apollo/client";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { Course } from "src/modules/courses/interfaces/course.interface";
import { FIND_COURSES } from "src/modules/courses/queries/find-courses.query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import withAdmin from "src/shared/wrappers/withAdmin";
import { PATHS } from "src/shared/constants/paths.constant";
import IconButton from "src/shared/components/IconButton";

const AdminCoursesOverviewPage: NextPage = () => {
  const router = useRouter();
  const { data, loading } = useQuery<{ courses: Array<Course> }>(FIND_COURSES);

  return (
    <DashboardLayout
      path={[PATHS.admin, PATHS.adminCourses]}
      title={<>All Courses</>}
      loading={loading}
    >
      <List initialView="grid">
        {data?.courses.map((course) => (
          <ListEntry
            title={course.title}
            key={course.uuid}
            onClick={() =>
              router.push(
                `${PATHS.adminCoursesEdit.href}?courseId=${course.uuid}`
              )
            }
          />
        ))}
        <IconButton
          icon={["fas", "add"]}
          variant="plain"
          onClick={() => router.push(PATHS.adminCoursesEdit.href)}
        >
          Add Course
        </IconButton>
      </List>
    </DashboardLayout>
  );
};

export default withAdmin(AdminCoursesOverviewPage);
