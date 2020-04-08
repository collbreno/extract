import { combineReducers } from 'redux'
import { SHOW_SWEET_ALERT, DISMISS_SWEET_ALERT } from '../types';

const INITIAL_STATE = {
  sweetAlert: {
    visible: false,
    title: '',
    type: '',
    message: '',
    buttons: []
  }
}

const viewReducer = (state = INITIAL_STATE, action) => {
  if (action.type == SHOW_SWEET_ALERT) {
    return { ...state, sweetAlert: { ...INITIAL_STATE.sweetAlert, ...action.payload, visible: true } }
  }
  if (action.type == DISMISS_SWEET_ALERT) {
    return { ...state, sweetAlert: { ...INITIAL_STATE.sweetAlert } }
  }
  return state
}

export default combineReducers({
  view: viewReducer
})