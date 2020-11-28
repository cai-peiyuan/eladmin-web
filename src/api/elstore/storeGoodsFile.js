import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeGoodsFile',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeGoodsFile/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeGoodsFile',
    method: 'put',
    data
  })
}

export function queryByGoodsId(data) {
  return request({
    url: 'api/storeGoodsFile?goodsId=' + data.goodsId,
    method: 'get'
  })
}

export default { add, edit, del, queryByGoodsId }
