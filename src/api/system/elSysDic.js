import request from '@/utils/request'

export function get(dicIndexKey) {
  const params = {
    dicIndexKey,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/elSysDic/getElSysDicDetails',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/elSysDic',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/elSysDic/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/elSysDic',
    method: 'put',
    data
  })
}

export default { add, edit, del, get }
