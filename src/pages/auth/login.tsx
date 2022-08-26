import axios from "axios";
import Button from "src/shared/components/Button";
import CenterLayout from "src/shared/layouts/CenterLayout";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import TextInput from "src/shared/components/TextInput";
import { StatusCodes } from "http-status-codes";
import { useAuth } from "src/modules/auth/auth.context";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const handleLogin = (e: FormEvent<any>) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    setLoading(true);
    axios({ url: "/api/auth/login", method: "POST", data: body })
      .then((res) => {
        setLoading(false);
        setUser(res.data);
        res.status === StatusCodes.OK && router.push("/");
      })
      .catch(() => setLoading(false));
  };

  return (
    <CenterLayout>
      <LoadingOverlay
        loading={loading}
        className="flex-col border border-stone-200 dark:border-stone-800 p-4 rounded"
      >
        <h1 className="mb-4">Login</h1>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <TextInput name="email" type="email" label="E-Mail" />
          <TextInput name="password" type="password" label="Password" />

          <Button>Login</Button>
        </form>
      </LoadingOverlay>
    </CenterLayout>
  );
};

export default LoginPage;
