import { combineReducers, createStore } from 'redux';
import Actions from './Constants/Actions';

const initialState = {
  token: null,
  patient: null,
  doctor: null
};

function setToken(state = initialState.token, action) {
  if (action.type == Actions.SET_TOKEN) {
    return action.token;
  }
  return state;
};

function setPatient(state = initialState.patient, action) {
  if (action.type == Actions.SET_PATIENT) {
    return action.patient;
  }
  return state;
};

function setDoctor(state = initialState.doctor, action) {
  if (action.type == Actions.SET_DOCTOR) {
    return action.doctor;
  }
  return state;
};

const reducers = combineReducers({
  token: setToken,
  patient: setPatient,
  doctor: setDoctor
});

const store = createStore(reducers);

export default store;