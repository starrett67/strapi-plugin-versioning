const { cloneDeep } = require('lodash')

module.exports.getComparisonString = (entry) => {
  const normalizedEntry = cloneDeep(entry)
  const internalFields = ['_id', 'published_at', '__v', 'created_by', 'updated_by', 'id', 'createdAt', 'updatedAt']
  for (const field of internalFields) {
    delete normalizedEntry[field]
  }
  return JSON.stringify(normalizedEntry, null, 2)
}

module.exports.normalizeObject = (entry, attributes) => {
  const obj = {}
  const attrList = (attributes ?? Object.keys(entry ?? {})).sort()
  for (const attr of attrList) {
    obj[attr] = entry[attr] ?? null
  }
  return obj
}
