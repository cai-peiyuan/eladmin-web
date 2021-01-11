<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-row :gutter="40" class="panel-group" style="padding: 5px 10px 10px 25px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础模板" name="first">
            <div class="tab-temp-main">
              <div v-for="item in crud.data" :key="item.id" class="temp-item" @click="clickStyleTempalte(item)" @mouseover="hoverStyleTempalte(item)">
                <div
                  class="temp-img"
                  :style="styleImgUrl(item)"
                />
                <div class="temp-info">
                  <div class="temp-name">{{ item.styleTemplateName }}</div>
                  <a class="temp-use">{{ item.styleTemplateRemark }}</a>
                  <a class="temp-use-senior">
                    <i class="iconfont-mapstyle icon-lock" />
                  </a>
                </div>
              </div>

              <div class="temp-item" @click="crud.toAdd">
                <div
                  class="temp-img"
                  style="text-align: center;"
                >
                  <svg-icon
                    icon-class="add"
                    style="width: 3em;height: 3em;margin-top: 40px"
                  />
                </div>
                <div class="temp-info">
                  <div class="temp-name">添加样式</div>
                </div>
              </div>

            </div>
          </el-tab-pane>
          <el-tab-pane label="高级模板" name="second">

            <div class="tab-temp-main">

              <div v-for="item in crud.data" :key="item.id" class="temp-item" @click="clickStyleTempalte(item)">
                <div
                  class="temp-img"
                  :style="styleImgUrl(item)"
                />
                <div class="temp-info">
                  <div class="temp-name">{{ item.styleTemplateName }}</div>
                  <a class="temp-use">{{ item.styleTemplateRemark }}</a>
                  <a class="temp-use-senior">
                    <i class="iconfont-mapstyle icon-lock" />
                  </a>
                </div>
              </div>

              <div class="temp-item" @click="crud.toAdd">
                <div
                  class="temp-img"
                  style="text-align: center;"
                >
                  <svg-icon
                    icon-class="add"
                    style="width: 3em;height: 3em;margin-top: 40px"
                  />
                </div>
                <div class="temp-info">
                  <div class="temp-name">添加样式</div>
                </div>
              </div>

            </div>

          </el-tab-pane>
        </el-tabs>
      </el-row>

      <el-row v-if="currentEditRowData.id" :gutter="40" class="panel-group" style="padding: 5px 10px 10px 25px">
        <div class="demo-table-expand" style="padding-left: 40px">
          <ul class="detail-info">

            <li>
              <div class="detail-title">缩略图</div>
              <div class="">
                <img
                  :src="currentEditRowData.styleTemplateImgBase64"
                  width="200"
                  height="200"
                  class="head_pic"
                  style="cursor: pointer;"
                  @click="uploadThumbnail"
                >
                <myUpload
                  v-model="show"
                  field="thumbnail"
                  :params="currentEditRowData"
                  :headers="headers"
                  :url="getUploadThumbnailUrl()"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </li>

            <li><div class="detail-title">样式id</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateId }}
                <el-button type="primary" plain>
                  <router-link :to="'/msp/resource/mapStyleTemplate/view/'+ currentEditRowData.styleTemplateId">
                    预览样式
                  </router-link>
                </el-button>
              </div>
            </li>

            <li><div class="detail-title">样式类型</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateType }}</div></li>
            <li><div class="detail-title">样式名称</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateName }}</div></li>
            <li><div class="detail-title">样式描述</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateRemark }}</div></li>
            <li><div class="detail-title">样式Json内容</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateContent }}</div></li>
            <li><div class="detail-title">样式级别</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateZoom }}</div></li>
            <li><div class="detail-title">样式中心点</div>
              <div class="detail-value">{{ currentEditRowData.styleTemplateCenter }}</div></li>
            <li v-if="checkPer(['admin','mapStyleTemplate:edit','mapStyleTemplate:del'])" label="设计样式" width="150px" align="center" fixed="right">
              <el-button type="primary" plain @click="editStyleJson(currentEditRowData)">编辑Json</el-button>
              <el-button type="primary" plain>
                <router-link :to="'/msp/resource/mapStyleTemplate/edit/'+ currentEditRowData.styleTemplateId">
                  在线设计
                </router-link>
              </el-button>
              <el-button type="warning" plain @click="crud.toEdit(currentEditRowData)">修改信息</el-button>
              <el-button type="danger" plain @click="toDelete(currentEditRowData)">删除样式</el-button>
            </li>
          </ul>
        </div>
      </el-row>

      <!-- 样式Json内容编辑窗口 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="vueJsonEditorDialog"
        :title="'【' + currentEditRowData.styleTemplateName + '】样式内容编辑'"
        width="900px"
        center
        height="700px"
      >
        <vue-json-editor
          v-model="styleTemplateContent"
          :mode="'code'"
          lang="zh"
          style="height: 600px;"
        />
        <div style="margin: 0 auto;text-align: center;">
          <el-button type="info" plain @click="vueJsonEditorDialog = !vueJsonEditorDialog">取消</el-button>
          <el-button type="primary" plain @click="saveJsonContent">保存</el-button>
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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="样式id" prop="styleTemplateId">
            <el-input v-model="form.styleTemplateId" style="width: 300px;" />
            <el-button v-if="form.id === '' || form.id === null" type="primary" plain @click="generateAccessToken">生成</el-button>
          </el-form-item>
          <el-form-item label="样式类型" prop="styleTemplateType">
            <el-select v-model="form.styleTemplateType" size="small" placeholder="样式类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_STYLE_TEMPLATE_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="样式名称" prop="styleTemplateName">
            <el-input v-model="form.styleTemplateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式描述" prop="styleTemplateRemark">
            <el-input v-model="form.styleTemplateRemark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="样式JSOn内容" prop="styleTemplateContent">
            <el-input v-model="form.styleTemplateContent" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="缩略图" prop="styleTemplateThumbnail">
            <el-input v-model="form.styleTemplateThumbnail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式级别" prop="styleTemplateZoom">
            <el-input-number v-model="form.styleTemplateZoom" style="width: 370px;" :min="1" :max="22" :step="1" />
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
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import crudMapStyleTemplate from '@/api/msp/mapStyleTemplate.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import vueJsonEditor from 'vue-json-editor'
import { uuid } from 'vue-uuid'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

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
  components: { vueJsonEditor, myUpload },
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
  // 数据字典
  el_dicts: ['', ''],
  dicts: ['', 'MSP_RESOURCE_STYLE_TEMPLATE_TYPE'],
  data() {
    return {
      uploadThumbnailUrl: 'api/mapStyleTemplate/uploadThumbnail',
      show: false,
      uploadParams: {
        'Authorization': getToken()
      },
      headers: {
        'Authorization': getToken()
      },
      vueJsonEditorDialog: false,
      currentEditRowData: {},
      styleTemplateContent: {},
      activeName: 'first',
      permission: {
        add: ['admin', 'mapStyleTemplate:add'],
        edit: ['admin', 'mapStyleTemplate:edit'],
        del: ['admin', 'mapStyleTemplate:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'styleTemplateContent', 'styleTemplateZoom', 'styleTemplateThumbnail'],
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
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      console.log(this.query.styleTemplateType)
      if (this.query.styleTemplateType === undefined || this.query.styleTemplateType === null) {
        this.query.styleTemplateType = '1'
      }
      this.currentEditRowData = {}
      return true
    },
    cropUploadSuccess(jsonData, field) {
      this.currentEditRowData.styleTemplateImgBase64 = (jsonData)
      console.log(field)
      this.show = !this.show
    },
    generateAccessToken() {
      this.crud.form.styleTemplateId = uuid.v4().replace(/-/g, '')
    },
    toDelete(item) {
      this.$confirm(`确定删除样式?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        crudMapStyleTemplate.del([item.id]).then(res => {
          this.crud.delAllLoading = false
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        }).catch(err => {
          this.crud.delAllLoading = false
          console.log(err.response.data.message)
        })
      }).catch(() => {
      })
    },
    clickStyleTempalte(item) {
      this.currentEditRowData = item
      // this.crud.toEdit(item)
    },
    hoverStyleTempalte(item) {
    },
    handleClick(tab, event) {
      console.log(tab, event)
      if (tab.name === 'first') {
        this.query.styleTemplateType = '1'
      } else {
        this.query.styleTemplateType = '0'
      }
      this.crud.toQuery()
    },
    saveJsonContent() {
      console.log(this.styleTemplateContent)
      crudMapStyleTemplate.updateStyleTemplate({
        id: this.currentEditRowData.id,
        styleTemplateContent: this.styleTemplateContent
      }).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.vueJsonEditorDialog = false
      }).catch(error => {
        this.$message({
          message: '更新失败' + error,
          type: 'warning'
        })
      })
    },
    editStyleJson(rowData) {
      this.styleTemplateContent = {
        msg: 'loading'
      }
      this.currentEditRowData = rowData
      this.vueJsonEditorDialog = true
      const _this = this
      crudMapStyleTemplate.getStyleTemplateByStyleId(rowData.styleTemplateId).then(res => {
        console.log(_this.styleTemplateContent)
        if (res.styleTemplateContent != null) {
          // eslint-disable-next-line no-eval eval('(' + res.styleTemplateContent + ')')
          _this.styleTemplateContent = JSON.parse(res.styleTemplateContent)
        }
      })
    },
    uploadThumbnail() {
      this.show = !this.show
    },
    getUploadThumbnailUrl() {
      return this.$store.getters.baseApi + '/api/mapStyleTemplate/uploadThumbnail'
    },
    /**
     * 获取样式预览图
     * @param styleTemplateId
     * @returns {string}
     */
    styleImgUrl(styleTemplate) {
      return "background: url('" + styleTemplate.styleTemplateImgBase64 + "') center center / 165px 160px no-repeat;"
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
      border-bottom: 1px solid #b8deea;
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
  /* jsoneditor右上角默认有一个链接,加css去掉了 */
  ::v-deep .jsoneditor-poweredBy{
     display: none;
  }
  ::v-deep .jsoneditor-vue{
     min-height: 550px;
  }
  ::v-deep .jsoneditor{
     min-height: 550px;
  }
  ::v-deep .jsoneditor-outer{
     min-height: 550px;
  }
  ::v-deep .ace-jsoneditor{
     min-height: 550px;
  }
</style>
