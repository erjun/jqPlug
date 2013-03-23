
!function($){

    "use strict"

    /* CLASS NOTICE DEFINITION
     * ======================= */

    var Popup = function (elem, options) {
        this.Status = 'off'
        this.init(elem, options)
    }

    Popup.prototype = {

        init: function(elem, options){
            this.$elem = $(elem)
            options.shade == null ? this.$elemBox = this.$elem : this.$elemBox = this.$elem.wrap("<div class='popup-box'></div>").after("<div class='popup-shade'></div>")

            var $self = this
              , $clone = this.$elem.clone().css({display:'block',position:'absolute',top:'-100000px'}).appendTo("body")
              , $elemTop = options.elemTop
              , $elemLeft = options.elemLeft
              , $cloneWidth = $clone.width()
              , $cloneHeight = $clone.height()
              , $window = $(window)

            $clone.remove()
            $elemTop === null ? $elemTop = $window.height() / 2 - $cloneHeight / 2 : null
            $elemLeft === null ? $elemLeft = $window.width() / 2 - $cloneWidth / 2 : null 

            this.$elem.css({
                position:"absolute",top:$elemTop,left:$elemLeft
            })

            options.showElem != null && $(document).on('click', function (event) {
                if (event.target != $self.$elem[0] && $self.Status == 'on') {
                    $self.hide()
                }
            })
            options.showElem != null && $(options.showElem).on('click', function (event) {
                if ($self.Status == 'off') {
                    $self.show()
                    return false
                }
            })
            return this
        }

      , show: function (timeout) {
            this.Status = 'on'
            this.$elemBox.show()
            timeout && this.hide(timeout)
            return this
        }

      , hide: function (timeout) {
            this.Status = 'off'
            var $self = this
              , timeout = timeout || 0
            setTimeout(function(){
                $self.$elemBox.hide()
            },timeout)
            return this
        }
    }

    $.fn.popup = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('popup')
              , options = $.extend({}, $.fn.popup.defaults, typeof option == 'object' && option) 
            if(!data) $this.data('popup', (data = new Popup(this, options)))
            //return new Popup(this, options)
        })
    }

    $.fn.popup.defaults = {
        shade : null 
      , elemTop : null
      , elemLeft : null
      , showElem : null
      , hideElem : null
    }

}(window.jQuery);
