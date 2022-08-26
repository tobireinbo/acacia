function emptyArray(start: number, end: number) {
  const arr = new Array(end - start).fill(undefined);
  return arr;
}

function numberedArray(start: number, end: number) {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

export const arrayHelper = { emptyArray, numberedArray };
