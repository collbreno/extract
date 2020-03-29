import React, { Component } from 'react'
import { View, Text, StatusBar, ScrollView, Dimensions, TextInput, FlatList, Animated } from 'react-native'
import { Appbar, TouchableRipple, Modal, Portal, Button, Snackbar } from 'react-native-paper'
import Colors from 'react-native-material-color'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import { OutlinedTextField } from 'react-native-material-textfield'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { material } from 'react-native-typography';
import SearchableDialog from '../../components/SearchableDialog';
import { getCategories, saveExpense } from '../../realm';
import PickerButton from '../../components/PickerButton';
import _ from 'lodash'
import Calculator from '../../components/Calculator';
import TagModal from '../../components/TagModal';
import DatePicker from '@react-native-community/datetimepicker'
import Tag from '../../components/TagModal/Tag';

export default class NewExpense extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      tags: [],
      categorySelected: null,
      showPickerDialog: false,
      description: '',
      showCalculator: false,
      snackbarTitle: '',
      showCalendar: false,
      showTagModal: false,
      value: 0,
      loading: false,
      date: new Date(Date.now()),
      refresh: false,
      valueMarginLeft: new Animated.Value(0),
      valueMarginRight: new Animated.Value(0),
      categoryMarginLeft: new Animated.Value(0),
      categoryMarginRight: new Animated.Value(0),
    }
  }

  componentDidMount = () => {
    getCategories()
      .then(result => this.setState({ categories: Array.from(result) }))
      .catch(error => console.log('error on getCategories()'))
  }

  shake = (left, right) => {
    Animated.sequence([
      Animated.timing(left, { toValue: -20, duration: 50 }),
      Animated.timing(left, { toValue: 20, duration: 100 }),
      Animated.timing(left, { toValue: -20, duration: 100 }),
      Animated.timing(left, { toValue: 20, duration: 100 }),
      Animated.timing(left, { toValue: 0, duration: 50 }),
    ]).start()
    Animated.sequence([
      Animated.timing(right, { toValue: 20, duration: 50 }),
      Animated.timing(right, { toValue: -20, duration: 100 }),
      Animated.timing(right, { toValue: 20, duration: 100 }),
      Animated.timing(right, { toValue: -20, duration: 100 }),
      Animated.timing(right, { toValue: 0, duration: 50 }),
    ]).start()
  }

  checkFields = () => {
    let valid = true
    if (this.state.value <= 0) {
      this.shake(this.state.valueMarginLeft, this.state.valueMarginRight)
      valid = false
    }
    if (!this.state.categorySelected) {
      this.shake(this.state.categoryMarginLeft, this.state.categoryMarginRight)
      valid = false
    }
    if (valid) {
      this.setState({ loading: true })
      saveExpense({ 
        value: this.state.value, 
        categoryId: this.state.categorySelected.id, 
        date: this.state.date, 
        description: this.state.description, 
        tagsId: this.state.tags.map(tag => tag.id) })
        .then(response => {
          this.setState({ snackbarTitle: 'Gasto salvo com sucesso', loading: false })
          this.clearFields()
          console.log('Gasto salvo:',response)
        })
        .catch(error => this.setState({ snackbarTitle: 'Erro ao salvar gasto', loading: false }))
    }
  }

  clearFields = () => {
    this.setState({ 
      description: '',
      date: new Date(Date.now()),
      tags: [],
      categorySelected: null,
      value: 0
     })
  }

  renderTextField = () => {
    return (
      <OutlinedTextField
        value={this.state.description}
        onChangeText={(description) => this.setState({ description })}
        multiline
        label={'Descrição'}
        tintColor={Colors.RED['A700']}
        labelOffset={{ x1: - 60 }}
        renderLeftAccessory={() => <MaterialCommunityIcons style={{ marginRight: 20 }} size={24} name='pencil' />}
        containerStyle={{ marginHorizontal: 20, marginTop: 8 }} />
    )
  }

  renderCalculatorButton = () => {
    return (
      <Animated.View style={{ marginLeft: this.state.valueMarginLeft, marginRight: this.state.valueMarginRight }}>
        <PickerButton
          onPress={() => this.setState({ showCalculator: true })}
          title={(this.state.value/100).toFixed(2)}
          icon={'currency-usd'}
          IconComponent={MaterialCommunityIcons} />
      </Animated.View>
    )
  }

  renderDateButton = () => {
    return (
      <PickerButton
        onPress={() => this.setState({ showCalendar: true })}
        title={format(this.state.date, "iiii, dd 'de' MMMM 'de' yyyy", { locale: pt })}
        icon={'calendar'}
        IconComponent={MaterialCommunityIcons} />
    )
  }

  renderCategorySelector = () => {
    if (!this.state.categorySelected) {
      return (
        <Animated.View style={{ marginLeft: this.state.categoryMarginLeft, marginRight: this.state.categoryMarginRight }}>
          <TouchableRipple
            onPress={() => this.setState({ showPickerDialog: true })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, height: 56 }}>
              <Text style={{ ...material.subheading, marginLeft: 12 }}>{'Selecione a categoria'}</Text>
              <MaterialCommunityIcons style={{ padding: 12 }} size={24} name={'menu-down'} />
            </View>
          </TouchableRipple>
        </Animated.View>
      )
    }
    else {
      return (
        <TouchableRipple onPress={() => this.setState({ showPickerDialog: true })}>
          <View style={{ paddingHorizontal: 20, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons style={{ marginHorizontal: 12, width: 28, alignSelf: 'center' }} name={this.state.categorySelected.icon} color={this.state.categorySelected.color} size={32} />
              <Text style={material.subheading}>
                {this.state.categorySelected.name}
              </Text>
            </View>
            <MaterialCommunityIcons style={{ padding: 12 }} size={24} name={'menu-down'} />
          </View>
        </TouchableRipple>
      )
    }
  }

  renderTags = () => {
    return (
      <View>
        <PickerButton
          onPress={() => this.setState({ showTagModal: true })}
          title={'Tags'}
          icon={'tag'}
          right={() => <Text style={material.caption}>{'Editar'}</Text>}
          IconComponent={MaterialCommunityIcons} />
        <FlatList
          style={{ paddingLeft: 32, marginTop: 5 }}
          horizontal
          extraData={this.state.refresh}
          data={this.state.tags}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 5, backgroundColor: 5 }} />}
          renderItem={({ item: tag }) => <Tag title={tag.title} color={tag.color} textColor={tag.textColor} icon={tag.icon} />} />
      </View>
    )
  }

  renderSaveButton = () => {
    return (
      <Button
        loading={this.state.loading}
        style={{ marginHorizontal: 20, marginTop: 30, backgroundColor: Colors.RED['A700'] }}
        mode='contained'
        onPress={() => this.checkFields()}>
        {'Salvar'}
      </Button>
    )
  }

  renderSnackbar = () => {
    return (
      <Portal>
        <Snackbar visible={!_.isEmpty(this.state.snackbarTitle)} duration={Snackbar.DURATION_SHORT} onDismiss={() => this.setState({ snackbarTitle: '' })}>
          {this.state.snackbarTitle}
        </Snackbar>
      </Portal>
    )
  }

  renderCalculator = () => {
    return (
      <Calculator
        onDismiss={() => this.setState({ showCalculator: false })}
        visible={this.state.showCalculator}
        onSubmit={value => this.setState({ value })}
        dismissable={false} />
    )
  }

  renderDatePicker = () => {
    if (!this.state.showCalendar) return null
    return (
      <DatePicker
        mode='date'
        value={this.state.date}
        onChange={(event, date) => {
          this.setState({ showCalendar: false })
          if (date) this.setState({ date })
          console.log('on change', date)
        }}
        display='calendar' />
    )
  }

  renderTagModal = () => {
    return (
      <Portal>
        <Modal
          visible={this.state.showTagModal} onDismiss={() => this.setState({ showTagModal: false })}
          contentContainerStyle={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white' }}>
          <TagModal
            tags={this.state.tags}
            onRemoveTag={(idRemoved) => this.setState(state => ({ tags: state.tags.filter(tag => tag.id != idRemoved) }))}
            addTag={(newTag) => {
              this.setState(state => ({ refresh: !state.refresh, tags: [newTag, ...state.tags] }))
            }}
            onDismiss={() => this.setState({ showTagModal: false })} />
        </Modal>
      </Portal>
    )
  }

  renderPickerDialog = () => {
    return (
      <SearchableDialog
        searchable={true}
        searchFunction={(element, text) => element.name.toLowerCase().includes(text.toLowerCase())}
        itemWidth={Dimensions.get('window').width - 52}
        itemHeight={56}
        columns={1}
        list={this.state.categories}
        title={'Categoria'}
        renderItem={(category) => {
          return (
            <TouchableRipple onPress={() => this.setState({ categorySelected: category, showPickerDialog: false })}>
              <View style={{ width: Dimensions.get('window').width - 52, height: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons style={{ marginRight: 10 }} name={category.icon} color={category.color} size={32} />
                <Text style={material.subheading}>
                  {category.name}
                </Text>
              </View>
            </TouchableRipple>
          )
        }}
        dismissable={false}
        visible={this.state.showPickerDialog}
        onDismiss={() => this.setState({ showPickerDialog: false })} />
    )
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor={Colors.RED['900']} />
        <Appbar.Header style={{ backgroundColor: Colors.RED['A700'] }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={'Novo gasto'} />
        </Appbar.Header>
        {this.renderPickerDialog()}
        {this.renderSnackbar()}
        {this.renderCalculator()}
        {this.renderTagModal()}
        {this.renderDatePicker()}
        <ScrollView
          keyboardShouldPersistTaps='handled'>
          <View style={{ height: 10 }} />
          {this.renderCalculatorButton()}
          {this.renderCategorySelector()}
          {this.renderDateButton()}
          {this.renderTextField()}
          {this.renderTags()}
          {this.renderSaveButton()}
        </ScrollView>
      </>
    )
  }
}