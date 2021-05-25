module.exports = strapi => ({
  initialize () {
    const versioningPlugin = strapi.plugins.versioning
    const versioningService = versioningPlugin.services.versioning
    const versionModel = versioningPlugin.models.version

    const newVersionMethods = ['PUT', 'POST']
    const shouldCreateVersion = (ctx, model) =>
      ctx.request.url.includes('/content-manager/collection-types/application') &&
      newVersionMethods.includes(ctx.request.method) &&
      model && ctx.response.message === 'OK'

    strapi.app.use(async (ctx, next) => {
      await next()

      const model = ctx?.params?.model
      const id = ctx?.params?.id ?? ctx?.response.body.id
      const strapiModel = versioningService.getStrapiModel(model)
      if (id && shouldCreateVersion(ctx, strapiModel)) {
        const entry = await versioningService.getEntryVersion(strapiModel, id)
        const versionEntry = versioningService.getVersionEntry(strapiModel, entry)
        await versionModel.create(versionEntry)
      }
    })
  }
})
