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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
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
          <el-form-item label="创建者">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新者">
            <el-input v-model="form.updateBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据源类型">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="驱动类">
            <el-input v-model="form.driverClass" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="form.userPassword" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="dsId" label="ID" />
        <el-table-column prop="dsName" label="名称" />
        <el-table-column prop="dsKey" label="数据源标识" />
        <el-table-column prop="jdbcUrl" label="jdbc连接" />
        <el-table-column prop="userName" label="账号" />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dsType" label="数据源类型" />
        <el-table-column prop="driverClass" label="驱动类" />
        <el-table-column prop="userPassword" label="密码" />
        <el-table-column v-permission="['admin','elSysDatasource:edit','elSysDatasource:del']" label="操作" width="150px" align="center">
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

const defaultForm = { dsId: null, dsName: null, dsKey: null, jdbcUrl: null, userName: null, createBy: null, updateBy: null, createTime: null, updateTime: null, dsType: null, driverClass: null, userPassword: null }
export default {
  name: 'ElSysDatasource',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'ElSystemDatasource', url: 'api/elSysDatasource', sort: 'dsId,desc', crudMethod: { ...crudElSysDatasource }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'elSysDatasource:add'],
        edit: ['admin', 'elSysDatasource:edit'],
        del: ['admin', 'elSysDatasource:del']
      },
      rules: {
        dsId: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
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
    }
  }
}
</script>

<style scoped>

</style>
