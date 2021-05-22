module.exports = async () => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access to restore and view old entry versions',
      uid: 'restore',
      pluginName: 'versioning'
    }
  ]

  await strapi.admin.services.permission.actionProvider.registerMany(actions)
}
