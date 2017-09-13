// $(function(){
// 	if(checkLogin()){
// 		doSomething();//每页js统一写在doSomething方法里，方便后续在前面插入方法
// 	}else{
// 		unLoginAction();
// 	}
// });

var sexInfo = {
    '0':'保密',
    '1':'男',
    '2':'女'
}

function checkLogin(){
	
}

function doSomething(){}

function unLoginAction(){}

function initMenu(level1,level2){
	$('#'+level1+'Menage').addClass('active');
	$('#'+level1+'Menage .treeview-menu #'+level2).addClass('active');
}

function logout(target){
	if(!myConfirm('确定退出登录？')) return;
	changeBind(target,true);
    $.ajax({
        url:'/api/user/logout/',
        type:'POST',
        datatype:'json',
        data:{

        },
        success:function(data){
            // console.log("退出登录");
            var data = JSON.parse(data);
            // console.log(data);
            sessionStorage.removeItem("adminLogin");
            window.location.href = "/api/oam/admin/login";
        },
        error:function(error){
            alert("退出登录失败，请刷新...");
        }
    })
}

function showPassword(){
	var editPanel = '<div class="editPanel panel panel-primary" style="width:420px;height:300px;">'
                +'<div class="panel-heading">修改密码</div>'
                +'<div class="panel-body">'
                    +'<div class="form-horizontal">'
                        +'<div class="form-group">'
                            +'<label class="col-sm-3 control-label">旧密码</label>'
                            +'<div class="col-sm-9" style="padding-top:0px;">'
                                +'<input type="password" class="form-control" id="oldPassword"/>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                    +'<div class="form-horizontal">'
                        +'<div class="form-group fileDiv">'
                            +'<label class="col-sm-3 control-label" >新密码</label>'
                            +'<div class="col-sm-9" style="padding-top:0px;">'
                                +'<input type="password" class="form-control" id="newPassword"/>'
                                +'<p style="margin:10px 0px;">密码由6-20位字母和数字组成</p>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                    +'<div class="form-horizontal">'
                        +'<div class="form-group fileDiv">'
                            +'<label class="col-sm-3 control-label" >确认密码</label>'
                            +'<div class="col-sm-9" style="padding-top:0px;">'
                                +'<input type="password" class="form-control" id="rePassword"/>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                    +'<div class="submitDiv form-group">'
                        +'<label class="col-sm-3 control-label" ></label>'
                        +'<div class="col-sm-9" style="padding-top:0px;">'
                            +'<input type="button" class="btn btn-primary saveBtn" value="保存"/>'
                            +'<input type="button" class="btn btn-default cancelBtn" value="取消"/>'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>';
    $('.fixedContainer').html(editPanel);
    $('.submitDiv .saveBtn').on('click',function(){
    	var target = this;
    	var oldPassword = $('#oldPassword').val();
    	var newPassword = $('#newPassword').val();
    	var rePassword = $('#rePassword').val();
        if(!checkNull(oldPassword,'请填写旧密码')) return;
    	if(!checkPassword(newPassword,rePassword,'请填写新密码')) return;
    	var json = {
    		'oldPassword':oldPassword,
    		'newPassword':newPassword
    	}
    	changeBind(target,true);
    	changePassword(json,target);
    });
    $('.submitDiv .cancelBtn').on('click',function(){
        $('.fixedContainer').html('');
        $('.fixedLayer').css('display','none');
    });
    setPanelSize();
    $('.fixedLayer').css('display','block');
}

function setPanelSize(){
    var orgWidth = $('.editPanel').width()+'px' ;
    var orgHeight = $('.editPanel').height()+'px';
    $('.fixedContainer').removeAttr('style');
    $('.fixedContainer').css('width',orgWidth).css('height',orgHeight);
}

