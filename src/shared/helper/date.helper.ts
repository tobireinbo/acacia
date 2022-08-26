import { DateTime } from "luxon";

type formatOptions = {
  day?: boolean;
  month?: boolean;
  year?: boolean;
  hour?: boolean;
  minute?: boolean;
};

function generateFormat(include: formatOptions) {
  const { day, minute, month, year, hour } = include;
  return `${day ? "dd" : ""}${day && month ? "." : ""}${month ? "LL" : ""}${
    month && year ? "." : ""
  }${year ? "yy" : ""}${year && (hour || minute) ? " " : ""}${
    hour ? "HH" : ""
  }${hour && minute ? ":" : ""}${minute ? "mm" : ""}`;
}

function isoToFormat(
  isoDate: string,
  options?: {
    include?: formatOptions;
  }
) {
  const defaultFormatOptions = {
    day: true,
    month: true,
    year: true,
  };
  const format = generateFormat({
    ...options?.include,
    ...defaultFormatOptions,
  });
  return DateTime.fromISO(isoDate).setZone("UTC").toFormat(format);
}

export const dateHelper = { isoToFormat };
