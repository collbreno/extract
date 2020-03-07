import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback, ActivityIndicator, Animated, Dimensions, TextInput, Keyboard } from 'react-native'
import { Appbar, Button, Portal, Dialog } from 'react-native-paper'
import { TextField } from 'material-bread'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { OutlinedTextField } from 'react-native-material-textfield'
import Colors from 'react-native-material-color'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'

const ICON = 1
const COLOR = 2
const colorList = [
  Colors.RED[300], Colors.RED[500], Colors.RED[700], Colors.RED[900],
  Colors.BLUE[300], Colors.BLUE[500], Colors.BLUE[700], Colors.BLUE[900],
  Colors.GREY[300], Colors.GREY[500], Colors.GREY[700], Colors.GREY[900],
  Colors.YELLOW[300], Colors.YELLOW[500], Colors.YELLOW[700], Colors.YELLOW[900],
  Colors.ORANGE[300], Colors.ORANGE[500], Colors.ORANGE[700], Colors.ORANGE[900],
  Colors.PURPLE[300], Colors.PURPLE[500], Colors.PURPLE[700], Colors.PURPLE[900],
  Colors.PINK[300], Colors.PINK[500], Colors.PINK[700], Colors.PINK[900],
  Colors.GREEN[300], Colors.GREEN[500], Colors.GREEN[700], Colors.GREEN[900],
]
const iconList = Object.keys(MaterialCommunityIcons.getRawGlyphMap())

export default class AddCategory extends Component {

  constructor(props) {
    super(props)
    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2)
    this.layoutProvider = new LayoutProvider(() => 'NORMAL', (type, dim) => {
      dim.height = 50
      dim.width = 50
    })
    this.currentWidth = new Animated.Value(0)
    this.totalWidth = Dimensions.get('window').width - 52
    this.state = {
      showPickerDialog: false,
      pickerDialogType: 0,
      colorSelected: colorList[0],
      iconSelected: iconList[0],
      collapsed: true,
      iconList: this.dataProvider.cloneWithRows(iconList),
      maxRecyclerListViewHeight: 300
    }
  }

  // componentDidMount = () => {
  //   Keyboard.addListener('keyboardDidHide', () => this.setState({ maxRecyclerListViewHeight: 300 }))
  //   Keyboard.addListener('keyboardDidShow', () => this.setState({ maxRecyclerListViewHeight: 100 }))
  // }

  dismissPickerDialog = () => {
    this.setState({ showPickerDialog: false, maxRecyclerListViewHeight: 300 })
    Animated.timing(this.currentWidth, {
      toValue: 0,
      duration: 0
    }).start()
  }

  renderColor = (color) => (
    <TouchableNativeFeedback onPress={() => { this.setState({ colorSelected: color }); this.dismissPickerDialog() }}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ backgroundColor: color, borderRadius: 20, width: 40, height: 40, margin: 5 }} />
      </View>
    </TouchableNativeFeedback>
  )
  renderIcon = (icon) => {
    return (
      <TouchableNativeFeedback onPress={() => { this.setState({ iconSelected: icon }); this.dismissPickerDialog() }}>
        <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: 50, height: 50 }}>
          <MaterialCommunityIcons name={icon} size={24} color={'black'} />
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderPickerDialogContent = () => {
    if (this.state.pickerDialogType == ICON) {
      return (
        <>
          <Animated.View style={{
            position: 'absolute', width: this.currentWidth,
            height: 60, backgroundColor: 'white', zIndex: 15,
            right: 0, top: 0, overflow: 'hidden',
            flexDirection: 'row', alignItems: 'center'
          }}>
            <TextInput
              ref={ref => this.searchTextRef = ref}
              style={{ marginLeft: 12 }}
              placeholder={'Pesquisar icone'}
              onChangeText={(text) => this.setState({ iconList: this.dataProvider.cloneWithRows(iconList.filter((element) => element.includes(text))) })} />
          </Animated.View>
          <View style={{
            position: 'absolute', right: 0, top: 0, alignItems: 'flex-end',
            height: 60, width: 48,
            backgroundColor: 'white', zIndex: 10, justifyContent: 'center'
          }}>
            <TouchableNativeFeedback onPress={() => {
              setTimeout(() => {
                if (this.searchTextRef) {
                  this.searchTextRef.focus()
                  this.setState({ maxRecyclerListViewHeight: 100 })
                }
              }, 150);
              Animated.timing(this.currentWidth, {
                duration: 150,
                toValue: this.totalWidth
              }).start()
            }}>
              <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name='search' size={32} color={'black'} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <Dialog.Title>{'Selecione o ícone'}</Dialog.Title>
          <Dialog.Content>
            <ActivityIndicator size={"large"} style={{ alignSelf: 'center', position: 'absolute' }} />
            <RecyclerListView
              style={{ width: 250, height: this.state.maxRecyclerListViewHeight, alignSelf: 'center' }}
              layoutProvider={this.layoutProvider}
              dataProvider={this.state.iconList}
              rowRenderer={(type, icon) => this.renderIcon(icon)} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ minWidth: 64 }} onPress={() => this.dismissPickerDialog()}>Cancelar</Button>
          </Dialog.Actions>
        </>
      )
    }
    return (
      <>
        <Dialog.Title>{'Selecione a cor'}</Dialog.Title>
        <Dialog.Content>
          <ActivityIndicator size={"large"} style={{ alignSelf: 'center', position: 'absolute' }} />
          <RecyclerListView
            style={{ width: 200, height: 300, alignSelf: 'center' }}
            layoutProvider={this.layoutProvider}
            dataProvider={this.dataProvider.cloneWithRows(colorList)}
            rowRenderer={(type, color) => this.renderColor(color)} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={{ minWidth: 64 }} onPress={() => this.dismissPickerDialog()}>Cancelar</Button>
        </Dialog.Actions>
      </>
    )
  }

  renderPickerDialog = () => {
    return (
      <Portal>
        <Dialog
          dismissable={false}
          visible={this.state.showPickerDialog}
          onDismiss={() => this.dismissPickerDialog()}>
          {this.renderPickerDialogContent()}
        </Dialog>
      </Portal>
    )
  }

  renderColorSelected = () => {
    return (
      <TouchableNativeFeedback onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: COLOR })}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: 45 }}>
          <Text>Selecione a cor</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, marginRight: 10, backgroundColor: this.state.colorSelected, borderRadius: 20 }} />
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
  renderIconSelected = () => {
    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({ showPickerDialog: true, pickerDialogType: ICON, iconList: this.dataProvider.cloneWithRows(iconList) })
      }}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: 45 }}>
          <Text>Selecione o icone</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={this.state.iconSelected} size={28} color={this.state.colorSelected} style={{ marginRight: 10 }} />
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title='Add category' />
        </Appbar.Header>
        {this.renderPickerDialog()}
        <View
          style={{
            marginHorizontal: 20,
          }}>
          <OutlinedTextField
            containerStyle={{ marginTop: 20 }}
            label='Nome' />
          {this.renderColorSelected()}
          {this.renderIconSelected()}
        </View>
      </>
    )
  }
}