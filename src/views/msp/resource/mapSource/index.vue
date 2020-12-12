<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">源名称</label>
        <el-input v-model="query.sourceName" clearable placeholder="源名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">源类型</label>
        <el-input v-model="query.sourceType" clearable placeholder="源类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">源地址</label>
        <el-input v-model="query.sourceUrl" clearable placeholder="源地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="源名称">
            <el-input v-model="form.sourceName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="源类型">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="源地址">
            <el-input v-model="form.sourceUrl" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="瓦片大小">
            <el-input v-model="form.tileSize" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="最小级别">
            <el-input v-model="form.minZoom" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="最大级别">
            <el-input v-model="form.maxZoom" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="源备注">
            <el-input v-model="form.sourceRemark" style="width: 370px;" />
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
              <el-form-item label="源名称">
                <span>{{ props.row.sourceName }}</span>
              </el-form-item>
              <el-form-item label="源类型">
                <span>{{ props.row.sourceType }}</span>
              </el-form-item>
              <el-form-item label="源地址">
                <span>{{ props.row.sourceUrl }}</span>
              </el-form-item>
              <el-form-item label="瓦片大小">
                <span>{{ props.row.tileSize }}</span>
              </el-form-item>
              <el-form-item label="最小级别">
                <span>{{ props.row.minZoom }}</span>
              </el-form-item>
              <el-form-item label="最大级别">
                <span>{{ props.row.maxZoom }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="源备注">
                <span>{{ props.row.sourceRemark }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序列号" sortable="custom" />
        <el-table-column prop="sourceName" label="源名称" sortable="custom" />
        <el-table-column prop="sourceType" label="源类型" sortable="custom" />
        <el-table-column prop="sourceUrl" label="源地址" sortable="custom" />
        <el-table-column prop="tileSize" label="瓦片大小" sortable="custom" />
        <el-table-column prop="minZoom" label="最小级别" sortable="custom" />
        <el-table-column prop="maxZoom" label="最大级别" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
        <el-table-column prop="sourceRemark" label="源备注" sortable="custom" />
        <el-table-column v-permission="['admin','mapSource:edit','mapSource:del']" label="操作" width="150px" align="center" fixed="right">
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
import crudMapSource from '@/api/msp/mapSource.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  sourceName: null,
  sourceType: null,
  sourceUrl: null,
  tileSize: null,
  minZoom: null,
  maxZoom: null,
  createTime: null,
  createUser: null,
  sourceRemark: null
}
export default {
  name: 'MapSource',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图数据源',
      url: 'api/mapSource',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapSource }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapSource:add'],
        edit: ['admin', 'mapSource:edit'],
        del: ['admin', 'mapSource:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: [],
      rules: {
        id: [
          { required: true, message: '序列号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'sourceName', display_name: '源名称' },
        { key: 'sourceType', display_name: '源类型' },
        { key: 'sourceUrl', display_name: '源地址' }
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
