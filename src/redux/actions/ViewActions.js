import { SHOW_SWEET_ALERT, DISMISS_SWEET_ALERT } from "../types";

export const viewActions = { 
  showSweetAlert: (props) => {
    return {
      type: SHOW_SWEET_ALERT,
      payload: props
    }
  },
  dismissSweetAlert: () => {
    return {
      type: DISMISS_SWEET_ALERT
    }
  }
 }