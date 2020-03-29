import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback, Animated, Dimensions, ScrollView, Keyboard, StatusBar } from 'react-native'
import { Appbar, Button, Snackbar, Portal } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { OutlinedTextField } from 'react-native-material-textfield'
import _ from 'lodash'
import SearchableDialog from '../components/SearchableDialog'
import PickerButton from '../components/PickerButton'
import { addCategory } from '../realm';
import { colorList, iconList } from '../functions';
import Colors from 'react-native-material-color'

const ICON = 1
const COLOR = 2

export default class AddCategory extends Component {

  constructor(props) {
    super(props)
    this.totalWidth = Dimensions.get('window').width - 52
    this.state = {
      showPickerDialog: false,
      pickerDialogType: 0,
      colorSelected: colorList[0],
      toolbarColor: colorList[0],
      iconSelected: iconList[0],
      marginLeft: new Animated.Value(0),
      marginRight: new Animated.Value(0),
      toolbarWidth: new Animated.Value(0),
      toolbarHeight: new Animated.Value(0),
      toolbarRadius: new Animated.Value(100),
      simpleSnackbarTitle: ''

    }
  }

  componentDidUpdate = (_, prevState) => {
    if (prevState.showPickerDialog != this.state.showPickerDialog && this.state.showPickerDialog) {
      Keyboard.dismiss()
    }
    if (prevState.colorSelected != this.state.colorSelected) {
      setTimeout(() => {
        this.setState(state => ({ toolbarHeight: new Animated.Value(0), toolbarWidth: new Animated.Value(0), toolbarRadius: new Animated.Value(100), toolbarColor: state.colorSelected }))
      }, 250);
      Animated.timing(this.state.toolbarWidth, { duration: 250, toValue: Dimensions.get('window').width }).start()
      Animated.timing(this.state.toolbarHeight, { duration: 250, toValue: 56 }).start()
      Animated.timing(this.state.toolbarRadius, { duration: 250, toValue: 0 }).start()
    }
  }

  dismissPickerDialog = () => {
    this.setState({ showPickerDialog: false })
  }

  shakeTextField = () => {
    Animated.sequence([
      Animated.timing(this.state.marginLeft, { toValue: -20, duration: 50 }),
      Animated.timing(this.state.marginLeft, { toValue: 20, duration: 100 }),
      Animated.timing(this.state.marginLeft, { toValue: -20, duration: 100 }),
      Animated.timing(this.state.marginLeft, { toValue: 20, duration: 100 }),
      Animated.timing(this.state.marginLeft, { toValue: 0, duration: 50 }),
    ]).start()
    Animated.sequence([
      Animated.timing(this.state.marginRight, { toValue: 20, duration: 50 }),
      Animated.timing(this.state.marginRight, { toValue: -20, duration: 100 }),
      Animated.timing(this.state.marginRight, { toValue: 20, duration: 100 }),
      Animated.timing(this.state.marginRight, { toValue: -20, duration: 100 }),
      Animated.timing(this.state.marginRight, { toValue: 0, duration: 50 }),
    ]).start()
  }

  checkFields = () => {
    if (_.isEmpty(this.CategoryName.value())) {
      this.shakeTextField()
      return
    }
    addCategory({ name: this.CategoryName.value(), color: this.state.colorSelected, icon: this.state.iconSelected })
      .then(() => this.setState({ simpleSnackbarTitle: 'Categoria criada com sucesso' }))
      .catch(() => this.setState({ simpleSnackbarTitle: 'Erro ao criar categoria' }))
  }

  renderSimpleSnackbar = () => {
    return (
      <Portal>
        <Snackbar
          duration={Snackbar.DURATION_SHORT}
          visible={!_.isEmpty(this.state.simpleSnackbarTitle)}
          onDismiss={() => this.setState({ simpleSnackbarTitle: '' })}>
          {this.state.simpleSnackbarTitle}
        </Snackbar>
      </Portal>
    )
  }

  renderPickerDialog = () => {
    return (
      <SearchableDialog
        searchable={this.state.pickerDialogType == ICON}
        itemWidth={50}
        searchFunction={(element, text) => element.toLowerCase().includes(text.toLowerCase())}
        itemHeight={50}
        columns={5}
        list={this.state.pickerDialogType == ICON ? iconList : colorList}
        title={this.state.pickerDialogType == ICON ? 'ícone' : 'cor'}
        renderItem={(item) => {
          if (this.state.pickerDialogType == ICON) {
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
                <View style={{ backgroundColor: item, borderWidth: 1, borderColor: Colors.Black, borderRadius: 20, width: 40, height: 40, margin: 5 }} />
              </View>
            </TouchableNativeFeedback>
          )
        }}
        dismissable={false}
        visible={this.state.showPickerDialog}
        onDismiss={() => this.dismissPickerDialog()} />
    )
  }

  renderTextField = () => {
    return (
      <Animated.View style={{ marginLeft: this.state.marginLeft, marginRight: this.state.marginRight }}>
        <OutlinedTextField
          ref={ref => this.CategoryName = ref}
          label={'Nome'}
          tintColor={this.state.colorSelected}
          labelOffset={{ x1: - 60 }}
          renderLeftAccessory={() => <MaterialCommunityIcons style={{ marginRight: 20 }} size={24} name='pencil' />}
          containerStyle={{ marginHorizontal: 20, marginTop: 20 }} />
      </Animated.View>
    )
  }

  renderColorSelected = () => {
    return (
      <PickerButton
        onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: COLOR })}
        title={'Selecione a cor'}
        icon={'md-color-palette'}
        IconComponent={Ionicons}
        right={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, marginRight: 10, backgroundColor: this.state.colorSelected, borderWidth: 1, borderColor: Colors.Black, borderRadius: 20 }} />
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </View>
        )} />
    )
  }
  renderIconSelected = () => {
    return (
      <PickerButton
        onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: ICON })}
        title={'Selecione o ícone'}
        icon={'image'}
        IconComponent={MaterialCommunityIcons}
        right={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name={this.state.iconSelected} size={28} color={this.state.colorSelected} style={{ marginRight: 10 }} />
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </View>
        )} />
    )
  }

  renderSaveButton = () => {
    return (
      <Button
        mode='contained'
        style={{ marginTop: 50, marginHorizontal: 20, backgroundColor: this.state.colorSelected }}
        onPress={this.checkFields}>
        {'Salvar'}
      </Button>
    )
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor={this.state.toolbarColor} />
        <Appbar.Header style={{ zIndex: 3, backgroundColor: this.state.toolbarColor }}>
          <Animated.View
            style={{
              backgroundColor: this.state.colorSelected, position: 'absolute', zIndex: 5, borderRadius: this.state.toolbarRadius,
              borderBottomRightRadius: 0, right: 0, bottom: 0, width: this.state.toolbarWidth, height: this.state.toolbarHeight,
            }} />
          <Appbar.BackAction style={{ zIndex: 8 }} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content style={{ zIndex: 8 }} title='Add category' />
        </Appbar.Header>
        {this.renderSimpleSnackbar()}
        {this.renderPickerDialog()}
        <ScrollView
          keyboardShouldPersistTaps='handled'>
          {this.renderTextField()}
          {this.renderColorSelected()}
          {this.renderIconSelected()}
          {this.renderSaveButton()}
        </ScrollView>
      </>
    )
  }
}