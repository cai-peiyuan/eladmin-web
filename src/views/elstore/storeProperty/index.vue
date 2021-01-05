<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">类别id</label>
        <el-input v-model="query.propertyCatalogId" clearable placeholder="类别id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性代码</label>
        <el-input v-model="query.propertyCode" clearable placeholder="属性代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">数据描述</label>
        <el-input v-model="query.propertyDesc" clearable placeholder="数据描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性类型</label>
        <el-input v-model="query.propertyType" clearable placeholder="属性类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">输入长度</label>
        <el-input v-model="query.propertyLength" clearable placeholder="输入长度" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">输入精度</label>
        <el-input v-model="query.propertyPrecision" clearable placeholder="输入精度" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">输入格式</label>
        <el-input v-model="query.propertyFormat" clearable placeholder="输入格式" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="类别id">
            <el-input v-model="form.propertyCatalogId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性代码">
            <el-input v-model="form.propertyCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据描述">
            <el-input v-model="form.propertyDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性类型">
            <el-select
              v-model="form.propertyType"
              style="width: 370px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dict.APP_STORE_PROPERTY_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="输入长度">
            <el-input v-model="form.propertyLength" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="输入精度">
            <el-input v-model="form.propertyPrecision" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="输入格式">
            <el-input v-model="form.propertyFormat" style="width: 370px;" />
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

              <el-form-item label="类别id">
                <span>{{ props.row.propertyCatalogId }}</span>
              </el-form-item>
              <el-form-item label="属性代码">
                <span>{{ props.row.propertyCode }}</span>
              </el-form-item>
              <el-form-item label="数据描述">
                <span>{{ props.row.propertyDesc }}</span>
              </el-form-item>
              <el-form-item label="属性类型">
                <span>{{ props.row.propertyType }}</span>
              </el-form-item>
              <el-form-item label="输入长度">
                <span>{{ props.row.propertyLength }}</span>
              </el-form-item>
              <el-form-item label="输入精度">
                <span>{{ props.row.propertyPrecision }}</span>
              </el-form-item>
              <el-form-item label="输入格式">
                <span>{{ props.row.propertyFormat }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="propertyCatalogId" label="类别id" />
        <el-table-column prop="propertyCode" label="属性代码" />
        <el-table-column prop="propertyDesc" label="数据描述" />
        <el-table-column prop="propertyType" label="属性类型">
          <template slot-scope="scope">
            {{ getDictLabel(scope.row.propertyType,'APP_STORE_PROPERTY_TYPE',scope) }}
          </template>
        </el-table-column>
        <el-table-column prop="propertyLength" label="输入长度" />
        <el-table-column prop="propertyPrecision" label="输入精度" />
        <el-table-column prop="propertyFormat" label="输入格式" />
        <el-table-column v-if="checkPer(['admin','storeProperty:edit','storeProperty:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudStoreProperty from '@/api/elstore/storeProperty.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, propertyCatalogId: null, propertyCode: null, propertyDesc: null, propertyType: null, propertyLength: null, propertyPrecision: null, propertyFormat: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreProperty',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreProperty', url: 'api/storeProperty', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreProperty }})
  },
  dicts: ['APP_STORE_PROPERTY_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'storeProperty:add'],
        edit: ['admin', 'storeProperty:edit'],
        del: ['admin', 'storeProperty:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'propertyCatalogId', display_name: '类别id' },
        { key: 'propertyCode', display_name: '属性代码' },
        { key: 'propertyDesc', display_name: '数据描述' },
        { key: 'propertyType', display_name: '属性类型' },
        { key: 'propertyLength', display_name: '输入长度' },
        { key: 'propertyPrecision', display_name: '输入精度' },
        { key: 'propertyFormat', display_name: '输入格式' }
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
