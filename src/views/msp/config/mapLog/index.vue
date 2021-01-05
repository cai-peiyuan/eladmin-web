<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">序列号</label>
        <el-input v-model="query.ak" clearable placeholder="序列号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">服务id</label>
        <el-input v-model="query.sid" clearable placeholder="服务id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">客户端ip</label>
        <el-input v-model="query.ip" clearable placeholder="客户端ip" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="序号" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="序列号">
            <el-input v-model="form.ak" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="服务id">
            <el-input v-model="form.sid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="客户端ip">
            <el-input v-model="form.ip" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="引用地址">
            <el-input v-model="form.reqReferer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求时间">
            <el-input v-model="form.reqTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求耗时">
            <el-input v-model="form.consTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求参数">
            <el-input v-model="form.reqParam" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="请求头信息">
            <el-input v-model="form.reqHeader" style="width: 370px;" />
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

              <el-form-item label="序号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="序列号">
                <span>{{ props.row.ak }}</span>
              </el-form-item>
              <el-form-item label="服务id">
                <span>{{ props.row.sid }}</span>
              </el-form-item>
              <el-form-item label="客户端ip">
                <span>{{ props.row.ip }}</span>
              </el-form-item>
              <el-form-item label="引用地址">
                <span>{{ props.row.reqReferer }}</span>
              </el-form-item>
              <el-form-item label="请求时间">
                <span>{{ parseTime(props.row.reqTime) }}</span>
              </el-form-item>
              <el-form-item label="请求耗时">
                <span>{{ props.row.consTime }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="请求参数">
                <span>{{ props.row.reqParam }}</span>
              </el-form-item>
              <el-form-item label="请求头信息">
                <span>{{ props.row.reqHeader }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号" sortable="custom" />
        <el-table-column prop="ak" label="序列号" sortable="custom" />
        <el-table-column prop="sid" label="服务id" sortable="custom" />
        <el-table-column prop="ip" label="客户端ip" sortable="custom" />
        <el-table-column prop="reqReferer" label="引用地址" sortable="custom" />
        <el-table-column prop="reqTime" label="请求时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.reqTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consTime" label="请求耗时" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reqParam" label="请求参数" sortable="custom" />
        <el-table-column prop="reqHeader" label="请求头信息" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapLog:edit','mapLog:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapLog from '@/api/msp/mapLog.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  ak: null,
  sid: null,
  ip: null,
  reqReferer: null,
  reqTime: null,
  consTime: null,
  createTime: null,
  reqParam: null,
  reqHeader: null
}
export default {
  name: 'MapLog',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '接口日志',
      url: 'api/mapLog',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapLog }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapLog:add'],
        edit: ['admin', 'mapLog:edit'],
        del: ['admin', 'mapLog:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: [],
      rules: {
        id: [
          { required: true, message: '序号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'ak', display_name: '序列号' },
        { key: 'sid', display_name: '服务id' },
        { key: 'ip', display_name: '客户端ip' }
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
  /deep/ .el-table__row {
    cursor: pointer;
  }
</style>
