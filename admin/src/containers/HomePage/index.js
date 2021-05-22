import React, { memo, useState, useEffect } from 'react'
import { Header } from '@buffetjs/custom'
import Container from '../../components/container'
import { request } from 'strapi-helper-plugin'
import pluginId from '../../pluginId'
import VersionList from '../VersionList'

const HomePage = () => {
  const [loading, setLoading] = useState(false)
  const [headerMessage, setHeaderMessage] = useState('Input an entry id to view versions')
  const [selectedVersion, setSelectedVersion] = useState(undefined)


  const retrieveCurrentVersion = async () => {
    try {
      setLoading(true)
      console.log(selectedVersion)
      const { entryId, contentType } = selectedVersion
      const response = await request(`/content-manager/collection-types/application::accordion.accordion/${entryId}`, { method: 'GET' })
      console.log(response)
    } catch (err) {
      console.log(err)
      setHeaderMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedVersion) {
      retrieveCurrentVersion()
    }
  }, [selectedVersion])

  return (
    <Container>
      <Header
        title={{ label: 'Versioning' }}
        content={headerMessage}
        isLoading={loading}
      />
      <VersionList 
        setLoading={setLoading}
        setSelectedVersion={setSelectedVersion}
        setHeaderMessage={setHeaderMessage} />
    </Container>
  )
}

export default memo(HomePage)
