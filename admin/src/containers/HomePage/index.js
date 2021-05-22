import React, { memo, useState, useEffect } from 'react'
import { Header } from '@buffetjs/custom'
import ReactDiffViewer from 'react-diff-viewer'
import Container from '../../components/container'
import { request } from 'strapi-helper-plugin'
import pluginId from '../../pluginId'
import VersionList from '../VersionList'
import { normalizeEntry } from './helper'
import { isEqual } from 'lodash'

const HomePage = ({location}) => {
  const [loading, setLoading] = useState(false)
  const [headerMessage, setHeaderMessage] = useState('Input an entry id to view versions')
  const [selectedVersion, setSelectedVersion] = useState(undefined)
  const [currentVersion, setCurrentVersion] = useState(undefined)
  const [actions, setActions] = useState([])


  const retrieveCurrentVersion = async () => {
    try {
      setLoading(true)
      const { entryId, collectionId } = selectedVersion
      const response = await request(`/content-manager/collection-types/${collectionId}/${entryId}`, { method: 'GET' })
      setCurrentVersion(response)
    } catch (err) {
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

  useEffect(() => {
    if (selectedVersion && currentVersion) {
      const headerMenuActions = [
        {
          label: 'Back',
          onClick: () => {
            setCurrentVersion(undefined)
            setSelectedVersion(undefined)
          },
          color: 'cancel',
          type: 'button',
        },
        {
          label: 'Restore',
          onClick: () => alert('going to restore'),
          color: 'success',
          type: 'button',
        }
      ]
      if (!isEqual(actions, headerMenuActions)) {
        setActions(headerMenuActions)
      }
    } else if (!isEqual(actions, [])) {
      setActions([])
    }
  }, [selectedVersion, currentVersion])

  return (
    <Container>
      <Header
        title={{ label: 'Versioning' }}
        content={headerMessage}
        isLoading={loading}
        actions={actions}
      />
      {selectedVersion && currentVersion ? 
        <ReactDiffViewer 
          newValue={normalizeEntry(currentVersion)}
          rightTitle="Current Version"
          oldValue={normalizeEntry(selectedVersion.content)}
          leftTitle={new Date(selectedVersion.createdAt).toLocaleString()}
          splitView 
        /> :
        <VersionList 
          setLoading={setLoading}
          setSelectedVersion={setSelectedVersion}
          setHeaderMessage={setHeaderMessage} />
      }
    </Container>
  )
}

export default memo(HomePage)
