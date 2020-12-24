<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="32">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <label class="el-form-item-label">名称</label>
          <el-input v-model="query.storeName" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <label class="el-form-item-label">仓库管理员</label>
          <el-input v-model="query.storeAdmin" clearable placeholder="仓库管理员" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <rrOperation :crud="crud" />
        </div>
        <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
        <crudOperation :permission="permission" />
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          highlight-current-row
          :data="crud.data"
          size="small"
          style="width: 100%;"
          @selection-change="crud.selectionChangeHandler"
          @current-change="showStoreShelf"
        >
          <el-table-column type="selection" width="50" fixed="left" />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

                <el-form-item label="主键">
                  <span>{{ props.row.id }}</span>
                </el-form-item>

                <el-form-item label="仓库编号">
                  <span><el-link type="primary">{{ props.row.storeCode }}</el-link></span>
                </el-form-item>

                <el-form-item label="仓库名称">
                  <span>{{ props.row.storeName }}</span>
                </el-form-item>

                <el-form-item label="仓库地址">
                  <span>{{ props.row.storeAddress }}</span>
                </el-form-item>

                <el-form-item label="仓库管理员">
                  <span>{{ props.row.storeAdmin }}</span>
                </el-form-item>

                <el-form-item label="仓库面积">
                  <span>{{ props.row.storeSquare }}</span>
                </el-form-item>

                <el-form-item label="仓库温度">
                  <span>{{ props.row.storeTemperature }}</span>
                </el-form-item>

                <el-form-item label="仓库湿度">
                  <span>{{ props.row.storeMoisture }}</span>
                </el-form-item>

                <el-form-item label="照片">
                  <span>{{ props.row.storePhoto }}</span>
                </el-form-item>

                <el-form-item label="平面图">
                  <span>{{ props.row.storeFloorPlan }}</span>
                </el-form-item>
                <el-form-item label="创建者">
                  <span>{{ props.row.createBy }}</span>
                </el-form-item>
                <el-form-item label="更新者">
                  <span>{{ props.row.updateBy }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ parseTime(props.row.createTime) }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ parseTime(props.row.updateTime) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column v-if="false" prop="id" label="主键" />
          <el-table-column prop="storeCode" label="仓库编号">
            <template slot-scope="scope">
              <span><el-link type="primary" @click="showStoreShelf(scope.row)">{{ (scope.row.storeCode) }}</el-link></span>
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="仓库名称" />
          <el-table-column prop="storeAddress" label="仓库地址" />
          <el-table-column prop="storeAdmin" label="仓库管理员" />
          <el-table-column prop="storeSquare" label="仓库面积" />
          <el-table-column prop="storeTemperature" label="仓库温度" />
          <el-table-column prop="storeMoisture" label="仓库湿度" />
          <el-table-column v-if="false" prop="storePhoto" label="照片" />
          <el-table-column v-if="false" prop="storeFloorPlan" label="平面图" />
          <el-table-column v-if="false" prop="createBy" label="创建者" />
          <el-table-column v-if="false" prop="updateBy" label="更新者" />
          <el-table-column v-if="false" prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPer(['admin','storeHouse:edit','storeHouse:del'])"
            fixed="right"
            label="操作"
            width="120px"
            align="center"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination />
      </el-row>
      <!--分页组件-->
      <el-row :gutter="32">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>仓库货架详情</span>
            <el-button
              v-if="this.$refs.storeShelf && this.$refs.storeShelf.query.houseId"
              plain
              class="filter-item"
              size="mini"
              style="float: left;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.storeShelf && $refs.storeShelf.crud.toAdd()"
            >新增</el-button>
          </div>
          <storeShelf ref="storeShelf" :permission="permission" />
        </el-card>
      </el-row>

      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="true"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="仓库编号">
            <el-input v-model="form.storeCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="form.storeName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="form.storeAddress" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库管理员">
            <el-input v-model="form.storeAdmin" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库面积">
            <el-input v-model="form.storeSquare" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库温度">
            <el-input v-model="form.storeTemperature" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库湿度">
            <el-input v-model="form.storeMoisture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="照片">
            <el-input v-model="form.storePhoto" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="平面图">
            <el-input v-model="form.storeFloorPlan" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

import storeShelf from './storeShelf'
import crudStoreHouse from '@/api/elstore/storeHouse'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation.vue'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  storeCode: null,
  storeName: null,
  storeAddress: null,
  storeAdmin: null,
  storeSquare: null,
  storeTemperature: null,
  storeMoisture: null,
  storePhoto: null,
  storeFloorPlan: null,
  createBy: null,
  updateBy: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'StoreHouse',
  components: { pagination, crudOperation, rrOperation, udOperation, storeShelf },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'AppStoreHouse',
      url: 'api/storeHouse',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudStoreHouse }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeHouse:add'],
        edit: ['admin', 'storeHouse:edit'],
        del: ['admin', 'storeHouse:del']
      },
      rules: {
        id: [
          {
            required: true,
            message: '主键不能为空',
            trigger: 'blur'
          }
        ]
      },
      showDrawer: false
    }
  },
  created() {
    // this.showDrawer = true
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.storeShelf) {
        this.$refs.storeShelf.query.houseId = ''
      }
      return true
    },
    showStoreShelf(data) {
      if (data && data.id && this.$refs.storeShelf) {
        this.$refs.storeShelf.query.houseId = data.id
        this.$refs.storeShelf.houseId = data.id
        this.$refs.storeShelf.storeName = data.storeName
        this.$refs.storeShelf.crud.toQuery()
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
  .el-drawer {
    margin-top: 80px;
  }
</style>
