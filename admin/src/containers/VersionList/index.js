import React, { memo, useState, useEffect } from 'react'
import { InputText, Label, Table, Button } from '@buffetjs/core'
import { Col, Row } from 'reactstrap'
import { Header } from '@buffetjs/custom'
import { request } from 'strapi-helper-plugin'
import qs from 'querystring'
import { sanitizeVersionList } from './helper'
import pluginId from '../../pluginId'
import { version } from 'moment'


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

  if (query?.entryId && versionList.length === 0) {
    console.log('listing versions')
    listVersions()
  }

  return (
    <Row>
      <Col xs="3">
        <Row>
          <Col xs="8">
            <InputText
              name='EntryId'
              key='EntryId'
              value={entryId}
              onChange={(e) => setEntryId(e.target.value)}
              placeholder='Enter Entry ID'
            />
          </Col>
          <Col xs="4">
            <Button color="primary" onClick={listVersions}>List Versions</Button>
          </Col>
        </Row>
      </Col>
      <Col xs="9">
        {versionList.length > 0 && 
          <Table rows={sanitizeVersionList(versionList)}
            headers={versionTableHeaders}
            sortBy={'createdAt'}
            onClickRow={(e, data) => {
              const matchingVersion = versionList.find(({id}) => id === data.id)
              setSelectedVersion(matchingVersion)
            }}
          />
        }
      </Col>
    </Row>
  )
}

export default memo(VersionList)