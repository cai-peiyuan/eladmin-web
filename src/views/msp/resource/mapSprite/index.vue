<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-row :gutter="40" class="panel-group">
        <div
          v-for="item in spriteNameGroupData"
          :key="item.sprite_name"
          :xs="12"
          :sm="12"
          :lg="6"
          class="card-panel-col"
        >
          <div class="card-panel" @click="queryBySpriteName(item.sprite_name)">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="sprite" />
              <svg-icon icon-class="sprite" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                {{ item.sprite_name }}
              </div>
              <count-to
                :start-val="0"
                :end-val="item.cnt"
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
                上传图标集合
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">这里显示css
          <Java
            :value="currentSpriteJsonContent"
            height="600px"
            style="overflow-y: hidden"
          />
        </el-col>
        <el-col :span="12">这里显示img
          <img :src="currentSpritePngBase64" style="width: 100%">
        </el-col>
      </el-row>
      <div v-if="crud.props.searchToggle && false">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.spriteName" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">类型</label>
        <el-input v-model="query.spriteType" clearable placeholder="类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.spriteRemark" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
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
          <el-form-item label="序列号" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.spriteName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="JSON">
            <el-input v-model="form.spriteJson" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="PNG">
            <el-input v-model="form.spritePng" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.spriteRemark" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        v-if="false"
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
              <el-form-item label="名称">
                <span>{{ props.row.spriteName }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ props.row.spriteType }}</span>
              </el-form-item>
              <el-form-item label="JSON">
                <span>{{ props.row.spriteJson }}</span>
              </el-form-item>
              <el-form-item label="PNG">
                <span>{{ props.row.spritePng }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ parseTime(props.row.createTime) }}</span>
              </el-form-item>
              <el-form-item label="创建用户">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.spriteRemark }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序列号" sortable="custom" />
        <el-table-column prop="spriteName" label="名称" sortable="custom" />
        <el-table-column prop="spriteType" label="类型" sortable="custom" />
        <el-table-column prop="spriteJson" label="JSON" sortable="custom" />
        <el-table-column prop="spritePng" label="PNG" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建用户" sortable="custom" />
        <el-table-column prop="spriteRemark" label="备注" sortable="custom" />
        <el-table-column v-if="checkPer(['admin','mspMapSprite:edit','mspMapSprite:del'])" label="操作" width="150px" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination v-if="false" />
    </div>
  </div>
</template>

<script>
import crudMapSprite from '@/api/msp/mapSprite.js'
import Java from '@/components/JavaEdit/index'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import CountTo from 'vue-count-to'

const defaultForm = {
  id: null,
  spriteName: null,
  spriteType: null,
  spriteJson: null,
  spritePng: null,
  createTime: null,
  createUser: null,
  spriteRemark: null
}
export default {
  name: 'MapSprite',
  components: { pagination, crudOperation, rrOperation, udOperation, Java, CountTo },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '地图渲染图标集合',
      url: 'api/mapSprite',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudMapSprite }
    })
  },
  data() {
    return {
      spriteNameGroupData: [],
      currentSpriteName: '',
      currentSpriteJsonContent: '',
      currentSpritePngBase64: '',
      permission: {
        add: ['admin', 'mspMapSprite:add'],
        edit: ['admin', 'mspMapSprite:edit'],
        del: ['admin', 'mspMapSprite:del']
      },
      // 默认隐藏的数据列放到这个数组内 这里可以手动控制显示与隐藏 默认隐藏
      hiddenColumns: ['id', 'createUser', 'createTime'],
      rules: {
        id: [
          { required: true, message: '序列号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'spriteName', display_name: '名称' },
        { key: 'spriteType', display_name: '类型' },
        { key: 'spriteRemark', display_name: '备注' }
      ]
    }
  },
  mounted() {
    crudMapSprite.getSpriteNames({}).then(res => {
      console.log(res)
      this.spriteNameGroupData = res
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.page.size = 1000
      return true
    },
    queryBySpriteName(spriteName) {
      console.log(spriteName)
      this.currentSpriteName = spriteName
      // this.crud.query.spriteName = spriteName
      // this.crud.toQuery()
      crudMapSprite.getSprite({ spriteName: spriteName }).then(res => {
        this.currentSpriteJsonContent = res.spriteJsonContent
        this.currentSpritePngBase64 = res.spritePngBase64
        console.log(res)
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

      & :hover {

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
  .json-editor{
    .CodeMirror {
      overflow-y: hidden;
    }
  }
</style>
