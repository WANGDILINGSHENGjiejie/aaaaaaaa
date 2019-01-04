/**
 * 加入我们轮播js
 */
$(document).ready(function(){
    var index=0;
    var length=$("#jobInfo ul li").length;
    var i=1;

    //关键函数：通过控制i ，来显示图片
    function showImg(i){
        $("#jobInfo ul li")
            .eq(i).stop(true,true).fadeIn(800)
            .siblings("li").hide();
         $("#cbtn li")
            .eq(i).addClass("hov")
            .siblings().removeClass("hov");
    }

    function slideNext(){
        if(index >= 0 && index < length-1) {
             ++index;
             showImg(index);
        }else{
            //if(confirm("已经是最后一张,点击确定重新浏览！")){
                showImg(0);
                index=0;
                aniPx=(length-6)*155+'px'; //所有图片数 - 可见图片数 * 每张的距离 = 最后一张滚动到第一张的距离
                $("#cSlideUl ul").animate({ "left": "+="+aniPx },200);
                i=1;
            //}
            return false;
        }
        if(i<0 || i>length-6) {return false;}
               $("#cSlideUl ul").animate({ "left": "-=155px" },200)
               i++;
    }

    function slideFront(){
       if(index >= 1 ) {
             --index;
             showImg(index);
        }
        if(i<2 || i>length+6) {return false;}
               $("#cSlideUl ul").animate({ "left": "+=155px" },200)
               i--;
    }
        $("#jobInfo ul li").eq(0).show();
        $("#cbtn li").eq(0).addClass("hov");

        $(".picSildeRight,#next").click(function(){
               slideNext();
           })
        $(".picSildeLeft,#front").click(function(){
               slideFront();
           })
        $("#cbtn li").click(function(){
            index  =  $("#cbtn li").index(this);
            showImg(index);
        });
    })