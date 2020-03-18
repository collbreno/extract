import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback, Animated, Dimensions, ScrollView, Keyboard } from 'react-native'
import { Appbar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { OutlinedTextField } from 'react-native-material-textfield'
import Colors from 'react-native-material-color'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'
import SearchableDialog from '../components/SearchableDialog'
import PickerButton from '../components/PickerButton'

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

  componentDidUpdate = (_, prevState) => {
    if (prevState.showPickerDialog != this.state.showPickerDialog && this.state.showPickerDialog) {
      Keyboard.dismiss()
    }
  }

  dismissPickerDialog = () => {
    this.setState({ showPickerDialog: false, maxRecyclerListViewHeight: 300 })
    Animated.timing(this.currentWidth, {
      toValue: 0,
      duration: 0
    }).start()
  }

  renderPickerDialog = () => {
    return (
      <SearchableDialog
        searchable={this.state.pickerDialogType==ICON}
        listWidth={this.state.pickerDialogType==ICON?250:200}
        list={this.state.pickerDialogType==ICON?iconList:colorList}
        title={this.state.pickerDialogType==ICON?'ícone':'cor'}
        renderItem={(item) => {
          if (this.state.pickerDialogType==ICON) {
            return (
              <TouchableNativeFeedback onPress={() => { this.setState({ iconSelected: item }); this.dismissPickerDialog() }}>
              <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: 50, height: 50 }}>
                <MaterialCommunityIcons name={item} size={24} color={'black'} />
              </View>
            </TouchableNativeFeedback>
          )
        }
        return (
          <TouchableNativeFeedback onPress={() => { this.setState({ colorSelected: item }); this.dismissPickerDialog() }}>
            <View style={{ backgroundColor: 'white' }}>
              <View style={{ backgroundColor: item, borderRadius: 20, width: 40, height: 40, margin: 5 }} />
            </View>
          </TouchableNativeFeedback>
        )
        }}
        dismissable={false}
        visible={this.state.showPickerDialog}
        onDismiss={() => this.dismissPickerDialog()} />
    )
  }

  renderColorSelected = () => {
    return (
      <PickerButton
        onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: COLOR })}
        title={'Selecione a cor'}
        icon={'md-color-palette'}
        IconComponent={Ionicons}
        rigth={() => <View style={{ width: 28, height: 28, marginRight: 10, backgroundColor: this.state.colorSelected, borderRadius: 20 }} />} />
    )
  }
  renderIconSelected = () => {
    return (
      <PickerButton 
        onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: ICON, iconList: this.dataProvider.cloneWithRows(iconList) })}
        title={'Selecione o ícone'}
        icon={'circle-edit-outline'}
        IconComponent={MaterialCommunityIcons}
        rigth={() => <MaterialCommunityIcons name={this.state.iconSelected} size={28} color={this.state.colorSelected} style={{ marginRight: 10 }} />}/>
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
        <ScrollView
          keyboardShouldPersistTaps='handled'>
          <OutlinedTextField
            label={'Nome'}
            labelOffset={{ x1: - 40 }}
            renderLeftAccessory={() => <MaterialCommunityIcons style={{ marginRight: 5 }} size={24} name='pencil' />}
            containerStyle={{ marginHorizontal: 20, marginTop: 20 }} />
          {this.renderColorSelected()}
          {this.renderIconSelected()}
        </ScrollView>
      </>
    )
  }
}