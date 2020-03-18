import React, { Component } from 'react'
import { View, Text, TextInput, ActivityIndicator, Animated, Dimensions, Keyboard } from 'react-native'
import { Portal, Dialog, Button, withTheme, TouchableRipple } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LottieView from 'lottie-react-native'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'

class SearchableDialog extends Component {

  constructor(props) {
    super(props)
    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2)
    this.layoutProvider = new LayoutProvider(() => 'NORMAL', (type, dim) => {
      dim.height = 50
      dim.width = 50
    })
    this.currentWidth = new Animated.Value(0)
    this.totalWidth = Dimensions.get('window').width - 52
    this.state = {
      maxRecyclerListViewHeight: 300,
      collapsed: true,
      itemList: this.dataProvider.cloneWithRows(props.list),
      animationProgress: new Animated.Value(0)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.list != this.props.list) {
      this.setState({ itemList: this.dataProvider.cloneWithRows(this.props.list) })
    }
    if (prevProps.visible != this.props.visible && !this.props.visible) {
      this.setState({ collapsed: true, maxRecyclerListViewHeight: 300 })
    }
  }

  renderSearchButton = () => {
    if (!this.props.searchable) return null
    return (
      <>
      <Animated.View style={{
        position: 'absolute', width: this.currentWidth,
        height: 60, backgroundColor: 'white', zIndex: 15,
        left: 0, top: 0, right: 48, overflow: 'hidden',
        flexDirection: 'row', alignItems: 'center',
        borderRadius: this.props.theme.roundness
      }}>
        <TextInput
          ref={ref => this.searchTextRef = ref}
          style={{ marginLeft: 12 }}
          placeholder={'Pesquisar icone'}
          onChangeText={(text) => this.setState({ itemList: this.dataProvider.cloneWithRows(this.props.list.filter((element) => element.includes(text))) })} />
      </Animated.View>
      <View style={{
        position: 'absolute', right: 0, top: 0, alignItems: 'flex-end',
        height: 60, width: 48, borderRadius: this.props.theme.roundness,
        backgroundColor: 'white', zIndex: 20, justifyContent: 'center'
      }}>
        <TouchableRipple onPress={() => {
          setTimeout(() => {
            this.setState({ collapsed: !this.state.collapsed })
            if (this.searchTextRef) {
              this.searchTextRef.focus()
              this.setState({ maxRecyclerListViewHeight: 100 })
            }
          }, 150);
          if (this.state.collapsed) {
            Animated.timing(this.currentWidth, {
              duration: 150,
              toValue: this.totalWidth
            }).start()
            Animated.timing(this.state.animationProgress, {
              duration: 1000,
              toValue: 60 / 180
            }).start()
          }
          else {
            Animated.timing(this.currentWidth, {
              duration: 150,
              toValue: 0
            }).start()
            Animated.timing(this.state.animationProgress, {
              duration: 1000,
              toValue: 0
            }).start()
          }
        }}>
          <View style={{ height: 48, width: 48, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView progress={this.state.animationProgress} source={require('../../assets/lottie/search_button.json')} style={{height: 28, width: 28}}/>
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
              <Dialog.Content>
                <ActivityIndicator size={"large"} style={{ alignSelf: 'center', position: 'absolute' }} />
                <RecyclerListView
                  style={{ width: this.props.listWidth, height: this.state.maxRecyclerListViewHeight, alignSelf: 'center' }}
                  layoutProvider={this.layoutProvider}
                  dataProvider={this.state.itemList}
                  rowRenderer={(type, item) => this.props.renderItem(item)} />
              </Dialog.Content>
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