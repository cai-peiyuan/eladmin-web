<template>
  <elFrame :src="maputnikEditor" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Sql',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'maputnikEditor'
    ])
  }
}
</script>
