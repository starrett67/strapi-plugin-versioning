const { cloneDeep, isEmpty } = require('lodash')

const getComparisonString = (entry) => {
  const normalizedEntry = cloneDeep(entry)
  const internalFields = ['published_at', 'created_by', 'updated_by', 'createdAt', 'updatedAt']
  for (const field of internalFields) {
    delete normalizedEntry[field]
  }
  return JSON.stringify(normalizedEntry, null, 2)
}

const normalizeObject = (entry, attributes) => {
  const obj = {}
  const attrList = (Object.keys(attributes)).sort()
  for (const attr of attrList) {
    obj[attr] = entry[attr] ?? null
  }
  return removeInteralFields(obj)
}

const removeInteralFields = (obj) => {
  const keysToRemove = ['_id', '__v', 'id']
  if (Array.isArray(obj)) {
    obj = obj.map(removeInteralFields)
  } else if (typeof obj === 'object' && !isEmpty(obj)) {
    for (const key in obj) {
      if (keysToRemove.includes(key)) {
        delete obj[key]
      } else {
        obj[key] = removeInteralFields(obj[key])
      }
    }
  }
  return obj
}

module.exports = {
  getComparisonString,
  normalizeObject
}
