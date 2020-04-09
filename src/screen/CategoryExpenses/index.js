import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback, Dimensions, FlatList } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
// import { PieChart } from 'react-native-chart-kit'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { PieChart } from 'react-native-svg-charts'
import { getCategories } from '../../realm'
import { getTextColor, formatCash } from '../../functions'

const categoryList = [
  { name: 'Comida', color: 'red', value: 37, id: 14 },
  { name: 'Entretenimento', color: 'green', value: 21, id: 3 },
  { name: 'Saúde', color: 'blue', value: 64, id: 7 },
  { name: 'Aluguel', color: 'yellow', value: 14, id: 92 },
]

export default class CategoryExpenses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categories: []
    }
  }

  componentDidMount = () => {
    getCategories()
      .then(response => {
        response.forEach(category => {
          this.setState(state => ({ 
            categories: [
              ...state.categories, 
              { ...category, value: category.expenses.sum('value') }
            ] 
          }))
        })
      })
      .catch(error => {
        console.log('erro ao pegar categorias', error)
      })
  }

  renderLabel = ({item: category}) => {
    return (
      <View
        style={{
          alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
          height: 36, paddingHorizontal: 12, backgroundColor: category.color,
          marginHorizontal: 12, borderRadius: 12
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name={category.icon} size={18} color={getTextColor(category.color)} />
          <Text style={{ fontFamily: 'sans-serif-medium', color: getTextColor(category.color), marginLeft: 6, fontSize: 14 }}>{category.name}</Text>
        </View>
        <Text style={{ color: getTextColor(category.color), fontFamily: 'sans-serif-medium' }}>{formatCash(category.expenses.sum('value'))}</Text>
      </View>
    )
  }

  renderToolbar = () => {
    return (
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => this.props.navigation.pop()} />
        <Appbar.Content
          title={'Gastos por categoria'} />
      </Appbar.Header>
    )
  }

  renderChart = () => {
    return (
      <View style={{ paddingTop: 20, alignItems: 'center' }}>
        <PieChart
          style={{ height: 200, width: 200 }}
          data={this.state.categories.map(element => ({
            key: element.id.toString(),
            value: element.value,
            svg: {
              fill: element.color,
              onPress: () => false
            }
          }))} />
          <FlatList 
            data={this.state.categories}
            renderItem={this.renderLabel}
            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
            keyExtractor={(category) => category.id.toString()}
            style={{
              marginTop: 30,
              width: 300,
              height: 250
            }}/>
      </View>
    )
    return (
      <PieChart 
        data={this.state.categories}
        chartConfig={{
          color: () => 'rgba(255,255,255,1)',
          backgroundColor: 'yellow'
        }}
        height={350}
        accessor={'value'}
        width={Dimensions.get('screen').width}/>
    )
  }

  render() {
    return (
      <>
        {this.renderToolbar()}
        {this.renderChart()}
      </>
    )
  }
}