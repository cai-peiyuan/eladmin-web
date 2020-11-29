import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeGoods',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeGoods/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeGoods',
    method: 'put',
    data
  })
}

export function initGoodsDetail(id) {
  return request({
    url: 'api/storeGoods/initGoodsDetail/' + id,
    method: 'get'
  })
}

export default { add, edit, del, initGoodsDetail }
