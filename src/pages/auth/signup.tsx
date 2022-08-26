import axios from "axios";
import Button from "src/shared/components/Button";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import TextInput from "src/shared/components/TextInput";
import { StatusCodes } from "http-status-codes";
import CenterLayout from "src/shared/layouts/CenterLayout";
import { useAuth } from "src/modules/auth/auth.context";
import { NextPage } from "next";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { useSystem } from "src/modules/system/system.context";

const SignupPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useAuth();
  const { addMessage } = useSystem();

  const handleSignup = (e: FormEvent<any>) => {
    e.preventDefault();

    return addMessage({ message: "Singup has been disabled for now" });

    const body = {
      firstname: e.currentTarget.firstname.value,
      lastname: e.currentTarget.lastname.value,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    setLoading(true);
    axios({ url: "/api/auth/signup", method: "POST", data: body })
      .then((res) => {
        setLoading(false);
        setUser(res.data);
        res.status === StatusCodes.CREATED && Router.push("/");
      })
      .catch(() => setLoading(false));
  };

  return (
    <CenterLayout>
      <LoadingOverlay
        loading={loading}
        className="flex-col border border-stone-200 dark:border-stone-800 p-4 rounded"
      >
        <h1 className="mb-4">Signup</h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
          <TextInput name="firstname" required label={"First Name"} />
          <TextInput name="lastname" required label="Last Name" />
          <TextInput name="email" required type={"email"} label="E-Mail" />
          <TextInput
            name="password"
            required
            type={"password"}
            label="Password"
          />

          <Button>Signup</Button>
        </form>
      </LoadingOverlay>
    </CenterLayout>
  );
};

export default SignupPage;
