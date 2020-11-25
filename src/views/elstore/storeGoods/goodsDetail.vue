<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column v-if="false" prop="goodsId" label="物品id" />
        <el-table-column v-if="false" prop="goodsTemplateId" label="物品模板编号" />
        <el-table-column v-if="false" prop="propertySeq" label="属性序号" />
        <el-table-column v-if="false" prop="propertyCode" label="属性编码" />
        <el-table-column prop="propertyDesc" label="属性描述" />
        <el-table-column prop="propertyValue" label="属性值" />
      </el-table>
    </div>
  </div>
</template>

<script>
import crudStoreGoodsDetail from '@/api/elstore/storeGoodsDetail.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'

const defaultForm = { id: null, goodsId: null, goodsTemplateId: null, propertySeq: null, propertyCode: null, propertyDesc: null, propertyValue: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsDetail',
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ goods: { id: this.goodsId }, goodsId: this.goodsId }, defaultForm)
  }), crud()],
  cruds() {
    return CRUD({
      title: 'StoreGoodsDetail',
      url: 'api/storeGoodsDetail',
      idField: 'id',
      query: { goodsId: '' },
      sort: 'id,desc',
      crudMethod: { ...crudStoreGoodsDetail }
    })
  },
  data() {
    return {
      goodsId: null,
      goodsName: null,
      permission: {
        add: ['admin', 'storeGoodsDetail:add'],
        edit: ['admin', 'storeGoodsDetail:edit'],
        del: ['admin', 'storeGoodsDetail:del']
      },
      rules: {
        id: [
          { required: true, message: '记录编号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsId', display_name: '物品id' },
        { key: 'goodsTemplateId', display_name: '物品模板编号' },
        { key: 'propertySeq', display_name: '属性序号' },
        { key: 'propertyCode', display_name: '属性编码' },
        { key: 'propertyDesc', display_name: '属性描述' },
        { key: 'propertyValue', display_name: '属性值' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .demo-table-expand .el-form-item__content {
    font-size: 12px;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px 10px 20px !important;
  }
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
</style>
