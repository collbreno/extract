import React, { Component } from 'react'
import { View, Text, FlatList, TouchableNativeFeedback, Animated, Dimensions, BackHandler } from 'react-native'
import { Card, Portal, Dialog } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { formatCash } from '../../functions';
import _ from 'lodash'
import Tag from '../TagModal/Tag';
import { format } from 'date-fns';
import Colors from 'react-native-material-color'
import { material, materialColors } from 'react-native-typography';
import LottieView from 'lottie-react-native'

const trash = require('../../../assets/lottie/trash.json')

export default class DeletingAnimatedCard extends Component {

  renderDescription = () => {
    if (_.isEmpty(this.props.expense.description)) return null
    return (
      <Animated.View style={{ overflow: 'hidden', maxHeight: this.props.descriptionHeight }}>
        <Text style={{ paddingHorizontal: 12, paddingBottom: 12 }}>{this.props.expense.description}</Text>
      </Animated.View>
    )
  }

  render() {
    return (
      <Portal>
        <View style={{ zIndex: 9, position: 'absolute', left: 6, bottom: 0 }}>
          <LottieView style={{ height: 72, width: 72 }} progress={this.props.trashProgress} source={trash} />
        </View>
        <Animated.View
          style={{
            borderRadius: 4,
            backgroundColor: 'white',
            position: 'absolute',
            top: this.props.top,
            left: this.props.left,
            height: this.props.height,
            width: this.props.width,
            overflow: 'hidden'
          }}>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: this.props.expense.category.color, justifyContent: 'space-between',
              height: 42, paddingHorizontal: 12, borderTopLeftRadius: 4, borderTopRightRadius: 4, overflow: 'scroll'
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', overflow: 'scroll' }}>
              <MaterialCommunityIcons size={22} color={this.props.textColor} name={this.props.expense.category.icon} />
              <Text style={{ fontFamily: 'sans-serif-medium', color: this.props.textColor, marginLeft: 6, fontSize: 16 }}>{this.props.expense.category.name}</Text>
            </View>
            <Text style={{ color: this.props.textColor, fontFamily: 'sans-serif-medium' }}>{formatCash(this.props.expense.value)}</Text>
          </View>
          <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'calendar'} size={14} color={materialColors.blackPrimary} />
                <Text style={{ marginLeft: 6, fontFamily: 'sans-serif-medium', fontSize: 14, color: materialColors.blackPrimary }}>{format(this.props.expense.date, "dd/MM/yyyy")}</Text>
              </View>
              <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name='delete' size={22} color={materialColors.blackPrimary} />
              </View>
            </View>
            {this.renderDescription()}
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              horizontal={this.props.horizontal}
              renderItem={({ item: tag }) => <Tag style={{ margin: 2 }} icon={tag.icon} title={tag.title} color={tag.color} textColor={tag.textColor} />}
              data={Array.from(this.props.expense.tags).sort((a, b) => {
                if (a.icon && !b.icon) return -1
                if (!a.icon && b.icon) return 1
                if (a.color != Colors.GREY['300'] && b.color == Colors.GREY['300']) return -1
                if (a.color == Colors.GREY['300'] && b.color != Colors.GREY['300']) return 1
                return 0
              })} />
          </View>
        </Animated.View>
      </Portal>
    )
  }
}