<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="地图模板在线设计" />
    <el-alert :closable="false" :title="'地图模板id：'+styleId" />
  </div>
</template>
<script >
export default {
  data() {
    return {
      styleId: ''
    }
  },
  created() {
    this.styleId = this.$route.params.styleId
  }
}
</script>
