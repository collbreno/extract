import React, { Component } from 'react'
import { Text, View, TextInput, Keyboard, TouchableNativeFeedback, FlatList } from 'react-native'
import { Appbar, Portal, Dialog, Button, TouchableRipple } from 'react-native-paper';
import NewTagDialog from './NewTagDialog';
import Autocomplete from 'react-native-autocomplete-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { material, materialColors } from 'react-native-typography';
import { getRealmInstance } from '../../realm';
import Tag from './Tag';

export default class TagModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showNewTagDialog: false,
      tagTitle: '',
      keyboardIsVisible: false,
      autocompleteList: [],
    }
  }



  componentDidMount = () => {
    Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboardIsVisible: false }))
    Keyboard.addListener('keyboardDidShow', () => this.setState({ keyboardIsVisible: true }))
    this.updateSearch()
  }

  addTag = (tag) => {
    Keyboard.dismiss()
    this.props.addTag(tag)
    this.setState({ tagTitle: '' }, () => {
      this.updateSearch()
    })
  } 

  updateSearch = (query = this.state.tagTitle) => {
    getRealmInstance()
      .then(realm => {
        console.log('fazendo pesquisa', query)
        this.setState({
          autocompleteList: [
            ...(Array.from(realm.objects('Tag').filtered(`title CONTAINS[C] "${query}"`))).filter(element => !this.props.tags.find((existingTag => existingTag.id == element.id))),
            { id: -1, title: `Criar Tag ${query}`, icon: 'plus', color: 'white', textColor: materialColors.blackPrimary }
          ]
        })
      })
  }

  renderNewTagDialog = () => {
    return (
      <NewTagDialog 
        title={this.state.tagTitle}
        visible={this.state.showNewTagDialog}
        addTag={tag => this.addTag(tag)}
        onDismiss={() => this.setState({ showNewTagDialog: false })}/>
    )
  }

  renderTextInput = () => {
    return (
      <View style={{position: 'absolute', top: 56, left: 0, right: 0, zIndex: 5}}>
      <Autocomplete
        ref={ref => this.TextInput = ref}
        value={this.state.tagTitle}
        placeholder={'Pesquisa por uma tag ou crie uma nova'}
        hideResults={!this.state.keyboardIsVisible}
        onChangeText={(tagTitle) => {
          this.updateSearch(tagTitle)
          this.setState({ tagTitle })
        }}
        onSubmitEditing={() => {
          const firstTag = this.state.autocompleteList[0]
          if (firstTag.id == -1) this.setState({ showNewTagDialog: true })
          else this.addTag(firstTag)
        }}
        style={{ height: 56, paddingHorizontal: 20 }}
        keyExtractor={(item) => item.id.toString()}
        data={Array.from(this.state.autocompleteList)} 
        renderItem={({item: tag}) => (
          <TouchableNativeFeedback useForeground onPress={() => {
            console.log('cliquei', tag)
            if (tag.id == -1) this.setState({ showNewTagDialog: true })
            else {
              this.addTag(tag)
            }
          }}>
            <View style={{backgroundColor: tag.color, height: 36, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12}}>
              {
                !tag.icon? null : <MaterialCommunityIcons style={{marginRight: 6}} size={16} color={tag.textColor} name={tag.icon}/>
              }
              <Text style={{ fontFamily: 'sans-serif-medium', color: tag.textColor, fontSize: 14}}>{tag.title}</Text>
            </View>
          </TouchableNativeFeedback>
        )}/>
        </View>
    )
  }

  renderTags = () => {
    return (
      <View style={{ marginTop: 60, paddingHorizontal: 20 }}>
        <Text style={material.subheading}>{'Clique em uma Tag para remover'}</Text>
        <FlatList
          keyboardShouldPersistTaps='handled'
          style={{ marginTop: 15 }}
          data={this.props.tags}
          keyExtractor={tag => tag.id.toString()}
          renderItem={({ item: tag }) => (
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(tag.textColor)} useForeground
              onPress={() => this.props.onRemoveTag(tag.id)}>
              <View style={{ padding: 4 }}>
                <Tag title={tag.title} textColor={tag.textColor} color={tag.color} icon={tag.icon} />
              </View>
            </TouchableNativeFeedback>
          )} />
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderNewTagDialog()}
        <Appbar.Header>
          <Appbar.Action icon={'close'} onPress={this.props.onDismiss} />
        </Appbar.Header>
        {this.renderTextInput()}
        {this.renderTags()}
      </View>
    )
  }
}