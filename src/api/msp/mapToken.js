import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapToken',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapToken/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapToken',
    method: 'put',
    data
  })
}

export function getTokenApi(id) {
  return request({
    url: 'api/mapToken/getTokenApi/' + id,
    method: 'get'
  })
}

export function saveTokenApiData(id, data) {
  return request({
    url: 'api/mapToken/saveTokenApiData/' + id,
    method: 'post',
    data
  })
}
export default { add, edit, del, getTokenApi, saveTokenApiData }
