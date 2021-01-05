<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">物品id</label>
        <el-input v-model="query.goodsId" clearable placeholder="物品id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板编号</label>
        <el-input v-model="query.goodsTemplateId" clearable placeholder="物品模板编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性序号</label>
        <el-input v-model="query.propertySeq" clearable placeholder="属性序号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性编码</label>
        <el-input v-model="query.propertyCode" clearable placeholder="属性编码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性描述</label>
        <el-input v-model="query.propertyDesc" clearable placeholder="属性描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">属性值</label>
        <el-input v-model="query.propertyValue" clearable placeholder="属性值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="物品id">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品模板编号">
            <el-input v-model="form.goodsTemplateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性序号">
            <el-input v-model="form.propertySeq" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性编码">
            <el-input v-model="form.propertyCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性描述">
            <el-input v-model="form.propertyDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性值">
            <el-input v-model="form.propertyValue" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

              <el-form-item label="物品id">
                <span>{{ props.row.goodsId }}</span>
              </el-form-item>
              <el-form-item label="物品模板编号">
                <span>{{ props.row.goodsTemplateId }}</span>
              </el-form-item>
              <el-form-item label="属性序号">
                <span>{{ props.row.propertySeq }}</span>
              </el-form-item>
              <el-form-item label="属性编码">
                <span>{{ props.row.propertyCode }}</span>
              </el-form-item>
              <el-form-item label="属性描述">
                <span>{{ props.row.propertyDesc }}</span>
              </el-form-item>
              <el-form-item label="属性值">
                <span>{{ props.row.propertyValue }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="goodsId" label="物品id" />
        <el-table-column prop="goodsTemplateId" label="物品模板编号" />
        <el-table-column prop="propertySeq" label="属性序号" />
        <el-table-column prop="propertyCode" label="属性编码" />
        <el-table-column prop="propertyDesc" label="属性描述" />
        <el-table-column prop="propertyValue" label="属性值" />
        <el-table-column v-if="checkPer(['admin','storeGoodsDetail:edit','storeGoodsDetail:del'])" label="操作" width="150px" align="center">
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
import crudStoreGoodsDetail from '@/api/elstore/storeGoodsDetail.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, goodsId: null, goodsTemplateId: null, propertySeq: null, propertyCode: null, propertyDesc: null, propertyValue: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoodsDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreGoodsDetail', url: 'api/storeGoodsDetail', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreGoodsDetail }})
  },
  data() {
    return {
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
  /deep/ .el-dialog__body {
    padding: 0 20px 10px 20px !important;
  }
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
</style>
