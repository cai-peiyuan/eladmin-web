<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" :hidden-columns="hiddenColumns" />
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="580px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="外链菜单" prop="iframe">
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存" prop="cache">
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input v-model="form.title" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '0'" label="权限标识" prop="permission">
          <el-input v-model="form.permission" :disabled="form.iframe" placeholder="权限标识" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件路径" prop="component">
          <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item v-if="showParentMenu" label="上级菜单" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px;"
            placeholder="选择上级菜单"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain type="info" @click="crud.cancelCU">取消</el-button>
        <el-button plain :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getMenus"
      :data="crud.data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :expand-row-keys="defaultExpandKeys"
      row-key="id"
      @row-click="editTheRow"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="200px" prop="title">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" /> <span v-text="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-tooltip content="添加下级菜单" placement="top">
            <span><el-link type="primary" @click="addMenuChild(scope.row)"><i class="el-icon-plus" /></el-link></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="path1" label="类型" width="120px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="warning" style="cursor: pointer" @click="addEditButtonMenu(scope.row)">菜单</el-tag>
          <el-tag v-else type="danger">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" width="160px">
        <template slot-scope="scope">
          <el-input
            v-if="currentEditDataId === scope.row.id"
            v-model="scope.row.permission"
            size="small"
            type="text"
            @blur="handleInputBlurResult({index:scope.$index, value:scope.row.permission, id: scope.row.id, type: 'permission'})"
          />
          <span v-if="currentEditDataId != scope.row.id">{{ scope.row.permission }}</span>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="path" label="路由地址" width="140px">
        <template slot-scope="scope">
          <el-input
            v-if="currentEditDataId === scope.row.id"
            v-model="scope.row.path"
            size="small"
            type="text"
            @blur="handleInputBlurResult({index:scope.$index, value:scope.row.path, id: scope.row.id, type: 'path'})"
          />
          <span v-if="currentEditDataId != scope.row.id">{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" width="220px">
        <template slot-scope="scope">
          <el-input
            v-if="currentEditDataId === scope.row.id"
            v-model="scope.row.component"
            size="small"
            type="text"
            @blur="handleInputBlurResult({index:scope.$index, value:scope.row.component, id: scope.row.id, type: 'component'})"
          />
          <span v-if="currentEditDataId != scope.row.id">{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="iframe" label="外链" width="75px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.iframe" type="danger" style="cursor: pointer">是</el-tag>
          <el-tag v-else type="primary" style="cursor: pointer">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="缓存" width="75px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cache" type="danger" style="cursor: pointer">是</el-tag>
          <el-tag v-else type="primary" style="cursor: pointer">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hidden" type="danger" style="cursor: pointer" @click="changePropBooleanValue(scope.row, 'hidden')">否</el-tag>
          <el-tag v-else type="primary" style="cursor: pointer" @click="changePropBooleanValue(scope.row, 'hidden')">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="false" prop="createTime" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="menuSort" align="center" label="排序" width="150px" sortable>
        <template slot-scope="scope">
          <el-input-number
            v-if="currentEditDataId === scope.row.id"
            v-model="scope.row.menuSort"
            size="small"
            style="width: 120px"
            @change="handleInputBlurResult({index:scope.$index, value:scope.row.menuSort, id: scope.row.id, type: 'menuSort'})"
          />
          <span v-if="currentEditDataId != scope.row.id">{{ scope.row.menuSort }}</span>
        </template>
      </el-table-column>

      <el-table-column v-permission="['admin','menu:edit','menu:del']" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudMenu from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

// crud交由presenter持有
const defaultForm = { id: null, title: null, menuSort: 999, path: null, component: null, componentName: null, iframe: false, roles: [], pid: 0, icon: null, cache: false, hidden: false, type: 0, permission: null }
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '菜单',
      url: 'api/menus',
      crudMethod: { ...crudMenu }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      menuDoPop: false,
      showParentMenu: true,
      refreshRowId: null,
      defaultExpandKeys: [1, 2],
      currentEditDataId: '',
      menus: [],
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      hiddenColumns: ['icon'],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.showParentMenu = true
      this.menus = []
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0
        }
        this.getSupDepts(form.id)
      } else {
        this.menus.push({ id: 0, label: '顶级类目', children: null })
      }
    },
    // 刷新表格之后操作
    [CRUD.HOOK.afterRefresh](crud, form) {
      console.log(this.crud.data)
      const _this = this
      if (_this.refreshRowId) {
        this.crud.data.forEach(data => {
          // _this.$refs.table.toggleRowExpansion(data, true)
        })
      }
      return true
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudMenu.getMenus(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    getSupDepts(id) {
      crudMenu.getMenuSuperior(id).then(res => {
        const children = res.map(function(obj) {
          if (!obj.leaf && !obj.children) {
            obj.children = null
          }
          return obj
        })
        this.menus = [{ id: 0, label: '顶级类目', children: children }]
      })
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudMenu.getMenusTree(parentNode.id).then(res => {
          parentNode.children = res.map(function(obj) {
            if (!obj.leaf) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    },
    getTypeDesc(typeCode) {
      if (typeCode === 0) {
        return '目录'
      } else if (typeCode === 1) {
        return '菜单'
      } else if (typeCode === 2) {
        return '按钮'
      } else {
        return typeCode
      }
    },
    showMenuDoPop() {
      this.menuDoPop = true
    },
    addMenuChild(rowData) {
      this.crud.resetForm()
      this.crud.form.pid = rowData.id
      this.crud.status.add = CRUD.STATUS.PREPARED
      this.showParentMenu = false
    },
    // 添加增删改的菜单按钮
    addEditButtonMenu(rowData) {
      this.$prompt('输入权限标识以批量生成增、删、改权限按钮', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: rowData.permission,
        inputPattern: /^.{4,100}$/,
        inputErrorMessage: '权限标识不正确'
      }).then(({ value }) => {
        const loading = this.$loading({
          lock: true,
          text: '正在处理',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 20000)
        crudMenu.addEditButtonMenu({ id: rowData.id, permission: value }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功: ' + value
          })
          this.refreshRowId = rowData.pid
          this.crud.refresh()
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    editTheRow(rowData, column, event) {
      this.currentEditDataId = rowData.id
    },
    handleInputBlurResult({ index, value = '', id = '', type = '' }) {
      console.log(id)
      console.log(value)
      // this.currentEditDataId = ''
      if (type === 'menuSort' || type === 'path' || type === 'component' || type === 'permission') {
        if (type === 'menuSort') {
          this.$refs.table.sort('menuSort', 'asc')
        }
        // this.updateTableData(this.$refs.table.data, type, value, id)
        // 更新菜单的排序值
        crudMenu.updatePropValueById({ id: id, value: value, prop: type }).then(res => {
        })
      }
    },
    changePropBooleanValue(data, prop) {
      console.log(prop)
      data[prop] = !data[prop]
      crudMenu.updatePropValueById({ id: data.id, value: data[prop], prop: prop }).then(res => {
      })
    },
    updateTableData(data, prop, value, id) {
      data.forEach(item => {
        if (item.id === id) {
          item[prop] = value
          return
        }
        if (item.children) {
          this.updateTableData(item.children, prop, value, id)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
 .el-dropdown {
   vertical-align: top;
 }
 .el-dropdown + .el-dropdown {
   margin-left: 15px;
 }
 .el-icon-arrow-down {
   font-size: 12px;
 }
</style>
