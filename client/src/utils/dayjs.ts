import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend once before using anywhere
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
