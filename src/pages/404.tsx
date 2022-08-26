import DashboardLayout from "src/shared/layouts/DashboardLayout";
import TextLink from "src/shared/components/TextLink";
import { NextPage } from "next";

const NotFoundPage: NextPage = () => {
  return (
    <DashboardLayout title={<>404 – Page Not Found</>}>
      <div>
        <TextLink href={"/"}>Back To Home Page</TextLink>
      </div>
    </DashboardLayout>
  );
};

export default NotFoundPage;
