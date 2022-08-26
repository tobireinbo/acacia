import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { arrayHelper } from "src/shared/helper/array.helper";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopulatedTimeslot } from "src/modules/timeslots/interfaces/timeslot.interface";

export type ScheduleProps = {
  timeslots: Array<PopulatedTimeslot>;
  weekRange: [number, number];
};

export const DAY_NAMES = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MINUTE_HEIGHT = "2px";

const Schedule: React.FC<ScheduleProps> = ({ timeslots, weekRange }) => {
  const [addToWeek, setAddToWeek] = useState(0);

  const navigateWeek = (by: number) => {
    let add = addToWeek + by;
    if (add < weekRange[0]) {
      add = weekRange[0];
    }
    if (add > weekRange[1]) {
      add = weekRange[1];
    }

    setAddToWeek(add);
  };

  const [startOfWeek, endOfWeek] = useMemo(() => {
    const now = DateTime.now().plus({ weeks: addToWeek });

    return [now.startOf("week"), now.endOf("week")];
  }, [weekRange, addToWeek]);

  const minutes = useMemo(() => arrayHelper.numberedArray(8 * 60, 18 * 60), []);

  const rangedTimeslots = useMemo(() => {
    return timeslots.flatMap((t) => {
      const slotStart = DateTime.fromISO(t.startDate).setZone("UTC");
      const slotStartsAtMinutes = slotStart.hour * 60 + slotStart.minute;
      const startOfWeekOfSlotStart = slotStart.startOf("week");

      const slotEnd = DateTime.fromISO(t.endDate).setZone("UTC");
      const slotEndsAtMinutes = slotEnd.hour * 60 + slotEnd.minute;

      const slotStartsAtDayIndex = slotStart.weekday;
      const payload = {
        data: t,
        startsAtMinutes: slotStartsAtMinutes,
        endsAtMinutes: slotEndsAtMinutes,
        startsAtDayIndex: slotStartsAtDayIndex,
      };

      if (
        startOfWeekOfSlotStart.weekNumber <= startOfWeek.weekNumber &&
        t.reoccuring
      ) {
        return payload;
      }

      if (startOfWeekOfSlotStart.weekNumber !== startOfWeek.weekNumber) {
        return [];
      }

      return payload;
    });
  }, [timeslots, startOfWeek, endOfWeek]);
  return (
    <div>
      <div className="max-h-[800px] overflow-y-auto relative border border-stone-200 dark:border-stone-600 rounded">
        <div className="flex dark:bg-stone-700 bg-stone-100 border-b border-stone-200 dark:border-stone-600 items-center space-x-2 justify-center p-2">
          {weekRange[0] !== addToWeek && (
            <Button variant="plain" onClick={() => navigateWeek(-1)}>
              <FontAwesomeIcon icon={["fas", "angle-left"]} />
            </Button>
          )}
          <h4>
            {startOfWeek.toFormat("dd.LL.yy")} –{" "}
            {endOfWeek.toFormat("dd.LL.yy")}
          </h4>
          {weekRange[1] !== addToWeek && (
            <Button variant="plain" onClick={() => navigateWeek(1)}>
              <FontAwesomeIcon icon={["fas", "angle-right"]} />
            </Button>
          )}
        </div>
        <table className="table-fixed">
          <thead>
            <tr className="sticky top-0 z-10 bg-stone-100 dark:bg-stone-700">
              {DAY_NAMES.map((day, index) => (
                <th key={day} className="p-4 w-64">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {minutes.map((minute) => (
              <tr key={minute}>
                {DAY_NAMES.map((day, index) => (
                  <td
                    className="relative"
                    style={{ height: MINUTE_HEIGHT }}
                    key={day}
                  >
                    {minute % 60 === 0 && (
                      <div
                        className="absolute bg-white p-1 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 -z-10 top-0 left-0 right-0"
                        style={{ height: `calc(${MINUTE_HEIGHT}*60)` }}
                      >
                        {index === 0 && <p>{minute / 60}:00</p>}
                      </div>
                    )}
                    {rangedTimeslots
                      .filter(
                        (t) =>
                          t.startsAtMinutes === minute &&
                          index === t.startsAtDayIndex
                      )
                      .map((t) => (
                        <div
                          key={t.data.uuid}
                          style={{
                            height: `calc(${MINUTE_HEIGHT}*${
                              t.endsAtMinutes - t.startsAtMinutes
                            })`,
                          }}
                          className="p-1  absolute z-0 top-0 "
                        >
                          <div className="p-2 bg-secondary-light rounded  h-full w-full">
                            <h4 className="dark:text-black">
                              {t.data.course?.title}
                            </h4>
                            <h6>Location: {t.data.location?.title}</h6>
                          </div>
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
