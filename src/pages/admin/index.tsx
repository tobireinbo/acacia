import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import withAdmin from "src/shared/wrappers/withAdmin";
import { PATHS } from "src/shared/constants/paths.constant";

const AdminPage: NextPage = () => {
  const router = useRouter();

  return (
    <DashboardLayout path={[PATHS.admin]} title={<>Admin Dashboard</>}>
      <List initialView="grid" hideViewSelector>
        <ListEntry
          title={PATHS.adminCourses.title}
          subtitle="View and Edit Courses"
          onClick={() => router.push(PATHS.adminCourses.href)}
        />
        <ListEntry
          title={PATHS.adminLocations.title}
          subtitle="View and Edit Locations"
          onClick={() => router.push(PATHS.adminLocations.href)}
        />
        <ListEntry
          title={PATHS.adminUsers.title}
          subtitle="View and Edit Users"
          onClick={() => router.push(PATHS.adminUsers.href)}
        />
      </List>
    </DashboardLayout>
  );
};

export default withAdmin(AdminPage);
