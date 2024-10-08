import moment from "moment";
import momentTz from "moment-timezone"

// Date range generation function
export const getAllDatesInRange = (period: string, from: Date, to: Date, timeZone: string) => {
  let dates: string[] = [];
  let startDate, endDate, dateFormat, type;
  let difference = 0;
  const now = momentTz().tz(timeZone);

  switch (period) {
    case "today":
      startDate = now.clone().startOf("day");
      endDate = now.clone().endOf("day");
      dateFormat = "hh:mm A";
      type = 'hour';
      break;

    case "yesterday":
      startDate = now.clone().subtract(1, 'day').startOf("day");
      endDate = now.clone().subtract(1, 'day').endOf("day");
      dateFormat = "hh:mm A";
      type = 'hour';
      break;

    case "last-7-days":
      startDate = now.clone().subtract(6, 'day').startOf("day");
      endDate = now.clone().endOf("day");
      dateFormat = "DD MMM YYYY";
      type = 'day';
      break;

    case "last-30-days":
      startDate = now.clone().subtract(29, 'day').startOf("day");
      endDate = now.clone().endOf("day");
      dateFormat = "DD MMM YYYY";
      type = 'day';
      break;

    case "current-month":
      startDate = now.clone().startOf("month");
      endDate = now.clone().endOf("month");
      dateFormat = "DD MMM YYYY";
      type = 'day';
      break;

    case "last-month":
      startDate = now.clone().subtract(1, 'month').startOf("month");
      endDate = now.clone().subtract(1, 'month').endOf("month");
      dateFormat = "DD MMM YYYY";
      type = 'day';
      break;

    case "current-year":
      startDate = now.clone().startOf("year");
      endDate = now.clone().endOf("year");
      dateFormat = "MMM YYYY";
      type = 'month';
      break;

    case "last-year":
      startDate = now.clone().subtract(1, 'year').startOf("year");
      endDate = now.clone().subtract(1, 'year').endOf("year");
      dateFormat = "MMM YYYY";
      type = 'month';
      break;

    case "current-financial-year":
      startDate = momentTz(`${now.year()}-04-01`).tz(timeZone); // April 1st of the current year
      endDate = momentTz(`${now.year() + 1}-03-31`).tz(timeZone); // March 31st of the next year
      dateFormat = "MMM YYYY";
      type = 'month';
      break;

    case "last-financial-year":
      startDate = momentTz(`${now.year() - 1}-04-01`).tz(timeZone); // April 1st of the last year
      endDate = momentTz(`${now.year()}-03-31`).tz(timeZone); // March 31st of the current year
      dateFormat = "MMM YYYY";
      type = 'month';
      break;

    case "all-time":
      startDate = momentTz(from).startOf("year").tz(timeZone);
      endDate = now.clone().endOf("year");
      dateFormat = "MMM YYYY";
      type = 'month';
      break;

    case "custom":
      difference = moment(to).diff(moment(from), 'days');
      // console.log({ difference })
      if (difference > 30) {
        startDate = momentTz(from).startOf("year").tz(timeZone);
        endDate = momentTz(to).endOf("year").tz(timeZone);
        dateFormat = "MMM YYYY";
        type = 'month';
      } else {
        startDate = momentTz(from).tz(timeZone).startOf("day");
        endDate = momentTz(to).tz(timeZone).subtract(1, "day").endOf("day");
        dateFormat = "DD MMM YYYY";
        type = 'day';
      }
      break;

    default:
      throw new Error("Invalid period");
  }

  let current = startDate.clone();
  while (current.isSameOrBefore(endDate)) {
    dates.push(current.format(dateFormat));
    current.add(1, type);
  }

  return {
    dates,
    difference,
  };
};

