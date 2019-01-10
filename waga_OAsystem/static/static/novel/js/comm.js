$(function(){
    toastr.options.positionClass = 'toast-top-center';
    // $('[data-toggle="tooltip"]').tooltip();

});
/*全选*/
function CheckAll(form)
  {
    console.log(form);
  for (var i=0;i<form.elements.length;i++)
    {
    var e = form.elements[i];
    if (e.name != 'chkall')
       e.checked = form.chkall.checked;
    }
}
/*获取全选ID值*/
function getCheckAllData(){
    var ids='';
    $("#formlist [name='ids']:checked").each(function(){
    ids+=ids!=''?',':'';
    ids+=$(this).val();
    });
    return ids;
}
var noticemsg=new function(){///公告
    var _notice_key='notice_msg';
    var _authread_index=-1;
    this.showmsgnumEx=function(num){
        if(num>0){
            _show(num);
            $("#noticemenu").css('color','#E85656');
        }
    }
    this.showmsgnum=function(num){
        var val=Cookies.get(_notice_key);
        if(val){
            val=num-parseInt(val);
            if(val>0){
                _show(val);
            }
        }else{
            _show(num);
        }
    }
    this.setmsgnum=function(){
        Cookies.set(_notice_key, _Notice, { expires: 10 * 365 * 24 * 60 * 60 });
    }
    function _show(num){
        num=num>=9?'9+':num;
        $(".notice_msgnum").text(num);
    }
    this.autoreaddlg=function(){
        _autoreaddlg();
    }
    function _autoreaddlg(){
        var length= typeof _unReadTop != 'undefined' ? _unReadTop.length : 0;
        if(length<=0 && _authread_index>=length){
            return;
        }
        var info=_unReadTop[++_authread_index];
        // var info=data.data;

        var dialog=Ewin.dialog({
            'title':info.title,
            'message':info.body,
            'btnok':'我知道了',
            'isbtncl':false
        });
        //info.id

        var pdata = { action:'notice_rd', id:info.id };

        sendData(api_url, pdata, function(data){});

        dialog.on(function(status){
            _autoreaddlg();
        });
    }
}

