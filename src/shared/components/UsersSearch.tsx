import { useLazyQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { SEARCH_USERS_BY_NAME_OR_EMAIL } from "src/modules/users/queries/search-users-by-name-or-email.query";
import useOutsideClick from "../hooks/useOutsideClick";

interface UsersSearchProps {
  name: string;
  required?: boolean;
  defaultUser?: PublicUser;
  label?: string;
}

const UsersSearch: React.FC<UsersSearchProps> = ({
  name,
  required = false,
  defaultUser,
  label,
}) => {
  const [aborterRef, setAborterRef] = useState(new AbortController());
  const [search, result] = useLazyQuery<{
    usersByNameOrEmail: Array<PublicUser>;
  }>(SEARCH_USERS_BY_NAME_OR_EMAIL, {
    context: {
      fetchPolicy: "network-only",
      fetchOptions: {
        signal: aborterRef.signal,
      },
    },
  });

  const [selectedUser, setSelectedUser] = useState<PublicUser | undefined>(
    defaultUser
  );
  const [searchString, setSearchString] = useState("");
  const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setFocused(false));

  useEffect(() => {
    aborterRef.abort();
    setAborterRef(new AbortController());

    search({
      variables: {
        searchString: searchString,
      },
    });
  }, [searchString]);

  useEffect(() => {
    if (!focused && !selectedUser) {
      setSearchString("");
    }
  }, [focused, selectedUser]);

  return (
    <label className="flex flex-col text-base">
      {label}
      <div className="relative" ref={ref}>
        <div
          className={`p-2 rounded flex items-center justify-between space-x-2 ${
            focused
              ? "outline outline-2 outline-primary bg-white dark:bg-stone-900"
              : "bg-stone-100 dark:bg-stone-800"
          }`}
        >
          <input
            className="hidden"
            name={name}
            readOnly
            required={required}
            value={selectedUser?.uuid ?? ""}
          />
          {!selectedUser ? (
            <input
              onFocus={() => setFocused(true)}
              className="bg-transparent outline-none w-full"
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
            />
          ) : (
            <>
              <div className="bg-stone-200 dark:bg-stone-700 px-2 rounded">
                {selectedUser.firstname + " " + selectedUser.lastname}
              </div>
              <FontAwesomeIcon
                icon={["fas", "x"]}
                className="text-xs cursor-pointer"
                onClick={() => {
                  setSelectedUser(undefined);
                  setSearchString("");
                }}
              />
            </>
          )}
        </div>
        {focused && (
          <ul className="absolute rounded mt-1 bg-white dark:bg-stone-900 w-full border border-stone-100 dark:border-stone-800 shadow-lg">
            {result.data?.usersByNameOrEmail.map((user) => (
              <li
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                key={user.uuid}
                onClick={() => {
                  setSelectedUser(user);
                  setFocused(false);
                }}
              >
                {user.firstname + " " + user.lastname}
              </li>
            ))}
          </ul>
        )}
      </div>
    </label>
  );
};

export default UsersSearch;
