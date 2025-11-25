const api = require('../../utils/api')
const data = require('../../utils/data')
const interact = require('../../utils/interact')
Component({
  data: {
    likeStatus: '',
    likeCount: 0,
    entityUserId: 0,
    commentId: 0,
    useful: 0,
    isQuestionOwn: false,
    isCommentOwn: false
  },
  methods: {
    correntComment: function () {
      this.triggerEvent('correntComment')
    },
    deleteComment: function () {
      interact.warnModal('确认删除', () => {
        api.deleteComment(this.data.commentId).then(() => {
          wx.showToast({ title: '删除成功' })
          this.triggerEvent('update')
        }).catch(interact.errorToast)
      })
    },
    initData: function (d) {
      this.setData(d)
      this.setData({ isCommentOwn: data.isOwn(this.data.username), isQuestionOwn: data.isOwn(d.questionUsername) })
    },
    flagUseful: function () {
      api.flagUseful(this.data.commentId).then(() => {
        let text = '已取消标记'
        if (this.data.useful) text = '已标记有用'
        wx.showToast({
          title: text,
        })
        this.setData({ useful: !this.data.useful })
      }).catch(interact.errorToast)
    },
    likeComment: function () {
      if (this.data.likeStatus == '未登录') {
        interact.errorToast('未登录')
        return
      }
      api.likeComment(this.data.commentId, this.data.entityUserId).then(res => {
        if (this.data.likeStatus == '未点赞') {
          wx.showToast({
            title: '点赞成功',
          })
          this.setData({ likeStatus: '已点赞', likeCount: this.data.likeCount + 1 })
        } else {
          wx.showToast({
            title: '取消点赞',
          })
          this.setData({ likeStatus: '未点赞', likeCount: this.data.likeCount - 1 })
        }
      }).catch(interact.errorToast)
    }
  }
})