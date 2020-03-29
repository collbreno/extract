import Realm from 'realm'
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