function getCategoryInfo(parentId,target,callback){
    console.log(parentId,target);
    $('.level:gt('+(target-1)+')').html("");
    if (target == 1) {
       $.ajax({
            url:'/api/oam/product/categroy1_list',
            type:'GET',
            datatype:'json',
            data:{

            },
            success:function(data){
                var data = JSON.parse(data);
                console.log(data);
                $('#level'+target).html('');

                console.log("分类一"+parentId,target);
                $.each(data.firstlist,function(index,content){
                    $('#level1').append('<option value="'+content.id+'">'+content.name+'</option>');
                });

                if(callback) callback();

                      
            },
            error:function(error){

            }
        }); 
    }
    if (target == 2) {
        var id = $("#level1").val();
        $.ajax({
            url:'/api/oam/product/categroy2_list',
            type:'GET',
            datatype:'json',
            data:{
                'id':id
            },
            success:function(data){
                var data = JSON.parse(data);
                console.log(data);
                $('#level'+target).html('');

                console.log("分类二"+parentId,target);
                $.each(data.secondlist,function(index,content){
                    $('#level2').append('<option value="'+content.id+'">'+content.name+'</option>');
                });

                if(callback) callback();

                      
            },
            error:function(error){

            }
        }); 
    }
    if (target == 3) {
        var id = $("#level2").val();
        $.ajax({
            url:'/api/oam/product/categroy3_list',
            type:'GET',
            datatype:'json',
            data:{
                'id':id
            },
            success:function(data){
                var data = JSON.parse(data);
                console.log(data);
                $('#level'+target).html('');

                console.log("分类三"+parentId,target);
                $.each(data.thirdlist,function(index,content){
                    $('#level3').append('<option value="'+content.id+'">'+content.name+'</option>');
                });

                if(callback) callback();

                      
            },
            error:function(error){

            }
        }); 
    }

}

function changePassword(json,target){
    $.ajax({
        url:'/api/oam/user/password/change',
        type:'POST',
        datatype:'json',
        data:{
            'old_password':json.oldPassword,
            'new_password':json.newPassword
        },
        success:function(data){
            alert('密码修改成功');
            sessionStorage.removeItem("adminLogin");
            window.location.href = "/api/oam/admin/login";
            $('.submitDiv .cancelBtn').click();
        },
        error:function(error){
            changeBind(target,false);
            alert("修改密码失败");
        }
    })
}



//全选与全不选切换,点击全局checkbox触发
function toggleSelect(){
    var globalStatus = $('.global-checkbox').prop('checked');
    if(globalStatus)
        $('.table-checkbox').prop('checked',true);
    else
        $('.table-checkbox').prop('checked',false);
}

//列表中的多选框与head多选框的联动，单击单项checkbox触发
function interSelect(){
    var checkedLen = $('.table-checkbox:checked').length;
    var checkboxNum = $('.table-checkbox').length;
    if(checkedLen==checkboxNum)
        $('.global-checkbox').prop('checked',true);
    else
        $('.global-checkbox').prop('checked',false);

}

function getOnlineStatus(){
    var channelList = [] ;
    var online = 1;     //上线状态
    var offline = 0;    //下线状态
    var checkboxArr = $('.table-checkbox');
    var checkboxArrLen = checkboxArr.length;
    var i;
    for(i=0;i<checkboxArrLen;i++){
        var item = {};
        item.id = $(checkboxArr[i]).attr('data-id');
        if($(checkboxArr[i]).prop('checked')){
            item.status= online;
        }else{
            item.status = offline;
        }
        channelList.push(item);
    };
    return channelList;
}

