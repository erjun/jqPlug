!function($){

    "use strict"

    /* CLASS NOTICE DEFINITION
     * ======================= */

    var Popup = function (elem, options) {
        this.Status = 'off'
        this.$elem = $(elem)
        this.options = options
        this.init()
    }

    Popup.prototype = {

        init: function(){
            var options = this.options
            options.shade == null ? this.$elemBox = this.$elem : this.$elemBox = this.$elem.wrap("<div class='popup-box'></div>").after("<div class='popup-shade'></div>")

            var $self = this
              , $clone = this.$elem.clone().css({display:'block',position:'absolute',top:'-100000px'}).appendTo("body")
              , $cloneWidth = $clone.width()
              , $cloneHeight = $clone.height()
              , $window = $(window)

            $clone.remove()
            options.elemTop === null ? $cloneHeight = $window.height() / 2 - $cloneHeight / 2 : $cloneHeight = options.elemTop
            options.elemLeft === null ? $cloneWidth = $window.width() / 2 - $cloneWidth / 2 : $cloneWidth = options.elemLeft 

            this.$elem.css({
                position:"absolute",top:$cloneHeight,left:$cloneWidth
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
