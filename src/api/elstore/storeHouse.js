import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storeHouse',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storeHouse/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storeHouse',
    method: 'put',
    data
  })
}

export function getStoreHouseAndShelfTreeData(data) {
  return request({
    url: 'api/storeHouse/treeData',
    method: 'post',
    data
  })
}

export default { add, edit, del, getStoreHouseAndShelfTreeData }
