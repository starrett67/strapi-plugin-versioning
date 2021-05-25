import React, { memo, useState, useEffect } from 'react'
import { Header } from '@buffetjs/custom'
import { useHistory } from 'react-router-dom'
import ReactDiffViewer from 'react-diff-viewer'
import Container from '../../components/container'
import { request } from 'strapi-helper-plugin'
import VersionList from '../VersionList'
import { getComparisonString, normalizeObject } from './helper'
import { isEqual } from 'lodash'
import pluginId from '../../pluginId'

const HomePage = ({ location }) => {
  const [loading, setLoading] = useState(false)
  const [headerMessage, setHeaderMessage] = useState('Input an entry id to view versions')
  const [selectedVersion, setSelectedVersion] = useState(undefined)
  const [currentVersion, setCurrentVersion] = useState(undefined)
  const [actions, setActions] = useState([])

  const history = useHistory()

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

  const clearSelectedVersion = () => {
    setCurrentVersion(undefined)
    setSelectedVersion(undefined)
  }

  const restoreVersion = async () => {
    try {
      setLoading(true)
      const { id, entryId, collectionId } = selectedVersion
      await request(`/${pluginId}/restore/${id}`, { method: 'PUT' })
      history.push(`/plugins/content-manager/collectionType/${collectionId}/${entryId}`)
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
      setHeaderMessage(`Restore version from ${new Date(selectedVersion.createdAt).toLocaleString()}?`)
      const headerMenuActions = [
        {
          label: 'Back',
          onClick: clearSelectedVersion,
          color: 'cancel',
          type: 'button'
        },
        {
          label: 'Restore',
          onClick: restoreVersion,
          color: 'success',
          type: 'button'
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
      {selectedVersion && currentVersion
        ? <ReactDiffViewer
          newValue={getComparisonString(normalizeObject(currentVersion, Object.keys(selectedVersion.content)))}
          rightTitle='Current Version'
          oldValue={getComparisonString(normalizeObject(selectedVersion.content))}
          leftTitle={new Date(selectedVersion.createdAt).toLocaleString()}
          splitView
        />
        : <VersionList
          setLoading={setLoading}
          setSelectedVersion={setSelectedVersion}
          setHeaderMessage={setHeaderMessage}
        />}
    </Container>
  )
}

export default memo(HomePage)
