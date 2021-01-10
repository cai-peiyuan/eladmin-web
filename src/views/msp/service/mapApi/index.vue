<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">服务地址</label>
        <el-input v-model="query.apiUrl" clearable placeholder="服务地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">服务名称</label>
        <el-input v-model="query.apiName" clearable placeholder="服务名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">服务类</label>
        <el-input v-model="query.className" clearable placeholder="服务类" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">服务id</label>
        <el-input v-model="query.sid" clearable placeholder="服务id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.remark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否可用</label>
        <el-input v-model="query.isEnable" clearable placeholder="是否可用" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">方法</label>
        <el-input v-model="query.methodName" clearable placeholder="方法" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="服务地址">
            <el-input v-model="form.apiUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务名称">
            <el-input v-model="form.apiName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务类">
            <el-input v-model="form.className" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务id">
            <el-input v-model="form.sid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否可用">
            <el-input v-model="form.isEnable" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="方法">
            <el-input v-model="form.methodName" style="width: 370px;" />
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
              <el-form-item label="服务地址">
                <span>{{ props.row.apiUrl }}</span>
              </el-form-item>
              <el-form-item label="服务名称">
                <span>{{ props.row.apiName }}</span>
              </el-form-item>
              <el-form-item label="服务类">
                <span>{{ props.row.className }}</span>
              </el-form-item>
              <el-form-item label="服务id">
                <span>{{ props.row.sid }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="是否可用">
                <span>{{ props.row.isEnable }}</span>
              </el-form-item>
              <el-form-item label="方法">
                <span>{{ props.row.methodName }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序列号" sortable="custom" width="80px" />
        <el-table-column prop="apiUrl" label="服务地址" sortable="custom" width="160px" />
        <el-table-column prop="apiName" label="服务名称" sortable="custom" width="220px" />
        <el-table-column prop="className" label="服务类" sortable="custom" />
        <el-table-column prop="methodName" label="方法" sortable="custom" width="100px" />
        <el-table-column prop="sid" label="服务id" sortable="custom" width="150px" />
        <el-table-column prop="remark" label="备注" sortable="custom" />
        <el-table-column prop="isEnable" label="是否可用" sortable="custom" width="100px" />
        <el-table-column v-if="checkPer(['admin','mapApi:edit','mapApi:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapApi from '@/api/msp/mapApi'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  apiUrl: null,
  apiName: null,
  className: null,
  sid: null,
  remark: null,
  isEnable: null,
  methodName: null
}
export default {
  name: 'MapApi',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图服务接口',
      url: 'api/mapApi',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapApi }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapApi:add'],
        edit: ['admin', 'mapApi:edit'],
        del: ['admin', 'mapApi:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['remark', ''],
      rules: {
        id: [
          { required: true, message: '序列号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'apiUrl', display_name: '服务地址' },
        { key: 'apiName', display_name: '服务名称' },
        { key: 'className', display_name: '服务类' },
        { key: 'sid', display_name: '服务id' },
        { key: 'remark', display_name: '备注' },
        { key: 'isEnable', display_name: '是否可用' },
        { key: 'methodName', display_name: '方法' }
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
