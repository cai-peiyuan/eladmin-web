<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">配置所属编辑器标识</label>
        <el-select v-model="query.editorKey" clearable size="small" placeholder="配置所属编辑器标识" class="filter-item" style="width: 185px" @change="crud.toQuery">
          <el-option v-for="item in dict.dict.MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_EDITOR_KEY" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <label class="el-form-item-label">配置分组</label>
        <el-select v-model="query.configGroup" clearable size="small" placeholder="配置分组" class="filter-item" style="width: 185px" @change="crud.toQuery">
          <el-option v-for="item in dict.dict.MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_GROUP" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <label class="el-form-item-label">配置说明</label>
        <el-input v-model="query.configName" clearable placeholder="配置说明" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">配置项Key</label>
        <el-input v-model="query.configKey" clearable placeholder="配置项目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        width="650px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
          <el-form-item label="配置所属编辑器标识" prop="editorKey">
            <el-select v-model="form.editorKey" size="small" placeholder="配置所属编辑器标识" class="filter-item" style="width: 450px;">
              <el-option v-for="item in dict.dict.MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_EDITOR_KEY" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="false" label="配置分组">
            <el-select v-model="form.configGroup" size="small" placeholder="配置分组" class="filter-item" style="width: 450px;">
              <el-option v-for="item in dict.dict.MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_GROUP" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="配置项Key" prop="configKey">
            <el-input v-model="form.configKey" style="width: 450px;" />
          </el-form-item>
          <el-form-item v-if="false" label="配置值类型">
            <el-select v-model="form.valueType" size="small" placeholder="配置值类型" class="filter-item" style="width: 450px;">
              <el-option v-for="item in dict.dict.MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_VALUE_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="配置值" prop="configValue">
            <vue-json-editor
              v-model="form.configValue"
              :mode="'code'"
              lang="zh"
              style="height: 300px;"
            />
          </el-form-item>
          <el-form-item label="配置说明" prop="configName">
            <el-input v-model="form.configName" :rows="5" type="textarea" style="width: 450px;" />
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
                <li><div class="detail-title">配置所属编辑器标识</div>
                  <div class="detail-value">{{ props.row.editorKey }}</div></li>
                <li><div class="detail-title">配置说明</div>
                  <div class="detail-value">{{ props.row.configName }}</div></li>
                <li><div class="detail-title">配置项目</div>
                  <div class="detail-value">{{ props.row.configKey }}</div></li>
                <li><div class="detail-title">配置值</div>
                  <div class="detail-value">{{ props.row.configValue }}</div></li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="editorKey" label="配置所属编辑器标识" sortable="custom" />
        <el-table-column prop="configName" label="配置说明" sortable="custom" />
        <el-table-column prop="configGroup" label="配置分组" sortable="custom" />
        <el-table-column prop="configKey" label="配置项目" sortable="custom" />
        <el-table-column prop="configValue" label="配置值" sortable="custom" />
        <el-table-column prop="valueType" label="配置值类型" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapStyleEditorConfig:edit','mapStyleEditorConfig:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapStyleEditorConfig from '@/api/msp/mapStyleEditorConfig.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import vueJsonEditor from 'vue-json-editor'

const defaultForm = {
  id: null,
  editorKey: null,
  configName: null,
  configGroup: null,
  configKey: null,
  configValue: null,
  valueType: null,
  updateUser: null,
  updateTime: null
}
export default {
  name: 'MapStyleEditorConfig',
  components: { vueJsonEditor, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图样式编辑器配置',
      url: 'api/mapStyleEditorConfig',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapStyleEditorConfig }
    })
  },
  // 数据字典
  el_dicts: [''],
  dicts: ['MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_VALUE_TYPE', 'MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_EDITOR_KEY', 'MSP_TOOLS_MAP_STYLE_EDITOR_CONFIG_GROUP'],
  data() {
    return {
      permission: {
        add: ['admin', 'mapStyleEditorConfig:add'],
        edit: ['admin', 'mapStyleEditorConfig:edit'],
        del: ['admin', 'mapStyleEditorConfig:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'configGroup', 'configValue', 'valueType'],
      rules: {
        editorKey: [
          { required: true, message: '配置所属编辑器标识不能为空', trigger: 'blur' }
        ],
        configName: [
          { required: true, message: '配置说明不能为空', trigger: 'blur' }
        ],
        configGroup: [
          { required: true, message: '配置分组不能为空', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: '配置项目不能为空', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: '配置值不能为空', trigger: 'blur' }
        ],
        valueType: [
          { required: true, message: '配置值类型不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'editorKey', display_name: '配置所属编辑器标识' },
        { key: 'configName', display_name: '配置说明' },
        { key: 'configGroup', display_name: '配置分组' },
        { key: 'configKey', display_name: '配置项目' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.form.configValue = JSON.parse(this.form.configValue)
      return true
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
  /* jsoneditor右上角默认有一个链接,加css去掉了 */
  ::v-deep .jsoneditor-poweredBy{
    display: none;
  }
  ::v-deep .jsoneditor-vue{
    min-height: 250px;
  }
  ::v-deep .jsoneditor{
    min-height: 250px;
  }
  ::v-deep .jsoneditor-outer{
    min-height: 250px;
  }
  ::v-deep .ace-jsoneditor{
    min-height: 250px;
  }
  .mystyle-main {
    max-width: 1000px;
  }
  .mystyle-header {
    position: relative;
    margin-top: 32px;
    margin-bottom: 30px;
  }
  .maystyle-item {
    position: relative;
    border: 1px dashed #e6ebec;
    border-radius: 3px;
    width: 100%;
    height: 122px;
    margin: 12px 12px 24px 0;
    background: #fff;
    padding-left: 139px;
    .maystyle-item-img {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 120px;
      border-radius: 3px 0 0 3px;
    }
    .maystyle-item-info {
      position: relative;
      font-size: 12px;
      height: 100%;
      color: #7c7e7d;

      .maystyle-item-info-top {
        position: absolute;
        top: 17px;
        width: 100%;
        .name {
          cursor: pointer;
          float: left;
          font-size: 14px;
          color: #535353;
          .txt {
            display: inline-block;
            max-width: 450px;
          }
          .text-overflow {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .edit {
            position: relative;
            top: -5px;
            margin-left: 18px;
            i {
              display: none;
              font-size: 14px;
              color: #42a4f5;
            }
          }
        }
        .edit-info {
          float: right;
          margin-right: 20px;
          color: #a8a9a8;
          .pub-time {
            margin-left: 20px;
          }
        }
      }
      .maystyle-item-info-bottom {
        position: absolute;
        bottom: 13px;
        span {
          display: inline-block;
          margin-right: 24px;
          cursor: pointer;
          i {
            font-size: 13px;
            color: #42a4f5;
            margin-right: 9px;
          }
        }
      }
      .maystyle-item-info-center {
        position: absolute;
        bottom: 63px;
        span {
          display: inline-block;
          margin-right: 24px;
          cursor: pointer;
          i {
            font-size: 13px;
            color: #42a4f5;
            margin-right: 9px;
          }
        }
      }
    }
  }
</style>
