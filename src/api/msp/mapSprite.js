import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/mapSprite',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/mapSprite/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/mapSprite',
    method: 'put',
    data
  })
}

export function getSpriteNames(params) {
  return request({
    url: 'api/mapSprite/getSpriteNames',
    method: 'get',
    params
  })
}

export function getSprite(params) {
  return request({
    url: 'api/mapSprite/getSprite',
    method: 'get',
    params
  })
}

export default { add, edit, del, getSpriteNames, getSprite }
