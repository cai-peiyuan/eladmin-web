<template>
  <div style="padding:0px;">
    <el-alert :closable="false" title="自定义地图模板" />
    <el-row :gutter="20" class="panel-group" style="padding: 0px 10px 10px 25px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础模板" name="first">
          <div class="tab-temp-main">
            <div
              v-for="item in crud.data"
              :key="item.id"
              class="temp-item"
              @click="clickStyleTemplate(item)"
              @mouseover="hoverStyleTempalte(item)"
              @mouseleave="hideStyleTempalte(item)"
            >
              <div
                class="temp-img"
                :style="styleImgUrl(item)"
              />
              <div class="temp-info">
                <div class="temp-name">{{ item.styleTemplateName }}</div>
                <a v-if="item.id === hoverStyleTemplateId" class="temp-use">使用此模板</a>
                <a v-if="item.id === hoverStyleTemplateId" class="temp-use-senior">
                  <i class="iconfont-mapstyle icon-lock" />
                </a>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="高级模板" name="second">
          <div class="tab-temp-main">
            <div
              v-for="item in crud.data"
              :key="item.id"
              class="temp-item"
              @click="clickStyleTemplate(item)"
              @mouseover="hoverStyleTempalte(item)"
              @mouseleave="hideStyleTempalte(item)"
            >
              <div
                class="temp-img"
                :style="styleImgUrl(item)"
              />
              <div class="temp-info">
                <div class="temp-name">{{ item.styleTemplateName }}</div>
                <a v-if="item.id === hoverStyleTemplateId" class="temp-use">使用此模板</a>
                <a v-if="item.id === hoverStyleTemplateId" class="temp-use-senior">
                  <i class="iconfont-mapstyle icon-lock" />
                </a>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script >
import crudMapStyleTemplate from '@/api/msp/mapStyleTemplate.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
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
  components: { },
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
      currentEditRowData: {},
      styleTemplateContent: {},
      activeName: 'first',
      styleTemplateId: '',
      hoverStyleTemplateId: ''
    }
  },
  created() {
    this.styleTemplateId = this.$route.params.styleTemplateId
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      if (this.query.styleTemplateType === undefined || this.query.styleTemplateType === null) {
        this.query.styleTemplateType = '1'
      }
      this.currentEditRowData = {}
      return true
    },
    clickStyleTemplate(item) {
      this.currentEditRowData = item
      // this.crud.toEdit(item)
    },
    hoverStyleTempalte(item) {
      this.hoverStyleTemplateId = item.id
    },
    hideStyleTempalte(item) {
      this.hoverStyleTemplateId = ''
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
    /**
     * 获取样式预览图
     * @param styleTemplateId
     * @returns {string}
     */
    styleImgUrl(styleTemplate) {
      return "background: url('" + styleTemplate.styleTemplateImgBase64 + "') center center / 96px 96px no-repeat;"
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
    width: 96px;
    height: 96px;
    position: relative;
  }
  .temp-item .temp-img {
    border-radius: 4px;
    width: 96px;
    height: 96px;
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
    font-size: small;
    position: absolute;
    bottom: 6px;
    text-align: center;
    width: 100%;
  }
  .temp-item .temp-info .temp-use, .temp-item .temp-info .temp-use-senior {
    font-style: initial;
    color: cornflowerblue;
    font-size: medium;
    display: block;
    text-align: center;
  }
  .tab-temp-main {
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-height: 80px;
  }
  .iconfont-mapstyle {
    font-family: iconfont-mapstyle!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
