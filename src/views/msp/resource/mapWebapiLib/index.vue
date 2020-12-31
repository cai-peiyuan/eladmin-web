<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">js库名称</label>
        <el-input v-model="query.libName" clearable placeholder="js库名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">资源类型js/css</label>
        <el-input v-model="query.libVersion" clearable placeholder="资源类型js/css" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">描述</label>
        <el-input v-model="query.libRemark" clearable placeholder="描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">类库类型</label>
        <el-input v-model="query.libType" clearable placeholder="类库类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" :hidden-columns="hiddenColumns" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="主键" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="js库名称">
            <el-input v-model="form.libName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源类型js/css">
            <el-input v-model="form.libVersion" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源id，多个用逗号分隔">
            <el-input v-model="form.libItemIds" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类库之前代码">
            <el-input v-model="form.libScriptBefore" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类库之后代码">
            <el-input v-model="form.libScriptAfter" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.libRemark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类库类型">
            <el-input v-model="form.libType" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        stripe="stripe"
        highlight-current-row="highlight-current-row"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
        @sort-change="crud.changeSortHandler"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

              <el-form-item label="主键">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="js库名称">
                <span>{{ props.row.libName }}</span>
              </el-form-item>
              <el-form-item label="资源类型js/css">
                <span>{{ props.row.libVersion }}</span>
              </el-form-item>
              <el-form-item label="资源id，多个用逗号分隔">
                <span>{{ props.row.libItemIds }}</span>
              </el-form-item>
              <el-form-item label="类库之前代码">
                <span>{{ props.row.libScriptBefore }}</span>
              </el-form-item>
              <el-form-item label="类库之后代码">
                <span>{{ props.row.libScriptAfter }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.libRemark }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="类库类型">
                <span>{{ props.row.libType }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="主键" sortable="custom" />
        <el-table-column prop="libName" label="js库名称" sortable="custom" />
        <el-table-column prop="libVersion" label="资源类型js/css" sortable="custom" />
        <el-table-column prop="libItemIds" label="资源id，多个用逗号分隔" sortable="custom" />
        <el-table-column prop="libScriptBefore" label="类库之前代码" sortable="custom" />
        <el-table-column prop="libScriptAfter" label="类库之后代码" sortable="custom" />
        <el-table-column prop="libRemark" label="描述" sortable="custom" />
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="libType" label="类库类型" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.libType === '1' ? 'primary' : 'success'"
                disable-transitions
              >{{ getDictLabel(scope.row.libType,'MSP_RESOURCE_LIB_TYPE',scope) }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','mapWebapiLib:edit','mapWebapiLib:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapWebapiLib from '@/api/msp/mapWebapiLib.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  libName: null,
  libVersion: null,
  libItemIds: null,
  libScriptBefore: null,
  libScriptAfter: null,
  libRemark: null,
  createUser: null,
  createTime: null,
  libType: null
}
export default {
  name: 'MapWebapiLib',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图类库',
      url: 'api/mapWebapiLib',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapWebapiLib }
    })
  },
  // 数据字典
  el_dicts: ['', ''],
  dicts: ['', 'MSP_RESOURCE_LIB_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'mapWebapiLib:add'],
        edit: ['admin', 'mapWebapiLib:edit'],
        del: ['admin', 'mapWebapiLib:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'libItemIds', 'libScriptBefore', 'libScriptAfter', 'createUser', 'createTime'],
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'libName', display_name: 'js库名称' },
        { key: 'libVersion', display_name: '资源类型js/css' },
        { key: 'libRemark', display_name: '描述' },
        { key: 'libType', display_name: '类库类型' }
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
  /deep/ .el-table__row {
    cursor: pointer;
  }
</style>
