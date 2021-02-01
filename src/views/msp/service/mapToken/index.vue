<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">应用名称</label>
        <el-input v-model="query.appName" clearable placeholder="应用名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">token值</label>
        <el-input v-model="query.accessToken" clearable placeholder="token值" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.remark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">限制客户端列表</label>
        <el-input v-model="query.iplist" clearable placeholder="限制客户端列表" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="form.appName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="token值" prop="accessToken">
            <el-input v-model="form.accessToken" style="width: 300px;" />
            <el-button v-if="form.id === '' || form.id === null" type="primary" plain @click="generateAccessToken">生成</el-button>
          </el-form-item>
          <el-form-item label="失效时间" prop="invalidTime">
            <el-date-picker v-model="form.invalidTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" style="width: 370px;" type="textarea" />
          </el-form-item>
          <el-form-item label="客户端列表">
            <el-input v-model="form.iplist" style="width: 370px;" type="textarea" />
          </el-form-item>
          <el-form-item label="每日请求限制">
            <el-input-number v-model="form.limitPerDay" :step="100" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="引用站列表">
            <el-input v-model="form.refererlist" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-if="false" label="是否启用" prop="isValid">
            <el-input v-model="form.isValid" style="width: 370px;" />
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

              <el-form-item label="应用名称">
                <span>{{ props.row.appName }}</span>
              </el-form-item>
              <el-form-item label="token值">
                <span>{{ props.row.accessToken }}</span>
              </el-form-item>
              <el-form-item label="失效时间">
                <span>{{ parseTime(props.row.invalidTime) }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="限制客户端列表">
                <span>{{ props.row.iplist }}</span>
              </el-form-item>
              <el-form-item label="每日请求限制">
                <span>{{ props.row.limitPerDay }}</span>
              </el-form-item>
              <el-form-item label="是否启用">
                <span>{{ props.row.isValid }}</span>
              </el-form-item>
              <el-form-item label="引用站列表">
                <span>{{ props.row.refererlist }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="appName" label="应用名称" sortable="custom" width="150px">
          <template slot-scope="scope">
            <span>
              <router-link :to="'/msp/service/mapToken/edit/'+ scope.row.accessToken">
                {{ (scope.row.appName) }}
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="accessToken" label="token值" sortable="custom">
          <template slot-scope="scope">
            <span>
              <el-link
                type="primary"
                @click="showTokenApiSettingDialog(scope.row)"
              >
                {{ encryptToken(scope.row.accessToken) }}
              </el-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="invalidTime" label="失效时间" sortable="custom" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.invalidTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable="custom" width="150px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建用户" sortable="custom" width="100px" />
        <el-table-column prop="iplist" label="限制客户端列表" sortable="custom" />
        <el-table-column prop="limitPerDay" label="每日请求限制" sortable="custom" width="120px" />
        <el-table-column prop="isValid" label="是否启用" sortable="custom" width="120px">
          <template slot-scope="scope">
            <span>
              <el-tag
                :type="scope.row.isValid === 0 ? 'primary' : 'success'"
                disable-transitions
              >{{ getDictLabel(scope.row.isValid,'MSP_SERVICE_TOKEN_VALID',scope) }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="refererlist" label="引用站列表" sortable="custom" />
        <el-table-column prop="remark" label="备注" sortable="custom" width="180px" />
        <el-table-column v-if="checkPer(['admin','mspMapToken:edit','mspMapToken:del'])" label="操作" width="150px" align="center" fixed="right">
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

      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showTokenApiSettingDialogFlag"
        :title="'Token接口权限设置'"
        width="980px"
        style="padding-bottom: 10px;"
      >
        <p style="text-align: center;display: none; margin: 0 0 0px">设置{{ setTokenApiRowData.accessToken }}的接口权限属性</p>
        <div style="text-align: center">
          <el-transfer
            v-model="tokenApiDataValue"
            style="text-align: left; display: inline-block;"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :render-content="renderFunc"
            :titles="['可选接口', '已选接口']"
            :button-texts="['', '']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            :data="tokenApiData"
            @change="handleChange"
          />
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="warn" icon="el-icon-refresh" plain @click="showTokenApiSettingDialogFlag = !showTokenApiSettingDialogFlag">取消</el-button>
          <el-button type="primary" icon="el-icon-refresh" plain @click="reloadTokenApiData">重新加载</el-button>
          <el-button :loading="saveTokenApiLoading" type="primary" icon="el-icon-check" plain @click="saveTokenApiSetting">保存设置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import crudMapToken from '@/api/msp/mapToken.js'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { uuid } from 'vue-uuid'

const defaultForm = {
  id: null,
  appName: null,
  accessToken: null,
  invalidTime: null,
  createTime: null,
  createUser: null,
  remark: null,
  iplist: null,
  limitPerDay: null,
  isValid: null,
  refererlist: null
}
export default {
  name: 'MapToken',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图服务Token',
      url: 'api/mapToken',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapToken }
    })
  },
  dicts: ['MSP_SERVICE_TOKEN_VALID'],
  data() {
    return {
      showTokenApiSettingDialogFlag: false,
      saveTokenApiLoading: false,
      setTokenApiRowData: {},
      tokenApiData: [],
      // 已选中的字段数据
      tokenApiDataValue: [],
      renderFunc(h, option) {
        return <span>{ option.label }</span>
      },
      permission: {
        add: ['admin', 'mspMapToken:add'],
        edit: ['admin', 'mspMapToken:edit'],
        del: ['admin', 'mspMapToken:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['createUser', 'createTime', 'refererlist', 'iplist', 'accessToken1'],
      rules: {
        appName: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' }
        ],
        accessToken: [
          { required: true, message: 'Token值不能为空', trigger: 'blur' }
        ],
        invalidTime: [
          { required: true, message: '失效时间不能为空', trigger: 'blur' }
        ],
        limitPerDay: [
          { required: true, message: '请求限制不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注信息不能为空', trigger: 'blur' }
        ],
        isValid: [
          { required: true, message: '是否启用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'appName', display_name: '应用名称' },
        { key: 'accessToken', display_name: 'token值' },
        { key: 'remark', display_name: '备注' },
        { key: 'iplist', display_name: '限制客户端列表' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    generateAccessToken() {
      this.crud.form.accessToken = uuid.v4().replace(/-/g, '')
    },
    // 监听模板属性变化操作
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    encryptToken(str) {
      return str ? str.substr(0, parseInt(str.split('').length / 3)) +
        '**' +
        str.substr(parseInt(str.split('').length / 3) * 2, str.split('').length) : ''
    },
    // 显示配置窗口
    showTokenApiSettingDialog(rowData) {
      this.showTokenApiSettingDialogFlag = !this.showTokenApiSettingDialogFlag
      this.setTokenApiRowData = rowData
      this.loadTokenApiData(rowData)
    },
    reloadTokenApiData() {
      this.loadTokenApiData(this.setTokenApiRowData)
    },
    loadTokenApiData(rowData) {
      const _this = this
      crudMapToken.getTokenApi(rowData.id).then(res => {
        _this.tokenApiData = []
        _this.tokenApiDataValue = []
        // 全部属性字段
        res.allApi.forEach(function(data, index) {
          const dataItem = {
            key: data.sid,
            label: data.apiName + '' + data.apiUrl,
            apiUrl: data.apiUrl,
            apiName: data.apiName,
            className: data.className,
            disabled: false
          }
          _this.tokenApiData.push(dataItem)
        })
        // 已选属性字段
        res.selectApi.forEach(function(data, index) {
          _this.tokenApiDataValue.push(data.sid)
        })
      })
    },
    // 保存模板属性配置信息
    saveTokenApiSetting() {
      this.saveTokenApiLoading = true
      crudMapToken.saveTokenApiData(this.setTokenApiRowData.id, this.tokenApiDataValue).then(res => {
        console.log(res)
        this.$notify({
          title: '成功保存->' + res.saveCnt,
          type: 'success',
          duration: 2500
        })
        this.saveTokenApiLoading = false
        this.showTokenApiSettingDialogFlag = false
        this.crud.toQuery()
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
  ::v-deep .el-transfer-panel {
    width: 420px;
    height: 500px;
  }
  ::v-deep .el-transfer-panel__list.is-filterable {
    height: 500px;
  }
  ::v-deep .el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 0px;
  }
</style>
