<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">资源名称</label>
        <el-input v-model="query.itemName" clearable placeholder="资源名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">资源类型</label>
        <el-select v-model="query.itemType" clearable size="small" placeholder="资源类型" class="filter-item" style="width: 185px" @change="crud.toQuery">
          <el-option v-for="item in dict.dict.MSP_RESOURCE_LIB_ITEM_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
        width="600px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="130px">
          <el-form-item v-if="false" label="主键" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源名称" prop="itemName">
            <el-input v-model="form.itemName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源类型js/css" prop="itemType">
            <el-select v-model="form.itemType" size="small" placeholder="资源类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_LIB_ITEM_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="资源版本" prop="itemVersion">
            <el-input v-model="form.itemVersion" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="crud.status.edit === 1" label="资源文件">
            <el-upload
              style="width: 370px;"
              name="file"
              with-credentials="with-credentials"
              :headers="uploadHeader()"
              :data="getUploadData()"
              :action="uploadUrl()"
              :auto-upload="true"
              :before-upload="beforeUpload"
            >
              <el-button plain size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传js/css文件，且文件不超过5M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="资源引用类型" prop="itemContentType">
            <el-select v-model="form.itemContentType" size="small" placeholder="资源内容引用类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_LIB_ITEM_CONTENT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="itemRemark">
            <el-input v-model="form.itemRemark" style="width: 370px;" type="textarea" />
          </el-form-item>
          <el-form-item v-if="false" label="创建用户">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
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
            <div class="demo-table-expand" style="padding-left: 40px">
              <ul class="detail-info">
                <li><div class="detail-title">主键</div><div class="detail-value">{{ props.row.id }}</div></li>
                <li><div class="detail-title">资源名称</div><div class="detail-value">{{ props.row.itemName }}</div></li>
                <li><div class="detail-title">资源类型js/css</div><div class="detail-value">{{ props.row.itemType }}</div></li>
                <li><div class="detail-title">资源版本</div><div class="detail-value">{{ props.row.itemVersion }}</div></li>
                <li><div class="detail-title">资源来类型</div><div class="detail-value">{{ props.row.itemContentType }}</div></li>
                <li><div class="detail-title">描述</div><div class="detail-value">{{ props.row.itemRemark }}</div></li>
                <li><div class="detail-title">创建时间</div><div class="detail-value">{{ parseTime(props.row.createTime) }}</div></li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="主键" sortable="custom" />
        <el-table-column prop="itemName" label="资源名称" sortable="custom" />
        <el-table-column prop="itemType" label="资源类型js/css" sortable="custom">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.itemType === 'js'" icon-class="java-script_1" style="width: 3em; height: 3em" />
            <svg-icon v-if="scope.row.itemType === 'css'" icon-class="css_1" style="width: 3em; height: 3em" />
          </template>
        </el-table-column>
        <el-table-column prop="itemVersion" label="资源版本" sortable="custom" />
        <el-table-column prop="itemContent" label="资源内容" sortable="custom" />
        <el-table-column prop="itemContentType" label="资源内容引用类型" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.itemContentType === 'import' ? 'primary' : 'success'"
                disable-transitions
              >{{ getDictLabel(scope.row.itemContentType,'MSP_RESOURCE_LIB_ITEM_CONTENT_TYPE',scope) }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="itemRemark" label="描述" sortable="custom" />
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','mapWebapiItem:edit','mapWebapiItem:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapWebapiItem from '@/api/msp/mapWebapiItem.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'

const defaultForm = {
  id: null,
  itemName: null,
  itemType: null,
  itemVersion: null,
  itemContent: null,
  itemContentType: null,
  itemRemark: null,
  createUser: null,
  createTime: null
}
export default {
  name: 'MapWebapiItem',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '资源内容',
      url: 'api/mapWebapiItem',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapWebapiItem }
    })
  },
  // 数据字典
  el_dicts: ['MSP_RESOURCE_LIB_ITEM_TYPE', 'MSP_RESOURCE_LIB_ITEM_CONTENT_TYPE'],
  dicts: ['MSP_RESOURCE_LIB_ITEM_TYPE', 'MSP_RESOURCE_LIB_ITEM_CONTENT_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'mapWebapiItem:add'],
        edit: ['admin', 'mapWebapiItem:edit'],
        del: ['admin', 'mapWebapiItem:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['createUser', 'createTime', 'itemContent', 'id'],
      rules: {
        itemName: [
          { required: true, message: '名称不可为空', trigger: 'blur' }
        ],
        itemType: [
          { required: true, message: '资源类型不能为空', trigger: 'blur' }
        ],
        itemContentType: [
          { required: true, message: '引用类型不能为空', trigger: 'blur' }
        ],
        itemVersion: [
          { required: true, message: '版本号不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'itemName', display_name: '资源名称' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.afterSubmit](crud) {
      console.log(crud)
      return true
    },
    beforeUpload(file) {
      // 修改状态 id有值// return false
      if (this.crud.form.id) {
        console.log(file)
      }
      console.log(file.type)
      const isJPG = file.type === 'text/javascript' || file.type === 'text/css'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传文件只能是 js/css 格式!')
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
      return this.$store.getters.baseApi + '/api/mapWebapiItem/upload'
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
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
