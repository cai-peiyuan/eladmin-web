<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="地图模板在线设计" />
    <el-alert :closable="false" :title="'地图模板id：'+styleTemplateId" />
  </div>
</template>
<script >
export default {
  data() {
    return {
      styleTemplateId: ''
    }
  },
  created() {
    this.styleTemplateId = this.$route.params.styleTemplateId
  }
}
</script>
