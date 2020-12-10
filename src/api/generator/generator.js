import request from '@/utils/request'

export function getAllTable() {
  return request({
    url: 'api/generator/tables/all',
    method: 'get'
  })
}

export function generator(tableName, type) {
  return request({
    url: 'api/generator/' + tableName + '/' + type,
    method: 'post',
    responseType: type === 2 ? 'blob' : ''
  })
}

export function generatorWithDataSource(dataSource, tableName, type) {
  return request({
    url: 'api/generator/' + dataSource + '/' + tableName + '/' + type,
    method: 'post',
    responseType: type === 2 ? 'blob' : ''
  })
}

export function save(data) {
  return request({
    url: 'api/generator',
    data,
    method: 'put'
  })
}

export function sync(tables) {
  return request({
    url: 'api/generator/sync',
    method: 'post',
    data: tables
  })
}

export function syncWithDataSource(dataSource, tables) {
  return request({
    url: 'api/generator/sync/' + dataSource,
    method: 'post',
    data: tables
  })
}

export function getEntityManagers() {
  return request({
    url: 'api/generator/entityManagers',
    method: 'get'
  })
}

export function getDataSources() {
  return request({
    url: 'api/generator/dataSources',
    method: 'get'
  })
}
