<template>
  <div style="padding:0px;height: 100%">
    <el-alert v-if="false" :closable="false" title="地图模板在线设计" />
    <el-alert v-if="false" :closable="false" :title="'地图模板id：'+styleId" />
    <iframe
      src="http://localhost:8888/?layer=3448681199%7E0&modal=open#11.61/39.91/116.3938"
      width="100%"
      height="1400"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
      allowtransparency="yes"
    />
  </div>
</template>
<style >
  html,body
  {
    margin: 0;
    padding: 0;
    border: 0;
    height: 100%;
  }
</style>
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
