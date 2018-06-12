(function($) {
  function Dialog(config) {
    this.config = {
      title: '',
      message: '出错了',
      buttons: null
    }
    //默认参数扩展
    if (config && $.isPlainObject(config)) {
      $.extend(this.config, config)
    }
    this.init()
  }
  Dialog.prototype.init = function() {
    this.body = $('body')
    //创建弹出窗口
    this.dialogWrap = $('<div class="ths-dialog-wrap"></div>')
    //创建遮罩层
    this.mask = $('<div class="mask"></div>')
    //创建弹出窗口dialog
    this.dialog = $('<div class="ths-dialog"></div>')
    //创建弹出窗口body
    this.dialogHd = $('<div class="ths-dialog-hd"></div>')
    //创建弹出窗口body
    this.dialogBd = $('<div class="ths-dialog-bd"></div>')
    //创建弹出窗口footer
    this.dialogFt = $('<div class="ths-dialog-ft ths-border-t"></div>')
    //渲染DOM
    this.clear()
    this.creact()
    this.show()
    this.event()
  }
  Dialog.prototype.event = function() {
    var _this = this,
      mask = this.mask,
      dialogHd = this.dialogHd
    mask.on('click', function() {
      _this.hide()
    })
    // 监听关闭按钮的点击事件
    dialogHd.find('.ths-dialog-close').on('click', function(){
      _this.hide()
    })
  }
  Dialog.prototype.clear = function(){
    if($('.ths-dialog-wrap').length > 0){
      $('.ths-dialog-wrap').remove()
    }
  }
  Dialog.prototype.creact = function() {
    var _this = this,
      body = $('body'),
      config = this.config,
      dialogWrap = this.dialogWrap,
      mask = this.mask,
      dialog = this.dialog,
      dialogHd = this.dialogHd,
      dialogBd = this.dialogBd,
      dialogFt = this.dialogFt
    dialogWrap.append(mask)
    //如果传了标题
    if (config.title) {
      dialog.append(dialogHd.html(config.title + '<i class="ths-dialog-close"></i>'))
    }
    //如果传了信息文本
    if (config.message) {
      dialog.append(dialogBd.html(config.message))
    }
    if (config.buttons && config.buttons.length > 0) {
      _this.creactButton(config.buttons, dialogFt)
      dialog.append(dialogFt)
    }
    dialogWrap.append(dialog)
    body.append(dialogWrap)
  }
  Dialog.prototype.creactButton = function(buttons, footer) {
    var _this = this
    $(buttons).each(function(index) {
      var callback = this.callback ? this.callback : null,
        button = $(`<a class="btn-item${this.className ? ' ' + this.className : ''}">${this.text ? this.text : ''}</a>`)
      if (callback) {
        button.click(function() {
          var isClose = callback()
          if (isClose !== false) {
            _this.hide()
          }
        })
      } else {
        button.click(function() {
          _this.hide()
        })
      }
      footer.append(button)
    })
  }
  Dialog.prototype.hide = function() {
    var _this = this
    if($('.ths-dialog-wrap .login').length > 0){
      isPhoneCorrect = false
      isPhoneYzmCorrect = false
      isGetYzmCanBeClick = true
      hasCickGetYzm = false
      telphone = ''
      phoneYzm = ''
      clearInterval(yzmTimer)
      yzmTimer = null // timer of getting check code
      skeyArr = [] // encryption infomation array
    }
    if(_this.config.closeStat){
      if(_this.config.notUseNewStat){
        hxmClickStat(_this.config.closeStat)
      }else{
        newClickStat(_this.config.closeStat)
      }
    }
    _this.dialogWrap.removeClass('show').addClass('hide')
    setTimeout(function() {
      _this.dialogWrap.remove()
      $('body').css('overflow', 'auto')
    }, 250)
  }
  Dialog.prototype.show = function() {
    var _this = this
    setTimeout(function() {
      _this.dialogWrap.removeClass('hide').addClass('show')
      $('body').css('overflow', 'hidden')
    }, 100)
  }
  window.Dialog = Dialog
  $.dialog = function(config) {
    return new Dialog(config)
  }
})(Zepto || $)
