const { cloneDeep, isEmpty } = require('lodash')

const sanitizeContent = (entry) => {
  const removeProperties = ['id', '_id', '__v', '__component', 'published_at', 'created_by', 'updated_by']
  const content = cloneDeep(entry)
  for (const prop of removeProperties) {
    delete content[prop]
  }
  return content
}

const stringifyObjectIds = (obj) => {
  const keysToRemove = ['_id', '__v']
  if (Array.isArray(obj)) {
    obj = obj.map(stringifyObjectIds)
  } else if (typeof obj === 'object' && !isEmpty(obj)) {
    for (const key in obj) {
      if (keysToRemove.includes(key)) {
        delete obj[key]
      } else {
        obj[key] = stringifyObjectIds(obj[key])
      }
    }
  }
  return obj
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

    let version = await versionModel.findById(id).lean()
    const { content, collectionId } = version
    const configuration = await contentManagerService.findContentType(collectionId)
    for (const attribute of Object.keys(configuration.allAttributes ?? {})) {
      const val = content[attribute]
      if (!val) {
        content[attribute] = null
      }
    }
    version = stringifyObjectIds(version)

    console.log(JSON.stringify(version, null, 2))
    delete version.content.Link.id
    return version
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
