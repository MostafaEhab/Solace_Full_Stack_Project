const validText = require ("./valid-text");
const Validator = require("validator");
var moment = require('moment'); 
module.exports = (data)=> {
  let errors = {};


  data.email = validText(data.email) ? data.email: "";
  data.password = validText(data.password) ? data.password: "" ;
  data.password2 = validText(data.password2) ? data.password2: "" ;
  data.firstName = validText(data.firstName) ? data.firstName: "" ;
  data.lastName = validText(data.lastName) ? data.lastName: "" ;
  data.dateOfBirth = validText(data.dateOfBirth) ? data.dateOfBirth: "" ;
  data.paypalEmail = validText(data.paypalEmail) ? data.paypalEmail: "";

  if(!Validator.isLength(data.firstName, { min:2, max:30 })){
      errors.firstName = "firstName must be between 2 and 30 characters";
  }
  if(Validator.isEmpty(data.firstName)){
      errors.firstName = "firstName field cannot be empty";
  }  

  if(!Validator.isLength(data.lastName, { min:2, max:30 })){
    errors.lastName = "lastName must be between 2 and 30 characters";
  }
  if(Validator.isEmpty(data.lastName)){
    errors.lastName = "lastName field cannot be empty";
  }  
  if(!Validator.isEmail(data.email)) {
    errors.email = "Email is incorrect format";
  }
  if(Validator.isEmpty(data.email)){
    errors.email = "Email field cannot be empty" ;
  }
  if(!Validator.isLength(data.password, { min:6, max:30 })){
    errors.password = "password must be between 6 and 30 characters";
 }
   if(!Validator.equals(data.password,data.password2)){
    errors.password2 = "passwords must match";
  }
   if(Validator.isEmpty(data.password)){
    errors.password = "password field cannot be empty" ;   
  }
   if(Validator.isEmpty(data.password2)){

    errors.password2 = "password2 field cannot be empty" ;
  }
  
  if (!moment(data.dateOfBirth).isValid()) {
    errors.dateOfBirth = 'Enter a valid date';
  }
  if(!Validator.isEmail(data.paypalEmail)) {
    errors.paypalEmail = "Paypal Email is incorrect format";
  }
  if(Validator.isEmpty(data.paypalEmail)){
    errors.paypalEmail = "Paypal Email field cannot be empty" ;
  }
  
  
return {
    errors,
    isValid: Object.keys(errors).length ===0
  }
}