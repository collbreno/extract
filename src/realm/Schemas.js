export const CategorySchema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    color: 'string',
    icon: 'string',
    expenses: { type: 'linkingObjects', objectType: 'Expense', property: 'category' },
  }
}

export const ExpenseSchema = {
  name: 'Expense',
  primaryKey: 'id',
  properties: {
    id: 'int',
    value: 'int',
    description: 'string',
    category: 'Category',
    tags: 'Tag[]',
    date: 'date'
  }
}

export const TagSchema = {
  name: 'Tag',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    color: 'string',
    textColor: 'string',
    icon: 'string?',
  }
}