//Jquery对象，filePath,filenameObj,previewImgNailDiv分别指文件路径，显示文件名对象，预览图片对象Div
function setImgDefaultStatus(filePath,filenameObj,previewImgNailDiv){
    var originName = getUploadFilename(filePath);
    var img = $('<img />');
    //读取文件名
    filenameObj.val(originName)
        .data('data-originName',originName)
        .attr('title',originName);
    //预览图片
    img.load(function(){
        var targetImgDiv = previewImgNailDiv;
        var imgSrc = img.attr('src');
        targetImgDiv.html(img)
            .data('data-orgImgPath',imgSrc);
        var targetImg = targetImgDiv.find(img);
        matchSize(targetImg[0],targetImgDiv[0]);
        targetImgDiv.data('data-orgImgWidth',targetImg.width())
            .data('data-orgImgHeight',targetImg.height());
        //点击展开图片右侧预览
        targetImgDiv.off('click','img').on('click','img',function(){
            viewUploadImg($(this),targetImgDiv.data('data-orgImgPath'));
        });
    });
    img.attr('src',filePath);
    previewImgNailDiv.data('data-imgSource','local');
}
//点击编辑面板的其他地方，收起右侧图片预览
function hideRightPreimg(){
    $('.fixedLayer').on('click',function(event){
        var event = event|| e.event;
        var target = event.target||event.srcElement;
        var cond1 = !$(target).hasClass('nailDiv')&&!$(target).parent().hasClass('nailDiv');
        var cond2 = !$(target).hasClass('imgPreviewDiv')&&!$(target).parent().hasClass('imgPreviewDiv');
        if(cond1&&cond2){
            $('#imgPreview').removeAttr('src').removeAttr('style')
                            .removeAttr('data-parentClass')
        };
    });
}

//选择图片后显示文件名及图片预览
function showFileNameandPreview(target){
    alert("上传图片");
    var filename = getUploadFilename($(target).val());
    var $simulateDiv = $(target).siblings('.upload-simulate');
    var $obj = $simulateDiv.find('.file-name');
    var $objOrigin = $obj.data('data-originName');
    var $objImgDiv = $simulateDiv.find('.nailDiv');
    var $objImgOrg = $objImgDiv.data('data-orgImgPath');
    var $objImgOrgWidth = $objImgDiv.data('data-orgImgWidth');
    var $objImgOrgHeight = $objImgDiv.data('data-orgImgHeight');
    var $objImg = $objImgDiv.find('img');
    var uploadBtn = target;
    var previewDiv = $objImgDiv[0];
    var formId = $(target).closest('form').attr('id');
    var uploadConst ={
        "unityType":2,   //0-3分别对应B、KB、MB、GB,其他的是TB
        "maxsize":2,
        "scaleValue":1,
        "isPicture":true,
        "checkSizeErrMsg":"文件大小不能超过2M",
        "checkScaleErrMsg":"图片比例不正确",
        "checkFormatFunction":function(encUrl){
            if (!encUrl.match(/(.jpeg|.png|.gif|.jpg)/i)) {
                return false;
            }
            return true;
        }
    }
    var parameters = setParameters(uploadConst,formId);
    uploadImg(uploadBtn,previewDiv,parameters,done_callback,err_callback);

    //文件上传成功回调函数
    function  done_callback(){
        var path = target.value;
        var filename = getUploadFilename(path);
        //显示文件名和预览图片
        if(filename){    //选择文件
            $obj.val(filename);
            $obj.attr('title',filename);
            if($objImgDiv.length){       //如果小图预览框存在
                $objImgDiv.off('click','img').on('click','img',function(){
                    viewUploadImg($(this),$objImgDiv.data('url'));
                });
            }
        }else if(!filename&&$objOrigin){       //编辑状态下未选择文件时预览图片
            setEditImgInfo();
        }else{     //添加状态下点击按钮选择文件后取消
            $obj.val('');
            $obj.attr('title','');
            $objImgDiv.empty();
        };
        //$obj.attr('data-picErr',0);     //图片未出错时将data-picErr 设置为0

//            $(previewDiv).removeData("url width height");
    };
    //文件上传失败回调函数
    function err_callback(){
        if($objOrigin){
            setEditImgInfo();
        }else{
            $obj.val('');
            $obj.attr('title','');
            $objImgDiv.empty();
        }
        //$obj.attr('data-picErr',1);     //图片出错时将data-picErr 设置为1
        $(previewDiv).removeData("url width height");
    }

    //编辑状态下设置预览值
    function setEditImgInfo(){
        $obj.val($objOrigin);
        $obj.attr('title',$objOrigin);
        var $imgNail;
        console.log($objImg);
        if($objImgDiv.find('img').length){
            $imgNail = $objImg;
        }else{
            var imgObj = $('<img />');
            $($objImgDiv).html(imgObj);
            $imgNail = $($objImgDiv).find('img');
        }
        $imgNail.attr('src',$objImgOrg)
            .css({
                "width":$objImgOrgWidth,
                "height":$objImgOrgHeight
            });
        $objImgDiv.off('click','img').on('click','img',function(){
            viewUploadImg($(this),$objImgOrg);
        });
    }
}
//右侧展开预览图片,url为图片链接
function viewUploadImg(target,url){
    var parentClass = target.closest('form').attr('id');
    var $oImg=$('<img />');
    if($('#imgPreview').attr('data-parentClass')==parentClass){
        $('.imgPreviewDiv').toggle();
    }else{
        $oImg.load(function(){
            $('#imgPreview').attr('src',$oImg.attr('src'));
            matchSize($('#imgPreview')[0],$('.imgPreviewDiv')[0]);
            $('.imgPreviewDiv').css('display','block');
        });
        $oImg.attr('src',url);
        $('#imgPreview').removeAttr('style data-parentClass')
                        .attr('data-parentClass',parentClass);
    }
}
//获取上传文件的文件名
function getUploadFilename(filePath){
//        var reg = new RegExp('\\\\','g');     //两种定义正则表达式的方式~
//        filePath = filePath.replace(reg,'/');
    filePath = filePath.replace(/\\/g,'/');
    var oLoc = filePath.lastIndexOf('/');   //获取最后一个斜杠的位置
    var filename = filePath.substring(oLoc+1);
    return filename;
}

