import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeTemplate',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeTemplate/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeTemplate',
    method: 'put',
    data
  })
}

export function optionData(data) {
  return request({
    url: 'api/storeTemplate/optionData',
    method: 'get',
    data
  })
}

export default { add, edit, del, optionData }
