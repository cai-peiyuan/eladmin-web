<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.shelfName" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货架编号</label>
        <el-input v-model="query.shelfCode" clearable placeholder="货架编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="仓库编号">
            <el-input v-model="form.houseId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架编号">
            <el-input v-model="form.shelfCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架名称">
            <el-input v-model="form.shelfName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架地址">
            <el-input v-model="form.shelfAddress" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架宽度">
            <el-input v-model="form.shelfWidth" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架高度">
            <el-input v-model="form.shelfHeight" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货架层数">
            <el-input v-model="form.shelfFloor" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单层高度">
            <el-input v-model="form.floorHeight" style="width: 370px;" />
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
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

              <el-form-item label="仓库编号">
                <span>{{ props.row.houseId }}</span>
              </el-form-item>
              <el-form-item label="货架编号">
                <span>{{ props.row.shelfCode }}</span>
              </el-form-item>
              <el-form-item label="货架名称">
                <span>{{ props.row.shelfName }}</span>
              </el-form-item>
              <el-form-item label="货架地址">
                <span>{{ props.row.shelfAddress }}</span>
              </el-form-item>
              <el-form-item label="货架宽度">
                <span>{{ props.row.shelfWidth }}</span>
              </el-form-item>
              <el-form-item label="货架高度">
                <span>{{ props.row.shelfHeight }}</span>
              </el-form-item>
              <el-form-item label="货架层数">
                <span>{{ props.row.shelfFloor }}</span>
              </el-form-item>
              <el-form-item label="单层高度">
                <span>{{ props.row.floorHeight }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="houseId" label="仓库编号" />
        <el-table-column prop="shelfCode" label="货架编号" />
        <el-table-column prop="shelfName" label="货架名称" />
        <el-table-column prop="shelfAddress" label="货架地址" />
        <el-table-column prop="shelfWidth" label="货架宽度" />
        <el-table-column prop="shelfHeight" label="货架高度" />
        <el-table-column prop="shelfFloor" label="货架层数" />
        <el-table-column prop="floorHeight" label="单层高度" />
        <el-table-column
          v-if="checkPer(['admin','storeShelf:edit','storeShelf:del'])"
          label="操作"
          width="150px"
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
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudStoreShelf from '@/api/elstore/storeShelf'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  houseId: null,
  shelfCode: null,
  shelfName: null,
  shelfAddress: null,
  shelfWidth: null,
  shelfHeight: null,
  shelfFloor: null,
  floorHeight: null,
  createBy: null,
  updateBy: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'StoreShelf',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'StoreShelf',
      url: 'api/storeShelf',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudStoreShelf }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeShelf:add'],
        edit: ['admin', 'storeShelf:edit'],
        del: ['admin', 'storeShelf:del']
      },
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      }
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
</style>
