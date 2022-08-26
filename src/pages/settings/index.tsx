import axios from "axios";
import Button from "src/shared/components/Button";
import { StatusCodes } from "http-status-codes";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { useSystem } from "src/modules/system/system.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Inbox from "src/shared/components/Inbox";

const SettingsPage: NextPage = () => {
  const router = useRouter();

  const { injectModal, injectDialogue, toggleTheme, addMessage } = useSystem();

  const handleLogout = () => {
    axios({
      method: "POST",
      url: "/api/auth/logout",
    })
      .then((res) => {
        if (res.status === StatusCodes.NO_CONTENT) {
          router.replace("/auth/login");
        } else {
        }
      })
      .catch((err) => {});
  };

  return (
    <DashboardLayout title={<>Settings</>}>
      <div className="flex space-x-2">
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={() => injectModal({ element: <h1>Modal</h1> })}>
          inject modal
        </Button>
        <Button onClick={() => injectDialogue({ message: "Dialogue" })}>
          inject dialogue
        </Button>
        <Button onClick={() => toggleTheme()}>toggle dark mode</Button>
        <Button
          onClick={() => {
            addMessage({ message: "Hello World" });
          }}
        >
          sys msg
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
