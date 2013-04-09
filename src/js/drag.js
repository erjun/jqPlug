!function () {

    "use strict"

        /* CLASS NOTICE DEFINITION
         * ======================= */

        var Drap = function (options) {
        }

    function(options){
        options = $.extend({ //默认参数
            thenElem:null,
                inElem:null
        },
        options);
        var $thenElem=options.thenElem,
            $inElem=options.inElem,
            on=false,
            inX=0,
            inY=0;
        if($thenElem===null){
            $thenElem=this;
        }
        if($inElem===null){
            $inElem=$thenElem;
        }
        $inElem.css({
            cursor:"move"
        });
        $inElem.bind("mousedown",function(e){
            on=true;
            inX=e.clientX-parseInt($thenElem.css("left"));
            inY=e.clientY-parseInt($thenElem.css("top"));

        });
        $(document).bind("mousemove",function(e){
            if(on===false){return}
            var x=e.clientX-inX,y=e.clientY-inY;
            $thenElem.css({
                left:x+"px",top:y+"px"
            });
        }); 
        $inElem.bind("mouseup",function(){
            on=false;
        });
    }

}(window.jQuery)
