<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">物品模板代码</label>
        <el-input v-model="query.templateCode" clearable placeholder="物品模板代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板类型</label>
        <el-input v-model="query.templateType" clearable placeholder="物品模板类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板名称</label>
        <el-input v-model="query.templateName" clearable placeholder="物品模板名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="物品模板代码">
            <el-input v-model="form.templateCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品模板类型">
            <el-input v-model="form.templateType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品模板名称">
            <el-input v-model="form.templateName" style="width: 370px;" />
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

              <el-form-item label="物品模板代码">
                <span>{{ props.row.templateCode }}</span>
              </el-form-item>
              <el-form-item label="物品模板类型">
                <span>{{ props.row.templateType }}</span>
              </el-form-item>
              <el-form-item label="物品模板名称">
                <span>{{ props.row.templateName }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="templateCode" label="物品模板代码" />
        <el-table-column prop="templateType" label="物品模板类型" />
        <el-table-column prop="templateName" label="物品模板名称" />
        <el-table-column v-permission="['admin','storeTemplate:edit','storeTemplate:del']" label="操作" width="150px" align="center">
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
import crudStoreTemplate from '@/api/elstore/storeTemplate.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, templateCode: null, templateType: null, templateName: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreTemplate', url: 'api/storeTemplate', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreTemplate }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeTemplate:add'],
        edit: ['admin', 'storeTemplate:edit'],
        del: ['admin', 'storeTemplate:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'templateCode', display_name: '物品模板代码' },
        { key: 'templateType', display_name: '物品模板类型' },
        { key: 'templateName', display_name: '物品模板名称' }
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
