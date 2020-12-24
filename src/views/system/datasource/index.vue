<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.dsName" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">数据源标识</label>
        <el-input v-model="query.dsKey" clearable placeholder="数据源标识" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="560px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="ID" prop="dsId">
            <el-input v-model="form.dsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="dsName">
            <el-input v-model="form.dsName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据源标识" prop="dsKey">
            <el-input v-model="form.dsKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="jdbc连接" prop="jdbcUrl">
            <el-input v-model="form.jdbcUrl" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账号" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据库类型">
            <el-select v-model="form.dsType" clearable size="small" placeholder="数据库类型" class="filter-item" style="width: 370px;">
              <el-option v-for="item in el_dict.dict.webide_jdbc_" :key="item.code" :label="item.desc" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="驱动类">
            <el-input v-model="form.driverClass" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="form.userPassword" type="password" style="width: 200px;" />
            <el-button :loading="loading" type="success" style="align: right;" @click="testConnectDataSource">测试连接</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="jdbc连接">
                <span>{{ props.row.jdbcUrl }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="false" prop="dsId" label="主键" />
        <el-table-column prop="dsName" label="名称" />
        <el-table-column prop="dsKey" label="数据源标识" />
        <el-table-column v-if="false" prop="jdbcUrl" label="jdbc连接" />
        <el-table-column v-if="false" prop="userName" label="账号" />
        <el-table-column v-if="false" prop="createBy" label="创建者" />
        <el-table-column v-if="false" prop="updateBy" label="更新者" />
        <el-table-column v-if="false" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dsType" label="数据源类型">
          <template slot-scope="scope">
            {{ getElDictDesc(scope.row.dsType,'webide_jdbc_',scope) }}
          </template>
        </el-table-column>
        <el-table-column prop="driverClass" label="驱动类" />
        <el-table-column v-if="false" prop="userPassword" label="密码" />
        <el-table-column v-if="checkPer(['admin','elSysDatasource:edit','elSysDatasource:del'])" label="操作" width="150px" align="center">
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
import crudElSysDatasource from '@/api/system/elSysDatasource'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { testDataSourceConnect } from '@/api/mnt/connect'

const defaultForm = { dsId: null, dsName: null, dsKey: null, jdbcUrl: null, userName: null, createBy: null, updateBy: null, createTime: null, updateTime: null, dsType: null, driverClass: null, userPassword: null }
export default {
  name: 'JDBC',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '数据源', url: 'api/elSysDatasource', sort: 'dsId,desc', crudMethod: { ...crudElSysDatasource }})
  },
  // 数据字典
  el_dicts: ['webide_jdbc_'],
  dicts: ['user_status', 'job_status'],
  data() {
    return {
      loading: false,
      permission: {
        add: ['admin', 'elSysDatasource:add'],
        edit: ['admin', 'elSysDatasource:edit'],
        del: ['admin', 'elSysDatasource:del']
      },
      rules: {
        dsName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        dsKey: [
          { required: true, message: '数据源标识不能为空', trigger: 'blur' }
        ],
        jdbcUrl: [
          { required: true, message: 'jdbc连接不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'dsName', display_name: '名称' },
        { key: 'dsKey', display_name: '数据源标识' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    testConnectDataSource() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          testDataSourceConnect(this.form).then((res) => {
            this.loading = false
            this.$notify({
              title: res.success ? '连接成功' : res.message,
              type: res.success ? 'success' : 'error',
              duration: 2500
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
    /*,
    // 根据字典值和字典名称获取字典释义
    getElDictDesc(elDicValue, elDicKey, vueObj) {
      console.log(vueObj)
      if (vueObj._self.el_dict.dict[elDicKey] && vueObj._self.el_dict.dict[elDicKey][elDicValue]) {
        return vueObj._self.el_dict.dict[elDicKey][elDicValue].desc
      } else {
        return '请引入字典' + elDicKey + '查看' + elDicValue + '释意'
      }
    }*/
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
