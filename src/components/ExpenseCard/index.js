import React, { Component } from 'react'
import { Animated, Dimensions, BackHandler, View, StatusBar } from 'react-native'
import StaticCard from './StaticCard';
import AnimatedFullScreenCard from './AnimatedFullScreenCard';
import DeletingAnimatedCard from './DeletingAnimatedCard';
import { deleteExpense } from '../../realm';
import { getTextColor } from '../../functions';

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

const duration = 3000
const initialLottieProgress = (1/61)*13
const finalLottieProgress = (1/61)*28

const tagMinHeight = 28
const tagMinWidth = 20

const trashProgress = {
  INITIAL: 0,
  UP: (1/72)*17,
  OPEN: (1/72)*27,
  CLOSING: (1/72)*42,
  CLOSED: (1/72)*57,
  GONE: (1/72)*70
}

const NORMAL = 1
const FULL_SCREEN = 2
const DELETING = 3

export class DatedExpenseCard extends Component {
  constructor(props) {
    super(props)
    this.px = 0
    this.py = 0
    this.width = 0
    this.height = 0
    this.initialMarginLeft = 12
    this.state = {
      cardType: NORMAL,
      top: new Animated.Value(0),
      left: new Animated.Value(0),
      width: new Animated.Value(0),
      height: new Animated.Value(0),
      borderRadius: new Animated.Value(4),
      toolbarHeight: new Animated.Value(42),
      lottieProgress : new Animated.Value(initialLottieProgress),
      trashProgress: new Animated.Value(trashProgress.INITIAL),
      titleMarginLeft: new Animated.Value(this.initialMarginLeft),
      flatListHorizontal: true,
      flatListMaxWidth: new Animated.Value(screenWidth),
      flatListMaxHeight: new Animated.Value(screenHeight),
      descriptionHeight: new Animated.Value(0)
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.cardType != this.state.cardType) {
      this.forceUpdate()
    }
  }

  exitFullScreen = () => {
    setTimeout(() => {
      this.setState({ flatListHorizontal: true })
    }, duration/2);
      setTimeout(() => {
        this.setState({ cardType: NORMAL })
      }, duration);
      Animated.parallel([
        Animated.sequence([
          Animated.parallel([
            Animated.timing(this.state.flatListMaxHeight, { toValue: tagMinHeight, duration: duration / 2 }),
            Animated.timing(this.state.flatListMaxWidth, { toValue: tagMinWidth, duration: duration / 2 }),
          ]),
          Animated.parallel([
            Animated.timing(this.state.flatListMaxHeight, { toValue: screenHeight, duration: duration / 2 }),
            Animated.timing(this.state.flatListMaxWidth, { toValue: screenWidth, duration: duration / 2 }),
          ]),
        ]),
        Animated.timing(this.state.descriptionHeight, { toValue: 0, duration }),
        Animated.timing(this.state.top, { toValue: this.py, duration }),
        Animated.timing(this.state.titleMarginLeft, { toValue: this.initialMarginLeft, duration }),
        Animated.timing(this.state.left, { toValue: this.px, duration }),
        Animated.timing(this.state.toolbarHeight, { toValue: 42, duration }),
        Animated.timing(this.state.borderRadius, { toValue: 4, duration }),
        Animated.timing(this.state.width, { toValue: this.width, duration }),
        Animated.timing(this.state.height, { toValue: this.height, duration }),
        Animated.timing(this.state.lottieProgress, { toValue: initialLottieProgress, duration: duration / 2 })
      ]).start()
  }
  
