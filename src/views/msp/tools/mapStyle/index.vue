<template>
  <div id="mapStyleEditorDiv" style="padding:0px;height: 100%">
    <el-alert v-if="false" :closable="false" title="地图模板在线设计" />
    <el-alert v-if="false" :closable="false" :title="'地图模板id：'+styleId" />
    <iframe
      id="mapStyleEditorIframe"
      width="100%"
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
import Config from '@/settings'
export default {
  name: 'MapStyleEditor',
  dicts: ['MSP_TOOLS_MAP_STYLE_EDITOR_LAYER_TYPE'],
  data() {
    return {
      styleId: '',
      iframeH: 150
    }
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('mapStyleEditorIframe')
    console.log(oIframe.parentElement)
    console.log(oIframe.parentElement.style.height)
    console.log(oIframe.parentElement.style.width)
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = oIframe.parentElement.style.width
    oIframe.style.height = (Number(deviceHeight) - 120) + 'px'
    document.getElementById('mapStyleEditorIframe').src = Config.mspMapStyleEditorUrl + '?editorConfig=mspToolMapStyleEditor&layer=3202069833%7E0#10.66/39.9348/116.3695'
    window.onresize = function() { // 定义窗口大小变更通知事件
      const screenHeight = document.documentElement.clientHeight // 窗口高度
      oIframe.style.width = oIframe.parentElement.style.width
      oIframe.style.height = (Number(screenHeight) - 120) + 'px'
    }
  },
  created() {
    this.styleId = this.$route.params.styleId
  }
}
</script>
