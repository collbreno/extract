import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { material } from 'react-native-typography'

export default class PickerButton extends Component {
  render() {
    return (
      <TouchableNativeFeedback onPress={() => this.props.onPress()}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: 56, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <this.props.IconComponent size={24} name={this.props.icon} style={{marginHorizontal: 16, height: 28, width: 28, alignSelf: 'center'}} />
            <Text style={material.subheading}>{this.props.title}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.props.rigth()}
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}