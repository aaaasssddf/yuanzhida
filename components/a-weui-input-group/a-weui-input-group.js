Component({
  options: {
    addGlobalClass: true
  },
  data: {
    inputItems: [],
    outputItems: {},
  },
  methods: {
    initData: function (d) {
      this.setData(d)
      const els = this.selectAllComponents('.item')
      for (const i in els) {
        els[i].initData(this.data.inputItems[i])
      }
    },
    onInput: function (e) {
      let outputItems = this.data.outputItems
      outputItems[e.detail.key] = e.detail.value
      this.setData({
        'outputItems': outputItems
      })
      this.triggerEvent('input', outputItems)
    },
    clear: function () {
      this.selectAllComponents('.item').forEach(i => i.clear());
    }
  }
})