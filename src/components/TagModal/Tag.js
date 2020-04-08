import React, { Component } from 'react'
import { View, Text } from 'react-native'
import _ from 'lodash'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Tag extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', ...this.props.style }}>
        <View style={{ overflow: 'hidden', height: 24, backgroundColor: this.props.color, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 4 }}>
          {_.isEmpty(this.props.icon)? null : <MaterialCommunityIcons color={this.props.textColor} style={{marginRight: 4}} name={this.props.icon} size={12}/>}
          <Text numberOfLines={1} style={{ color:this.props.textColor, fontSize: 12, fontFamily: 'sans-serif-medium' }}>{this.props.title}</Text>
        </View>
      </View>
    )
  }
}