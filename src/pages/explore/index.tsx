import { useLazyQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/shared/components/Button";
import List from "src/shared/components/List";
import ListEntry from "src/shared/components/ListEntry";
import LoadingSpinner from "src/shared/components/LoadingSpinner";
import DashboardLayout from "src/shared/layouts/DashboardLayout";
import { Chapter } from "src/modules/chapters/interfaces/chapter.interface";
import { Course } from "src/modules/courses/interfaces/course.interface";
import { SEARCH_TITLES_AND_DESCRIPTIONS } from "src/modules/explore/queries/titles-and-descriptions.query";
import { Tutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent } from "react";

const ExplorePage: NextPage = () => {
  const router = useRouter();
  const [search, searchResult] = useLazyQuery<{
    titlesAndDescriptions: Array<
      { __typename: string } & (Course | Tutorial | Chapter)
    >;
  }>(SEARCH_TITLES_AND_DESCRIPTIONS, {});

  const handleSearch = (e: FormEvent<any>) => {
    e.preventDefault();
    const searchTerm = e.currentTarget.search.value;
    search({
      variables: {
        searchString: searchTerm,
      },
    });
  };

  const handleRoute = (type: string, uuid: string) => {
    let to: string;
    switch (type) {
      case "Course":
        to = `/courses/${uuid}`;
        break;
      case "Tutorial":
        to = `/tutorials/${uuid}`;
        break;
      case "Chapter":
        to = `/error`;
        break;
      default:
        to = `/error`;
        break;
    }

    router.push(to);
  };

  return (
    <DashboardLayout title={<>Explore</>}>
      <form
        className="flex w-full p-1  outline outline-2 outline-stone-400 focus-within:outline-primary overflow-hidden rounded"
        onSubmit={handleSearch}
      >
        <input
          name="search"
          className="w-full p-2 rounded-l border-r focus:border-stone-200 dark:focus:border-stone-700 dark:focus:bg-stone-900 border-transparent bg-stone-200 dark:bg-stone-700 focus:outline-0 focus:bg-white"
        />
        <Button variant="plain" className="flex items-center">
          <FontAwesomeIcon icon={["fas", "search"]} className="mr-2" /> Search
        </Button>
      </form>
      {searchResult.loading ? (
        <LoadingSpinner />
      ) : (
        <List title="Results" noEntriesLabel="No Results">
          {searchResult.data?.titlesAndDescriptions?.map((entry) => (
            <ListEntry
              onClick={() => handleRoute(entry.__typename, entry.uuid)}
              key={entry.uuid}
              title={entry.title}
              subtitle={entry.__typename}
            />
          ))}
        </List>
      )}
    </DashboardLayout>
  );
};

export default ExplorePage;
