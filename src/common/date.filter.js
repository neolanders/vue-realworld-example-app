import { format } from "date-fns";

export default (date) => {
  return format(new Date(date), "MMMM d, yyyy");
};
