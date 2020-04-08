import { SweetAlertProps } from "./SweetAlert/props";
import { store } from "../../App";
import { viewActions } from "../redux/actions/ViewActions";

export const showSweetAlert = (props: SweetAlertProps) => {
  store.dispatch(viewActions.showSweetAlert(props))
}