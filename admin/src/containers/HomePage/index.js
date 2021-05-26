import React, { memo, useState, useEffect } from 'react'
import { Header } from '@buffetjs/custom'
import { useHistory } from 'react-router-dom'
import ReactDiffViewer from 'react-diff-viewer'
import Container from '../../components/container'
import { request } from 'strapi-helper-plugin'
import VersionList from '../VersionList'
import { getComparisonString, normalizeObject } from './helper'
import { isEqual } from 'lodash'
import { cleanData } from 'strapi-plugin-content-manager/admin/src/containers/EditViewDataManagerProvider/utils'

const HomePage = ({ location }) => {
  const [loading, setLoading] = useState(false)
  const [headerMessage, setHeaderMessage] = useState('Input an entry id to view versions')
  const [selectedVersion, setSelectedVersion] = useState(undefined)
  const [currentVersion, setCurrentVersion] = useState(undefined)
  const [configuration, setConfiguration] = useState(undefined)
  const [actions, setActions] = useState([])

  const history = useHistory()

  const retrieveCurrentVersion = async () => {
    try {
      setLoading(true)
      const { entryId, collectionId } = selectedVersion
      const entry = await request(`/content-manager/collection-types/${collectionId}/${entryId}`, { method: 'GET' })
      const cleanedEntryContent = normalizeObject(cleanVersionContent(entry), configuration.contentType.attributes)
      setCurrentVersion(cleanedEntryContent)
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
      const { entryId, collectionId } = selectedVersion
      await request(`/content-manager/collection-types/${collectionId}/${entryId}`, { method: 'PUT', body: selectedVersion.content })
      history.push(`/plugins/content-manager/collectionType/${collectionId}/${entryId}`)
    } catch (err) {
      setHeaderMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cleanVersionContent = (content) => {
    const { contentType, components } = configuration
    return cleanData(content, contentType, components)
  }

  const onSetSelectedVersion = async (version) => {
    const entry = version.content
    version.content = normalizeObject(cleanVersionContent(entry), configuration.contentType.attributes)
    setSelectedVersion(version)
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
        ? (
          <ReactDiffViewer
            newValue={getComparisonString(currentVersion)}
            rightTitle='Current Version'
            oldValue={getComparisonString(selectedVersion.content)}
            leftTitle={new Date(selectedVersion.createdAt).toLocaleString()}
            splitView
          />
        )
        : (
          <VersionList
            setLoading={setLoading}
            setSelectedVersion={onSetSelectedVersion}
            setHeaderMessage={setHeaderMessage}
            setConfiguration={setConfiguration}
          />
        )}
    </Container>
  )
}

export default memo(HomePage)
