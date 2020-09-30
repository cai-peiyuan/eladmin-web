import ElDict from './ElDict'

const install = function(Vue) {
  Vue.mixin({
    data() {
      if (this.$options.el_dicts instanceof Array) {
        const el_dict = {
          dict: {},
          label: {}
        }
        return {
          el_dict
        }
      }
      return {}
    },
    created() {
      if (this.$options.el_dicts instanceof Array) {
        new ElDict(this.el_dict).init(this.$options.el_dicts, () => {
          this.$nextTick(() => {
            this.$emit('elDictReady')
          })
        })
      }
    }
  })
}

export default { install }
