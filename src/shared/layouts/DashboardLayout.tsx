import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "src/shared/components/Footer";
import LoadingSpinner from "src/shared/components/LoadingSpinner";
import TextLink from "src/shared/components/TextLink";
import { useAuth } from "src/modules/auth/auth.context";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactElement, useMemo } from "react";
import Inbox from "../components/Inbox";

export type DashboardLayoutProps = {
  title?: ReactElement;
  loading?: boolean;
  error?: any;
  path?: Array<{ title: string; href: string }>;
  backButton?: boolean;
  hideFooter?: boolean;
};

const DashboardLayout: React.FC<PropsWithChildren & DashboardLayoutProps> = ({
  children,
  title,
  loading = false,
  error,
  path,
  backButton = false,
  hideFooter = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <div className="flex h-full">
      {/* sidedeck */}
      <div className="h-full border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between">
        <div>
          <IconLink href="/" icon={["fas", "school"]} />
          <IconLink href="/courses" icon={["fas", "book-bookmark"]} />
          <IconLink href="/explore" icon={["fas", "search"]} />
        </div>
        <div>
          <Inbox />
          {user?.isAdmin && (
            <IconLink href="/admin" icon={["fas", "computer"]} />
          )}
          <IconLink href="/settings" icon={["fas", "wrench"]} />
        </div>
      </div>
      {/* outer page */}
      <div className="w-full h-full overflow-y-auto">
        {/* inner page */}
        <div className=" flex flex-col items-center min-h-full">
          {loading ? (
            <div className="w-full h-screen flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="relative p-4 w-full max-w-screen-lg space-y-8">
              <div>
                <div className="space-x-2 text-sm flex">
                  {path?.map((link, index, arr) => {
                    const active = link.href === router.asPath;
                    return (
                      <>
                        <Link key={index} href={link.href} passHref>
                          <a
                            className={`${
                              active
                                ? "text-black dark:text-white"
                                : "text-neutral-500 hover:underline dark:text-neutral-400"
                            } `}
                          >
                            {link.title}
                          </a>
                        </Link>
                        {index < arr.length - 1 && (
                          <div
                            key={index + "/"}
                            className="text-black dark:text-white"
                          >
                            /
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
                {backButton && (
                  <TextLink onClick={() => router.back()}>back</TextLink>
                )}
                {title && (
                  <div className="bg-white dark:bg-stone-900 dark:text-white sticky top-0 z-10 flex justify-between text-3xl font-bold pt-4 mb-8 pb-2 border-b border-stone-200 dark:border-stone-800">
                    {title}
                  </div>
                )}
              </div>
              {error ? (
                <>
                  <h3>Something Went Wrong</h3>
                </>
              ) : (
                children
              )}
            </div>
          )}
        </div>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default DashboardLayout;

export const IconLink: React.FC<{ icon: IconProp; href?: string }> = ({
  icon,
  href,
}) => {
  const router = useRouter();
  const active = useMemo(() => {
    if (!href) {
      return false;
    }
    const splitUrl = router.asPath.split("/").slice(1);
    const splitPath = href.split("/").slice(1);
    let matched = false;
    splitPath.forEach((key, index) => {
      if (splitUrl[index] === key) {
        matched = true;
      } else {
        matched = false;
      }
    });

    return matched;
  }, [router.asPath]);

  const inner = (
    <div className="h-16 w-16 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer">
      <FontAwesomeIcon
        icon={icon}
        className={`${
          active ? "text-primary" : "text-stone-300 dark:text-stone-700"
        } text-2xl`}
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  } else {
    return inner;
  }
};
