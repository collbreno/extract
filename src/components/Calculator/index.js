import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableNativeFeedback } from 'react-native'
import { Portal, Dialog, TouchableRipple, Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'
import Colors from 'react-native-material-color'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const buttonWidth = (Dimensions.get('window').width - 52)/4
const buttonHeight = (Dimensions.get('window').width - 52)/5

export default class Calculator extends Component {

  constructor(props) {
    super(props)
    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2)
    this.layoutProvider = new LayoutProvider(() => 'NORMAL', (type, dim) => {
      dim.height =  buttonHeight
      dim.width = buttonWidth
    })
    this.state = {
      text: '',
      buttons: ['CE', '(', ')', 'back',
                '7', '8', '9', '/',
                '4', '5', '6', '*',
                '1','2','3', '-',
                '0','.','=','+'],
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.visible != this.props.visible && this.props.visible) {
      this.setState({ text: '' })
    }
  }

  submit = () => {
    try {
      const result = parseInt(eval(this.state.text)*100)
      this.props.onSubmit(result)
      this.props.onDismiss()
    } catch (error){
      console.log(error)
    }
  }

  renderButton = (button) => {
    let buttonText = <Text style={material.titleWhite}>{button}</Text>
    if (button == 'back') buttonText = <MaterialCommunityIcons size={20} name={'backspace-outline'} color={'white'}/>
    return (
      <TouchableNativeFeedback 
        background={TouchableNativeFeedback.Ripple('white')} 
        useForeground 
        onPress={() => {
          if (button == 'CE') this.setState({ text: '' })
          else if (button == '=') this.setState(state => ({ text: eval(state.text) }))
          else if (button == 'back') this.setState(state => ({ text: state.text.substr(0, state.text.length-1) }))
          else this.setState(state => ({ text: `${state.text}${button}` }))
        }}>
        <View
          style={{
            height: buttonHeight, width: buttonWidth, backgroundColor: Colors.BLUEGREY['800'],
            justifyContent: 'center', alignItems: 'center'
          }}>
            {buttonText}
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderTextField = () => {
    return (
      <View style={{ height: 60, width: Dimensions.get('screen').width - 52, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20 }}> 
        <Text style={material.subheading}>{this.state.text}</Text>
      </View>
    )
  }

  renderButtons =() => {
    return (
      <RecyclerListView
        style={{ width: Dimensions.get('window').width - 52, height: buttonHeight*5, alignSelf: 'center' }}
        layoutProvider={this.layoutProvider}
        dataProvider={this.dataProvider.cloneWithRows(this.state.buttons)}
        rowRenderer={(type, button) => this.renderButton(button)} />
    )
  }

  render() {
    return (
      <Portal>
        <Dialog {...this.props}>
          {this.renderTextField()}
          {this.renderButtons()}
          <Dialog.Actions>
            <Button style={{minWidth: 64}} onPress={() => this.props.onDismiss()}>
              {'Fechar'}
            </Button>
            <Button style={{minWidth: 64}} onPress={() => this.submit()}>
              {'Ok'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}