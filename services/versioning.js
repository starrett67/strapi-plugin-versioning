const { cloneDeep } = require('lodash')

const sanitizeContent = (entry) => {
  const removeProperties = ['id', '_id', '__v', 'published_at', 'created_by', 'updated_by']
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

  normalizeVersion: async (id) => {
    const versioningPlugin = strapi.plugins.versioning
    const versionModel = versioningPlugin.models.version
    const contentManagerService = strapi.plugins['content-manager'].services['content-types']

    const version = await versionModel.findById(id)
    const { content, collectionId } = version
    const configuration = await contentManagerService.findContentType(collectionId)
    for (const attribute of Object.keys(configuration.allAttributes ?? {})) {
      if (!content[attribute]) {
        content[attribute] = null
      }
    }
    return version
  },

  getVersionEntry: (model, entry) => {
    const version = {
      collectionName: model.globalName,
      collectionId: model.uid,
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