  deleteCard = (px, py, width, height) => {

    const y0 = Math.max(56 + 20, py)
    const y1 = screenHeight - 25 - 8 - StatusBar.currentHeight
    const y2 = screenHeight - StatusBar.currentHeight - 25 - 8 + 72

    console.log('deletando card')
    this.setState({
      top: new Animated.Value(py),
      left: new Animated.Value(px),
      width: new Animated.Value(width),
      height: new Animated.Value(height),
      cardType: DELETING
    }, () => {
      setTimeout(() => {
        deleteExpense(this.props.expense.id)
      }, duration*2 + duration/2 + duration/3);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.top, { toValue: y0, duration }),
          Animated.timing(this.state.descriptionHeight, { toValue: 0 }),
          Animated.timing(this.state.width, { toValue: 25, duration }),
          Animated.timing(this.state.left, { toValue: 25, duration }),
          Animated.timing(this.state.height, { toValue: 25, duration }),
          Animated.timing(this.state.trashProgress, { toValue: trashProgress.OPEN, duration })
        ]),
        Animated.parallel([
          Animated.timing(this.state.trashProgress, { toValue: trashProgress.CLOSING, duration }),
          Animated.timing(this.state.top, { toValue: y1, duration }),
        ]),
        Animated.timing(this.state.trashProgress, { toValue: trashProgress.CLOSED, duration: duration/2 }),
        Animated.parallel([
          Animated.timing(this.state.top, { toValue: y2, duration: duration/3 }),
          Animated.timing(this.state.trashProgress, { toValue: trashProgress.GONE, duration: duration/3 })
        ]),
      ]).start()
    })
  }

  showFullScreen = (px, py, width, height) => {
    this.py = py
    this.px = px
    this.width = width
    this.height = height
    this.setState({
      top: new Animated.Value(py),
      left: new Animated.Value(px),
      width: new Animated.Value(width),
      height: new Animated.Value(height),
      cardType: FULL_SCREEN
    }, () => {
      setTimeout(() => {
        this.setState({ flatListHorizontal: false })
      }, duration/2);
        Animated.parallel([
          Animated.sequence([
            Animated.parallel([
              Animated.timing(this.state.flatListMaxHeight, { toValue: tagMinHeight, duration: duration / 2 }),
              Animated.timing(this.state.flatListMaxWidth, { toValue: tagMinWidth, duration: duration / 2 }),
            ]),
            Animated.parallel([
              Animated.timing(this.state.flatListMaxHeight, { toValue: screenHeight, duration: duration / 2 }),
              Animated.timing(this.state.flatListMaxWidth, { toValue: screenWidth, duration: duration / 2 }),
            ]),
          ]),
          Animated.timing(this.state.top, { toValue: 0, duration }),
          Animated.timing(this.state.descriptionHeight, { toValue: screenWidth, duration }),
          Animated.timing(this.state.titleMarginLeft, { toValue: 54, duration }),
          Animated.timing(this.state.left, { toValue: 0, duration }),
          Animated.timing(this.state.toolbarHeight, { toValue: 56, duration }),
          Animated.timing(this.state.borderRadius, { toValue: 0, duration }),
          Animated.timing(this.state.width, { toValue: screenWidth, duration }),
          Animated.timing(this.state.height, { toValue: screenHeight, duration }),
          Animated.timing(this.state.lottieProgress, { toValue: finalLottieProgress, delay: duration/2, duration: duration/2 })
        ]).start()
    })
  }

  renderDeletingAnimatedCard = () => {
    return (
      <DeletingAnimatedCard 
        expense={this.props.expense}
        width={this.state.width}
        left={this.state.left}
        descriptionHeight={this.state.descriptionHeight}
        horizontal={this.state.flatListHorizontal}
        borderRadius={this.state.borderRadius}
        titleMarginLeft={this.state.titleMarginLeft}
        lottieProgress={this.state.lottieProgress}
        toolbarHeight={this.state.toolbarHeight}
        top={this.state.top}
        textColor={getTextColor(this.props.expense.category.color)}
        trashProgress={this.state.trashProgress}
        height={this.state.height}/>
    )
  }

  renderStaticCard = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <StaticCard
          onMeasure={this.showFullScreen}
          onDelete={this.deleteCard}
          textColor={getTextColor(this.props.expense.category.color)}
          expense={this.props.expense} />
      </View>
    )
  }

  renderAnimatedFullScreenCard = () => {
    return (
      <AnimatedFullScreenCard 
        exitFullScreen={this.exitFullScreen}
        listMaxHeight={this.state.flatListMaxHeight}
        descriptionHeight={this.state.descriptionHeight}
        horizontal={this.state.flatListHorizontal}
        listMaxWidth={this.state.flatListMaxWidth}
        borderRadius={this.state.borderRadius}
        lottieProgress={this.state.lottieProgress}
        left={this.state.left}
        top={this.state.top}
        toolbarHeight={this.state.toolbarHeight}
        textColor={getTextColor(this.props.expense.category.color)}
        width={this.state.width}
        height={this.state.height}
        onDelete={this.deleteCard}
        titleMarginLeft={this.state.titleMarginLeft}
        expense={this.props.expense}/>
    )
  }

  render() {
    if (this.state.cardType == FULL_SCREEN) {
      return this.renderAnimatedFullScreenCard()
    }
    else if (this.state.cardType == DELETING) {
      return this.renderDeletingAnimatedCard()
    }
    return this.renderStaticCard()
  }
}