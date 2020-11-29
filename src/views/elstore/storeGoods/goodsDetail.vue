<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <div class="crud-opts">
        <!-- 表格操作左侧内容 -->
        <span class="crud-opts-right">
          <!--左侧插槽-->
          <slot name="left" />
          <el-button
            class="filter-item"
            size="mini"
            type="danger"
            plain
            @click="initGoodsDetailValue"
          >
            <svg-icon icon-class="reload" />
            同步模板属性
          </el-button>
        </span>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        highlight-current-row
        @row-click="editTheRow"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column v-if="false" prop="goodsId" label="物品id" />
        <el-table-column v-if="false" prop="goodsTemplateId" label="物品模板编号" />
        <el-table-column v-if="false" prop="propertySeq" label="属性序号" />
        <el-table-column v-if="false" prop="propertyCode" label="属性编码" />
        <el-table-column prop="propertyDesc" label="属性描述" width="100" />
        <el-table-column prop="propertyValue" label="属性值">
          <!--<template slot-scope="scope">
            <span>{{scope.row.propertyValue}}</span>
          </template>-->
          <template slot-scope="scope">
            <el-input
              v-if="currentEditDataId === scope.row.id && ('decimal' === scope.row.propertyType)"
              v-model="scope.row.propertyValue"
              size="small"
              type="text"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
              @keyup.enter.native="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <el-input
              v-if="currentEditDataId === scope.row.id && ('text' === scope.row.propertyType)"
              v-model="scope.row.propertyValue"
              size="small"
              type="text"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
              @keyup.enter.native="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <el-input
              v-if="currentEditDataId === scope.row.id && ('textarea' === scope.row.propertyType)"
              v-model="scope.row.propertyValue"
              size="small"
              type="textarea"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
              @keyup.enter.native="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <el-input-number
              v-if="currentEditDataId === scope.row.id && 'integer' === scope.row.propertyType"
              v-model="scope.row.propertyValue"
              size="small"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <el-date-picker
              v-if="currentEditDataId === scope.row.id && ('date' === scope.row.propertyType) "
              v-model="scope.row.propertyValue"
              align="right"
              type="date"
              placeholder="选择"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />
            <el-time-select
              v-if="currentEditDataId === scope.row.id && ('time' === scope.row.propertyType) "
              v-model="scope.row.propertyValue"
              align="right"
              type="time"
              placeholder="选择"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59'
              }"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <el-date-picker
              v-if="currentEditDataId === scope.row.id && ('datetime' === scope.row.propertyType) "
              v-model="scope.row.propertyValue"
              align="right"
              type="datetime"
              placeholder="选择"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @blur="handleInputBlurResult({index:scope.$index, value:scope.row.propertyValue, id: scope.row.id})"
            />

            <span v-if="currentEditDataId != scope.row.id">{{ parseGoodsDetailValue(scope.row, scope.row.propertyValue) }}</span>
          </template>

        </el-table-column>
      </el-table>

      <el-form v-if="false" label-width="100px" class="demo-dynamic">
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :label="'域名' + index"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true, message: '域名不能为空', trigger: 'blur'
          }"
        />
      </el-form>

    </div>
  </div>
</template>

<script>
import crudStoreGoodsDetail from '@/api/elstore/storeGoodsDetail.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'

const defaultForm = { id: null, goodsId: null, goodsTemplateId: null, propertySeq: null, propertyCode: null, propertyDesc: null, propertyValue: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsDetail',
  mixins: [presenter(), header(), form(function() {
    return Object.assign({ goods: { id: this.goodsId }, goodsId: this.goodsId }, defaultForm)
  }), crud()],
  cruds() {
    return CRUD({
      title: 'StoreGoodsDetail',
      url: 'api/storeGoodsDetail',
      idField: 'id',
      query: { goodsId: '' },
      sort: 'id,desc',
      crudMethod: { ...crudStoreGoodsDetail },
      queryOnPresenterCreated: false
    })
  },
  props: {
    initGoodsDetailValueFunc: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: ''
      },
      currentEditIndex: -1,
      currentEditDataId: '',
      goodsId: null,
      goodsName: null,
      permission: {
        add: ['admin', 'storeGoodsDetail:add'],
        edit: ['admin', 'storeGoodsDetail:edit'],
        del: ['admin', 'storeGoodsDetail:del']
      },
      rules: {
        id: [
          { required: true, message: '记录编号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsId', display_name: '物品id' },
        { key: 'goodsTemplateId', display_name: '物品模板编号' },
        { key: 'propertySeq', display_name: '属性序号' },
        { key: 'propertyCode', display_name: '属性编码' },
        { key: 'propertyDesc', display_name: '属性描述' },
        { key: 'propertyValue', display_name: '属性值' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.afterRefresh]() {
      this.$crud.data
      return true
    },
    initGoodsDetailValue() {
      if (this.initGoodsDetailValueFunc) {
        this.initGoodsDetailValueFunc()
      }
    },
    editTheRow(rowData, column, event) {
      this.currentEditDataId = rowData.id
    },
    handleInputBlurResult({
      index,
      value = '',
      id = ''
    }) {
      console.log(id)
      console.log(value)
      this.currentEditIndex = -1
      this.currentEditDataId = ''
      crudStoreGoodsDetail.edit({ id: id, propertyValue: value }).then(res => {
        console.log(res)
      })
    },
    parseGoodsDetailValue(row, value) {
      if (row.propertyType === 'time') {
        return (value)
      }
      if (row.propertyType === 'text') {
        return (value)
      }
      if (row.propertyType === 'textarea') {
        return (value)
      }
      if (row.propertyType === 'decimal') {
        return (value)
      }
      if (row.propertyType === 'integer') {
        return (value)
      }
      if (row.propertyType === 'date') {
        return (value)
      }
      if (row.propertyType === 'datetime') {
        return (value)
      }
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
