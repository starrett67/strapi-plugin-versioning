module.exports = {
  list: async (ctx) => {
    const { id } = ctx.params
    const versionModel = strapi.plugins.versioning.models.version
    const versions = await versionModel.find({ entryId: id })

    ctx.send(versions);
  },

  restore: async () => {
    const { id } = ctx.params
    const versionModel = strapi.plugins.versioning.models.version
    const version = await versionModel.find({ id })

    const { content, contentType, entryId } = version
    const response = await strapi.query(contentType).update(entryid, content)
    ctx.send(response)
  }
};
