import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FAB, Appbar, Button, Card } from 'react-native-paper'
import Colors from 'react-native-material-color'
import { material } from 'react-native-typography'
import { formatCash } from '../functions'
import { IconButton } from '../components/Buttons'
import { getMonthExpenseValue, getRealmInstance } from '../realm'

export default class Home extends Component {


  constructor(props) {
    super(props)
    this.state = {
      spentInMonth: 0
    }
  }

  componentDidMount = () => {
    this.updateSpentInMonth()
    getRealmInstance()
      .then(realm => realm.addListener('change', () => this.updateSpentInMonth()))
  }

  updateSpentInMonth = () => {
    getMonthExpenseValue()
      .then(value => this.setState({ spentInMonth: value }))
  }

  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title='Home' />
        </Appbar.Header>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...material.title, fontSize: 24, marginTop: 24 }}>{'Gasto esse mês:'}</Text>
          <Text style={{ fontFamily: 'sans-serif-medium', fontSize: 18 }}>{formatCash(this.state.spentInMonth)}</Text>
        </View>
        <View style={{ marginTop: 50, justifyContent: 'space-around', flexDirection: 'row', paddingHorizontal: 30 }}>
          <IconButton
            onPress={() => this.props.navigation.push('AddCategoryScreen')}
            backgroundColor={Colors.BLUE['700']} icon={'plus-box'}
            text={'Nova categoria'} textColor={'white'} />
          <IconButton
            onPress={() => this.props.navigation.push('ExpenseHistoryScreen')}
            backgroundColor={Colors.BLUE['700']} icon={'md-list-box'}
            IconComponent={Ionicons} text={'Histórico'} textColor={'white'} />
        </View>
        <FAB
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0
          }}
          icon='plus'
          onPress={() => this.props.navigation.push('NewExpenseScreen')} />
      </>
    )
  }
}