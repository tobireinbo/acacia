import { useEffect, useState } from "react";

function useMemoState<T = any>(cb: () => T, deps?: Array<any>) {
  const state = useState<T>(cb());

  useEffect(() => {
    state[1](cb());
  }, [deps]);

  return state;
}

export default useMemoState;
