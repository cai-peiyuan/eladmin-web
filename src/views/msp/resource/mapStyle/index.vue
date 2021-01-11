<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <styleTemplateList />
      <el-alert :closable="false" title="地图样式" />
      <el-row :gutter="40" class="panel-group" style="padding: 5px 10px 10px 25px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="系统公开样式" name="first">
            <div class="mystyle-box">
              <div class="mystyle-main">
                <div v-for="item in crud.data" :key="item.id" class="maystyle-item">
                  <div class="maystyle-item-img" :style="styleImgUrl(item)" @click="uploadThumbnail(item)" />
                  <div class="maystyle-item-info">
                    <div class="maystyle-item-info-top clearfix">
                      <div class="name">
                        <span class="txt text-overflow">{{ item.styleName }}</span>
                        <span class="edit"><i class="iconfont-mapstyle" />{{ item.styleRemark }}</span>
                      </div>
                      <div class="edit-info">
                        <span class="edit-time">创建用户 {{ item.createUser }}</span>
                        <span class="pub-time">创建时间 {{ item.createTime }}</span>
                      </div>
                    </div>
                    <div class="maystyle-item-info-bottom">
                      <span><i class="iconfont-mapstyle icon-bianjiqianbixieshuru" />编辑</span>
                      <span><i class="iconfont-mapstyle icon-post" />发布</span>
                      <span><i class="iconfont-mapstyle icon-share" />使用与分享</span>
                      <span><i class="iconfont-mapstyle icon-copy" />复制</span>
                      <span><i class="iconfont-mapstyle icon-delete" />删除</span>
                      <span><router-link :to="'/msp/resource/mapStyle/view/'+ item.styleId">预览样式</router-link></span>
                      <span @click="editStyleJson(item)">编辑Json</span>
                      <span><router-link :to="'/msp/resource/mapStyle/edit/'+ item.styleId">在线设计</router-link></span>
                      <span @click="crud.toEdit(item)">修改</span>
                      <span @click="toDelete(item)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我的自定义地图" name="second">
            <div class="mystyle-box">
              <div class="mystyle-main">
                <div v-for="item in crud.data" :key="item.id" class="maystyle-item">
                  <div class="maystyle-item-img" :style="styleImgUrl(item)" @click="uploadThumbnail(item)" />
                  <div class="maystyle-item-info">
                    <div class="maystyle-item-info-top clearfix">
                      <div class="name">
                        <span class="txt text-overflow">{{ item.styleName }}</span>
                        <span class="edit"><i class="iconfont-mapstyle" />{{ item.styleRemark }}</span>
                      </div>
                      <div class="edit-info">
                        <span class="edit-time">创建用户 {{ item.createUser }}</span>
                        <span class="pub-time">创建时间 {{ item.createTime }}</span>
                      </div>
                    </div>
                    <div class="maystyle-item-info-bottom">
                      <span><i class="iconfont-mapstyle icon-bianjiqianbixieshuru" />编辑</span>
                      <span><i class="iconfont-mapstyle icon-post" />发布</span>
                      <span><i class="iconfont-mapstyle icon-share" />使用与分享</span>
                      <span><i class="iconfont-mapstyle icon-copy" />复制</span>
                      <span><i class="iconfont-mapstyle icon-delete" />删除</span>
                      <span><router-link :to="'/msp/resource/mapStyle/view/'+ item.styleId">预览样式</router-link></span>
                      <span @click="editStyleJson(item)">编辑Json</span>
                      <span><router-link :to="'/msp/resource/mapStyle/edit/'+ item.styleId">在线设计</router-link></span>
                      <span @click="crud.toEdit(item)">修改</span>
                      <span @click="toDelete(item)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <myUpload
        v-model="show"
        field="thumbnail"
        :params="currentEditRowData"
        :headers="headers"
        :url="getUploadThumbnailUrl()"
        @crop-upload-success="cropUploadSuccess"
      />
      <!-- 样式Json内容编辑窗口 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="vueJsonEditorDialog"
        :title="'【' + currentEditRowData.styleName + '】样式内容编辑'"
        width="900px"
        center
        height="700px"
      >
        <vue-json-editor
          v-model="styleContent"
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
          <el-form-item label="样式id" prop="styleId">
            <el-input v-model="form.styleId" style="width: 300px;" />
            <el-button v-if="form.id === '' || form.id === null" type="primary" plain @click="generateAccessToken">生成</el-button>
          </el-form-item>
          <el-form-item label="样式类型" prop="styleType">
            <el-select v-model="form.styleType" size="small" placeholder="样式类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in dict.dict.MSP_RESOURCE_STYLE_TEMPLATE_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="样式名称" prop="styleName">
            <el-input v-model="form.styleName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="样式描述" prop="styleRemark">
            <el-input v-model="form.styleRemark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="样式JSOn内容" prop="styleContent">
            <el-input v-model="form.styleContent" :rows="3" type="textarea" style="width: 370px;" />
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
import crudMapStyle from '@/api/msp/mapStyle.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import vueJsonEditor from 'vue-json-editor'
import { uuid } from 'vue-uuid'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import styleTemplateList from './styleTemplateList'