export const groupAndMapData = ({ module, period, difference, timeZone }: any) => {
    const groupedData = module.reduce((acc: any, i: any) => {
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
export const getDateRange = (period: string, from: Date, to: Date, timeZone: string) => {
  const now = momentTz().tz(timeZone); // Ensure we are using UTC

  switch (period) {
    case "today":
      return {
        fromDate: now.clone().startOf("day").toDate(),
        toDate: now.clone().endOf("day").toDate(),
        previousFromDate: now.clone().subtract(1, 'day').startOf("day").toDate(),
        previousToDate: now.clone().subtract(1, 'day').endOf("day").toDate()
      };

    case "yesterday":
      return {
        fromDate: now.clone().subtract(1, 'day').startOf("day").toDate(),
        toDate: now.clone().subtract(1, 'day').endOf("day").toDate(),
        previousFromDate: now.clone().subtract(2, 'day').startOf("day").toDate(),
        previousToDate: now.clone().subtract(2, 'day').endOf("day").toDate()
      };

    case "last-7-days":
      return {
        fromDate: now.clone().subtract(7, 'days').startOf("day").toDate(),
        toDate: now.clone().endOf("day").toDate(),
        previousFromDate: now.clone().subtract(14, 'days').startOf("day").toDate(), // Start of the previous 7 days
        previousToDate: now.clone().subtract(7, 'days').endOf("day").toDate()      // End of the previous 7 days
      };

    case "last-30-days":
      return {
        fromDate: now.clone().subtract(30, 'days').startOf("day").toDate(),
        toDate: now.clone().endOf("day").toDate(),
        previousFromDate: now.clone().subtract(60, 'days').startOf("day").toDate(), // Start of the previous 30 days
        previousToDate: now.clone().subtract(30, 'days').endOf("day").toDate()      // End of the previous 30 days
      };

    case "current-month":
      return {
        fromDate: now.clone().startOf("month").toDate(),
        toDate: now.clone().endOf("month").toDate(),
        previousFromDate: now.clone().subtract(1, 'month').startOf("month").toDate(),
        previousToDate: now.clone().subtract(1, 'month').endOf("month").toDate(),
      };

    case "last-month":
      return {
        fromDate: now.clone().subtract(1, 'month').startOf("month").toDate(),
        toDate: now.clone().subtract(1, 'month').endOf("month").toDate(),
        previousFromDate: now.clone().subtract(2, 'month').startOf("month").toDate(),
        previousToDate: now.clone().subtract(2, 'month').endOf("month").toDate(),
      };

    case "current-year":
      return {
        fromDate: now.clone().startOf("year").toDate(),
        toDate: now.clone().endOf("year").toDate(),
        previousFromDate: now.clone().subtract(1, 'year').startOf("year").toDate(),
        previousToDate: now.clone().subtract(1, 'year').endOf("year").toDate(),
      };

    case "last-year":
      return {
        fromDate: now.clone().subtract(1, 'year').startOf("year").toDate(),
        toDate: now.clone().subtract(1, 'year').endOf("year").toDate(),
        previousFromDate: now.clone().subtract(2, 'year').startOf("year").toDate(),
        previousToDate: now.clone().subtract(2, 'year').endOf("year").toDate(),
      };

    case "current-financial-year":
      return {
        fromDate: momentTz(`${now.year()}-04-01`).tz(timeZone).toDate(), // April 1st of the current year
        toDate: momentTz(`${now.year() + 1}-03-31`).tz(timeZone).toDate(), // March 31st of the next year
        previousFromDate: momentTz(`${now.year() - 1}-04-01`).tz(timeZone).toDate(), // April 1st of the previous year
        previousToDate: momentTz(`${now.year()}-03-31`).tz(timeZone).toDate() // March 31st of the current year
      };

    case "last-financial-year":
      return {
        fromDate: momentTz(`${now.year() - 1}-04-01`).tz(timeZone).toDate(), // April 1st of the last year
        toDate: momentTz(`${now.year()}-03-31`).tz(timeZone).toDate(), // March 31st of the current year
        previousFromDate: momentTz(`${now.year() - 2}-04-01`).tz(timeZone).toDate(), // April 1st of the year before last
        previousToDate: momentTz(`${now.year() - 1}-03-31`).tz(timeZone).toDate() // March 31st of the last financial year
      };

    case "all-time":
      return {
        fromDate: momentTz(from).startOf("year").tz(timeZone).toDate(),
        toDate: now.clone().endOf("year").toDate(),
        previousFromDate: null,
        previousToDate: null
      };

    case "custom":
      return {
        fromDate: momentTz(from).startOf("day").tz(timeZone).toDate(),
        toDate: momentTz(to).endOf("day").tz(timeZone).toDate(),
        previousFromDate: null,
        previousToDate: null
      };

    default:
      throw new Error("Invalid period");
  }
};

// calculate percentage change of statistic values
export const calculatePercentageChange = (current: number, previous: number) => {
  console.log({ current, previous })
  if (previous === 0) {
    return current === 0 ? "No change" : "+100%"; // Handle no previous data case
  }
  
  const change = current - previous;
  const percentageChange = Math.round((change / Math.abs(previous)) * 100);

  // Format the output
  return (percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`);
}