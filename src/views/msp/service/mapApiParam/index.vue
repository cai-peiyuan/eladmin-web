<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">服务SID</label>
        <el-input v-model="query.sid" clearable placeholder="服务SID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">参数名称</label>
        <el-input v-model="query.paramName" clearable placeholder="参数名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">参数类型</label>
        <el-input v-model="query.paramType" clearable placeholder="参数类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="序列号" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务SID">
            <el-input v-model="form.sid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数名称">
            <el-input v-model="form.paramName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数类型">
            <el-input v-model="form.paramType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="允许为空">
            <el-input v-model="form.allowNull" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="空值错误提示">
            <el-input v-model="form.nullValueMsg" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="默认值">
            <el-input v-model="form.defaultValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="正则校验">
            <el-input v-model="form.validationRegular" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="校验错误提示">
            <el-input v-model="form.validationErrorMsg" style="width: 370px;" />
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

              <el-form-item label="序列号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="服务SID">
                <span>{{ props.row.sid }}</span>
              </el-form-item>
              <el-form-item label="参数名称">
                <span>{{ props.row.paramName }}</span>
              </el-form-item>
              <el-form-item label="参数类型">
                <span>{{ props.row.paramType }}</span>
              </el-form-item>
              <el-form-item label="允许为空">
                <span>{{ props.row.allowNull }}</span>
              </el-form-item>
              <el-form-item label="空值错误提示">
                <span>{{ props.row.nullValueMsg }}</span>
              </el-form-item>
              <el-form-item label="默认值">
                <span>{{ props.row.defaultValue }}</span>
              </el-form-item>
              <el-form-item label="正则校验">
                <span>{{ props.row.validationRegular }}</span>
              </el-form-item>
              <el-form-item label="校验错误提示">
                <span>{{ props.row.validationErrorMsg }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序列号" sortable="custom" />
        <el-table-column prop="sid" label="服务SID" sortable="custom" />
        <el-table-column prop="paramName" label="参数名称" sortable="custom" />
        <el-table-column prop="paramType" label="参数类型" sortable="custom" />
        <el-table-column prop="allowNull" label="允许为空" sortable="custom" />
        <el-table-column prop="nullValueMsg" label="空值错误提示" sortable="custom" />
        <el-table-column prop="defaultValue" label="默认值" sortable="custom" />
        <el-table-column prop="validationRegular" label="正则校验" sortable="custom" />
        <el-table-column prop="validationErrorMsg" label="校验错误提示" sortable="custom" />
        <el-table-column v-permission="['admin','mapApiParam:edit','mapApiParam:del']" label="操作" width="150px" align="center" fixed="right">
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
import crudMapApiParam from '@/api/msp/mapApiParam.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  sid: null,
  paramName: null,
  paramType: null,
  allowNull: null,
  nullValueMsg: null,
  defaultValue: null,
  validationRegular: null,
  validationErrorMsg: null
}
export default {
  name: 'MapApiParam',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '接口参数配置',
      url: 'api/mapApiParam',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapApiParam }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapApiParam:add'],
        edit: ['admin', 'mapApiParam:edit'],
        del: ['admin', 'mapApiParam:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: [],
      rules: {
        id: [
          { required: true, message: '序列号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'sid', display_name: '服务SID' },
        { key: 'paramName', display_name: '参数名称' },
        { key: 'paramType', display_name: '参数类型' }
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
