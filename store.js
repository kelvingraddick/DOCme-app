import { combineReducers, createStore } from 'redux';
import Actions from './Constants/Actions';

const initialState = {
  patient: {},
  doctor: {}
};

function setPatient(state, action) {
  if (action.type == Actions.SET_PATIENT) {
    return action.patient;
  }
  return initialState.patient;
};

function setDoctor(state, action) {
  if (action.type == Actions.SET_DOCTOR) {
    return action.doctor;
  }
  return initialState.doctor;
};

const reducers = combineReducers({
  patient: setPatient,
  doctor: setDoctor
});

const store = createStore(reducers);

export default store;