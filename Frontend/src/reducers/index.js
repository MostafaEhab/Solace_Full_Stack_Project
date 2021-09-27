import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import offer from './offer';

export default combineReducers({
  alert,
  auth,
  offer,
});
