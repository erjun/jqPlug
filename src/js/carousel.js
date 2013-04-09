(function($) {
	var Carousel = function(element, options) {
		this.$element = $(element)
		this.options = options
		this.options.slide && this.slide(this.options.slide)
		this.options.pause == 'hover' && this.$element.bind('mouseenter', $.proxy(this.pause, this)).bind('mouseleave', $.proxy(this.cycle, this))
		this.len = this.$element.find("img").length
	}
	Carousel.prototype = {
        debug:false
      , init:function(){
            var that=this
            if(this.debug===true){console.log('init ok')}
            this.$element.css({position:"relative",overflow:"hidden"})
            this.imgWHSet(this.$element.find(".active"))
            if(!$.isArray(this.options.inputType))this.options.inputType=[this.options.inputType]
            $.each(this.options.inputType,function(){
                if(this=='next') that.nav=true
            })
            
            //如果是slide切换就给容器加上所有.item节点总宽度
            if(this.options.changeType=='slide'){
                this.$element.css({position:"absolute"})
                this.$elemWidth=this.$element.width()
                this.$element.css({
                    width:this.$element.find('.item').length*this.$elemWidth
                })
            }

            this.changeControl()
            return this
        }
	  ,	setTitle: function(elem) {
			this.$element.find("h1").text(elem.find("img").attr("alt"))
		}
	  ,	cycle: function(e) {
			if (!e) {
				this.paused = false
			}
			this.options.interval && ! this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
			return this
		}
	  ,	to: function(pos) {
			var $active = this.$element.find('.item.active'),
			children = $active.parent().children(),
			activePos = children.index($active),
			that = this
			if (pos > (children.length - 1) || pos < 0) return
			if (this.sliding) {
				return this.$element.one('slid', function() {
					that.to(pos)
				})
			}
			if (activePos == pos) {
				return this.pause().cycle()
			}
			return this.slide(pos > activePos ? 'next': 'prev', $(children[pos]))
		}
	  ,	pause: function(e) {
			if (!e) this.paused = true
			clearInterval(this.interval)
			this.interval = null
			return this
		}
	  ,	next: function() {
			if (this.sliding) return
			return this.slide('next')
		}
	  ,	prev: function() {
			if (this.sliding) return
			return this.slide('prev')
		}
	  ,	slide: function(type, next) {
			var isCycling = this.interval
              , fallback = type == 'next' ? 'first': 'last'
              , that = this
            this.$active = this.$element.find('.active')
			this.$next = next || this.$active[type]('.item')
            var e = $.Event('slide', {
                relatedTarget: that.$next[0]
            })
			this.direction = type == 'next' ? 'left': 'right'
            isCycling && this.pause()
            if(this.debug===true){console.log(isCycling)}
			that.$next = that.$next.length ? that.$next: this.$element.find('.item')[fallback]()
            if (that.$next.hasClass('active')) return
            if (this.$element.find(".item").is(":animated")) return
            this.sliding = true

            this.imgWHSet(that.$next)
            this.slideType()[this.options.changeType]()
            if(that.nav===true){
                var $index=this.$nextIndex=this.$next.index()

                this.$element.siblings("ol").find("li").eq($index).addClass("focus").siblings("li").removeClass("focus")
            }
            
            this.$active.removeClass('active')
            this.$next.addClass('active')
            this.sliding = false
            isCycling && this.cycle()
            this.cycle()
            this.$element.trigger('slid')
            return this
		}
      , slideType:function(){//切换风格
            var self=this
              , base=function(){
                self.$next.show(0, function() {
                    self.$active.hide(self.options.imgHideTime)
                })
             }
              , fade=function(){
                self.$next.fadeIn(self.options.imgShowTime) 
                .siblings(".item").fadeOut(self.options.imgHideTime); 
            }
              , left=function(){
                self.options.imgHideTime > self.options.imgShowTime ? self.options.imgShowTime = self.options.imgHideTime: {}
                var $width = self.$element.width()
                self.$next.css({
                    display: "block",
                    left:  "-"+$width+ "px"
                })
                self.$active.animate({
                    left:  $width + "px"
                },
                self.options.imgShowTime, function() {
                    $(this).css({
                        display: "none"
                    })
                })
                self.$next.animate({
                    left: 0+ "px"
                },
                self.options.imgShowTime)
            } 
              , top=function(){
                self.options.imgShowTime > self.options.imgShowTime ? self.options.imgShowTime = self.options.imgShowTime: {}
                var $height = $tu.height()
                $dh.css({
                    display: "inline",
                    top: self.num > index ? $height + "px": "-" + $height + "px"
                })
                $qdh.animate({
                    top: self.num > index ? "-" + $height + "px": $height + "px"
                },
                self.options.imgShowTime, function() {
                    $(self).css({
                        display: "none"
                    })
                })
                $dh.animate({
                    top: "0px"
                },
                self.options.imgShowTime)
            }
              , slide=function(){
                var n=self.$next.index()
                var intLeft = 0 - n * self.$elemWidth
                self.$element.animate({
                    left:intLeft
                },300)
            }
            return {
                base:base,
                fade:fade,
                left:left,
                top:top,
                slide:slide
            }
        }
      , imgWHSet: function($next) {//图片宽高设置
            var self=this
            if (self.options.imgWH[0]===0 || self.options.imgWH[1]===0) {
                return
            }
            if(this.debug){console.log('imgWHSet ok')}
            var $then =$next.find("img"),
                $src = $then.attr("src")
            $("<img />").bind("load", function() {
                var h = this.height,
                    w = this.width,
                    $w=self.options.imgWH[0]||0,
                    $h=self.options.imgWH[1]||0
                if (!self.options.imgWH[2]) {
                    w < $w ? $w = w : null
                    h < $h ? $h = h : null
                }
                $then.css({
                    width: $w + "px",
                    height: $h + "px"
                })
                self.$element.css({
                    width: $w + "px",
                    height: $h + "px"
                })
            }).attr("src", $src)
        }
      , changeControl:function(){
           var self=this,
               types=self.options.inputType
            types = $.isArray(types) ? types : [types]
            $.each(types,function(i) {
                if(type == null) return
                var that = this.split(":")
                  , type=that[0]
                  , event=that[1]||'click'
                self.inputType()[type](event)
            })
        }
      , inputType:function(){
            var self=this
              , number=function(event){
                   var $ol=$("<ol></ol>"),
                       mr = (700-(self.len*45-5))/2
                    for (var i = 1; i < self.len + 1; i++) {
                        if(i != 1){
                            $ol.append("<li>"+i+"</li>"); 
                        }else if(i == 1){
                            $ol.append("<li style='margin-left:"+mr+"px'>"+i+"</li>"); 
                        }
                    }
                    self.$element.before($ol)
                    var $li=self.$element.siblings("ol").find("li")
                    $li.first().addClass("focus"); 
                    var eventFun=function(){
                        var $index=$(this).index(),
                            type='next',
                            activeIndex=self.$element.find('.active').index(),
                            $next=self.$element.find('.item').eq($index)
                        if(activeIndex>$index){
                            type='prev'
                        }
                        self.slide(type,$next)
                    }
                    if(event=='hover'){
                        $li.hover(eventFun,function(){
                            self.$element.stop()
                            var n=self.$next.index()
                            var intLeft = 0 - n * self.$elemWidth
                            self.$element.css({left:intLeft+"px"})
                        })
                    }else{
                        $li.bind(event,eventFun)
                    }
           }
              , next=function(event){
                    self.$element.before("<a class='prev' href='#'></a>").after("<a class='next' href='#'></a>")
                    self.$element.siblings(".next").bind(event,function() {
                        self.next()
                        return false
                    })
                    self.$element.siblings(".prev").bind(event,function() {
                        self.prev()
                        return false
                    })
            }
            return {
                number:number,
                next:next
            }
        }
	}
	$.fn.carousel = function(option) {
		return this.each(function() {
			var $this = $(this)
              , data = $this.data('carousel')
              , options = $.extend({},$.fn.carousel.defaults, typeof option == 'object' && option)
              , action = typeof option == 'string' ? option : options.slide
			if (!data) {
				$this.data('carousel', (data = new Carousel(this, options).init()))
			}
			if (typeof option == 'number') {
				data.to(option)
			} else if (action) {
				data[action]()
			} else if (options.interval) {
				data.cycle()
			}
		})
	}

	$.fn.carousel.defaults = {
		interval: 3000,
		pause: 'hover',
		changeType:'base',
		imgShowTime: 1000,
		imgHideTime: 1000,
		inputType:'number',
		timingPlay: true,
		title: true,
		imgWH: [0, 0]
	}

	$.fn.carousel.Constructor = Carousel

  $(document).on('click.carousel.data-api', '[data-slide]', function (e) {
        var $this = $(this)
          , href
          , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) 
          , options = $.extend({}, $target.data(), $this.data())
        $target.carousel(options)
        e.preventDefault()
  })
    

})(window.jQuery)


