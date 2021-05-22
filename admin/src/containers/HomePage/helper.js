const { cloneDeep } = require('lodash')

module.exports.normalizeEntry = (entry) => {
  const normalizedEntry = cloneDeep(entry)
  const internalFields = ['_id', 'published_at', '__v', 'created_by', 'updated_by', 'id', 'createdAt', 'updatedAt']
  for (const field of internalFields) {
    delete normalizedEntry[field]
  }
  return JSON.stringify(normalizedEntry, null, 2)
}
