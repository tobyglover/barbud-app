 /*eslint no-useless-escape: 0 */
import moment from 'moment';


export const isInvalidEmail = (email) => !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

export const reasonInvalidName = (name) => {
  return name == '' ||
  !/.+ .+/.test(name) && 
  "Must be first and last name";
};

export const reasonInvalidEmail = (email) => {
  return email == '' ||
  isInvalidEmail(email) && 
  "Invalid email";
};

export const reasonInvalidPassword = (password) => {
  return  password == '' ||
          password.length < 7 ? 
          "Passwords must be at least 8 characters long" :
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password) && 
          "Passwords must contain at least 1 lowercase and uppercase characters and a number";
};

export const reasonInvalidPhone = (phone) => {
  return  phone.length > 0 && phone.length != 10 ?
          "Must be 10 numbers" :
          /\D/.test(phone) && "Invalid characters";
};

export const reasonInvalidDOB = (dob) => {
  return moment(dob).isAfter(moment().subtract(21, 'years')) && 
         "Date of birth must be at least 21 years ago";
};