/*限制输入整数或小数*/
//function checkDecimal(target){
//    target.value = target.value.replace(/[^\d.]/g,"");
//    target.value = target.value.replace(/^\./g,"");
//    target.value = target.value.replace(/\.{2,}/g,".");
//    target.value = target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
//    if(!(/^-?\d+\.?\d{0,2}$/.test(target.value)) && !isNaN(parseFloat(target.value))){
//        target.value = parseFloat(target.value).toFixed(2);
//    }
//}

//判断文本框内的值是否为数字
function checkNum(value,msg){
    if((/\D/ig).test(value)){
        alert(msg);
        return false;
    }else{
        return true;
    }
}
//获取编辑状态下的分类信息
function getEditCategoryInfo(parentId,target,callback){
    if(parentId!=-1){
        if(target!=1) $('.control-panel select:gt('+(target-2)+')').html("");
        else $('.control-panel select').html("<option value='-1'>全部分类</option>");
        ajaxAction(
            'GET',
            apiPath('/api/category/search?parentId='+parentId),
            {},
            true,
            function (data,textStatus){
                $('#category'+target+' select').html('');
                $('#category'+target+' select').prepend("<option value='-1'>全部分类</option>");
                $.each(data.rows,function(index,content){
                    $('#category'+target+' select').append('<option value="'+content.id+'">'+content.name+'</option>');
                });
                if(callback) callback();
            },
            function (errno,errmsg){

            });
    }
    else{
        $('.control-panel select:gt('+(target-2)+')').html("<option value='-1'>全部分类</option>");
    }
}
// //默认加载时，状态下第二个下拉框的值变化时发生的变化
// function changeEditCategoryD2(index){
//     var selectNum = $('.control-panel select').length;
//     recursion(index);
//     function recursion(index){
//         var curValue = $('#category'+index+' select option:selected').val();
//         if(curValue!=-1){
//             getEditCategoryInfo(curValue,index+1,function(){
//                 $($('#category'+(index+1)+' select option')[1]).prop('selected',true);
//                 if((index+1)<selectNum)
//                     recursion(index+1);
//             });
//         }else{
//             getEditCategoryInfo(-1,index+1);
//         }
//     }
// }
