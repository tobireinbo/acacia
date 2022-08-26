import LoadingSpinner from "src/shared/components/LoadingSpinner";
import CenterLayout from "src/shared/layouts/CenterLayout";
import { useAuth } from "src/modules/auth/auth.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAdmin = (Page: NextPage) => {
  const Admin: React.FC = (props) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      if (user && !user?.isAdmin) {
        router.replace("/");
      }
    }, [user]);

    if (!user) {
      return (
        <CenterLayout>
          <LoadingSpinner />
        </CenterLayout>
      );
    }

    return <Page {...props} />;
  };

  return Admin;
};

export default withAdmin;
