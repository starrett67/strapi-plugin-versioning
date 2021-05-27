const { cloneDeep } = require('lodash')

const sanitizeContent = (entry) => {
  const removeProperties = ['id', '_id', '__v', '__component', 'published_at', 'created_by', 'updated_by']
  const content = cloneDeep(entry)
  for (const prop of removeProperties) {
    delete content[prop]
  }
  return content
}

module.exports = {
  getModelFromCtx: (ctx) => ctx?.params?.model,

  getStrapiModel: (model) => {
    return Object.values(strapi.models).find(({ uid }) => uid === model)
  },

  getEntryVersion: (model, id) => {
    return strapi.query(model.uid).findOne({ id })
  },

  getVersionEntry: (model, entry) => {
    const version = {
      collectionName: model.collectionName,
      globalName: model.globalName,
      collectionId: model.uid,
      model: model.modelName,
      entryId: entry.id,
      updatedBy: {
        id: entry.updated_by.id,
        name: `${entry.updated_by.firstname} ${entry?.updated_by?.lastname ?? ''}`.trim()
      },
      content: sanitizeContent(entry)
    }
    return version
  }
}
