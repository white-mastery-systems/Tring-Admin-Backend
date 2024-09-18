import {
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import momentTz from "moment-timezone"

// Date range generation function
export const getAllDatesInRange = (period: string, from: Date, to: Date) => {
  let dates: string[] = [];
  let startDate: Date, endDate: Date;
  let difference = 0;

  // console.log({ from, to, period })
  const now = new Date();

  switch (period) {
    case "today":
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      dates = eachHourOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "hh:mm a"),
      );
      break;

    case "yesterday":
      startDate = startOfDay(subDays(now, 1));
      endDate = endOfDay(subDays(now, 1));
      dates = eachHourOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "hh:mm a"),
      );
      break;

    case "last-7-days":
      startDate = startOfDay(subDays(now, 6));
      endDate = endOfDay(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "last-30-days":
      startDate = startOfDay(subDays(now, 29));
      endDate = endOfDay(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "current-month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "last-month":
      startDate = startOfMonth(subMonths(now, 1));
      endDate = endOfMonth(subMonths(now, 1));
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "current-year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "last-year":
      startDate = startOfYear(subYears(now, 1));
      endDate = endOfYear(subYears(now, 1));
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "current-financial-year":
      startDate = new Date(now.getFullYear(), 3, 1); // April 1st of the current year
      endDate = new Date(now.getFullYear() + 1, 2, 31); // March 31st of the next year
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "last-financial-year":
      startDate = new Date(now.getFullYear() - 1, 3, 1); // April 1st of the last year
      endDate = new Date(now.getFullYear(), 2, 31); // March 31st of the current year
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "all-time":
      startDate = startOfYear(from);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "custom":
      difference = differenceInDays(to, from);
      // console.log({ difference })
      if (difference > 30) {
        startDate = startOfYear(from);
        endDate = endOfYear(to);
        dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
          (date) => format(date, "MMM yyyy"),
        );
      } else {
        startDate = from;
        endDate = to;
        dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
          (date) => format(date, "dd MMM yyyy"),
        );
      }
      break;

    default:
      throw new Error("Invalid period");
  }

  return {
    dates,
    difference,
  };
};


export const groupAndMapData = ({ module, period, difference, timeZone }: any) => {
    const groupedData = module.reduce((acc, i) => {
    // console.log({ groupAndMapDataDifference: difference })
    const date = momentTz(i.createdAt).tz(timeZone).minutes(0)
    let dateKey;
    if (period === "today" || period === "yesterday") {
      dateKey = momentTz(date).format("hh:mm A")
    } else if (
      period === "current-year" ||
      period === "last-year" ||
      period === "current-financial-year" ||
      period === "last-financial-year" ||
      period === "all-time" ||
      difference > 30
    ) {
      dateKey =  momentTz(date).format("MMM YYYY");
    } else {
      dateKey =  momentTz(date).format("DD MMM YYYY");
    }
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // Map the grouped data to the desired format
  return Object.entries(groupedData).map(([date, count]) => ({
    date,
    count,
  }));
};


// get Date ranges
export const getDateRange = (period: string, from: Date, to: Date) => {
  const now = new Date();
  // console.log("------", { period, from, to })

  switch (period) {
    case "today":
      return {
        fromDate: startOfDay(now),
        toDate: endOfDay(now),
      };
    case "yesterday":
      return {
        fromDate: startOfDay(subDays(now, 1)),
        toDate: endOfDay(subDays(now, 1)),
      };
    case "last-7-days":
      return {
        fromDate: startOfDay(subDays(now, 7)),
        toDate: endOfDay(now),
      };
    case "last-30-days":
      return {
        fromDate: startOfDay(subDays(now, 30)),
        toDate: endOfDay(now),
      };
    case "current-month":
      return {
        fromDate: startOfMonth(now),
        toDate: endOfMonth(now),
      };
    case "last-month":
      return {
        fromDate: startOfMonth(subMonths(now, 1)),
        toDate: endOfMonth(subMonths(now, 1)),
      };
    case "current-year":
      return {
        fromDate: startOfYear(now),
        toDate: endOfYear(now),
      };
    case "last-year":
      return {
        fromDate: startOfYear(subYears(now, 1)),
        toDate: endOfYear(subYears(now, 1)),
      };
    case "current-financial-year":
      return {
        fromDate: new Date(now.getFullYear(), 3, 1), // April 1st of the current year
        toDate: new Date(now.getFullYear() + 1, 2, 31), // March 31st of the next year
      };
    case "last-financial-year":
      return {
        fromDate: new Date(now.getFullYear() - 1, 3, 1), // April 1st of the last year
        toDate: new Date(now.getFullYear(), 2, 31), // March 31st of the current year
      };
    case "all-time":
      return {
        fromDate: startOfYear(from),
        toDate: endOfYear(now),
      };

    case "custom":
      return {
        fromDate: from,
        toDate: to,
      };

    default:
      throw new Error("Invalid period");
  }
};