var api=new function(){
    this.showtip=function(msg){////警告提示信息
        $("#tipdlg").html('<div class="alert alert-warning alert-dismissible" role="alert" ><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'+msg+'</div>');
    }
    this.submitStatus=function(status,elname,txt){////提交btn状态更新
        if(status){
            txt=!txt?'':txt;
            $(elname).attr({"disabled":'disabled'}).html('<i class="fa fa-spinner fa-spin"></i>'+txt);
        }else{
            $(elname).removeAttr('disabled').html(txt);
        }
    }
    this.GetRandomNum=function (Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    }

    this.TextToHtml=function (text) {
      if (!text) {
        return text;
      }
      text = text.replace(/((http|https):\/\/[^\s]+)/g, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
      });
      text = text.replace(/\n/g, '<br/>');
      return text;
    }
    this.CopyText_modal=function(){
        new Clipboard('.btn-copy-url', {
            text: function() {return $(".text-copy-url").text();}
        }).on('success', function(e) {
            e.clearSelection();
            toastr.success('推广链接复制成功');
        });
    }
    this.CopyText_footbar=function(){
        new Clipboard('.foot-btn-copy-url', {
            text: function() {return $(".foot-text-copy-url").text();}
        }).on('success', function(e) {
            e.clearSelection();
            toastr.success('推广链接复制成功');
        });
    }
}
function sendData(url,data,callback){
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: function (data) {
            try {
                callback(data);
            } catch(e) {
                console.log(e);
            }
            return data
            return false;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown){
            callback('error');
        }
    });
}
function getDispatchFollow(obj,aid,Ver){
    var value=$(obj).val();
    if(value==''){
        $(obj).next().text('');
        return;
    }

    if( Ver > 0 ){
        var data={
            action:'getfollowtext',
            aid:aid,
            num:value,
            ver_code:Ver,
        }
    } else {
        var data={
            action:'getfollowtext',
            aid:aid,
            num:value,
        }
    }



    sendData(api_url,data,function(data){
        // if(data=='error'){
        //     toastr.error('网络繁忙，请稍候再试');
        //     return;
        // }
        // if(data.err<0){
        //     toastr.warning(data.msg);
        //     $(obj).val('');
        //     $(obj).next().text('');
        //     return;
        // }
        // if(data.err==0){
            $(obj).next().text(data.data.text);
        // }
    });
}
function submitDispatch(type,did,aid,num,Ver){
    if(Ver > 0 ){

        var dialog=Ewin.dialog({
            btnok:did>0?'保存修改':'保存创建',
            title:did>0?"修改属性":"创建推广链接",
            message:'<div style="text-align:center"><i class="fa fa-spinner fa-spin" style="font-size: 46px;margin:0 auto;"></i></div>',
            url:api_url+'?type='+type+'&did='+did+'&aid='+aid+'&num='+num+"&ver_code="+Ver,
        });

    } else  {

        var dialog=Ewin.dialog({
            btnok:did>0?'保存修改':'保存创建',
            title:did>0?"修改属性":"创建推广链接",
            message:'<div style="text-align:center"><i class="fa fa-spinner fa-spin" style="font-size: 46px;margin:0 auto;"></i></div>',
            url:api_url+'?type='+type+'&did='+did+'&aid='+aid+'&num='+num,
        });

    }
    // $("#"+dialog.id).off().on( 'hidden', 'hidden.bs.modal');
    // $("#"+dialog.id).off().on( 'hidden', 'hidden.bs.modal');
    $("#"+dialog.id).off().on( 'hidden');
    $("#"+dialog.id).off().on('hidden.bs.modal');
    dialog.on(function(result){

        if(result){
            try{
                if(__cfg && did==0){
                    $("#title_id").val(__cfg.title);
                    $("#cover_id").val(__cfg.cover);
                    $("#body_id").val(__cfg.body);
                    $("#footer_id").val(__cfg.footer);
                }
            }catch(e){
                console.log(e);
            }
            var data=$("#dispatch-form").serialize();

            data+='&action=dispatch_save';

            sendData(api_url,data,function(data){

                $("#"+dialog.id).remove();
                $(".modal-backdrop").remove();
                $("body").removeClass('modal-open').removeAttr('style');

                if( data.data.ver_code > 0 ){
                //---------------------------------
                showResultDlg(data.data.url,data.did,data.data.did,"dispatch_list",data.data.ver_code);
                //------------------------------

                } else {
                //---------------------------------
                showResultDlg(data.data.url,data.did,data.data.did,"dispatch_list");
                //------------------------------

                }

            });

        }else{

            $("#"+dialog.id).remove();
            $(".modal-backdrop").remove();
            $("body").removeClass('modal-open').removeAttr('style');

        }

        return true;
    });
}
function submitInDispatch(type,did,aid,num,Ver){

    if(Ver > 0 ){
        var dialog=Ewin.dialog({
            btnok:did>0?'保存修改':'保存创建',
            title:did>0?"修改属性":"创建内推链接",
            message:'<div style="text-align:center"><i class="fa fa-spinner fa-spin" style="font-size: 46px;margin:0 auto;"></i></div>',
            url:api_url+'?type='+type+'&did='+did+'&aid='+aid+'&num='+num+'&state=Internal_push&ver_code='+Ver,
        });
    } else {
        var dialog=Ewin.dialog({
            btnok:did>0?'保存修改':'保存创建',
            title:did>0?"修改属性":"创建内推链接",
            message:'<div style="text-align:center"><i class="fa fa-spinner fa-spin" style="font-size: 46px;margin:0 auto;"></i></div>',
            url:api_url+'?type='+type+'&did='+did+'&aid='+aid+'&num='+num+'&state=Internal_push',
        });
    }



    $("#"+dialog.id).off().on( 'hidden');
    $("#"+dialog.id).off().on( 'hidden.bs.modal');

    dialog.on(function(result){

        if(result){
            try{
                if(__cfg && did==0){
                    $("#title_id").val(__cfg.title);
                    $("#cover_id").val(__cfg.cover);
                    $("#body_id").val(__cfg.body);
                    $("#footer_id").val(__cfg.footer);
                }
            }catch(e){
                console.log(e);
            }
            var data=$("#dispatch-form").serialize();
            data+='&action=idispatch_save';

            sendData(api_url,data,function(data){

                $("#"+dialog.id).remove();
                $(".modal-backdrop").remove();
                $("body").removeClass('modal-open').removeAttr('style');

                if( data.data.ver_code > 0 ){
                    //---------------------------------
                    showResultDlg(data.data.url,data.did,data.data.did,'idispatch_list',data.data.ver_code);
                    //------------------------------
                } else {
                    //---------------------------------
                    showResultDlg(data.data.url,data.did,data.data.did,'idispatch_list');
                    //------------------------------
                }


            });
        }else{
            $("#"+dialog.id).remove();
            $(".modal-backdrop").remove();
            $("body").removeClass('modal-open').removeAttr('style');
        }
        return true;
    });
}
function showResultDlg(url,did,newdid,sourcetype,Ver){
    var html='<div style="font-size:16px;"><div>请复制下方推广链接，您可以在后台菜单的"推广链接"中找到它并查看统计数据</div><div style="margin:10px 0" class="text-success text-copy-url">'+url+'</div><div style="color:red;"><i class="fa fa-info-circle"></i> 请使用此链接作为文案的原文链接地址</div></div>';
    if(Ver){
        var qrcode_img='/'+sourcetype+'.php?qrimgdid='+newdid+'&ver_code='+Ver;//文案二维码
        var qrcode_code='/'+sourcetype+'.php?qrcodedid='+newdid+'&ver_code='+Ver;//普通二维码
    } else {
        var qrcode_img='/'+sourcetype+'.php?qrimgdid='+newdid;//文案二维码
        var qrcode_code='/'+sourcetype+'.php?qrcodedid='+newdid;//普通二维码
    }
    html+='<div class="disatch_qrcodebox">\
            <div class="qr-line">\
                <div class="w1 img"><div id="qrcodeimg1"></div><img src="'+imgurl+'novel/img/template_qrcodebg.png"></div>\
                <div class="w2"><a class="btn btn-success" href="'+qrcode_img+'" download="qrcodeimg'+newdid+'">下载</a></div>\
            </div>\
            <div class="qr-line">\
                <div class="w1"><div id="qrcodeimg2"></div></div>\
                <div class="w2"><a class="btn btn-success" href="'+qrcode_code+'" download="qrcodecode'+newdid+'">下载</a></div>\
            </div>\
            </div>';
    var dialog=Ewin.dialog({
        btnok:'复制推广链接',
        isbtncl:false,
        title:'保存成功',
        message:html,

    });

    $('#qrcodeimg1').qrcode({width: 100,height:100,text: url});
    $('#qrcodeimg2').qrcode({width: 100,height:100,text:url});
    $("#"+dialog.id).find('.ok').addClass('btn-copy-url');
    // $("#"+dialog.id).off().on( 'hidden', 'hidden.bs.modal');
    $("#"+dialog.id).off().on( 'hidden');
    $("#"+dialog.id).off().on('hidden.bs.modal');
    dialog.on(function(result){


        if(result){
        }else{
            if(did==newdid){
                $("#"+dialog.id).remove();
                $(".modal-backdrop").remove();
                $("body").removeClass('modal-open').removeAttr('style');
            }else{

                if('/wxeditor/view'==location.pathname){///文案页
                    window.location.href='/wxeditor/view?did='+newdid;
                    return;
                }else if('/wxeditor/in-view'==location.pathname){///文案页
                    window.location.href='/wxeditor/in-view?did='+newdid;
                    return;
                }
            }

            if('./dispatch_list.php'=="."+location.pathname){///推广列表
                window.location.reload();
                return;
            }else if('./idispatch_list.php'=="."+location.pathname){///内推列表
                window.location.reload();
                return;
            }else if('./book_body.php'=="."+location.pathname){///章节列表
                if(location.search.match('in_link')){
                    window.location.href='./idispatch_list.php';
                    return;
                } else {
                    window.location.href='./dispatch_list.php';
                    return;
                }
            }
        }

    });
}




