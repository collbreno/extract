import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  const { view } = state
  return { view }
}

export const reduxConnector = (component) => {
  return connect(mapStateToProps)(component)
}