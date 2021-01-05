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
      <crudOperation :permission="permission" :hidden-columns="hiddenColumns" />

      <!--出库操作表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="goodsOutHouseDialogFlag"
        :title="goodsOutHouseDialogTitle"
        width="500px"
      >
        <el-form ref="outHouseForm" :model="form" :rules="rulesOutHouseForm" size="small" label-width="80px">
          <el-form-item v-if="true" label="当前物品存放位置">
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
          <el-form-item v-if="true" label="出库时间">
            <el-date-picker
              v-model="form.storeTimeOut"
              style="width: 370px;"
              type="datetime"
              placeholder="选择出库时间"
            />
          </el-form-item>
          <el-form-item v-if="true" label="出库人" prop="storeByOut">
            <el-input v-model="form.storeByOut" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="goodsOutHouseDialogFlag = false">取消</el-button>
          <el-button :loading="goodsOutHouseLoading" type="primary" @click="doGoodsOutHouse">出库</el-button>
        </div>
      </el-dialog>
      <!--入库操作表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="goodsInHouseDialogFlag"
        :title="goodsInHouseDialogTitle"
        width="500px"
      >
        <el-form ref="inHouseForm" :model="form" :rules="rulesInHouseForm" size="small" label-width="80px">
          <el-form-item v-if="true" label="存放位置" prop="storeHouseId">
            <el-cascader
              v-model="storeHouseAndShelfIds"
              :options="storeHouseAndShelf"
              style="width: 370px;"
              placeholder="请选择存放位置"
              clearable
              @change="selectStoreHouseAndSelf"
            />
          </el-form-item>
          <el-form-item v-if="false" label="仓库编号" prop="storeHouseId">
            <el-input v-model="form.storeHouseId" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="货架编号" prop="storeShelfId">
            <el-input v-model="form.storeShelfId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="入库时间" prop="storeTimeIn">
            <el-date-picker
              v-model="form.storeTimeIn"
              style="width: 370px;"
              type="datetime"
              placeholder="选择入库时间默认当前时间"
            />
          </el-form-item>
          <el-form-item v-if="true" label="入库人" prop="storeByIn">
            <el-input v-model="form.storeByIn" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="goodsInHouseDialogFlag = false">取消</el-button>
          <el-button :loading="goodsInHouseLoading" type="primary" @click="doGoodsInHouse">入库</el-button>
        </div>
      </el-dialog>
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
          <el-form-item v-if="false" label="物品状态">
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

          <el-form-item v-if="false" label="存放位置">
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
            stripe="stripe"
            highlight-current-row="highlight-current-row"
            @selection-change="crud.selectionChangeHandler"
            @row-click="queryGoodsInfo"
            @sort-change="crud.changeSortHandler"
          >
            <el-table-column type="selection" width="55" fixed="left" />
            <el-table-column type="index" width="50" fixed="left" label="序号" />
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
            <el-table-column prop="goodsTemplateId" label="物品类型" sortable="custom" width="100px">
              <template slot-scope="scope">
                <span>
                  {{ getTemplateNameById(scope.row.goodsTemplateId, scope) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="goodsCode" label="物品代码" sortable="custom" />
            <el-table-column prop="goodsName" label="物品名称" sortable="custom" width="150px" />
            <el-table-column prop="goodsBrand" label="品牌" sortable="custom" width="80px" />
            <el-table-column prop="goodsModel" label="型号" sortable="custom" width="80px" />

            <el-table-column prop="goodsStatus" label="物品状态" sortable="custom" width="80px">
              <template slot-scope="scope">
                <span>
                  <el-tag
                    :type="(scope.row.goodsStatus === '0' || scope.row.goodsStatus === '2') ? 'warning' : 'success'"
                    disable-transitions
                  >{{ getDictLabel(scope.row.goodsStatus,'APP_STORE_GOODS_STATUS',scope) }}</el-tag>
                </span>
              </template>
            </el-table-column>
            <!-- 自定义的一些列 -->
            <el-table-column v-if="true" label="存放位置">
              <template slot-scope="scope">
                <span>{{ getHouseAndShelfName(scope.row.storeHouseId, scope.row.storeShelfId) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="true" label="最后操作时间" width="150px">
              <template slot-scope="scope">
                <span>{{ getLastModifyTime(scope.row.goodsStatus, scope.row.storeTimeIn, scope.row.storeTimeOut) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="true" label="最后操作人" width="100px">
              <template slot-scope="scope">
                <span>{{ getLastModifyUser(scope.row.goodsStatus, scope.row.storeByIn, scope.row.storeByOut) }}</span>
              </template>
            </el-table-column>
            <!-- 原来的表的列 -->
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
            <el-table-column v-if="checkPer(['admin','storeGoods:edit','storeGoods:del'])" label="操作" width="150px" align="center" fixed="right">
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
        <el-col v-if="currentRowData != null" :span="8" style="padding-left: 10px">
          <el-collapse v-if="false" accordion>
            <el-collapse-item :title="goodsDetailTitle" />
            <el-collapse-item :title="goodsFileTitle" />
            <el-collapse-item :title="goodsHistoryTitle" />
          </el-collapse>

          <el-tabs type="card">
            <el-tab-pane :label="goodsDetailTitle">
              <goodsDetail
                ref="goodsDetail"
                :permission="permission"
                :init-goods-detail-value-func="initGoodsDetailValue"
              />
            </el-tab-pane>
            <el-tab-pane :label="goodsFileTitle">
              <!-- 文件列表和上传控件 -->
              <el-upload
                ref="upload"
                class="upload-demo"
                multiple="multiple"
                name="file"
                :data="{ id: currentRowData === null ? '' : currentRowData.id }"
                with-credentials="with-credentials"
                :headers="uploadHeader()"
                show-file-list="show-file-list"
                :action="uploadUrl()"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="fileList"
                list-type="text"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary">选文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">上传文件大小控制在5MB以内</div>
              </el-upload>

            </el-tab-pane>
            <el-tab-pane label="出入库记录">
              <el-row>
                <p style="text-align: center; margin: 0 0 20px">
                  {{ currentRowData?currentRowData.goodsName:'' }}出入库历史记录
                  <el-button
                    v-if="currentRowData != null && (currentRowData.goodsStatus === '1') "
                    type="primary"
                    plain
                    @click="goodsOutHouse"
                  >
                    <i class="el-icon-arrow-up" />出库
                  </el-button>
                  <el-button
                    v-if="currentRowData != null && (currentRowData.goodsStatus === '0' || currentRowData.goodsStatus === '2') "
                    type="success"
                    plain
                    @click="goodsInHouse"
                  >
                    <i class="el-icon-arrow-down" />入库
                  </el-button>
                </p>
              </el-row>
              <el-row>
                <goodsLog
                  ref="goodsLog"
                  :permission="permission"
                />
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

      <el-dialog
        :title="previewImgTitle"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >

        <el-image
          :src="previewImgUrl"
          fit="contain"
          lazy
        >
          <div slot="error">
            <i class="el-icon-document" />
          </div>
        </el-image>
        <span slot="footer" class="dialog-footer">
          <a
            slot="reference"
            :href="previewImgUrl"
            class="el-link--primary"
            style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
            target="_blank"
          >下载文件</a>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { del as deleteGoodsFile, queryByGoodsId } from '@/api/elstore/storeGoodsFile.js'
import { optionData } from '@/api/elstore/storeTemplate.js'
import { getStoreHouseAndShelfTreeData } from '@/api/elstore/storeHouse.js'
import goodsDetail from './goodsDetail.vue'
import goodsLog from './goodsLog.vue'
import crudStoreGoods from '@/api/elstore/storeGoods.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { parseTime } from '../../../utils'

const defaultForm = { id: null, goodsCode: null, goodsName: null, goodsBrand: null, goodsModel: null, goodsStatus: null, goodsTemplateId: null, storeHouseId: null, storeShelfId: null, storeTimeIn: null, storeTimeOut: null, storeByIn: null, storeByOut: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoods',
  components: { pagination, crudOperation, rrOperation, udOperation, goodsDetail, goodsLog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '物品信息',
      url: 'api/storeGoods',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudStoreGoods }})
  },
  dicts: ['APP_STORE_PROPERTY_TYPE', 'APP_STORE_GOODS_STATUS', 'APP_STORE_INOUT_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'storeGoods:add'],
        edit: ['admin', 'storeGoods:edit'],
        del: ['admin', 'storeGoods:del']
      },
      hiddenColumns: ['goodsCode', 'goodsModel'],
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      },
      rulesInHouseForm: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ],
        storeHouseId: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ],
        storeShelfId: [
          { required: true, message: '货架不能为空', trigger: 'blur' }
        ],
        storeByIn: [
          { required: true, message: '入库人不能为空', trigger: 'blur' }
        ]
      },
      rulesOutHouseForm: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ],
        storeByOut: [
          { required: true, message: '出库人不能为空', trigger: 'blur' }
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
      currentRowData: null,
      storeTemplateData: [],
      storeHouseAndShelfIds: [],
      storeHouseAndShelf: [],
      fileList: [{
        id: '1',
        name: 'food.jpeg111',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        id: '2',
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      centerDialogVisible: false,
      previewImgUrl: '',
      previewImgTitle: '图片预览',
      goodsFileTitle: '附件信息',
      goodsHistoryTitle: '出入库记录',
      goodsDetailTitle: '详细信息',
      goodsOutHouseDialogTitle: '物品出库',
      goodsOutHouseDialogFlag: false,
      goodsOutHouseLoading: false,
      goodsInHouseDialogTitle: '物品入库',
      goodsInHouseDialogFlag: false,
      goodsInHouseLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  mounted() {

  },
  created() {
    this.loadStoreHouseAndShelfData()
    this.loadStoreTemplateOptionData()
  },
  methods: {
    getHouseAndShelfName(houseId, shelfId) {
      let houseName = houseId
      for (let i = 0; i < this.storeHouseAndShelf.length; i++) {
        const houseInfo = this.storeHouseAndShelf[i]
        if (houseInfo.id === houseId) {
          houseName = houseInfo.label
        }
      }
      return houseName
    },
    getLastModifyTime(goodsStatus, storeTimeIn, storeTimeOut) {
      return (goodsStatus === '0' || goodsStatus === '1') ? parseTime(storeTimeIn) : parseTime(storeTimeOut)
    },
    getLastModifyUser(goodsStatus, storeByIn, storeByOut) {
      return (goodsStatus === '0' || goodsStatus === '1') ? (storeByIn) : (storeByOut)
    },
    uploadHeader() {
      return { 'Authorization': getToken() }
    },
    uploadUrl() {
      return this.$store.getters.baseApi + '/api/storeGoods/upload'
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      const _this = this
      if (file && file.id) {
        deleteGoodsFile([file.id]).then(res => {
          _this.queryGoodsFile()
        })
      }
    },
    handleSuccess(response, file, fileList) {
      this.queryGoodsFile()
    },
    handlePreview(file) {
      this.centerDialogVisible = true
      this.previewImgUrl = file.url
      this.previewImgTitle = file.name
      console.log(file)
    },
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
    [CRUD.HOOK.afterRefresh]() {
      this.currentRowData = null
    },
    queryGoodsLog() {
      if (this.currentRowData && this.currentRowData.id && this.$refs.goodsLog) {
        this.$refs.goodsLog.query.goodsId = this.currentRowData.id
        this.$refs.goodsLog.goodsId = this.currentRowData.id
        this.$refs.goodsLog.goodsName = this.currentRowData.goodsName
        this.$refs.goodsLog.crud.toQuery()
      }
    },
    queryGoodsDetail() {
      if (this.currentRowData && this.currentRowData.id && this.$refs.goodsDetail) {
        this.$refs.goodsDetail.query.goodsId = this.currentRowData.id
        this.$refs.goodsDetail.goodsId = this.currentRowData.id
        this.$refs.goodsDetail.goodsName = this.currentRowData.goodsName
        this.$refs.goodsDetail.crud.toQuery()
      }
    },
    queryGoodsFile() {
      const _this = this
      // 加载附件请求
      this.fileList = []
      queryByGoodsId({ goodsId: this.currentRowData.id }).then(res => {
        if (res && res.totalElements > 0) {
          this.goodsFileTitle = '附件信息(' + res.totalElements + ')'
          res.content.forEach(function(data, index) {
            data['name'] = data.originalFileName
            data['url'] = _this.$store.getters.baseApi + '/file/物品附件/' + data.fileName
          })
          this.fileList = res.content
        } else {
          this.goodsFileTitle = '附件信息(无)'
        }
      })
    },
    queryGoodsInfo(data) {
      this.form.id = data.id
      this.currentRowData = data
      // 查询物品的一些信息
      if (this.currentRowData) {
        this.queryGoodsDetail()
        this.queryGoodsFile()
        this.queryGoodsLog()
      }
    },
    // 商品入库
    doGoodsInHouse() {
      const _this = this
      this.$refs['inHouseForm'].validate((valid) => {
        if (valid) {
          _this.goodsInHouseLoading = true
          crudStoreGoods.doGoodsInHouse(this.form).then(res => {
            _this.goodsInHouseLoading = false
            _this.crud.refresh()
            _this.crud.notify('物品入库操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          })
        } else {
          return false
        }
      })
    },
    // 商品出库
    doGoodsOutHouse() {
      const _this = this
      this.$refs['outHouseForm'].validate((valid) => {
        if (valid) {
          _this.goodsOutHouseLoading = true
          crudStoreGoods.doGoodsOutHouse(this.form).then(res => {
            _this.goodsOutHouseLoading = false
            _this.crud.refresh()
            _this.crud.notify('物品出库操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          })
        } else {
          return false
        }
      })
    },
    // 商品入库
    goodsInHouse() {
      this.goodsInHouseDialogFlag = true
    },
    // 商品出库
    goodsOutHouse() {
      this.goodsOutHouseDialogFlag = true
    },
    initGoodsDetailValue() {
      const _this = this
      if (!this.currentRowData) {
        this.$notify({
          title: '请选择一个物品',
          type: 'error',
          duration: 1000
        })
        return
      }
      this.$confirm(`该操作初始化当前物品所有的属性信息吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudStoreGoods.initGoodsDetail(_this.currentRowData.id).then(res => {
          _this.queryGoodsDetail()
        })
      }).catch(() => {

      })
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
  /deep/ .el-table__row {
    cursor: pointer;
  }
  .java.hljs {
    color: #444444;
    background: #ffffff !important;
    height: 630px !important;
  }
</style>
