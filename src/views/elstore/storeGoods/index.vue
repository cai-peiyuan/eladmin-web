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
        <label class="el-form-item-label">物品类型id</label>
        <el-input v-model="query.goodsTemplateId" clearable placeholder="物品类型id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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

          <el-form-item label="物品类型">
            <el-input v-if="false" v-model="form.goodsTemplateId" style="width: 370px;" />
            <el-select v-model="form.goodsTemplateId" style="width: 370px;" clearable>
              <el-option
                v-for="item in storeTemplateData"
                :key="item.id"
                :label="item.templateName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="物品代码">
            <el-input v-model="form.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品名称">
            <el-input v-model="form.goodsName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="form.goodsBrand" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="form.goodsModel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品状态">
            <el-input v-if="false" v-model="form.goodsStatus" style="width: 370px;" />
            <el-select
              v-model="form.goodsStatus"
              style="width: 370px"
              placeholder="请选择物品状态"
            >
              <el-option
                v-for="item in dict.APP_STORE_GOODS_STATUS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="存放位置">
            <el-cascader
              v-model="storeHouseAndShelfIds"
              :options="storeHouseAndShelf"
              style="width: 370px;"
              placeholder="请选择存放位置"
              clearable
              @change="selectStoreHouseAndSelf"
            />
          </el-form-item>
          <el-form-item v-if="false" label="仓库编号">
            <el-input v-model="form.storeHouseId" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="货架编号">
            <el-input v-model="form.storeShelfId" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="入库时间">
            <el-date-picker
              v-model="form.storeTimeIn"
              style="width: 370px;"
              type="datetime"
              placeholder="选择入库时间"
            />
          </el-form-item>
          <el-form-item v-if="false" label="出库时间">
            <el-date-picker
              v-model="form.storeTimeOut"
              style="width: 370px;"
              type="datetime"
              placeholder="选择出库时间"
            />
          </el-form-item>
          <el-form-item v-if="false" label="入库人">
            <el-input v-model="form.storeByIn" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="出库人">
            <el-input v-model="form.storeByOut" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <el-row style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
        <el-col :span="16">
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
            @current-change="showGoodsDetail"
            @sort-change="crud.changeSortHandler"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column type="index" width="50" fixed="left" />
            <el-table-column v-if="false" type="expand">
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
                  <el-form-item label="物品类型ID">
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
            <el-table-column prop="goodsTemplateId" label="物品类型" sortable="custom">
              <template slot-scope="scope">
                <span>
                  {{ getTemplateNameById(scope.row.goodsTemplateId, scope) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="goodsCode" label="物品代码" sortable="custom" />
            <el-table-column prop="goodsName" label="物品名称" sortable="custom" />
            <el-table-column prop="goodsBrand" label="品牌" sortable="custom" />
            <el-table-column prop="goodsModel" label="型号" sortable="custom" />

            <el-table-column prop="goodsStatus" label="物品状态" sortable="custom">
              <template slot-scope="scope">
                <span>
                  {{ getDictLabel(scope.row.goodsStatus,'APP_STORE_GOODS_STATUS',scope) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column v-if="false" prop="storeHouseId" label="仓库编号" />
            <el-table-column v-if="false" prop="storeShelfId" label="货架编号" />
            <el-table-column v-if="false" prop="storeTimeIn" label="入库时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.storeTimeIn) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="false" prop="storeTimeOut" label="出库时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.storeTimeOut) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="false" prop="storeByIn" label="入库人" />
            <el-table-column v-if="false" prop="storeByOut" label="出库人" />
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
        <!-- 右侧详细信息卡片 -->
        <el-col :span="8">
          <el-tabs type="card">
            <el-tab-pane label="详细信息">
              <goodsDetail ref="goodsDetail" :permission="permission" />
            </el-tab-pane>
            <el-tab-pane label="文件信息" />
            <el-tab-pane label="出入库记录">
              <el-row>
                <p style="text-align: center; margin: 0 0 20px">
                  <el-button type="primary" plain><i class="el-icon-arrow-up" />出库</el-button>
                  <el-button type="success" plain><i class="el-icon-arrow-down" />入库</el-button>
                </p>
              </el-row>
              <el-row>
                <p style="text-align: center; margin: 0 0 20px">
                  出入库历史记录
                </p>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { optionData } from '@/api/elstore/storeTemplate.js'
import { getStoreHouseAndShelfTreeData } from '@/api/elstore/storeHouse.js'
import goodsDetail from './goodsDetail'
import crudStoreGoods from '@/api/elstore/storeGoods.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, goodsCode: null, goodsName: null, goodsBrand: null, goodsModel: null, goodsStatus: null, goodsTemplateId: null, storeHouseId: null, storeShelfId: null, storeTimeIn: null, storeTimeOut: null, storeByIn: null, storeByOut: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoods',
  components: { pagination, crudOperation, rrOperation, udOperation, goodsDetail },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '物品信息', url: 'api/storeGoods', idField: 'id', sort: 'id,desc', crudMethod: { ...crudStoreGoods }})
  },
  dicts: ['APP_STORE_PROPERTY_TYPE', 'APP_STORE_GOODS_STATUS'],
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
        { key: 'goodsTemplateId', display_name: '物品类型id' },
        { key: 'storeHouseId', display_name: '仓库编号' },
        { key: 'storeShelfId', display_name: '货架编号' },
        { key: 'storeTimeIn', display_name: '入库时间' },
        { key: 'storeTimeOut', display_name: '出库时间' },
        { key: 'storeByIn', display_name: '入库人' },
        { key: 'storeByOut', display_name: '出库人' }
      ],
      storeTemplateData: [],
      storeHouseAndShelfIds: [],
      storeHouseAndShelf: []
    }
  },
  mounted() {

  },
  created() {
    this.loadStoreHouseAndShelfData()
    this.loadStoreTemplateOptionData()
  },
  methods: {
    getTemplateNameById(templateId, scope) {
      // console.log(templateId)
      // console.log(scope)
      let retVal = '未知类型'
      this.storeTemplateData.forEach(res => {
        if (res.id === templateId) {
          retVal = res.templateName
        }
      })
      return retVal
    },
    selectStoreHouseAndSelf(param) {
      const houseId = (this.storeHouseAndShelfIds[0])
      const shelfId = (this.storeHouseAndShelfIds[1])
      this.form.storeHouseId = houseId
      this.form.storeShelfId = shelfId
    },
    loadStoreTemplateOptionData() {
      optionData({ a: '' }).then(res => {
        this.storeTemplateData = res
      })
    },
    loadStoreHouseAndShelfData() {
      getStoreHouseAndShelfTreeData({ id: '123' }).then(res => {
        // console.log(res)
        const data = res.content
        this.storeHouseAndShelf = data
      })
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.storeHouseAndShelfIds = [this.form.storeHouseId, this.form.storeShelfId]
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