/****Bootstrap对话框*******************************/
(function ($) {
    window.Ewin = function () {
        var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
        '<div class="modal-dialog modal-sm">' +
         '<div class="modal-content">' +
         '<div class="modal-header">' +
          '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
          '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
         '</div>' +
         '<div class="modal-body">' +
         '<p>[Message]</p>' +
         '</div>' +
         // '<div class="modal-footer">' +
        // '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
        // '<button type="button" class="btn btn-success ok" data-dismiss="modal">[BtnOk]</button>' +
        // '</div>' +
         '</div>' +
        '</div>' +
        '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function () {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function (options) {
          options = $.extend({}, {
              title: "操作提示",
              message: "提示内容",
              btnok: "确定",
              btncl: "取消",
              isbtnok:true,
              isbtncl:true,
              width: 200,
              auto: false
              }, options || {});
          var modalId = generateId();
          var content = html.replace(reg, function (node, key) {
              return {
                   Id: modalId,
                   Title: options.title,
                   Message: options.message,
                   BtnOk: options.btnok,
                   BtnCancel: options.btncl
              }[key];
          });
          $('body').append(content);
          var modal=$('#' + modalId);
          modal.modal({
              width: options.width,
              backdrop: 'static'
          });
          modal.on('hide.bs.modal', function (e) {
            $('body').find('#' + modalId).remove();
          });
          !options.isbtnok && modal.find('.ok').hide();
          !options.isbtncl && modal.find('.cancel').hide();
          return modalId;
        }

        return {
            alert: function (options) {
              if (typeof options == 'string') {
               options = {message: options};
              }
              var id = init(options);
              var modal = $('#' + id);
              modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
              modal.find('.cancel').hide();
                return {
                   id: id,
                   on: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.find('.ok').click(function () { callback(true); });
                       }
                   },
                   hide: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.on('hide.bs.modal', function (e) {
                        callback(e);
                        });
                       }
                   }
                };
            },
            confirm: function (options) {
              var id = init(options);
              var modal = $('#' + id);
              modal.find('.ok').removeClass('btn-primary').addClass('btn-success');
              modal.find('.cancel').show();
              return {
                   id: id,
                   on: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.find('.ok').click(function () { callback(true); });
                        modal.find('.cancel').click(function () { callback(false); });
                       }
                   },
                   hide: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.on('hide.bs.modal', function (e) {
                        callback(e);
                        });
                       }
                   }
              };
            },
            dialog: function (options) {
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.modal-dialog').removeClass('modal-sm');
                // 弹窗信息
                if(options.url){
                    modal.find('.modal-body').load(options.url);
                }else{
                    modal.find('.modal-body').html(options.message);
                }
                return {
                   id: id,
                   on: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.find('.ok').click(function () { callback(true); });
                        modal.find('.cancel').click(function () { callback(false); });
                        modal.find('.close').click(function () { callback(false); });
                       }
                   },
                   hide: function (callback) {
                       if (callback && callback instanceof Function) {
                        modal.on('hide.bs.modal', function (e) {
                        callback(e);
                        });
                       }
                   }
                };

            }
        }
    }();
})(jQuery);
