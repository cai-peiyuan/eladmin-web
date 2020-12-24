<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">样式名称</label>
        <el-input v-model="query.styleName" clearable placeholder="样式名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">样式描述</label>
        <el-input v-model="query.styleRemark" clearable placeholder="样式描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="样式名称">
            <el-input v-model="form.styleName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式描述">
            <el-input v-model="form.styleRemark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="中心点">
            <el-input v-model="form.styleCenter" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="默认级别">
            <el-input v-model="form.styleZoom" style="width: 370px;" />
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
              <el-form-item label="样式名称">
                <span>{{ props.row.styleName }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="样式描述">
                <span>{{ props.row.styleRemark }}</span>
              </el-form-item>
              <el-form-item label="中心点">
                <span>{{ props.row.styleCenter }}</span>
              </el-form-item>
              <el-form-item label="默认级别">
                <span>{{ props.row.styleZoom }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="主键" sortable="custom" />
        <el-table-column prop="styleName" label="样式名称" sortable="custom" />
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="styleRemark" label="样式描述" sortable="custom" />
        <el-table-column prop="styleCenter" label="中心点" sortable="custom" />
        <el-table-column prop="styleZoom" label="默认级别" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapStyle:edit','mapStyle:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapStyle from '@/api/msp/mapStyle.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  styleName: null,
  createUser: null,
  createTime: null,
  styleRemark: null,
  styleCenter: null,
  styleZoom: null
}
export default {
  name: 'MapStyle',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图样式',
      url: 'api/mapStyle',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapStyle }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapStyle:add'],
        edit: ['admin', 'mapStyle:edit'],
        del: ['admin', 'mapStyle:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: [],
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'styleName', display_name: '样式名称' },
        { key: 'styleRemark', display_name: '样式描述' }
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
