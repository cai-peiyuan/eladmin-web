import Vue from 'vue'
import { get as getElSysDicDetails } from '@/api/system/elSysDic'

export default class ElDict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('need ElDict names')
    }
    const ps = []
    names.forEach(n => {
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(getElSysDicDetails(n).then(data => {
        this.dict[n].splice(0, 0, ...data)
        data.forEach(d => {
          Vue.set(this.dict.dict[n], d.code, d)
          Vue.set(this.dict.label[n], d.code, d.desc)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
