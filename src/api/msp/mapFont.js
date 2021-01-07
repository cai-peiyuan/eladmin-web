import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapFont',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapFont/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapFont',
    method: 'put',
    data
  })
}
export function queryFontNameGroup(params) {
  return request({
    url: 'api/mapFont/queryFontNameGroup',
    method: 'get',
    params
  })
}

export default { add, edit, del, queryFontNameGroup }
