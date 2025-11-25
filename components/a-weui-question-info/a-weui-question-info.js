const api = require('../../utils/api')
const data = require('../../utils/data')
const interact = require('../../utils/interact')
Component({
  data: {
    solvedFlag: false,
    viewCount: 0,
    commentCount: 0,
    likeCount: 0,
    likeStatus: '未登录',
    collectCount: 0,
    collectStatus: '未登录',
    entityUserId: 0,
    questionId: 0,
    isOwn: false,
    username: '',
    categoryId: 0,
    // where can good or collect 
    canConduct: false,
  },
  methods: {
    initData: function (d) {
      this.setData(d)
      this.setData({ isOwn: data.isOwn(this.data.username) })
    },
    deleteQuestion: function () {
      interact.warnModal('删除题目', () => {
        api.deleteQuestion(this.data.questionId).then(() => {
          wx.showToast({ title: '删除成功' })
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/questions/questions?categoryId=' + this.data.categoryId })
          }, 1500);
        }).catch(interact.errorToast)
      })
    },
    flagSolved: function () {
      interact.warnModal('标记解决', () => {
        api.flagSolved(this.data.questionId, !this.data.solvedFlag).then(() => {
          wx.showToast({ title: '标记已经解决', })
          this.setData({ solvedFlag: !this.data.solvedFlag })
        }).catch(interact.errorToast)
      })
    },
    likeQuestion: function () {
      if (!this.data.canConduct) return 
      if (this.data.likeStatus == '未登录') {
        interact.errorToast('未登录')
        return
      }
      api.likeQuestion(this.data.questionId, this.data.entityUserId).then(() => {
        if (this.data.likeStatus == '未点赞') {
          wx.showToast({ title: '点赞成功', })
          this.setData({ likeStatus: '已点赞', likeCount: this.data.likeCount + 1 })
        } else {
          wx.showToast({ title: '取消点赞', })
          this.setData({ likeStatus: '未点赞', likeCount: this.data.likeCount - 1 })
        }
      }).catch(interact.errorToast)
    },
    collectQuestion: function () {
      if (!this.data.canConduct) return 
      if (this.data.collectStatus == '未登录') {
        interact.errorToast('未登录')
        return
      }
      api.likeQuestion(this.data.questionId, this.data.entityUserId).then(() => {
        if (this.data.collectStatus == '未收藏') {
          wx.showToast({ title: '收藏成功', })
          this.setData({ likeStatus: '已收藏', collectCount: this.data.collectCount + 1 })
        } else {
          wx.showToast({ title: '取消收藏', })
          this.setData({ likeStatus: '未收藏', collectCount: this.data.collectCount - 1 })
        }
      }).catch(interact.errorToast)
    },
    correntQuestion: function () {
      interact.warnModal('修改题目', () => {
        this.triggerEvent('correntQuestion')
      })
    }
  }
})