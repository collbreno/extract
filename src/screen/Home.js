import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { FAB, Appbar } from 'react-native-paper'

export default class Home extends Component {
  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title='Home'/>
        </Appbar.Header>
        <Text>primeira tela yey</Text>
        <FAB 
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon='plus'
          onPress={() => this.props.navigation.push('AddCategoryScreen')}/>
      </>
    )
  }
}