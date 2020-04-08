import React from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'
import { material } from 'react-native-typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const IconButton = ({ onPress, backgroundColor, textColor, icon, text, IconComponent = MaterialCommunityIcons }) => {
  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(textColor)} useForeground onPress={() => onPress()}>
    <View style={{ width: 100, height: 120, backgroundColor, alignItems: 'center', justifyContent: 'center', borderRadius: 4, elevation: 4 }}>
      <IconComponent color={textColor} size={36} name={icon}/>
      <Text style={{...material.button, color: textColor, marginTop: 12, textAlign: 'center'}}>{text.toUpperCase()}</Text>
    </View>
  </TouchableNativeFeedback>
  )
}