import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import produce from "immer";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSystem } from "src/modules/system/system.context";
import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { FIND_PUBLIC_USERS } from "src/modules/users/queries/find-public-users.query";
import { UPDATE_PUBLIC_USER } from "src/modules/users/queries/update-public-user.query";
import Button from "src/shared/components/Button";
import Checkbox from "src/shared/components/Checkbox";
import IconButton from "src/shared/components/IconButton";
import LoadingOverlay from "src/shared/components/LoadingOverlay";
import TextInput from "src/shared/components/TextInput";
import { PAGINATION_OPTIONS } from "src/shared/constants/pagination.constant";
import { PATHS } from "src/shared/constants/paths.constant";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import withAdmin from "src/shared/wrappers/withAdmin";

const AdminUsersOverviewPage: NextPage = () => {
  const { addMessage } = useSystem();

  const findUsers = useQuery<{ users: Array<PublicUser> }>(FIND_PUBLIC_USERS, {
    variables: {
      options: {
        limit: PAGINATION_OPTIONS.limit,
        offset: 0,
      },
    },
  });

  const [updateUser, updateUserResult] = useMutation<{
    updateUsers: {
      users: Array<PublicUser>;
    };
  }>(UPDATE_PUBLIC_USER);

  const handleUpdate = (
    uuid: string,
    data: Partial<Omit<PublicUser, "uuid" | "createdAt" | "updatedAt">>
  ) => {
    updateUser({
      variables: {
        where: {
          uuid,
        },
        update: {
          ...data,
        },
      },
      update: (cache, { data }) => {
        const updatedUser = data?.updateUsers.users[0];
        if (!updatedUser) {
          return;
        }
        cache.modify({
          fields: {
            users: (cachedUsers: Array<PublicUser> = []) => {
              return produce(cachedUsers, (draft) => {
                const index = draft.findIndex(
                  (u) => u.uuid === updatedUser.uuid
                );

                draft[index] = updatedUser;
              });
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          addMessage({ message: "Successfully Updated User" });
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Update User" });
      });
  };

  return (
    <DashboardLayout
      path={[PATHS.admin, PATHS.adminUsers]}
      loading={findUsers.loading}
      title={<>{PATHS.adminUsers.title}</>}
    >
      <LoadingOverlay
        loading={updateUserResult.loading}
        className="rounded border border-stone-200 dark:border-stone-600"
      >
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>E-Mail</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {findUsers.data?.users.map((user) => (
              <tr key={user.uuid}>
                <td>
                  <EditableText
                    defaultValue={user.firstname}
                    onChange={(text) => {
                      handleUpdate(user.uuid, { firstname: text });
                    }}
                  />
                </td>
                <td>
                  <EditableText
                    defaultValue={user.lastname}
                    onChange={(text) => {
                      handleUpdate(user.uuid, { lastname: text });
                    }}
                  />
                </td>
                <td>{user.email}</td>
                <td>
                  <Checkbox
                    checked={user.isAdmin}
                    onChange={(e) =>
                      handleUpdate(user.uuid, { isAdmin: e.target.checked })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LoadingOverlay>
      <Button
        onClick={() =>
          findUsers.fetchMore({
            variables: {
              options: {
                limit: PAGINATION_OPTIONS.limit,
                offset: findUsers.data?.users.length,
              },
            },
          })
        }
        variant="plain"
      >
        Load More
      </Button>
    </DashboardLayout>
  );
};

export default withAdmin(AdminUsersOverviewPage);

const EditableText: React.FC<{
  defaultValue: string;
  onChange: (text: string) => void;
}> = ({ defaultValue, onChange }) => {
  const [edit, setEdit] = useState(false);
  const [_value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  if (edit) {
    return (
      <div className="flex space-x-2">
        <TextInput value={_value} onChange={(e) => setValue(e.target.value)} />
        <IconButton
          icon={["fas", "check"]}
          onClick={() => {
            setEdit(false);
            onChange(_value);
          }}
        />
        <IconButton
          icon={["fas", "x"]}
          onClick={() => {
            setEdit(false);
            setValue(defaultValue);
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="group flex items-center">
        {_value}
        <div
          onClick={() => setEdit(true)}
          className="ml-2 group-hover:opacity-100 opacity-0 cursor-pointer"
        >
          <FontAwesomeIcon icon={["fas", "edit"]} className="text-sm" />
        </div>
      </div>
    );
  }
};
