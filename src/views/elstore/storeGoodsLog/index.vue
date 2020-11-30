<template>
  <div class="app-container" style="padding: 10px">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">物品代码</label>
        <el-input v-model="query.goodsCode" clearable placeholder="物品代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品id</label>
        <el-input v-model="query.goodsId" clearable placeholder="物品id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">仓库编号</label>
        <el-input v-model="query.houseId" clearable placeholder="仓库编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货架编号</label>
        <el-input v-model="query.shelfId" clearable placeholder="货架编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">出入库标记</label>
        <el-input v-model="query.logType" clearable placeholder="出入库标记" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">出入库时间</label>
        <el-input v-model="query.logTime" clearable placeholder="出入库时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">出入库人</label>
        <el-input v-model="query.logBy" clearable placeholder="出入库人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="物品代码">
            <el-input v-model="form.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品id">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库编号">
            <el-input v-model="form.houseId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架编号">
            <el-input v-model="form.shelfId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="出入库标记">
            <el-input v-model="form.logType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="出入库时间">
            <el-input v-model="form.logTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="出入库人">
            <el-input v-model="form.logBy" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

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
        <el-table-column prop="goodsCode" label="物品代码" />
        <el-table-column prop="goodsId" label="物品id" />
        <el-table-column prop="houseId" label="仓库编号" />
        <el-table-column prop="shelfId" label="货架编号" />
        <el-table-column prop="logType" label="出入库状态" />
        <el-table-column prop="logTime" label="操作时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.logTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="logBy" label="出入库人" />
        <el-table-column v-permission="['admin','storeGoodsLog:edit','storeGoodsLog:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudStoreGoodsLog from '@/api/elstore/storeGoodsLog.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, goodsCode: null, goodsId: null, houseId: null, shelfId: null, logType: null, logTime: null, logBy: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsLog',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ goods: { id: this.goodsId }, goodsId: this.goodsId }, defaultForm)
  }), crud()],
  cruds() {
    return CRUD({
      title: 'StoreGoodsLog',
      url: 'api/storeGoodsLog',
      idField: 'id',
      query: { goodsId: '' },
      sort: 'logTime,desc',
      crudMethod: { ...crudStoreGoodsLog }
    })
  },
  dicts: ['APP_STORE_INOUT_TYPE'],
  data() {
    return {
      goodsId: null,
      goodsName: null,
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
