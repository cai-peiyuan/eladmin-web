<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="40" class="panel-group" style="padding: 5px 10px 10px 25px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础模板" name="first">
            <div class="tab-temp-main">

              <div v-for="item in crud.data" :key="item.id" class="temp-item ">
                <div
                  class="temp-img"
                  style="background: url(https://lbs.amap.com/dev/config/mapstyle/img/normal.png) center center no-repeat;"
                />
                <div class="temp-info">
                  <div class="temp-name">{{ item.styleTemplateName }}</div>
                  <a class="temp-use">{{ item.styleTemplateRemark }}</a>
                  <a class="temp-use-senior">
                    <i class="iconfont-mapstyle icon-lock" />
                  </a>
                </div>
              </div>

            </div>
          </el-tab-pane>
          <el-tab-pane label="高级模板" name="second" />
        </el-tabs>
      </el-row>
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">样式id</label>
        <el-input v-model="query.styleTemplateId" clearable placeholder="样式id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">样式类型</label>
        <el-input v-model="query.styleTemplateType" clearable placeholder="样式类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">样式名称</label>
        <el-input v-model="query.styleTemplateName" clearable placeholder="样式名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">样式描述</label>
        <el-input v-model="query.styleTemplateRemark" clearable placeholder="样式描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="样式id" prop="styleTemplateId">
            <el-input v-model="form.styleTemplateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式类型" prop="styleTemplateType">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="样式名称" prop="styleTemplateName">
            <el-input v-model="form.styleTemplateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式描述" prop="styleTemplateRemark">
            <el-input v-model="form.styleTemplateRemark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式JSOn内容" prop="styleTemplateContent">
            <el-input v-model="form.styleTemplateContent" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="缩略图" prop="styleTemplateThumbnail">
            <el-input v-model="form.styleTemplateThumbnail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式级别" prop="styleTemplateZoom">
            <el-input v-model="form.styleTemplateZoom" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式中心点" prop="styleTemplateCenter">
            <el-input v-model="form.styleTemplateCenter" style="width: 370px;" />
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="demo-table-expand" style="padding-left: 40px">
              <ul class="detail-info">

                <li><div class="detail-title">样式id</div>
                  <div class="detail-value">{{ props.row.styleTemplateId }}</div></li>
                <li><div class="detail-title">样式类型</div>
                  <div class="detail-value">{{ props.row.styleTemplateType }}</div></li>
                <li><div class="detail-title">样式名称</div>
                  <div class="detail-value">{{ props.row.styleTemplateName }}</div></li>
                <li><div class="detail-title">样式描述</div>
                  <div class="detail-value">{{ props.row.styleTemplateRemark }}</div></li>
                <li><div class="detail-title">样式JSOn内容</div>
                  <div class="detail-value">{{ props.row.styleTemplateContent }}</div></li>
                <li><div class="detail-title">缩略图</div>
                  <div class="detail-value">{{ props.row.styleTemplateThumbnail }}</div></li>
                <li><div class="detail-title">样式级别</div>
                  <div class="detail-value">{{ props.row.styleTemplateZoom }}</div></li>
                <li><div class="detail-title">样式中心点</div>
                  <div class="detail-value">{{ props.row.styleTemplateCenter }}</div></li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="styleTemplateId" label="样式id" />
        <el-table-column prop="styleTemplateType" label="样式类型" />
        <el-table-column prop="styleTemplateName" label="样式名称" />
        <el-table-column prop="styleTemplateRemark" label="样式描述" />
        <el-table-column prop="styleTemplateContent" label="样式JSOn内容" />
        <el-table-column prop="styleTemplateThumbnail" label="缩略图" />
        <el-table-column prop="styleTemplateZoom" label="样式级别" />
        <el-table-column prop="styleTemplateCenter" label="样式中心点" />
        <el-table-column v-if="checkPer(['admin','mapStyleTemplate:edit','mapStyleTemplate:del'])" label="操作" width="150px" align="center" fixed="right">
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
import crudMapStyleTemplate from '@/api/msp/mapStyleTemplate.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  styleTemplateId: null,
  styleTemplateType: null,
  styleTemplateName: null,
  styleTemplateRemark: null,
  styleTemplateContent: null,
  styleTemplateThumbnail: null,
  styleTemplateZoom: null,
  styleTemplateCenter: null,
  createUser: null,
  createTime: null
}
export default {
  name: 'MapStyleTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图样式模板',
      url: 'api/mapStyleTemplate',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapStyleTemplate }
    })
  },
  data() {
    return {
      activeName: 'first',
      permission: {
        add: ['admin', 'mapStyleTemplate:add'],
        edit: ['admin', 'mapStyleTemplate:edit'],
        del: ['admin', 'mapStyleTemplate:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id'],
      rules: {
        styleTemplateId: [
          { required: true, message: '样式id不能为空', trigger: 'blur' }
        ],
        styleTemplateType: [
          { required: true, message: '样式类型不能为空', trigger: 'blur' }
        ],
        styleTemplateName: [
          { required: true, message: '样式名称不能为空', trigger: 'blur' }
        ],
        styleTemplateRemark: [
          { required: true, message: '样式描述不能为空', trigger: 'blur' }
        ],
        styleTemplateZoom: [
          { required: true, message: '样式级别不能为空', trigger: 'blur' }
        ],
        styleTemplateCenter: [
          { required: true, message: '样式中心点不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      console.log(crud)
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
  .temp-item {
    cursor: pointer;
    margin-left: 20px;
    margin-bottom: 20px;
    width: 165px;
    height: 150px;
    position: relative;
  }
  .temp-item .temp-img {
    border-radius: 4px;
    width: 165px;
    height: 150px;
    box-shadow: 0 1px 7px rgba(0,0,0,.2);
  }
  .temp-item .temp-info {
    position: absolute;
    width: 100%;
    height: 61px;
    bottom: 0;
    font-size: 14px;
    color: #535353;
    color: #fff;
    border-radius: 4px;
    background: linear-gradient(-180deg,rgba(51,52,59,0),rgba(12,12,18,.3));
  }
  .temp-item .temp-info .temp-name {
    position: absolute;
    bottom: 6px;
    text-align: center;
    width: 100%;
  }
  .temp-item .temp-info .temp-use, .temp-item .temp-info .temp-use-senior {
    display: none;
  }
  .tab-temp-main {
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-height: 240px;
  }
  .iconfont-mapstyle {
    font-family: iconfont-mapstyle!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
