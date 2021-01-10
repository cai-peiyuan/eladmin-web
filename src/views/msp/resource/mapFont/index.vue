<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="40" class="panel-group">
        <div
          v-for="item in fontNameGroupData"
          :key="item.FONT_NAME"
          :xs="12"
          :sm="12"
          :lg="6"
          class="card-panel-col"
        >
          <div class="card-panel" @click="queryByFontName(item.FONT_NAME)">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="font" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ item.FONT_NAME }}
              </div>
              <count-to
                :start-val="0"
                :end-val="item.CNT"
                :duration="1000"
                class="card-panel-num"
              />
            </div>
          </div>
        </div>

        <div
          :xs="12"
          :sm="12"
          :lg="6"
          class="card-panel-col"
        >
          <div class="card-panel" @click="crud.toAdd">
            <div class="card-panel-icon-wrapper icon-people">
              <i class="el-icon-plus" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                上传字体
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">字体名称</label>
        <el-select v-model="query.fontName" clearable size="small" placeholder="字体名称" class="filter-item" style="width: 280px" @change="crud.toQuery">
          <el-option v-for="item in fontNameGroupData" :key="item.FONT_NAME" :label="item.FONT_NAME + '  ' + item.CNT" :value="item.FONT_NAME" />
        </el-select>
        <label class="el-form-item-label">字体碎片区间</label>
        <el-input v-model="query.fontRange" clearable placeholder="字体碎片区间" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.fontRemark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <el-row v-if="false">
        <el-button
          v-for="item in fontNameGroupData"
          :key="item.FONT_NAME"
          plain
          type="default"
          size="mini"
          @click="queryByFontName(item.FONT_NAME)"
        >{{ item.FONT_NAME }}</el-button>

      </el-row>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation v-if="false" :permission="permission" :hidden-columns="hiddenColumns" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="字体名称" prop="fontName">
            <el-input v-model="form.fontName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字体文件">
            <el-upload
              ref="upload"
              style="width: 370px;"
              name="file"
              with-credentials="with-credentials"
              :headers="uploadHeader()"
              :data="getUploadData()"
              :action="uploadUrl()"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :on-change="uploadOnchange"
              :on-exceed="uploadOnexceed"
              :on-success="uploadSuccess"
              :limit="1"
            >
              <el-button plain size="small" type="primary">点击上传</el-button>
              <div slot="tip" style="display: block;" class="el-upload__tip">将字体文件压缩成zip格式压缩文件进行上传</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="doUpload('form')">上传</el-button>
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
            <el-form label-position="left" inline class="demo-table-expand" style="padding-left: 60px">

              <el-form-item label="序列号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="字体名称">
                <span>{{ props.row.fontName }}</span>
              </el-form-item>
              <el-form-item label="字体碎片区间">
                <span>{{ props.row.fontRange }}</span>
              </el-form-item>
              <el-form-item label="字体文件内容">
                <span>{{ props.row.fontContent }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.fontRemark }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序列号" sortable="custom" />
        <el-table-column prop="fontName" label="字体名称" sortable="custom" />
        <el-table-column prop="fontRange" label="字体碎片区间" sortable="custom" />
        <el-table-column prop="fontContent" label="字体文件内容" sortable="custom" />
        <el-table-column prop="fontRemark" label="备注" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudMapFont from '@/api/msp/mapFont.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import { getToken } from '@/utils/auth'
import CountTo from 'vue-count-to'

const defaultForm = {
  id: null,
  fontName: null,
  fontRange: null,
  fontContent: null,
  createTime: null,
  createUser: null,
  fontRemark: null
}
export default {
  name: 'MapFont',
  components: { pagination, crudOperation, rrOperation, CountTo },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '字体资源',
      url: 'api/mapFont',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapFont }
    })
  },
  data() {
    return {
      fontNameGroupData: [],
      permission: {
        add: ['admin', 'mapFont:add'],
        edit: ['admin', 'mapFont:edit'],
        del: ['admin', 'mapFont:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['fontContent', 'id', 'createUser'],
      rules: {
        fontName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'fontName', display_name: '字体名称' },
        { key: 'fontRange', display_name: '字体碎片区间' },
        { key: 'fontContent', display_name: '字体文件内容' },
        { key: 'fontRemark', display_name: '备注' }
      ]
    }
  },
  mounted() {
    crudMapFont.queryFontNameGroup().then(res => {
      this.fontNameGroupData = res
    })
  },
  methods: {
    queryByFontName(fontName) {
      console.log(fontName)
      this.crud.query.fontName = fontName
      this.crud.toQuery()
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    uploadOnexceed(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.$notify({
        title: '只允许上传单个文件',
        type: 'success',
        duration: 2500
      })
    },
    uploadOnchange(file, fileList) {
      this.crud.form.fontName = file.name.split('.')[0]
      console.log(file)
      console.log(fileList)
    },
    beforeUpload(file) {
      // 修改状态 id有值// return false
      console.log(file.type)
      const isJPG = file.type === 'application/zip'
      const isLt2M = file.size / 1024 / 1024 < 210
      if (!isJPG) {
        this.$message.error('上传文件只能是 zip 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isJPG && isLt2M
    },
    getUploadData() {
      const fontName = this.crud.form.fontName
      return { fontName: fontName }
    },
    uploadHeader() {
      return { 'Authorization': getToken() }
    },
    uploadUrl() {
      return this.$store.getters.baseApi + '/api/mapFont/upload'
    },
    uploadSuccess() {
      this.$notify({
        title: '上传成功',
        type: 'success',
        duration: 2500
      })
      this.$refs.upload.clearFiles()
    },
    doUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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

  ::v-deep .el-table__row {
    cursor: pointer;
  }

  .panel-group {
    margin-top: 18px;
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-height: 150px;
    .card-panel-col {
      cursor: pointer;
      margin-left: 20px;
      margin-bottom: 20px;
      width: 165px;
      height: 150px;
      position: relative;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 18px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        display: none;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
        display: none;
      }

      .card-panel-description {
        font-weight: bold;
        margin: 10px;
        text-align: center;

        .card-panel-text {
          word-break: break-all;
          color: rgba(0, 0, 0, 0.45);
        }

        .card-panel-num {
          font-size: 20px;
          margin-top: 20px;
        }
      }
    }
  }
</style>