const defaultForm = {
  id: null,
  styleId: null,
  styleName: null,
  styleRemark: null,
  styleCenter: null,
  styleZoom: null,
  createUser: null,
  createTime: null
}
export default {
  name: 'MapStyle',
  components: { vueJsonEditor, myUpload, styleTemplateList },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图样式模板',
      url: 'api/mapStyle',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapStyle }
    })
  },
  // 数据字典
  el_dicts: ['', ''],
  dicts: ['', 'MSP_RESOURCE_STYLE_TEMPLATE_TYPE'],
  data() {
    return {
      uploadThumbnailUrl: 'api/mapStyle/uploadThumbnail',
      show: false,
      uploadParams: {
        'Authorization': getToken()
      },
      headers: {
        'Authorization': getToken()
      },
      vueJsonEditorDialog: false,
      currentEditRowData: {},
      styleContent: {},
      activeName: 'first',
      permission: {
        add: ['admin', 'mapStyle:add'],
        edit: ['admin', 'mapStyle:edit'],
        del: ['admin', 'mapStyle:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'styleContent', 'styleTemplateZoom', 'styleTemplateThumbnail'],
      rules: {
        styleId: [
          { required: true, message: '样式id不能为空', trigger: 'blur' }
        ],
        styleType: [
          { required: true, message: '样式类型不能为空', trigger: 'blur' }
        ],
        styleName: [
          { required: true, message: '样式名称不能为空', trigger: 'blur' }
        ],
        styleRemark: [
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
      this.crud.page.size = 1000
      console.log(this.query.stylePublic)
      if (this.query.stylePublic === undefined || this.query.stylePublic === null) {
        this.query.stylePublic = '1'
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
      this.crud.form.styleId = uuid.v4().replace(/-/g, '')
    },
    toDelete(item) {
      this.$confirm(`确定删除样式?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        crudMapStyle.del([item.id]).then(res => {
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
        this.query.stylePublic = '1'
      } else {
        this.query.stylePublic = '0'
      }
      this.crud.toQuery()
    },
    saveJsonContent() {
      console.log(this.styleContent)
      crudMapStyle.updateStyle({
        id: this.currentEditRowData.id,
        styleContent: this.styleContent
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
      this.styleContent = {
        msg: 'loading'
      }
      this.currentEditRowData = rowData
      this.vueJsonEditorDialog = true
      const _this = this
      crudMapStyle.getStyleByStyleId(rowData.styleId).then(res => {
        console.log(_this.styleContent)
        if (res.styleContent != null) {
          // eslint-disable-next-line no-eval eval('(' + res.styleContent + ')')
          _this.styleContent = JSON.parse(res.styleContent)
        }
      })
    },
    uploadThumbnail(item) {
      if (item) {
        this.currentEditRowData = item
      }
      this.show = !this.show
    },
    getUploadThumbnailUrl() {
      return this.$store.getters.baseApi + '/api/mapStyle/uploadThumbnail'
    },
    /**
     * 获取样式预览图
     * @param styleId
     * @returns {string}
     */
    styleImgUrl(styleTemplate) {
      return "background: url('" + styleTemplate.styleTemplateImgBase64 + "') center center / 100px 100px no-repeat;"
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
    width: 100px;
    height: 100px;
    position: relative;
  }
  .temp-item .temp-img {
    border-radius: 4px;
    width: 100px;
    height: 100px;
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
    min-height: 100px;
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
  .mystyle-header {
    position: relative;
    margin-top: 32px;
    margin-bottom: 30px;
  }
  .maystyle-item {
    position: relative;
    border: 1px dashed #e6ebec;
    border-radius: 3px;
    width: 100%;
    height: 122px;
    margin: 12px 12px 24px 0;
    background: #fff;
    padding-left: 139px;
    .maystyle-item-img {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 120px;
      border-radius: 3px 0 0 3px;
    }
    .maystyle-item-info {
      position: relative;
      font-size: 12px;
      height: 100%;
      color: #7c7e7d;

      .maystyle-item-info-top {
        position: absolute;
        top: 17px;
        width: 100%;
        .name {
          cursor: pointer;
          float: left;
          font-size: 14px;
          color: #535353;
          .txt {
            display: inline-block;
            max-width: 450px;
          }
          .text-overflow {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .edit {
            position: relative;
            top: -5px;
            margin-left: 18px;
            i {
              display: none;
              font-size: 14px;
              color: #42a4f5;
            }
          }
        }
        .edit-info {
          float: right;
          margin-right: 20px;
          color: #a8a9a8;
          .pub-time {
            margin-left: 20px;
          }
        }
      }
      .maystyle-item-info-bottom {
        position: absolute;
        bottom: 13px;
        span {
          display: inline-block;
          margin-right: 24px;
          cursor: pointer;
          i {
            font-size: 13px;
            color: #42a4f5;
            margin-right: 9px;
          }
        }
      }
    }
  }
</style>
