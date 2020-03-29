import React, { Component } from 'react'
import { View, Text, TextInput, ActivityIndicator, Animated, Dimensions, Keyboard } from 'react-native'
import { Portal, Dialog, Button, withTheme, TouchableRipple } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import _ from 'lodash'
import LottieView from 'lottie-react-native'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'

class SearchableDialog extends Component {

  constructor(props) {
    super(props)
    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2)
    this.layoutProvider = new LayoutProvider(() => 'NORMAL', (type, dim) => {
      dim.height = props.itemHeight
      dim.width = props.itemWidth
    })
    this.totalWidth = Dimensions.get('window').width - 52
    this.state = {
      maxRecyclerListViewHeight: new Animated.Value(300),
      collapsed: true,
      currentWidth: new Animated.Value(0),
      itemList: this.dataProvider.cloneWithRows(props.list),
      animationProgress: new Animated.Value(0)
    }
  }

  componentDidMount = () => {
    Keyboard.addListener('keyboardDidShow', ({duration}) => {
      Animated.timing(this.state.maxRecyclerListViewHeight, {
        duration: 150,
        toValue: 150
      }).start()
    })
    Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(this.state.maxRecyclerListViewHeight, {
        duration: 150,
        toValue: 300,
      }).start()
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.list != this.props.list) {
      this.setState({ itemList: this.dataProvider.cloneWithRows(this.props.list) })
    }
    if (prevProps.visible != this.props.visible && this.props.visible) {
      this.setState({ 
        currentWidth: new Animated.Value(0),
        maxRecyclerListViewHeight: new Animated.Value(300),
        collapsed: true,
      })
      // this.LottieView.reset()
    }
    else if (this.props.visible && prevState.collapsed != this.state.collapsed && this.state.collapsed) {
      Animated.timing(this.state.currentWidth, {
        duration: 150,
        toValue: 0
      }).start()
      this.setState({ itemList: this.dataProvider.cloneWithRows(this.props.list) })
      if (this.LottieView) this.LottieView.play(30, 50)
    }
    else if (this.props.visible && prevState.collapsed != this.state.collapsed && !this.state.collapsed) {
      Animated.timing(this.state.currentWidth, {
        duration: 150,
        toValue: this.totalWidth
      }).start()
      if (this.LottieView) this.LottieView.play(0, 15)
      this.searchTextRef.focus()
    }
  }

  renderSearchButton = () => {
    if (!this.props.searchable) return null
    return (
      <>
      <Animated.View style={{
        position: 'absolute', width: this.state.currentWidth,
        height: 60, backgroundColor: 'white', zIndex: 15,
        top: 0, right: 0, overflow: 'hidden',
        flexDirection: 'row', alignItems: 'center',
        borderRadius: this.props.theme.roundness
      }}>
        <TextInput
          ref={ref => this.searchTextRef = ref}
          style={{ marginLeft: 12, flex: 1 }}
          placeholder={'Pesquisar icone'}
          onChangeText={(text) => this.setState({ itemList: this.dataProvider.cloneWithRows(this.props.list.filter((element) =>this.props.searchFunction(element, text))) })} />
      </Animated.View>
      <View style={{
        position: 'absolute', right: 0, top: 0, alignItems: 'flex-end',
        height: 60, width: 48, borderRadius: this.props.theme.roundness,
        backgroundColor: 'white', zIndex: 20, justifyContent: 'center'
      }}>
        <TouchableRipple onPress={() => {
            this.setState({ collapsed: !this.state.collapsed })
        }}>
          <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
            <LottieView
              ref={ref => this.LottieView = ref}
              loop={false}
              source={require('../../assets/lottie/search_button.json')}
              style={{ height: 42, width: 42 }} />
          </View>
        </TouchableRipple>
      </View>
      </>
    )
  }

  render() {
    return (
      <>
        <Portal>
          <Dialog
            {...this.props}>
            <>
            {this.renderSearchButton()}
              <Dialog.Title>{`Selecione o ${this.props.title}`}</Dialog.Title>
              <Dialog.ScrollArea style={{paddingBottom: 0}}>
                <Animated.View style={{height: this.state.maxRecyclerListViewHeight}}>
                  { _.isEmpty(this.state.itemList._data) ? null :
                    <RecyclerListView
                    style={{ width: this.props.columns*this.props.itemWidth, flex: 1, alignSelf: 'center' }}
                    layoutProvider={this.layoutProvider}
                    dataProvider={this.state.itemList}
                    rowRenderer={(type, item) => this.props.renderItem(item)} />
                  }
                </Animated.View>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button style={{ minWidth: 64 }} onPress={() => this.props.onDismiss()}>{'Cancelar'}</Button>
              </Dialog.Actions>
            </>
          </Dialog>
        </Portal>
      </>
    )
  }
}

export default withTheme(SearchableDialog)