import React, { memo, useState } from 'react'
import { InputText, Table, Button } from '@buffetjs/core'
import { Col, Row } from 'reactstrap'
import { request } from 'strapi-helper-plugin'
import qs from 'querystring'
import { sanitizeVersionList } from './helper'
import pluginId from '../../pluginId'

const VersionList = ({
  setLoading,
  setSelectedVersion,
  setHeaderMessage
}) => {
  const query = qs.parse(location?.search?.replace('?', ''))
  const [entryId, setEntryId] = useState(query?.entryId)
  const [versionList, setVersionList] = useState([])

  const versionTableHeaders = [
    {
      name: 'Date',
      value: 'createdAt',
      isSortEnabled: true
    },
    {
      name: 'Updated By',
      value: 'updatedBy',
      isSortEnabled: false
    },
    {
      name: 'Collection Type',
      value: 'collectionName',
      isSortEnabled: false
    },
    {
      name: 'Id',
      value: 'id',
      isSortEnabled: false
    }
  ]

  const listVersions = async () => {
    try {
      setLoading(true)
      const response = await request(`/${pluginId}/list/${entryId}`, { method: 'GET' })
      setVersionList(response)
      setHeaderMessage('Select a version to compare and restore')
    } catch (err) {
      console.log(err)
      setHeaderMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getVersion = async (id) => {
    try {
      setLoading(true)
      const response = await request(`/${pluginId}/${id}`, { method: 'GET' })
      return response
    } catch (err) {
      console.log(err)
      setHeaderMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const versionSelected = async (e, data) => {
    const matchingVersion = versionList.find(({ id }) => id === data.id)
    const version = await getVersion(matchingVersion.id)
    matchingVersion.content = version
    setSelectedVersion(matchingVersion)
  }

  if (query?.entryId && versionList.length === 0) {
    console.log('listing versions')
    listVersions()
  }

  return (
    <>
      <Row>
        <Col xs='5'>
          <Row>
            <Col>
              <InputText
                name='EntryId'
                key='EntryId'
                value={entryId}
                onChange={(e) => setEntryId(e.target.value)}
                placeholder='Enter Entry ID'
              />
            </Col>
            <Col>
              <Button color='primary' onClick={listVersions}>List Versions</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {versionList.length > 0 &&
        <Row style={{ paddingTop: '10px' }}>
          <Col>
            <Table
              rows={sanitizeVersionList(versionList)}
              headers={versionTableHeaders}
              onClickRow={versionSelected}
            />
          </Col>
        </Row>}
    </>
  )
}

export default memo(VersionList)
