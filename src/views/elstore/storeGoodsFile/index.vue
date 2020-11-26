<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">文件名称</label>
        <el-input v-model="query.fileName" clearable placeholder="文件名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">文件扩展名</label>
        <el-input v-model="query.fileSuffix" clearable placeholder="文件扩展名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">文件类型</label>
        <el-input v-model="query.fileType" clearable placeholder="文件类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">原始文件名称</label>
        <el-input v-model="query.originalFileName" clearable placeholder="原始文件名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">文件类型</label>
        <el-input v-model="query.contentType" clearable placeholder="文件类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属物品编号</label>
        <el-input v-model="query.goodsId" clearable placeholder="所属物品编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="文件名称">
            <el-input v-model="form.fileName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="文件扩展名">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="文件类型">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="文件大小">
            <el-input v-model="form.fileSize" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="原始文件名称">
            <el-input v-model="form.originalFileName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="文件类型">
            <el-input v-model="form.contentType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="文件存储路径">
            <el-input v-model="form.filePath" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所属物品编号">
            <el-input v-model="form.goodsId" style="width: 370px;" />
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

              <el-form-item label="文件名称">
                <span>{{ props.row.fileName }}</span>
              </el-form-item>
              <el-form-item label="文件扩展名">
                <span>{{ props.row.fileSuffix }}</span>
              </el-form-item>
              <el-form-item label="文件类型">
                <span>{{ props.row.fileType }}</span>
              </el-form-item>
              <el-form-item label="文件大小">
                <span>{{ props.row.fileSize }}</span>
              </el-form-item>
              <el-form-item label="原始文件名称">
                <span>{{ props.row.originalFileName }}</span>
              </el-form-item>
              <el-form-item label="文件类型">
                <span>{{ props.row.contentType }}</span>
              </el-form-item>
              <el-form-item label="文件存储路径">
                <span>{{ props.row.filePath }}</span>
              </el-form-item>
              <el-form-item label="所属物品编号">
                <span>{{ props.row.goodsId }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="originalFileName" label="原始名称" sortable="custom" />
        <el-table-column prop="fileSuffix" label="扩展名" sortable="custom" />
        <el-table-column prop="fileType" label="文件类型" sortable="custom" />
        <el-table-column prop="fileSize" label="大小" sortable="custom" />
        <el-table-column prop="contentType" label="内容类型" sortable="custom" />
        <el-table-column v-if="false" prop="fileName" label="存储名称" sortable="custom" />
        <el-table-column v-if="false" prop="filePath" label="存储路径" sortable="custom" />
        <el-table-column v-if="false" prop="goodsId" label="所属物品编号" sortable="custom" />
        <el-table-column v-permission="['admin','storeGoodsFile:edit','storeGoodsFile:del']" label="操作" width="150px" align="center" fixed="right">
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
import crudStoreGoodsFile from '@/api/elstore/storeGoodsFile.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, fileName: null, fileSuffix: null, fileType: null, fileSize: null, originalFileName: null, contentType: null, filePath: null, goodsId: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsFile',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '物品附件', url: 'api/storeGoodsFile', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreGoodsFile }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeGoodsFile:add'],
        edit: ['admin', 'storeGoodsFile:edit'],
        del: ['admin', 'storeGoodsFile:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'fileName', display_name: '文件名称' },
        { key: 'fileSuffix', display_name: '文件扩展名' },
        { key: 'fileType', display_name: '文件类型' },
        { key: 'originalFileName', display_name: '原始文件名称' },
        { key: 'contentType', display_name: '文件类型' },
        { key: 'goodsId', display_name: '所属物品编号' }
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
