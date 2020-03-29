import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { material } from 'react-native-typography'
import Colors from 'react-native-material-color'
import { TouchableRipple } from 'react-native-paper';

export default class PickerButton extends Component {
  render() {
    return (
      <TouchableRipple onPress={() => this.props.onPress()}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: 56, paddingHorizontal: 20, ...this.props.style }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <this.props.IconComponent size={24} name={this.props.icon} style={{ marginHorizontal: 12, height: 28, width: 28, alignSelf: 'center' }} />
            <Text style={material.subheading}>{this.props.title}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: 'center' }}>
            {
              typeof this.props.right != 'function' ? null :
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {this.props.right()}
                </View>
            }
            {
              typeof this.props.onClear != 'function' ? null :
              <TouchableRipple style={{height: 48, width: 48, alignItems: 'center', justifyContent: 'center'}} onPress={this.props.onClear}>
                <MaterialCommunityIcons size={24} color={Colors.RED['700']} name={'close'} />
              </TouchableRipple>
            }
          </View>
        </View>
      </TouchableRipple>
    )
  }
}