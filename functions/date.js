import { DateTime } from "luxon";

const newDate = () => {
  const dt = DateTime.now().setZone("America/New_York");
  return dt.toFormat("yyyy-LL-dd");
};

export default newDate;
