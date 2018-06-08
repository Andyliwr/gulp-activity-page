/**
 * 滚动文字效果
 * 参数说明  container 为最外层容器的id(必须是id) direction 为滚动方向 （top 或left） distance 和delay
 * 同时使用  distance  为滚动距离，delay为滚动间隔 speed  为滚动速度  单位是毫秒
 * @param {Object} option 
 * @example option =>{target:'container',direction:'left',distance:30,speed:50,delay:0}
 */
function scroll_text(option) {
  var area = document.getElementById(option.target)
  area.style.webkitUserSelect = 'none'
  var distance = option.distance || 24 //单行滚动的高度
  var speed = option.speed || 50 //滚动的速度
  var time
  var delay = option.delay
  if (option.direction == 'top') {
    var startScroll = function startScroll() {
      time = setInterval(scrollUp, speed)
      area.scrollTop++
    }

    var scrollUp = function scrollUp() {
      if (area.scrollTop % distance == 0) {
        clearInterval(time)
        setTimeout(startScroll, delay)
      } else {
        area.scrollTop++
        if (area.scrollTop >= area.scrollHeight / 2) {
          area.scrollTop = 0
        }
      }
    }

    area.scrollTop = 0
    area.innerHTML += area.innerHTML

    setTimeout(startScroll, delay)
  }
  if (option.direction == 'left') {
    var _startScroll = function _startScroll() {
      time = setInterval(scrollLeft, speed)
      area.scrollLeft++
    }

    var scrollLeft = function scrollLeft() {
      if (area.scrollLeft % distance == 0) {
        clearInterval(time)
        setTimeout(_startScroll, delay)
      } else {
        area.scrollLeft++
        if (area.scrollLeft >= area.scrollWidth / 2) {
          area.scrollLeft = 0
        }
      }
    }

    area.scrollLeft = 0
    var li_width = 0
    $('#' + option.target + ' li').each(function(item, value) {
      li_width += $(value).width()
    })
    if (li_width > $('#' + option.target).width()) {
      setTimeout(_startScroll, delay)
      area.innerHTML += area.innerHTML
    }
  }
  $('#' + option.target).on('click', function(e) {
    if ($(e.target)[0].tagName.toUpperCase() == 'LI') {
      if ($($(e.target)[0]).attr('data-url')) {
        window.location.href = $($(e.target)[0]).attr('data-url')
      }
    }
  })
}
