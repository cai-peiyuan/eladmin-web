<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 0px">

              <el-form-item label="物品代码">
                <span>{{ props.row.goodsCode }}</span>
              </el-form-item>
              <el-form-item label="物品id">
                <span>{{ props.row.goodsId }}</span>
              </el-form-item>
              <el-form-item label="仓库编号">
                <span>{{ props.row.houseId }}</span>
              </el-form-item>
              <el-form-item label="货架编号">
                <span>{{ props.row.shelfId }}</span>
              </el-form-item>
              <el-form-item label="出入库标记">
                <span>{{ props.row.logType }}</span>
              </el-form-item>
              <el-form-item label="出入库时间">
                <span>{{ parseTime(props.row.logTime) }}</span>
              </el-form-item>
              <el-form-item label="出入库人">
                <span>{{ props.row.logBy }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="goodsCode" label="物品代码" />
        <el-table-column v-if="false" prop="goodsId" label="物品id" />
        <el-table-column v-if="false" prop="houseId" label="仓库编号" />
        <el-table-column v-if="false" prop="shelfId" label="货架编号" />
        <el-table-column prop="logTime" label="出入库时间" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.logTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="logType" label="出入库标记" width="100px">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.logType === 'IN' ? 'primary' : 'success'"
                disable-transitions
              >{{ getDictLabel(scope.row.logType,'APP_STORE_INOUT_TYPE',scope) }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="logBy" label="出入库人" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudStoreGoodsLog from '@/api/elstore/storeGoodsLog.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, goodsCode: null, goodsId: null, houseId: null, shelfId: null, logType: null, logTime: null, logBy: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsLog',
  components: { pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreGoodsLog', url: 'api/storeGoodsLog', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreGoodsLog }})
  },
  dicts: ['APP_STORE_INOUT_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'storeGoodsLog:add'],
        edit: ['admin', 'storeGoodsLog:edit'],
        del: ['admin', 'storeGoodsLog:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsCode', display_name: '物品代码' },
        { key: 'goodsId', display_name: '物品id' },
        { key: 'houseId', display_name: '仓库编号' },
        { key: 'shelfId', display_name: '货架编号' },
        { key: 'logType', display_name: '出入库标记' },
        { key: 'logTime', display_name: '出入库时间' },
        { key: 'logBy', display_name: '出入库人' }
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
    font-size: 12px;
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
  ::v-deep .el-dialog__body {
    padding: 0 20px 10px 20px !important;
  }
  ::v-deep .el-table__expanded-cell[class*=cell] {
    padding: 10px 20px;
  }
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
</style>
