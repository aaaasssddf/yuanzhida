const util = require('../../utils/util')
Component({
  data: {
    value: [],
    maxNum: 9,
    canAddImage: true,
    addImageText: '添加图片'
  },
  methods: {
    refleshImagesShow: function () {
      this.selectComponent('#images-preview').initData({ images: this.data.value, canDel: true })
    },
    initData: function (d) {
      // d = { value: ["2025/04/04/123.png","http://tmp","wxfile://tmp"] }
      // add oss prefix if need
      d.value = util.toVisibleImages(d.value || [])
      this.setData(d)
      this.refleshImagesShow()
      // after init data,need to trigger
      this.trigger()
    },
    addImage: function () {
      wx.chooseMedia({
        count: this.data.maxNum - this.data.value.length,
        mediaType: 'image',
        success: (res) => {
          this.setData({ value: this.data.value.concat(res.tempFiles.map(i => i.tempFilePath)) })
          this.refleshImagesShow()
          if (this.data.value.length == this.data.maxNum) {
            this.setData({ canAddImage: false, addImageText: '最多' + this.data.maxNum + '张图片' })
            return
          }
          this.trigger()
        }
      })
    },
    clear: function () {
      this.setData({ value: [] })
      this.refleshImagesShow()
    },
    onDelImage: function (e) {
      wx.showModal({
        title: '警告',
        content: '是否删除该图片',
        complete: (res) => {
          if (res.confirm) {
            let images = this.data.value
            images.splice(e.detail.index, 1)
            this.setData({ value: images })
            this.trigger()
            this.refleshImagesShow()
          }
        }
      })
    },
    trigger: function () {
      this.triggerEvent('input', { key: 'images', value: this.data.value })
    }
  }
})