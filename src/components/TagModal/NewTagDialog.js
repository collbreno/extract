import React, { Component } from 'react'
import { Text, View, TextInput, Keyboard } from 'react-native'
import { Portal, Dialog, Button, TouchableRipple, Snackbar } from 'react-native-paper';
import PickerButton from '../PickerButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colorList, iconList } from '../../functions';
import SearchableDialog from '../SearchableDialog';
import Colors from 'react-native-material-color'
import _ from 'lodash'
import Tag from './Tag';
import { saveTag, getRealmInstance } from '../../realm';

const ICON = 1
const COLOR = 2
const TEXT_COLOR = 3

export default class NewTagDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      iconSelected: null,
      colorSelected: Colors.GREY['300'],
      textColorSelected: Colors.GREY['900'],
      pickerDialogType: 0,
      snackbarTitle: '',
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.visible != this.props.visible && this.props.visible) {
      Keyboard.dismiss()
    }
  }

  saveTag = () => {
    saveTag({ title: this.props.title, color: this.state.colorSelected, textColor: this.state.textColorSelected, icon: this.state.iconSelected })
      .then((response) => {
        this.setState({ snackbarTitle: 'Tag criada com sucesso' })
        this.props.addTag(response)
        this.props.onDismiss()
      })
      .catch(() => this.setState({ snackbarTitle: 'Erro ao criar Tag' }))
  }

  renderSnackbar = () => {
    return (
      <Portal>
        <Snackbar duration={Snackbar.DURATION_SHORT} visible={!_.isEmpty(this.state.snackbarTitle)} onDismiss={() => this.setState({ snackbarTitle: '' })}>
          {this.state.snackbarTitle}
        </Snackbar>
      </Portal>
    )
  }

  renderSearchableDialog = () => {
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
              <TouchableRipple onPress={() => { this.setState({ iconSelected: item }); this.setState({ showPickerDialog: false }) }}>
                <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: 50, height: 50 }}>
                  <MaterialCommunityIcons name={item} size={24} color={'black'} />
                </View>
              </TouchableRipple>
            )
          }
          return (
            <TouchableRipple onPress={() => { if (this.state.pickerDialogType == COLOR) { this.setState({ colorSelected: item, showPickerDialog: false }) } else this.setState({ textColorSelected: item, showPickerDialog: false }) }}>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ backgroundColor: item, borderWidth: 1, borderColor: Colors.Black, borderRadius: 20, width: 40, height: 40, margin: 5 }} />
              </View>
            </TouchableRipple>
          )
        }}
        dismissable={false}
        visible={this.state.showPickerDialog}
        onDismiss={() => this.setState({ showPickerDialog: false })} />
    )
  }

  render() {
    return (
      <Portal>
        {this.renderSearchableDialog()}
        {this.renderSnackbar()}
        <Dialog dismissable={false} visible={this.props.visible} onDismiss={this.props.onDismiss}>
          <Dialog.Title>{'Criar nova Tag'}</Dialog.Title>
          <Dialog.Content style={{ paddingBottom: 0, paddingHorizontal: 0 }}>
            <Tag style={{ marginLeft: 24, marginBottom: 10 }} title={this.props.title} color={this.state.colorSelected} textColor={this.state.textColorSelected} icon={this.state.iconSelected} />
            <PickerButton
              onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: COLOR })}
              title={'Cor'}
              icon={'md-color-palette'}
              IconComponent={Ionicons}
              right={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 28, height: 28, marginRight: 10, backgroundColor: this.state.colorSelected, borderWidth: 1, borderColor: Colors.Black, borderRadius: 20 }} />
                  <MaterialIcons name='arrow-drop-down' size={24} color='black' />
                </View>
              )} />
            <PickerButton
              onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: TEXT_COLOR })}
              title={'Cor do texto'}
              icon={'format-color-text'}
              IconComponent={MaterialCommunityIcons}
              right={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 28, height: 28, marginRight: 10, backgroundColor: this.state.textColorSelected, borderWidth: 1, borderColor: Colors.Black, borderRadius: 20 }} />
                  <MaterialIcons name='arrow-drop-down' size={24} color='black' />
                </View>
              )} />
            <PickerButton
              onClear={this.state.iconSelected ? () => this.setState({ iconSelected: null }) : null}
              style={this.state.iconSelected ? { paddingRight: 0 } : {}}
              onPress={() => this.setState({ showPickerDialog: true, pickerDialogType: ICON })}
              title={'Ícone'}
              icon={'image'}
              IconComponent={MaterialCommunityIcons}
              right={() => !this.state.iconSelected ? <MaterialIcons name='arrow-drop-down' size={24} color='black' /> :
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: this.state.colorSelected, borderRadius: 6, height: 28, width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <MaterialCommunityIcons name={this.state.iconSelected} size={18} color={this.state.textColorSelected} />
                  </View>
                  <MaterialIcons name='arrow-drop-down' size={24} color='black' />
                </View>
              } />
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={{ minWidth: 64 }} onPress={this.props.onDismiss}>
              {'Cancelar'}
            </Button>
            <Button style={{ minWidth: 64 }} onPress={() => this.saveTag()}>
              {'Salvar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}