import Router from "next/router";

function singleParam(param: string | string[] | undefined) {
  if (typeof param === "string") {
    return param;
  } else {
    return;
  }
}

export const queryHelper = {
  singleParam,
};
