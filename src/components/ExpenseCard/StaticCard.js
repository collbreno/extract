import React, { Component } from 'react'
import { View, Text, FlatList, TouchableNativeFeedback, Animated, Dimensions, BackHandler } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { formatCash } from '../../functions';
import Tag from '../TagModal/Tag';
import { format } from 'date-fns';
import Colors from 'react-native-material-color'
import { showSweetAlert } from '../../globalComponents/'
import { material, materialColors } from 'react-native-typography';


export default class StaticCard extends Component {

  render() {
    return (
      <TouchableNativeFeedback useForeground onPress={() => this.View.measure((x, y, w, h, px, py) => this.props.onMeasure(px, py, w, h))}>
        <View ref={ref => this.View = ref} collapsable={false}
          style={{
            margin: 5, borderRadius: 4, 
            backgroundColor: 'white',
            height: 126
          }}>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: this.props.expense.category.color, justifyContent: 'space-between',
              height: 42, borderTopLeftRadius: 4, borderTopRightRadius: 4
            }}>
            <View style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center', }}>
              <MaterialCommunityIcons size={22} color={this.props.textColor} name={this.props.expense.category.icon} />
              <Text style={{ fontFamily: 'sans-serif-medium', color: this.props.textColor, marginLeft: 6, fontSize: 16 }}>{this.props.expense.category.name}</Text>
            </View>
            <Text style={{ marginRight: 12, color: this.props.textColor, fontFamily: 'sans-serif-medium' }}>{formatCash(this.props.expense.value)}</Text>
          </View>
          <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'calendar'} size={14} color={materialColors.blackPrimary} />
                <Text style={{ marginLeft: 6, fontFamily: 'sans-serif-medium', fontSize: 14, color: materialColors.blackPrimary }}>{format(this.props.expense.date, "dd/MM/yyyy")}</Text>
              </View>
              <TouchableNativeFeedback
                onPress={() => {
                  this.View.measure((x, y, w, h, px, py) => {
                    this.props.onDelete(px, py, w, h)
                    return 
                    const noButton = { text: 'Não', onPress: () => false }
                    const yesButton = { text: 'Sim', onPress: () => this.props.onDelete(px, py, w, h) }
                    showSweetAlert({
                      type: 'question',
                      title: 'Apagar gasto?',
                      buttons: [noButton, yesButton]
                    })
                  })
                }}>
                <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name='delete' size={22} color={materialColors.blackPrimary} />
                </View>
              </TouchableNativeFeedback>
            </View>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              horizontal
              renderItem={({ item: tag }) => <Tag style={{ margin: 2 }} icon={tag.icon} title={tag.title} color={tag.color} textColor={tag.textColor} />}
              data={Array.from(this.props.expense.tags).sort((a, b) => {
                if (a.icon && !b.icon) return -1
                if (!a.icon && b.icon) return 1
                if (a.color != Colors.GREY['300'] && b.color == Colors.GREY['300']) return -1
                if (a.color == Colors.GREY['300'] && b.color != Colors.GREY['300']) return 1
                return 0
              })} />
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
} 