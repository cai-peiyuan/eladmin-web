<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">物品模板代码</label>
        <el-input v-model="query.templateCode" clearable placeholder="物品模板代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板类型</label>
        <el-input v-model="query.templateType" clearable placeholder="物品模板类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板名称</label>
        <el-input v-model="query.templateName" clearable placeholder="物品模板名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="物品模板代码">
            <el-input v-model="form.templateCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品模板类型">
            <el-input v-model="form.templateType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品模板名称">
            <el-input v-model="form.templateName" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" highlight-current-row :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="templateCode" label="物品模板代码" />
        <el-table-column prop="templateType" label="物品模板类型" />
        <el-table-column v-if="false" prop="templateName" label="物品模板名称" />

        <el-table-column v-permission="['admin','storeTemplate:edit','storeTemplate:del']" label="物品模板名称" width="150px" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>点击设置<span style="color: red;">{{ scope.row.templateName }}</span>模板字段</p>
              <div slot="reference" class="name-wrapper">
                <span><el-link type="primary" @click="showTemplatePropertySettingDialog(scope.row)">{{ (scope.row.templateName) }}</el-link></span>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column v-permission="['admin','storeTemplate:edit','storeTemplate:del']" label="操作" width="150px" align="center">
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

      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showTemplatePropertySettingDialogFlag"
        :title="this.setTemplatePropertyRowData.templateName + '  ->  字段设置'"
        width="750px"
        style="padding-bottom: 20px;"
      >
        <p style="text-align: center; margin: 0 0 0px">设置{{ setTemplatePropertyRowData.templateName }}的属性</p>
        <div style="text-align: center">
          <el-transfer
            v-model="templatePropertyDataValue"
            style="text-align: left; display: inline-block"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :render-content="renderFunc"
            :titles="['可选属性字段', '已选属性字段']"
            :button-texts="['', '']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="templatePropertyData"
            @change="handleChange"
          />
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="warn" icon="el-icon-refresh" plain @click="showTemplatePropertySettingDialogFlag = !showTemplatePropertySettingDialogFlag">取消</el-button>
          <el-button type="primary" icon="el-icon-refresh" plain @click="reloadTemplatePropertyData">重新加载</el-button>
          <el-button :loading="saveTemplateloading" type="primary" icon="el-icon-check" plain @click="saveTemplatePropertySetting">保存设置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import crudStoreTemplate from '@/api/elstore/storeTemplate.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, templateCode: null, templateType: null, templateName: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '物品类型模板',
      url: 'api/storeTemplate',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudStoreTemplate }})
  },
  data() {
    /**
     * 转换器测试数据
     * @param _
     * @returns {[]}
     */
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i + '-11',
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      saveTemplateloading: false,
      // 所有的字段数据
      templatePropertyData: generateData(),
      // 已选中的字段数据
      templatePropertyDataValue: [],
      renderFunc(h, option) {
        return <span>{ option.propertyDesc } ({ option.propertyType })</span>
      },
      setTemplatePropertyRowData: {},
      showTemplatePropertySettingDialogFlag: false,
      permission: {
        add: ['admin', 'storeTemplate:add'],
        edit: ['admin', 'storeTemplate:edit'],
        del: ['admin', 'storeTemplate:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'templateCode', display_name: '物品模板代码' },
        { key: 'templateType', display_name: '物品模板类型' },
        { key: 'templateName', display_name: '物品模板名称' }
      ]
    }
  },
  methods: {
    // 监听模板属性变化操作
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    // 保存模板属性配置信息
    saveTemplatePropertySetting() {
      this.saveTemplateloading = true
      // console.log(this.setTemplatePropertyRowData)
      // console.log(this.templatePropertyDataValue)
      crudStoreTemplate.saveTemplatePropertyData(this.setTemplatePropertyRowData.id, this.templatePropertyDataValue).then(res => {
        console.log(res)
        this.$notify({
          title: '成功保存->' + res.saveCnt,
          type: 'success',
          duration: 2500
        })
        this.saveTemplateloading = false
        this.showTemplatePropertySettingDialogFlag = false
      })
    },
    // 显示模板属性配置窗口
    showTemplatePropertySettingDialog(rowData) {
      this.showTemplatePropertySettingDialogFlag = !this.showTemplatePropertySettingDialogFlag
      this.setTemplatePropertyRowData = rowData
      this.loadTemplatePropertyData(rowData)
    },
    reloadTemplatePropertyData() {
      this.loadTemplatePropertyData(this.setTemplatePropertyRowData)
    },
    // 加载模板和字段数据
    loadTemplatePropertyData(rowData) {
      const _this = this
      crudStoreTemplate.getTemplatePropertyData(rowData.id).then(res => {
        _this.templatePropertyData = []
        _this.templatePropertyDataValue = []
        // 全部属性字段
        res.allProperty.forEach(function(data, index) {
          const dataItem = {
            key: data.id,
            label: data.propertyCode + '' + data.propertyDesc,
            propertyCode: data.propertyCode,
            propertyType: data.propertyType,
            propertyDesc: data.propertyDesc,
            disabled: false
          }
          _this.templatePropertyData.push(dataItem)
        })
        // 已选属性字段
        res.selectProperty.forEach(function(data, index) {
          _this.templatePropertyDataValue.push(data.propertyId)
        })
      })
    },
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
  /deep/ .el-transfer-panel {
    width: 250px;
  }
</style>
