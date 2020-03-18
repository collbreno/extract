import React, { Component } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { Appbar, TextInput, TouchableRipple } from 'react-native-paper'
import Colors from 'react-native-material-color'
import { OutlinedTextField } from 'react-native-material-textfield'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class NewExpense extends Component {
  render() {
    return (
      <>
        <StatusBar backgroundColor={Colors.RED['900']} />
        <Appbar.Header style={{ backgroundColor: Colors.RED['A700'] }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={'Novo gasto'} />
        </Appbar.Header>
        <OutlinedTextField
          label={'Nome'}
          labelOffset={{ x1: - 40 }}
          renderLeftAccessory={() => <MaterialCommunityIcons style={{ marginRight: 5 }} size={24} name='pencil' />}
          containerStyle={{ marginHorizontal: 20, marginTop: 20 }} />
        <TouchableRipple
          onPress={() => false}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, height: 60}}>
            <Text>{'Selecione a categoria'}</Text>
            <MaterialCommunityIcons style={{padding: 12}} size={24} name={'menu-down'}/>
          </View>
        </TouchableRipple>
      </>
    )
  }
}