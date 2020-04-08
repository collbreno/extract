interface Touchable {
  text: string,
  onPress: () => void
}

export interface SweetAlertProps {
  type: 'error' | 'success' | 'warning' | 'question',
  title?: string,
  message?: string,
  buttons?: Touchable[]
}