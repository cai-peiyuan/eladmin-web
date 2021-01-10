<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">参数名称</label>
        <el-input v-model="query.name" clearable placeholder="参数名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">参数键</label>
        <el-input v-model="query.paramKey" clearable placeholder="参数键" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">参数值</label>
        <el-input v-model="query.value" clearable placeholder="参数值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属分类</label>
        <el-input v-model="query.type" clearable placeholder="所属分类" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.remark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="参数名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数键" prop="paramKey">
            <el-input v-model="form.paramKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数值">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属分类">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
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

              <el-form-item label="流水号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="参数名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="参数键">
                <span>{{ props.row.paramKey }}</span>
              </el-form-item>
              <el-form-item label="参数值">
                <span>{{ props.row.value }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ parseTime(props.row.updateTime) }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="流水号" sortable="custom" />
        <el-table-column prop="name" label="参数名称" sortable="custom" />
        <el-table-column prop="paramKey" label="参数键" sortable="custom" />
        <el-table-column prop="value" label="参数值" sortable="custom" />
        <el-table-column prop="type" label="所属分类" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapParam:edit','mapParam:del'])" label="操作" width="150px" align="center" fixed="right">
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

import crudMapParam from '@/api/msp/mapParam.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  name: null,
  paramKey: null,
  value: null,
  type: null,
  updateTime: null,
  remark: null
}
export default {
  name: 'MapParam',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图参数配置',
      url: 'api/mapParam',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapParam }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapParam:add'],
        edit: ['admin', 'mapParam:edit'],
        del: ['admin', 'mapParam:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['updateTime', 'type'],
      rules: {
        name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        paramKey: [
          { required: true, message: '参数键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '参数名称' },
        { key: 'paramKey', display_name: '参数键' },
        { key: 'value', display_name: '参数值' },
        { key: 'type', display_name: '所属分类' },
        { key: 'remark', display_name: '备注' }
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
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
  ::v-deep .el-table__row {
    cursor: pointer;
  }
</style>
