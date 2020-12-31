<template>
  <div class="navTabs">
    <el-tabs>
      <el-tab-pane label="用户管理" name="first" />
      <el-tab-pane label="配置管理" name="second" />
      <el-tab-pane label="角色管理" name="third" />
      <el-tab-pane label="定时任务补偿" name="fourth" />
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'NavTabs',
  computed: {}
}
</script>

<style lang="scss" scoped>
.navTabs{
  height: 50px;
  display: none;
}
</style>

<style lang="scss">

</style>
