module.exports.sanitizeVersionList = (versions) => {
  return versions.map(version => ({
    createdAt: new Date(version.createdAt).toLocaleString(),
    updatedBy: version.updatedBy.name,
    collectionName: version.collectionName,
    id: version.id
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
