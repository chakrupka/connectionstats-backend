const newDate = () => {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export default newDate;
