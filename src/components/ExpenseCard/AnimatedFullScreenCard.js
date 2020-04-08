import React, { Component } from 'react'
import { View, Text, FlatList, TouchableNativeFeedback, Animated, Dimensions, BackHandler } from 'react-native'
import { Card, Portal } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { formatCash } from '../../functions';
import Tag from '../TagModal/Tag';
import { format } from 'date-fns';
import Colors from 'react-native-material-color'
import _ from 'lodash'
import { material, materialColors } from 'react-native-typography';
import LottieView from 'lottie-react-native'
import { showSweetAlert } from '../../globalComponents';

const back_button_white = require('../../../assets/lottie/back_button_white.json')

export default class AnimatedFullScreenCard extends Component {

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.exitFullScreen()
      return true
    })
  }

  componentWillUnmount = () => {
    if (this.backHandler) this.backHandler.remove()
  }

  renderToolbar = () => {
    return (
      <Animated.View
        style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: this.props.expense.category.color, justifyContent: 'space-between',
          height: this.props.toolbarHeight, borderTopLeftRadius: this.props.borderRadius, borderTopRightRadius: this.props.borderRadius
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ marginLeft: 6 }}>
            <TouchableNativeFeedback
              onPress={() => this.props.exitFullScreen()}>
              <View>
                <LottieView progress={this.props.lottieProgress} style={{ height: 42, width: 42 }} source={back_button_white} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <Animated.View style={{ position: 'absolute', left: this.props.titleMarginLeft, flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons size={22} color={this.props.textColor} name={this.props.expense.category.icon} />
            <Text style={{ fontFamily: 'sans-serif-medium', color: this.props.textColor, marginLeft: 6, fontSize: 16 }}>{this.props.expense.category.name}</Text>
          </Animated.View>
        </View>
        <Text style={{ marginRight: 12, color: this.props.textColor, fontFamily: 'sans-serif-medium' }}>{formatCash(this.props.expense.value)}</Text>
      </Animated.View>
    )
  }

  renderDateAndDeleteButton = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name={'calendar'} size={14} color={materialColors.blackPrimary} />
          <Text style={{ marginLeft: 6, fontFamily: 'sans-serif-medium', fontSize: 14, color: materialColors.blackPrimary }}>{format(this.props.expense.date, "dd/MM/yyyy")}</Text>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            console.log('cliquei no botao de apagar')
            this.props.onDelete(0, 0, Dimensions.get('window').width, Dimensions.get('window').height)
            return
            //sweet alert não funciona por algum motivo. TODO: consertar isso
            const noButton = { text: 'Não', onPress: () => false }
            const yesButton = { text: 'Sim', onPress: () => this.props.onDelete(0, 0, Dimensions.get('window').width, Dimensions.get('window').height) }
            showSweetAlert({
              type: 'question',
              title: 'Apagar gasto?',
              buttons: [noButton, yesButton]
            })
          }}>
          <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name='delete' size={22} color={materialColors.blackPrimary} />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderDescription = () => {
    if (_.isEmpty(this.props.expense.description)) return null
    return (
      <Animated.View style={{ overflow: 'hidden', maxHeight: this.props.descriptionHeight }}>
        <Text style={{ paddingHorizontal: 12, paddingBottom: 12 }}>{this.props.expense.description}</Text>
      </Animated.View>
    )
  }

  renderTagList = () => {
    return (
      <Animated.View
        style={{
          maxWidth: this.props.listMaxWidth,
          maxHeight: this.props.listMaxHeight
        }}>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          horizontal={this.props.horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: tag }) => <Tag style={{ margin: 2, overflow: 'hidden' }} icon={tag.icon} title={tag.title} color={tag.color} textColor={tag.textColor} />}
          data={Array.from(this.props.expense.tags).sort((a, b) => {
            if (a.icon && !b.icon) return -1
            if (!a.icon && b.icon) return 1
            if (a.color != Colors.GREY['300'] && b.color == Colors.GREY['300']) return -1
            if (a.color == Colors.GREY['300'] && b.color != Colors.GREY['300']) return 1
            return 0
          })} />
      </Animated.View>
    )
  }

  render() {
    return (
      <View>
        <Portal>
          <Animated.View
            style={{
              borderRadius: this.props.borderRadius,
              backgroundColor: 'white',
              top: this.props.top,
              left: this.props.left,
              zIndex: 1,
              height: this.props.height,
              width: this.props.width
            }}>
            {this.renderToolbar()}
            <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
              {this.renderDateAndDeleteButton()}
              {this.renderDescription()}
              {this.renderTagList()}
            </View>
          </Animated.View>
        </Portal>
      </View>
    )
  }
}