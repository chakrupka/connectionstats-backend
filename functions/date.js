const newDate = () => {
  var currentDate = new Date();
  var day = currentDate.getDate().toString();
  var month = (currentDate.getMonth() + 1).toString();
  var year = currentDate.getFullYear().toString();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  var formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export default newDate;
