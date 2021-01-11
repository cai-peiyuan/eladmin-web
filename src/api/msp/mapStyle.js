import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapStyle',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapStyle/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapStyle',
    method: 'put',
    data
  })
}

export function getStyleByStyleId(styleId) {
  return request({
    url: 'api/mapStyle/' + styleId,
    method: 'get'
  })
}

export function updateStyle(data) {
  return request({
    url: 'api/mapStyle/update',
    method: 'post',
    data
  })
}

export default { add, edit, del, getStyleByStyleId, updateStyle }
