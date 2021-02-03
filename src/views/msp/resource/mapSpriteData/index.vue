<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.name" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="上传文件">
            <el-upload
              multiple
              style="width: 370px;"
              name="file"
              with-credentials="with-credentials"
              class="upload-demo"
              :action="uploadUrl()"
              :headers="uploadHeader()"
              :data="getUploadData()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传json/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
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
        <!-- 展开预览详细信息列 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="demo-table-expand" style="padding-left: 40px">
              <ul class="detail-info">

                <li><div class="detail-title">名称</div>
                  <div class="detail-value">{{ props.row.name }}</div></li>
                <li><div class="detail-title">类型</div>
                  <div class="detail-value">{{ props.row.type }}</div></li>
                <li><div class="detail-title">标清JSON</div>
                  <div class="detail-value">{{ props.row.jsonLength }}</div></li>
                <li><div class="detail-title">标清PNG</div>
                  <div class="detail-value">{{ props.row.pngLength }}</div></li>
                <li><div class="detail-title">高清JSON</div>
                  <div class="detail-value">{{ props.row.json2xLength }}</div></li>
                <li><div class="detail-title">高清PNG</div>
                  <div class="detail-value">{{ props.row.png2xLength }}</div></li>
                <li><div class="detail-title">备注</div>
                  <div class="detail-value">{{ props.row.remark }}</div></li>

              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" sortable="custom" />
        <el-table-column prop="type" label="类型" sortable="custom" />
        <el-table-column prop="jsonLength" label="标清JSON" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.jsonLength === 0 ? 'primary' : 'success'"
                disable-transitions
              >{{ scope.row.jsonLength === 0?'未上传':
                Math.ceil(scope.row.jsonLength/1024) > 1024 ?
                  (scope.row.jsonLength/1024/1024).toFixed(2)+'MB' :
                  Math.ceil(scope.row.jsonLength/1024) + 'KB' }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="pngLength" label="标清PNG" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.pngLength === 0 ? 'primary' : 'success'"
                disable-transitions
              >{{ scope.row.pngLength === 0?'未上传':
                Math.ceil(scope.row.pngLength/1024) > 1024 ?
                  (scope.row.pngLength/1024/1024).toFixed(2)+'MB' :
                  Math.ceil(scope.row.pngLength/1024) + 'KB' }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="json2xLength" label="高清JSON" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.json2xLength === 0 ? 'primary' : 'success'"
                disable-transitions
              >{{ scope.row.json2xLength === 0?'未上传':
                Math.ceil(scope.row.json2xLength/1024) > 1024 ?
                  (scope.row.json2xLength/1024/1024).toFixed(2)+'MB' :
                  Math.ceil(scope.row.json2xLength/1024) + 'KB' }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="png2xLength" label="高清PNG" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.png2xLength === 0 ? 'primary' : 'success'"
                disable-transitions
              >{{ scope.row.png2xLength === 0?'未上传':
                Math.ceil(scope.row.png2xLength/1024) > 1024 ?
                  (scope.row.png2xLength/1024/1024).toFixed(2)+'MB' :
                  Math.ceil(scope.row.png2xLength/1024) + 'KB' }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapSpriteData:edit','mapSpriteData:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapSpriteData from './mapSpriteData.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '../../../../utils/auth'

const defaultForm = {
  id: null,
  name: null,
  type: null,
  json: null,
  png: null,
  json2x: null,
  png2x: null,
  updateTime: null,
  createTime: null,
  createUser: null,
  remark: null
}
export default {
  name: 'MapSpriteData',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '图标集合数据',
      url: 'api/mapSpriteData',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapSpriteData }
    })
  },
  // 数据字典
  el_dicts: [''],
  dicts: [''],
  data() {
    return {
      permission: {
        add: ['admin', 'mapSpriteData:add'],
        edit: ['admin', 'mapSpriteData:edit'],
        del: ['admin', 'mapSpriteData:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'type', 'json', 'png', 'json2x', 'png2x'],
      rules: {
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    beforeUpload(file) {
      // 修改状态 id有值// return false
      if (this.crud.form.id) {
        console.log(file)
      }
      console.log(file.type)
      const isJPG = file.type === 'text/javascript' || file.type === 'text/css' || file.type === 'application/json'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传文件只能是 js/css/json 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    getUploadData() {
      const theItemId = this.crud.form.id
      return { id: theItemId }
    },
    uploadHeader() {
      return { 'Authorization': getToken() }
    },
    uploadUrl() {
      return this.$store.getters.baseApi + '/api/mapSpriteData/upload'
    }
  }
}
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
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

  .detail-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 18px 0;
      font-size: 13px;
    }
    .detail-value {
      float: left;
      a{
        color: #317EF3;
      }
    }
    .detail-title {
      font-size: 14px;
      font-weight: bold;
      float: left;
      width: 200px;
    }
  }
</style>
