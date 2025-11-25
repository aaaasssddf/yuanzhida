const util = require('../../utils/util')
Component({
  data: {
    comments: [],
    entityUserId: 0,
    questionUsername: ''
  },
  methods: {
    initData: function (d) {
      this.setData(d)
      this.updateUserAndTime()
      this.updateCommentInfo()
      this.updateImagesPreview()
    },
    onUpdate: function () {
      this.triggerEvent('update')
    },
    updateUserAndTime: function () {
      const els = this.selectAllComponents('.user-and-time')
      for (let i in els) {
        els[i].initData({
          username: this.data.comments[i].username,
          time: this.data.comments[i].createTime
        })
      }
    },
    onCorrentComment: function (e) {
      const id = e.currentTarget.dataset.id
      const comment = this.data.comments.filter(i => i.id == id)[0]
      this.triggerEvent('correctComment', comment)
    },
    updateImagesPreview: function () {
      const els = this.selectAllComponents('.images-preview')
      for (let i in els) {
        els[i].initData({
          images: this.data.comments[i].images
        })
      }
    },
    updateCommentInfo: function () {
      const els = this.selectAllComponents('.comment-info')
      for (let i in els) {
        const {
          likeCount,
          likeStatus,
          id,
          useful,
          username
        } = this.data.comments[i]
        els[i].initData({
          likeStatus,
          likeCount,
          entityUserId: this.data.entityUserId,
          commentId: id,
          useful,
          username,
          questionUsername: this.data.questionUsername
        })
      }
    },
    appendComments: function (e) {
      console.log(e)
      const loadedComments = this.data.comments
      loadedComments.push(e)
      this.setData({
        comments:loadedComments
      })
      console.log(this.data.comments)
      this.updateUserAndTime()
      this.updateCommentInfo()
      this.updateImagesPreview()
    }
  }
})