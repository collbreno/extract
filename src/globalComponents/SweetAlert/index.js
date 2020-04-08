import React, { Component } from 'react'
import { Text, View, Animated, Easing } from 'react-native'
import { Portal, Dialog, Button } from 'react-native-paper'
import LottieView from 'lottie-react-native'
import { material } from 'react-native-typography';
import _ from 'lodash'
import { dialogTextStyle } from '../../constants/index.js';
import { reduxConnector } from '../../redux/index.js';
import { store } from '../../../App.js';
import { viewActions } from '../../redux/actions/ViewActions.js';

const errorIcon = require('../../../assets/lottie/error.json')
const questionIcon = require('../../../assets/lottie/question.json')
const successIcon = require('../../../assets/lottie/success.json')
const warningIcon = require('../../../assets/lottie/warning.json')

class SweetAlert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animationProgress: new Animated.Value(0)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.view.sweetAlert.visible != this.props.view.sweetAlert.visible && this.props.view.sweetAlert.visible) {
      console.log('mostrei o alert')
      Animated.timing(this.state.animationProgress, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }).start()
    }
    else if (prevProps.view.sweetAlert.visible != this.props.view.sweetAlert.visible && !this.props.view.sweetAlert.visible) {
      this.setState({ animationProgress: new Animated.Value(0) })
    }
  }

  render() {
    return (
        <Dialog
          dismissable={false}
          visible={this.props.view.sweetAlert.visible}>
          <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
            <LottieView
              style={{ marginVertical: 10, height: 80, width: 80 }}
              source={this.props.view.sweetAlert.type == 'error' ? errorIcon : this.props.view.sweetAlert.type == 'success' ? successIcon : this.props.view.sweetAlert.type == 'warning'? warningIcon : questionIcon}
              progress={this.state.animationProgress} />
            {_.isEmpty(this.props.view.sweetAlert.title) ? null : <Text style={{ ...material.headlineObject, marginTop: 10, textAlign: 'center' }}>{this.props.view.sweetAlert.title}</Text>}
          </View>
          {
            _.isEmpty(this.props.view.sweetAlert.message) ? null :
            <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
              <Text style={dialogTextStyle}>{this.props.view.sweetAlert.message}</Text>
            </View>
          }
          {
            _.isEmpty(this.props.view.sweetAlert.buttons) ?
            <Dialog.Actions>
            <Button style={{ minWidth: 64 }} onPress={() => store.dispatch(viewActions.dismissSweetAlert())}>
              {'Ok'}
            </Button>
          </Dialog.Actions>
          :
          <Dialog.Actions style={(this.props.view.sweetAlert.buttons.length > 2 || this.props.view.sweetAlert.buttons.find(btn => btn.text.includes(' ')))?{flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center'}:{}}>
            {this.props.view.sweetAlert.buttons.map(button => {
              return (
                <Button key={button.text} style={{minWidth: 64}} onPress={() => {store.dispatch(viewActions.dismissSweetAlert());button.onPress()}}>{button.text}</Button>
              )
            }) }
          </Dialog.Actions>
          }
        </Dialog>
    )
  }
}

export default reduxConnector(SweetAlert)