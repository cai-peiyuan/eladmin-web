import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapStyleTemplate',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapStyleTemplate/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapStyleTemplate',
    method: 'put',
    data
  })
}

export function getStyleTemplateByStyleId(styleId) {
  return request({
    url: 'api/mapStyleTemplate/' + styleId,
    method: 'get'
  })
}

export function updateStyleTemplate(data) {
  return request({
    url: 'api/mapStyleTemplate/update',
    method: 'post',
    data
  })
}

export default { add, edit, del, getStyleTemplateByStyleId, updateStyleTemplate }
