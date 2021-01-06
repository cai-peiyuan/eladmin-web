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

export function optionData(params) {
  return request({
    url: 'api/storeTemplate/optionData',
    method: 'get',
    params
  })
}

export function getTemplatePropertyData(id) {
  return request({
    url: 'api/storeTemplate/getTemplatePropertyData/' + id,
    method: 'get'
  })
}

export function saveTemplatePropertyData(id, data) {
  return request({
    url: 'api/storeTemplate/saveTemplatePropertyData/' + id,
    method: 'post',
    data
  })
}

export default { add, edit, del, optionData, getTemplatePropertyData, saveTemplatePropertyData }
