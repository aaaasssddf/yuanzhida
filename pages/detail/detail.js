const api = require('../../utils/api')
const data = require('../../utils/data')
const util = require('../../utils/util')
const interact = require('../../utils/interact')
Page({
  options: {
    addGlobalClass: true
  },
  data: {
    containerHeight: 1320,
    question: {},
    questionId: 0,
    CommentPageCurrent: 1,
    outputItems: {},
    // if correct comment
    isCorrect: false,
    isNewConmmentVisible: false,
    correctCommentId: 0,
    inputHeader: '新建解答',
    totalComments: 0,
    currentComments: 0,
    inputItems: [{
        type: 'text',
        key: 'content',
        label: null,
        multiLine: true
      },
      {
        type: 'images'
      }
    ]
  },

  onLoad(options) {
    this.setData({
      questionId: options.id
    })
    this.updateQuestion().then(() => {
      this.updateUserAndTime()
      this.updateQuestionInfo()
      this.updateImagesPreview()
      this.updateComments()
    })
  },
  cancelCorrect: function () {
    this.setData({
      isCorrect: false
    })
  },
  onUpdate: function () {
    // when update comments' status,reflesh the comments from the api
    this.updateComments()
  },
  updateImagesPreview: function () {
    this.selectComponent('#images-preview').initData({
      images: this.data.question.images
    })
  },
  updateUserAndTime: function () {
    this.selectComponent('#user-and-time').initData({
      username: this.data.question.username,
      time: this.data.question.createTime
    })
  },
  updateQuestionInfo: function () {
    const {
      solvedFlag,
      viewCount,
      categoryId,
      commentCount,
      username,
      likeCount,
      userId,
      likeStatus
    } = this.data.question
    this.selectComponent('#question-info').initData({
      solvedFlag,
      viewCount,
      commentCount,
      likeCount,
      entityUserId: userId,
      categoryId,
      username,
      questionId: this.data.questionId,
      likeStatus,
      canConduct: true
    })
  },
  updateQuestion: function () {
    return api.questionDetail(this.data.questionId).then(res => {
      res = util.modifyItem(res)
      res.subject_name = data.getSubjectName(res.categoryId)
      this.setData({
        question: res
      })
    }).catch(interact.errorToast)
  },
  updateComments: function () {
    api.comments({
      id: this.data.questionId,
      size: 10,
      current: this.data.CommentPageCurrent
    }).then(res => {
      this.selectComponent('#comments').initData({
        comments: util.modifyItemList(res.records),
        entityUserId: this.data.question.userId,
        questionUsername: this.data.question.username
      })
      this.setData({
        totalComments: res.total,
        currentComments: res.total > 10 ? 10 : res.total
      })
    }).catch(interact.errorToast)
  },
  onInput: function (e) {
    this.setData({
      outputItems: e.detail
    })
  },
  submit_answer: function () {
    let outputItems = this.data.outputItems
    outputItems['questionId'] = this.data.questionId
    outputItems['topCommentId'] = 0
    outputItems['parentCommentId'] = 0
    wx.showLoading({
      title: '正在提交',
    })
    api.newAnswer(outputItems).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
      })
      this.selectComponent('#input-group').clear()
      this.updateComments()
    }).catch(interact.errorToast)
  },
  onCommmentRedirect: function (e) {
    this.setData({
      CommentPageCurrent: e.detail
    })
    this.updateComments()
  },
  onCorrectComment: function (e) {
    if (!this.isNewConmmentVisible) {
      this.showInput()
    }
    this.setData({
      inputHeader: '修改回答'
    })
    const {
      id,
      content,
      images
    } = e.detail
    const inputItems = this.data.inputItems
    inputItems[0].value = content
    inputItems[1].value = images
    this.setData({
      isCorrect: true,
      inputItems: inputItems,
      correctCommentId: id
    })
    this.selectComponent('#input-group').initData({
      inputItems: this.data.inputItems
    })
  },
  submitCorrect: function () {
    wx.showLoading({
      title: '正在提交',
    })
    api.correctComment({
      id: this.data.correctCommentId,
      content: this.data.outputItems.content,
      images: this.data.outputItems.images
    }).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '修改成功',
      })
      setTimeout(() => {
        this.updateComments()
        this.selectComponent('#input-group').clear()
      }, 1500);
    }).catch(err => {
      wx.hideLoading()
      interact.errorToast(err)
    })
  },
  onCorrentQuestion: function () {
    const {
      title,
      content,
      categoryId,
      images,
      id
    } = this.data.question
    wx.setStorageSync('cachedQuestion', {
      title,
      content,
      categoryId,
      id,
      images
    })
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/newQuestion/newQuestion',
      })
    }, 1500);
  },
  closeInput: function () {
    this.setData({
      isNewConmmentVisible: false,
      containerHeight: 1320
    })
  },
  scrollToLower: function () {
    console.log('触底')
    if (this.data.currentComments < this.data.totalComments) {
      api.comments({
        id: this.data.questionId,
        size: 10,
        current: this.data.CommentPageCurrent + 1
      }).then(res => {
        this.setData({
          totalComments: res.total,
          currentComments: this.data.CommentPageCurrent * 10 < res.total? this.data.CommentPageCurrent * 10 : res.total
        })
        const e = util.modifyItemList(res.records)
        for(let i of e){
        this.selectComponent('#comments').appendComments(i)}
      })
      this.setData({
        currentComments: this.data.currentComments + 10 < this.data.totalComments ? this.currentComments + 10 : this.data.totalComments,
        CommentPageCurrent: this.data.CommentPageCurrent + 1
      })
    }
  },
  showInput: function () {
    if (!this.isCorrect) {
      this.setData({
        inputHeader: '新建解答'
      })
    }
    this.setData({
      isNewConmmentVisible: true,
      containerHeight: 740,
      isCorrect: false,
    })
    this.selectComponent('#input-group').initData({
      inputItems: this.data.inputItems
    })
  }
})