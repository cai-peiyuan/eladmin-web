import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapWebapiItem',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapWebapiItem/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapWebapiItem',
    method: 'put',
    data
  })
}

export function getLibItemOptionData(params) {
  return request({
    url: 'api/mapWebapiItem/getLibItemOptionData',
    method: 'get',
    params
  })
}

export default { add, edit, del, getLibItemOptionData }
