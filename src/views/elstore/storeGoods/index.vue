<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">物品代码</label>
        <el-input v-model="query.goodsCode" clearable placeholder="物品代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品名称</label>
        <el-input v-model="query.goodsName" clearable placeholder="物品名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品状态</label>
        <el-input v-model="query.goodsStatus" clearable placeholder="物品状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">物品模板id</label>
        <el-input v-model="query.goodsTemplateId" clearable placeholder="物品模板id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">仓库编号</label>
        <el-input v-model="query.storeHouseId" clearable placeholder="仓库编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货架编号</label>
        <el-input v-model="query.storeShelfId" clearable placeholder="货架编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">入库时间</label>
        <el-input v-model="query.storeTimeIn" clearable placeholder="入库时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">出库时间</label>
        <el-input v-model="query.storeTimeOut" clearable placeholder="出库时间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">入库人</label>
        <el-input v-model="query.storeByIn" clearable placeholder="入库人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">出库人</label>
        <el-input v-model="query.storeByOut" clearable placeholder="出库人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="物品代码">
            <el-input v-model="form.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品名称">
            <el-input v-model="form.goodsName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品状态">
            <el-input v-model="form.goodsStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型模板">
            <el-input v-model="form.goodsTemplateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="存放位置">
            <el-cascader :options="storeHouseAndShelf" style="width: 370px;" placeholder="请选择存放位置" />
          </el-form-item>
          <el-form-item v-if="false" label="仓库编号">
            <el-input v-model="form.storeHouseId" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="货架编号">
            <el-input v-model="form.storeShelfId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="form.storeTimeIn"
              style="width: 370px;"
              type="datetime"
              placeholder="选择入库时间"
            />
          </el-form-item>
          <el-form-item label="出库时间">
            <el-date-picker
              v-model="form.storeTimeOut"
              style="width: 370px;"
              type="datetime"
              placeholder="选择出库时间"
            />
          </el-form-item>
          <el-form-item label="入库人">
            <el-input v-model="form.storeByIn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="出库人">
            <el-input v-model="form.storeByOut" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <el-row>
        <el-col :span="18">
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
            @current-change="showGoodsDetail"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

                  <el-form-item label="物品代码">
                    <span>{{ props.row.goodsCode }}</span>
                  </el-form-item>
                  <el-form-item label="物品名称">
                    <span>{{ props.row.goodsName }}</span>
                  </el-form-item>
                  <el-form-item label="物品状态">
                    <span>{{ props.row.goodsStatus }}</span>
                  </el-form-item>
                  <el-form-item label="物品模板id">
                    <span>{{ props.row.goodsTemplateId }}</span>
                  </el-form-item>
                  <el-form-item label="仓库编号">
                    <span>{{ props.row.storeHouseId }}</span>
                  </el-form-item>
                  <el-form-item label="货架编号">
                    <span>{{ props.row.storeShelfId }}</span>
                  </el-form-item>
                  <el-form-item label="入库时间">
                    <span>{{ parseTime(props.row.storeTimeIn) }}</span>
                  </el-form-item>
                  <el-form-item label="出库时间">
                    <span>{{ parseTime(props.row.storeTimeOut) }}</span>
                  </el-form-item>
                  <el-form-item label="入库人">
                    <span>{{ props.row.storeByIn }}</span>
                  </el-form-item>
                  <el-form-item label="出库人">
                    <span>{{ props.row.storeByOut }}</span>
                  </el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="goodsCode" label="物品代码" />
            <el-table-column prop="goodsName" label="物品名称" />
            <el-table-column prop="goodsStatus" label="物品状态" />
            <el-table-column v-if="false" prop="goodsTemplateId" label="物品模板id" />
            <el-table-column v-if="false" prop="storeHouseId" label="仓库编号" />
            <el-table-column v-if="false" prop="storeShelfId" label="货架编号" />
            <el-table-column prop="storeTimeIn" label="入库时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.storeTimeIn) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeTimeOut" label="出库时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.storeTimeOut) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeByIn" label="入库人" />
            <el-table-column prop="storeByOut" label="出库人" />
            <el-table-column v-permission="['admin','storeGoods:edit','storeGoods:del']" label="操作" width="150px" align="center" fixed="right">
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
        </el-col>
        <el-col :span="6">
          <goodsDetail ref="goodsDetail" :permission="permission" />
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import goodsDetail from './goodsDetail'
import crudStoreGoods from '@/api/elstore/storeGoods.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, goodsCode: null, goodsName: null, goodsStatus: null, goodsTemplateId: null, storeHouseId: null, storeShelfId: null, storeTimeIn: null, storeTimeOut: null, storeByIn: null, storeByOut: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoods',
  components: { pagination, crudOperation, rrOperation, udOperation, goodsDetail },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'StoreGoods', url: 'api/storeGoods', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreGoods }})
  },
  dicts: ['APP_STORE_PROPERTY_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'storeGoods:add'],
        edit: ['admin', 'storeGoods:edit'],
        del: ['admin', 'storeGoods:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsCode', display_name: '物品代码' },
        { key: 'goodsName', display_name: '物品名称' },
        { key: 'goodsStatus', display_name: '物品状态' },
        { key: 'goodsTemplateId', display_name: '物品模板id' },
        { key: 'storeHouseId', display_name: '仓库编号' },
        { key: 'storeShelfId', display_name: '货架编号' },
        { key: 'storeTimeIn', display_name: '入库时间' },
        { key: 'storeTimeOut', display_name: '出库时间' },
        { key: 'storeByIn', display_name: '入库人' },
        { key: 'storeByOut', display_name: '出库人' }
      ],
      storeHouseAndShelf: [{
        value: 'zhinan',
        label: '指南',
        disabled: false,
        children: [{
          value: 'shejiyuanze',
          label: '设计原则'
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'data',
          label: 'Data'
        }, {
          value: 'notice',
          label: 'Notice'
        }, {
          value: 'navigation',
          label: 'Navigation'
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    showGoodsDetail(data) {
      if (data && data.id && this.$refs.goodsDetail) {
        this.$refs.goodsDetail.query.goodsId = data.id
        this.$refs.goodsDetail.goodsId = data.id
        this.$refs.goodsDetail.goodsName = data.goodsName
        this.$refs.goodsDetail.crud.toQuery()
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
