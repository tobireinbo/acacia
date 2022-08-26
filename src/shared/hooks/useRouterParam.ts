import { queryHelper } from "src/shared/helper/query.helper";
import { useRouter } from "next/router";
import { useMemo } from "react";

function useRouterParam(key: string) {
  const router = useRouter();
  return useMemo(() => {
    return queryHelper.singleParam(router.query[key]);
  }, [router]);
}

export default useRouterParam;
