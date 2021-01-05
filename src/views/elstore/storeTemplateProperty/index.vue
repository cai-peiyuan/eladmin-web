<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">模板编号</label>
        <el-input v-model="query.templateId" clearable placeholder="模板编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性编号</label>
        <el-input v-model="query.propertyId" clearable placeholder="属性编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">默认值</label>
        <el-input v-model="query.defaultValue" clearable placeholder="默认值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="模板编号">
            <el-input v-model="form.templateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性编号">
            <el-input v-model="form.propertyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="默认值">
            <el-input v-model="form.defaultValue" style="width: 370px;" />
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

              <el-form-item label="模板编号">
                <span>{{ props.row.templateId }}</span>
              </el-form-item>
              <el-form-item label="属性编号">
                <span>{{ props.row.propertyId }}</span>
              </el-form-item>
              <el-form-item label="默认值">
                <span>{{ props.row.defaultValue }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="templateId" label="模板编号" />
        <el-table-column prop="propertyId" label="属性编号" />
        <el-table-column prop="defaultValue" label="默认值" />
        <el-table-column v-if="checkPer(['admin','storeTemplateProperty:edit','storeTemplateProperty:del'])" label="操作" width="150px" align="center">
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
import crudStoreTemplateProperty from '@/api/elstore/storeTemplateProperty.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, templateId: null, propertyId: null, defaultValue: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreTemplateProperty',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreTemplateProperty', url: 'api/storeTemplateProperty', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreTemplateProperty }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeTemplateProperty:add'],
        edit: ['admin', 'storeTemplateProperty:edit'],
        del: ['admin', 'storeTemplateProperty:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'templateId', display_name: '模板编号' },
        { key: 'propertyId', display_name: '属性编号' },
        { key: 'defaultValue', display_name: '默认值' }
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
  /deep/ .el-dialog__body {
    padding: 0 20px 10px 20px !important;
  }
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
</style>
