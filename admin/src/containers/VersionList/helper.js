const { cloneDeep } = require('lodash')

module.exports.sanitizeVersionList = (versions) => {
  return versions.map(version => ({
    createdAt: new Date(version.createdAt).toLocaleString(),
    updatedBy: version.updatedBy.name,
    collectionName: version.collectionName,
    id: version.id
  }))
}

