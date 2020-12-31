<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">资源名称</label>
        <el-input v-model="query.itemName" clearable placeholder="资源名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="资源名称">
            <el-input v-model="form.itemName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源类型js/css">
            <el-select v-model="form.itemType" size="small" placeholder="资源类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_LIB_ITEM_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="资源版本">
            <el-input v-model="form.itemVersion" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资源内容">
            <el-upload>
              <el-button plain size="small" type="primary">点击上传</el-button>
              <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过5M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="资源内容引用类型">
            <el-select v-model="form.itemContentType" size="small" placeholder="资源内容引用类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_LIB_ITEM_CONTENT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
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
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

              <el-form-item label="主键">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="资源名称">
                <span>{{ props.row.itemName }}</span>
              </el-form-item>
              <el-form-item label="资源类型js/css">
                <span>{{ props.row.itemType }}</span>
              </el-form-item>
              <el-form-item label="资源版本">
                <span>{{ props.row.itemVersion }}</span>
              </el-form-item>
              <el-form-item label="资源内容">
                <span>{{ props.row.itemContent }}</span>
              </el-form-item>
              <el-form-item label="资源来类型">
                <span>{{ props.row.itemContentType }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.itemRemark }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>

            </el-form>
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
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
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
