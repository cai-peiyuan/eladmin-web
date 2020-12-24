<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">枚举类型KEY</label>
        <el-input v-model="query.enumKey" clearable placeholder="枚举类型KEY" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">枚举类型名称</label>
        <el-input v-model="query.enumName" clearable placeholder="枚举类型名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">枚举元素KEY</label>
        <el-input v-model="query.elementKey" clearable placeholder="枚举元素KEY" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">枚举元素值</label>
        <el-input v-model="query.elementValue" clearable placeholder="枚举元素值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">是否启用</label>
        <el-input v-model="query.isEnable" clearable placeholder="是否启用" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">所属分类</label>
        <el-input v-model="query.type" clearable placeholder="所属分类" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.remark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="流水号" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="枚举类型KEY" prop="enumKey">
            <el-input v-model="form.enumKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="枚举类型名称" prop="enumName">
            <el-input v-model="form.enumName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="枚举元素KEY" prop="elementKey">
            <el-input v-model="form.elementKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="枚举元素值" prop="elementValue">
            <el-input v-model="form.elementValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            未设置字典，请手动设置 Radio
          </el-form-item>
          <el-form-item label="所属分类" prop="type">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="排序号">
            <el-input v-model="form.sortNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
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

              <el-form-item label="流水号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="枚举类型KEY">
                <span>{{ props.row.enumKey }}</span>
              </el-form-item>
              <el-form-item label="枚举类型名称">
                <span>{{ props.row.enumName }}</span>
              </el-form-item>
              <el-form-item label="枚举元素KEY">
                <span>{{ props.row.elementKey }}</span>
              </el-form-item>
              <el-form-item label="枚举元素值">
                <span>{{ props.row.elementValue }}</span>
              </el-form-item>
              <el-form-item label="是否启用">
                <span>{{ props.row.isEnable }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="排序号">
                <span>{{ props.row.sortNo }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ parseTime(props.row.updateTime) }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="流水号" sortable="custom" />
        <el-table-column prop="enumKey" label="枚举类型KEY" sortable="custom" />
        <el-table-column prop="enumName" label="枚举类型名称" sortable="custom" />
        <el-table-column prop="elementKey" label="枚举元素KEY" sortable="custom" />
        <el-table-column prop="elementValue" label="枚举元素值" sortable="custom" />
        <el-table-column prop="isEnable" label="是否启用" sortable="custom" />
        <el-table-column prop="type" label="所属分类" sortable="custom" />
        <el-table-column prop="sortNo" label="排序号" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mapEnum:edit','mapEnum:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapEnum from '@/api/msp/mapEnum.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  enumKey: null,
  enumName: null,
  elementKey: null,
  elementValue: null,
  isEnable: null,
  type: null,
  sortNo: null,
  updateTime: null,
  remark: null
}
export default {
  name: 'MapEnum',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图字典',
      url: 'api/mapEnum',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapEnum }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapEnum:add'],
        edit: ['admin', 'mapEnum:edit'],
        del: ['admin', 'mapEnum:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: [],
      rules: {
        id: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ],
        enumKey: [
          { required: true, message: '枚举类型KEY不能为空', trigger: 'blur' }
        ],
        enumName: [
          { required: true, message: '枚举类型名称不能为空', trigger: 'blur' }
        ],
        elementKey: [
          { required: true, message: '枚举元素KEY不能为空', trigger: 'blur' }
        ],
        elementValue: [
          { required: true, message: '枚举元素值不能为空', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '是否启用不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '所属分类不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'enumKey', display_name: '枚举类型KEY' },
        { key: 'enumName', display_name: '枚举类型名称' },
        { key: 'elementKey', display_name: '枚举元素KEY' },
        { key: 'elementValue', display_name: '枚举元素值' },
        { key: 'isEnable', display_name: '是否启用' },
        { key: 'type', display_name: '所属分类' },
        { key: 'remark', display_name: '备注' }
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
