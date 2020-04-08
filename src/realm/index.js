import Realm from 'realm'
import { addMonths } from 'date-fns'
import { CategorySchema, ExpenseSchema, TagSchema } from './Schemas';
let _realmInstance = null

export const getRealmInstance = async () => {
  try {
    if (!_realmInstance) {
      _realmInstance = await Realm.open({
        schema: [CategorySchema, ExpenseSchema, TagSchema],
        schemaVersion: 2,
        migration: (oldRealm, newRealm) => {
          if (oldRealm < 1) {} //nothing to do
          if (oldRealm < 2) {}
          console.log('old version', oldRealm.schemaVersion)
          console.log('new version', newRealm.schemaVersion)
        }
      })
    }
    return _realmInstance
  }
  catch (error) {
    console.log('error on getting realm instance', error)
    throw error
  }
}

export const addCategory = async ({ name, icon, color }) => {
  try {
    const realm = await getRealmInstance()
    await realm.write(() => {
      let id = realm.objects('Category').max('id')
      if (typeof id == 'number') id++
      else id = 0
      realm.create('Category', {
        id,
        name,
        icon,
        color
      })
    })
    return true
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getCategories = async () => {
  try {
    const realm = await getRealmInstance()
    return realm.objects('Category')
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

export const saveTag = async ({title, color, textColor, icon}) => {
  try {
    const realm = await getRealmInstance()
    let response = null
    await realm.write(() => {
      let id = realm.objects('Tag').max('id')
      if (typeof id == 'number') id++
      else id = 0
      response = realm.create('Tag', {
        id,
        title,
        color,
        textColor,
        icon
      })
    })
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const saveExpense = async ({value, categoryId, date, description = '', tagsId = []}) => {
  try {
    const realm = await getRealmInstance()
    let response = null
    await realm.write(() => {
      let id = realm.objects('Expense').max('id')
      if (typeof id == 'number') id++
      else id = 0
      const category = realm.objectForPrimaryKey('Category', categoryId)
      const tags = tagsId.map(tag => realm.objectForPrimaryKey('Tag', tag))
      response = realm.create('Expense', {
        id,
        value,
        description,
        category,
        date,
        tags
      })
    })
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getExpenses = async () => {
  try {
    const realm = await getRealmInstance()
    return realm.objects('Expense').sorted('date', true)
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteExpense = async (id) => {
  try {
    console.log('deletando gasto do banco de dados')
    const realm = await getRealmInstance()
    let response = undefined
    await realm.write(() => {
      response = realm.delete(realm.objectForPrimaryKey('Expense', id))
    })
    console.log('deletei gasto do banco de dados')
    return response
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

export const getMonthExpenseValue = async (date = new Date(Date.now())) => {
  try {
    let date1 = new Date(date.getFullYear(), date.getMonth(), 1)
    let date2 = addMonths(date1, 1)
    const realm = await getRealmInstance()
    return realm.objects('Expense').filtered('date >= $0 AND date < $1', date1, date2).sum('value')
  }
  catch (error) {
    console.log(error)
    throw error
  }
}