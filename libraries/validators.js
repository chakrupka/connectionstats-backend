/*
 * Validators for password, username, and name fields
 * Cha Krupka, Spring 2024
 * Created with help from https://rows.com/tools/regex-generator
 */

/*
 * Password must be:
 * - between 6 and 20 characters long
 * - include only ASCII-standard symbols
 * - no accented characters
 * - no whitespace
 */
const isValidPassword = (password) => {
  const regex = /^(?!.*[`"'])[\x21-\x7E]{6,20}$/;
  return regex.test(password);
};

/*
 * Username must be:
 * - between 3 and 16 characters long
 * - include only ASCII-standard symbols
 * - no accented characters
 * - no whitespace
 */
const isValidUsername = (username) => {
  const regex =
    /^(?=.{3,16}$)(?!.*\.\.)(?!^\.)[A-Za-z0-9._]*(?=.*[A-Za-z])[A-Za-z0-9._]*$/;
  return regex.test(username);
};

/*
 * Name must be:
 * - between 2 and 16 characters long
 * - A-Z and a-z
 * - One word
 */
const isValidName = (name) => {
  const regex = /^[A-Za-z]{2,16}$/;
  return regex.test(name);
};

const validateAll = ({ password, username, name }) => {
  return (
    isValidPassword(password) && isValidUsername(username) && isValidName(name)
  );
};

export default { validateAll, isValidPassword, isValidUsername, isValidName };
