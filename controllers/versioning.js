module.exports = {
  list: async (ctx) => {
    const { id } = ctx.params
    const versionModel = strapi.plugins.versioning.models.version
    const versions = await versionModel.find({ entryId: id })

    ctx.send(versions)
  },

  getVersion: async (ctx) => {
    const { id } = ctx.params
    const versioningPlugin = strapi.plugins.versioning
    const versioningService = versioningPlugin.services.versioning

    const version = await versioningService.normalizeVersion(id)
    ctx.send(version.content)
  },

  restore: async (ctx) => {
    const { id } = ctx.params
    const versioningPlugin = strapi.plugins.versioning
    const versioningService = versioningPlugin.services.versioning

    const version = await versioningService.normalizeVersion(id)
    const { entryId, content, model } = version
    strapi.query(model).update({ id: entryId }, content)
    ctx.send({ status: 'entry restored' })
  }
}
