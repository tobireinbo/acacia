import React, { ReactNode } from "react";

function useNoChildren(children: ReactNode) {
  return React.Children.count(children) < 1;
}
export default useNoChildren;
