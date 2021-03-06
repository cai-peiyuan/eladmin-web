<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">多语言标识</label>
        <el-input v-model="query.langKey" clearable placeholder="多语言标识" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">英文显示内容</label>
        <el-input v-model="query.langEn" clearable placeholder="英文显示内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">中文显示内容</label>
        <el-input v-model="query.langZh" clearable placeholder="中文显示内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="多语言标识" prop="langKey">
            <el-input v-model="form.langKey" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="英文显示内容" prop="langEn">
            <el-input v-model="form.langEn" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="中文显示内容" prop="langZh">
            <el-input v-model="form.langZh" :rows="3" type="textarea" style="width: 370px;" />
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

                <li><div class="detail-title">多语言标识</div>
                  <div class="detail-value">{{ props.row.langKey }}</div></li>
                <li><div class="detail-title">英文显示内容</div>
                  <div class="detail-value">{{ props.row.langEn }}</div></li>
                <li><div class="detail-title">中文显示内容</div>
                  <div class="detail-value">{{ props.row.langZh }}</div></li>

              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="langKey" label="多语言标识" sortable="custom" />
        <el-table-column prop="langEn" label="英文显示内容" sortable="custom" />
        <el-table-column prop="langZh" label="中文显示内容" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapStyleEditorLang:edit','mapStyleEditorLang:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapStyleEditorLang from '@/api/msp/mapStyleEditorLang.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  langKey: null,
  langEn: null,
  langZh: null
}
export default {
  name: 'MapStyleEditorLang',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '编辑器多语言配置',
      url: 'api/mapStyleEditorLang',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapStyleEditorLang }
    })
  },
  // 数据字典
  el_dicts: [''],
  dicts: [''],
  data() {
    return {
      permission: {
        add: ['admin', 'mapStyleEditorLang:add'],
        edit: ['admin', 'mapStyleEditorLang:edit'],
        del: ['admin', 'mapStyleEditorLang:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id'],
      rules: {
      },
      queryTypeOptions: [
        { key: 'langKey', display_name: '多语言标识' },
        { key: 'langEn', display_name: '英文显示内容' },
        { key: 'langZh', display_name: '中文显示内容' }
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
