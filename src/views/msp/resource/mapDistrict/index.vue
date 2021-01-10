<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">区域代码</label>
        <el-input v-model="query.adCode" clearable placeholder="区域代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">区域名称</label>
        <el-input v-model="query.districtName" clearable placeholder="区域名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">区域别名</label>
        <el-input v-model="query.districtAlias" clearable placeholder="区域别名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">城市代码</label>
        <el-input v-model="query.cityCode" clearable placeholder="城市代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="区域代码">
            <el-input v-model="form.adCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区域名称">
            <el-input v-model="form.districtName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区域英文">
            <el-input v-model="form.districtNameEn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="x坐标">
            <el-input v-model="form.districtX" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="y坐标">
            <el-input v-model="form.districtY" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="r坐标">
            <el-input v-model="form.districtR" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区域别名">
            <el-input v-model="form.districtAlias" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城市代码">
            <el-input v-model="form.cityCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区域坐标">
            <el-input v-model="form.districtCoords" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="grid_codes">
            <el-input v-model="form.gridCodes" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="bounds">
            <el-input v-model="form.bounds" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
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

              <el-form-item label="区域代码">
                <span>{{ props.row.adCode }}</span>
              </el-form-item>
              <el-form-item label="区域名称">
                <span>{{ props.row.districtName }}</span>
              </el-form-item>
              <el-form-item label="区域英文">
                <span>{{ props.row.districtNameEn }}</span>
              </el-form-item>
              <el-form-item label="x坐标">
                <span>{{ props.row.districtX }}</span>
              </el-form-item>
              <el-form-item label="y坐标">
                <span>{{ props.row.districtY }}</span>
              </el-form-item>
              <el-form-item label="r坐标">
                <span>{{ props.row.districtR }}</span>
              </el-form-item>
              <el-form-item label="区域别名">
                <span>{{ props.row.districtAlias }}</span>
              </el-form-item>
              <el-form-item label="城市代码">
                <span>{{ props.row.cityCode }}</span>
              </el-form-item>
              <el-form-item label="区域坐标">
                <span>{{ props.row.districtCoords }}</span>
              </el-form-item>
              <el-form-item label="grid_codes">
                <span>{{ props.row.gridCodes }}</span>
              </el-form-item>
              <el-form-item label="bounds">
                <span>{{ props.row.bounds }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ parseTime(props.row.updateTime) }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="adCode" label="区域代码" sortable="custom" />
        <el-table-column prop="districtName" label="区域名称" sortable="custom" />
        <el-table-column prop="districtNameEn" label="区域英文" sortable="custom" />
        <el-table-column prop="districtX" label="x坐标" sortable="custom" />
        <el-table-column prop="districtY" label="y坐标" sortable="custom" />
        <el-table-column prop="districtR" label="r坐标" sortable="custom" />
        <el-table-column prop="districtAlias" label="区域别名" sortable="custom" />
        <el-table-column prop="cityCode" label="城市代码" sortable="custom" />
        <el-table-column prop="districtCoords" label="区域坐标" sortable="custom" />
        <el-table-column prop="gridCodes" label="grid_codes" sortable="custom" />
        <el-table-column prop="bounds" label="bounds" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','mapDistrict:edit','mapDistrict:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapDistrict from '@/api/msp/mapDistrict.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  adCode: null,
  districtName: null,
  districtNameEn: null,
  districtX: null,
  districtY: null,
  districtR: null,
  districtAlias: null,
  cityCode: null,
  districtCoords: null,
  gridCodes: null,
  bounds: null,
  updateTime: null
}
export default {
  name: 'MapDistrict',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '区域信息',
      url: 'api/mapDistrict',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapDistrict }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'mapDistrict:add'],
        edit: ['admin', 'mapDistrict:edit'],
        del: ['admin', 'mapDistrict:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['districtCoords', 'bounds'],
      rules: {
        id: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'adCode', display_name: '区域代码' },
        { key: 'districtName', display_name: '区域名称' },
        { key: 'districtAlias', display_name: '区域别名' },
        { key: 'cityCode', display_name: '城市代码' }
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
</style>
