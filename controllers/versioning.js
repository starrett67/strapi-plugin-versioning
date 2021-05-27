module.exports = {
  list: async (ctx) => {
    const { id } = ctx.params
    const versionModel = strapi.plugins['versioning-mongo'].models.version
    const versions = await versionModel.find({ entryId: id }).lean()

    ctx.send(versions)
  },

  getVersion: async (ctx) => {
    const { id } = ctx.params
    const versionModel = strapi.plugins['versioning-mongo'].models.version
    const version = await versionModel.findById(id).lean()

    ctx.send(version)
  }
}
