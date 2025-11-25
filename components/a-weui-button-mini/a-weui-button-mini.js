Component({
  properties: {
    'text': { type: String, value: '按钮' },
    'disabled': { type: Boolean, value: false },
    // normal big small tiny
    'size': { type: String, value: 'big' }
  },
  options: {
     addGlobalClass:true
  },
  data: {

  },
  methods: {
    _ontap: function () {
      if (this.data.disabled) {
        return
      }
      this.triggerEvent('the_tap')
    }
  }
})