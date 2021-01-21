<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="服务Token设置" />
    <el-alert :closable="false" :title="'服务Token值：'+token" />
  </div>
</template>
<script >
export default {
  data() {
    return {
      token: ''
    }
  },
  created() {
    this.token = this.$route.params.token
  }
}
</script>
