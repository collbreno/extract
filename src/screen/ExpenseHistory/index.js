import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { Appbar, Card, Portal, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'
import { getExpenses, deleteExpense, getRealmInstance } from '../../realm';
import { material } from 'react-native-typography';
import { formatCash } from '../../functions';
import _ from 'lodash'
import { DatedExpenseCard } from '../../components/ExpenseCard';

export default class ExpenseHistory extends Component {

  constructor(props) {
    super(props)
    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2)
    this.layoutProvider = new LayoutProvider(() => 'NORMAL', (type, dim) => {
      dim.height =  136
      dim.width = Dimensions.get('screen').width
    })
    this.state = {
      expenseList: this.dataProvider.cloneWithRows([]),
      snackbarTitle: '',
      swalType: '',
      swalTitle: '',
      swalMessage: '',
      swalButtons: [],
      showSwal: false
    }
  }

  showSwal = ( swalType, swalTitle = '', swalMessage = '', swalButtons = [] ) => {
    this.setState({ swalType, swalButtons, swalMessage, swalTitle, showSwal: true })
  }

  deleteExpense = (expense) => {
    deleteExpense(expense.id)
      .then((result) => {
        console.log('file deleted', result)
        this.setState({ snackbarTitle: 'Gasto deletado com sucesso' })
      })
      .catch((error) => {
        console.log('error on delete file', error)
        this.setState({ snackbarTitle: 'Gasto deletado com sucesso' })
      })
  }

  componentDidMount = () => {
    getRealmInstance()
      .then((realm) => realm.addListener('change', () => this.updateExpenses()))
    this.updateExpenses()
  }

  updateExpenses = () => {
    getExpenses()
      .then(response => this.setState({ expenseList: this.dataProvider.cloneWithRows(Array.from(response)) }))
      .catch(() => console.log('error on getting expenses'))
  }

  renderExpense = (expense) => {
    return (
      <DatedExpenseCard
        key={expense.id.toString()}
        width={Dimensions.get('window').width}
        expense={expense} />
    )
  }

  renderList = () => {
    return (
      <RecyclerListView
        // forceNonDeterministicRendering
        style={{ width: Dimensions.get('window').width, flex: 1 }}
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.expenseList}
        rowRenderer={(type, expense) => this.renderExpense(expense)} />
    )
  }

  renderSnackbar = () => {
    return (
      <Portal>
        <Snackbar onDismiss={() => this.setState({ snackbarTitle: '' })} visible={!_.isEmpty(this.state.snackbarTitle)} duration={Snackbar.DURATION_SHORT}>
          {this.state.snackbarTitle}
        </Snackbar>
      </Portal>
    )
  }

  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={'Histórico'} />
        </Appbar.Header>
        {this.renderSnackbar()}
        {this.renderList()}
      </>
    )
  }
}