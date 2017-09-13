var dataTable_zh = '/bundles/oam/json/language.json';
//nav切换
$("ul.sidebar-menu .treeview").click(function(){
	$("ul.sidebar-menu .treeview").siblings().removeClass("active");
	// $("ul.sidebar-menu .treeview").siblings().find(".treeview-menu").slideUp();
	$(this).addClass("active");
	// $(this).find(".treeview-menu").slideDown();
});
$(".dropdown").click(function(){
	var a = $(this).find("ul.dropdown-menu").css("display");
	if (a == 'none') {
		$(this).find("ul.dropdown-menu").slideDown(600);
	}else{
		$(this).find("ul.dropdown-menu").slideUp(600);
	}
})
//产品信息click
function dis(){
		var oSect=document.getElementById('sect')
		var aBtn=oSect.getElementsByTagName('button');
		for(var i=0;i<aBtn.length;i++){
		aBtn[i].disabled='disabled';
			}
}
function rmdis(){
		var oSect=document.getElementById('sect')
		var aBtn=oSect.getElementsByTagName('button');
		for(var i=0;i<aBtn.length;i++){
		aBtn[i].disabled='';
			}
}
$("#t1").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_product_category',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t1").siblings().hide();
			// rmdis();
			$('#t2').attr('disabled','')
			alert("获取本地分类信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取本地分类信息失败！");
		}
	})
})
$("#t2").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_getcategory_info',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t2").siblings().hide();
			$('#t3').disabled='';
			// rmdis();
			alert("获取商品池信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取商品池信息失败！");
		}
	})
})
$("#t3").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_product_info',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t3").siblings().hide();
			$('#t4').disabled='';
			// rmdis();
			alert("获取产品详情信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取产品详情信息失败！");
		}
	})
})
$("#t4").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_product_image',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t4").siblings().hide();
			$('#t5').disabled='';
			// rmdis();
			alert("获取产品图片信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取产品图片信息失败！");
		}
	})
})
$("#t5").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_product_price',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t5").siblings().hide();
			// rmdis();
			$('#t6').disabled='';
			alert("获取产品价格信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取产品价格信息失败！");
		}
	})
})
$("#t6").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/get_product_stock',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#t6").siblings().hide();
			// rmdis();
			$('#t1').disabled='';
			alert("获取产品库存信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取产品库存信息失败！");
		}
	})
})

$("#res1").click(function(){

	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/area/province',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#res1").siblings().hide();
			rmdis();
			alert("获取省信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取省信息失败！");
		}
	})
})
$("#res2").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/area/city',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#res2").siblings().hide();
			rmdis();
			alert("获取市信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取市信息失败！");
		}
	})
})
$("#res3").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/area/country',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#res3").siblings().hide();
			rmdis();
			alert("获取县信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取县信息失败！");
		}
	})
})
$("#res4").click(function(){
	$(this).siblings().show();
	dis();
	$.ajax({
		url:'/api/oam/area/town',
		type:'GET',
		datatype:'json',
		data:{

		},
		success:function(data){
			$("#res4").siblings().hide();
			rmdis();
			alert("获取乡镇信息成功！");
			window.location.reload();
		},
		error:function(error){
			alert("获取乡镇信息失败！");
		}
	})
})
/*confirm提示*/
function myConfirm(msg){
	if(!confirm(msg)) return false;
	else return true;
}
//session
function getSessionstronge(key){
    return window.sessionStorage.getItem(key);
};
function setSessionstronge(key,value){
    if(!value)window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key,value);
};
/*alert提示*/
function myAlert(msg){
	alert(msg);
}
//判断登录
function checkLogin(){
    var loginName = '';
    var loginList = '';
    var topOrderN = '';
    //获取session 判断登录
    var Login = sessionStorage.getItem("adminLogin");
    console.log(Login);
    // var Login = getSessionstronge("login");
    if (Login == null) {  //没有登录
        console.log("没登录");
        this.flag = false;
    }else{  //登录
        console.log("已经登陆");
        this.flag = true;
        $(".info p")[0].text(Login);
        $(".hidden-xs").text(Login);
    }
}

//获取到url参数
function UrlSearch()
{
   var name,value;
   var str=location.href; //取得整个地址栏
   var num=str.indexOf("?")
   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

   var arr=str.split("&"); //各个参数放到数组里
   for(var i=0;i < arr.length;i++){
    num=arr[i].indexOf("=");
    if(num>0){
       name=arr[i].substring(0,num);
       value=arr[i].substr(num+1);
       this[name]=value;
       }
    }
}
var Request=new UrlSearch(); //实例化
var orderId = Request.orderId;
var main = Request.main;
var sub = Request.sub;
var watchId = Request.watchId;
var menu2Id = Request.menu2Id;
var menu3Id = Request.menu3Id;
console.log(menu2Id,menu3Id);
console.log(orderId);
console.log(main,sub);


function navMenu(main,sub){
  var main = parseInt(main);
  var sub = parseInt(sub);
  var Lis = $('.sidebar-menu li')[main];
  var LLis = $(dt).next().find('a')[sub];
  if (!main || !sub) {
    $(".sidebar-menu>li")
  };

}

function initMenu(a,b){
    var main = parseInt(a);
    var sub = parseInt(b);
    var dt = $('.nav-con dt')[main];
    var dd = $(dt).next().find('a')[sub];

    var main = $(dt).find('span').text();
    var title = $(dd).text();
    var pageHref = $(dd).attr('pagehref');
    if(!pageHref){
      toHelper(0,0);
      return;
    }
    var contTit = '<a href="/static/i3jf/index.html">首页</a>&nbsp;>&nbsp;<span id="faCheck">'+main+'</span>&nbsp;>&nbsp;<span id="check">'+title+'</span>';

    $('.contTit').html(contTit);
    $('#contentTitle').text(title);
    $('#helpPage').attr('src',pageHref);
    $(dt).find('span').addClass('spcli');
    $(dt).find('em').addClass('on');
    $(dt).next().removeClass('hide');
    $(dd).addClass('on');
    // console.log(111111);
  }

/*时间格式化默认格式*/
var formatteSet = 'YYYY MM DD H M S';
/*时间格式化，value单位为毫秒*/
function formatter(value,set){
	var date = new Date(value);
	var y = date.getFullYear();
	var m = checkTimeItem(date.getMonth()+1);
	var d = checkTimeItem(date.getDate());
	var h = checkTimeItem(date.getHours());
	var min = checkTimeItem(date.getMinutes());
	var s = checkTimeItem(date.getSeconds());
	var time = '';
	var setInfo = formatteSet
	if(set) setInfo = set;
	set = set.split(' ');
	$.each(set,function(index,content){
		switch(content){
			case 'YYYY':
				time+=y;
			break;

			case 'MM':
				if(!time) time+=m;
				else time+='-'+m;
			break;

			case 'DD':
				if(!time) time+=d;
				else time+='-'+d;
			break;

			case 'H':
				if(!time) time+=h;
				else time+=' '+h;
			break;

			case 'M':
				if(!time) time+=min;
				else time+=':'+min;
			break;

			case 'S':
				if(!time) time+=s;
				else time+=':'+s;
			break;
		}
	});
	return time;
}

/*格式化月日时分秒，不足两位数补零*/
function checkTimeItem(value){
	if(value < 10)
		return '0'+value;
	else
		return value;
}

/*按钮点击关闭/开启，target为按钮dom对象，bool为true/false*/
function changeBind(target,bool,callback){
	$(target).attr('disabled',bool);
	if(callback) callback(target);
}

/*接口地址格式化*/
function apiPath(url){
	var apiUrl = url;
	apiUrl = '/app_dev.php' + url;
	return apiUrl;
}

/*跳转地址格式化*/
function urlPath(url){
	var jumpUrl = url;
	jumpUrl = '/app_dev.php' + url;
	return jumpUrl;
}

/*获取cookie*/
function getCookie(time){
	if(document.cookie.length > 0){
		start=document.cookie.indexOf(time + "=");
		if(start!=-1){
			start=start + time.length+1 ;
			end=document.cookie.indexOf(";",start);
			if (end==-1) end=document.cookie.length;
			return unescape(document.cookie.substring(start,end));
		}
	}
	return "";
}
/*设置cookie*/
function setCookie(time,value,expiretime){
	var date = new Date();
	date.setDate(date.getDate() + expiretime);
	document.cookie=time+ "=" +escape(value)+";expires="+date.toGMTString()+";path=/";
}

/*批量绑定数据*/
function autoBindJson(target){
	var array = $(target).find('[paramet-data = "true"]');
	var json = {};
	$.each(array,function(index,content){
		var key = $(content).attr('data-key');
		var value = $(content).val();
		json[key] = value;
	});
	return json;
}

/*批量回填数据*/
function setBindJson(target,data){
	$.each(data,function(index,content){
		var item = $(target).find('[data-value = "'+index+'"]');
        if(!item[0]) return;
        if(matchTag(item)){
        	item.val(matchItem(index,content));
        }else{
        	item.text(matchItem(index,content));
        }
    });
}

/*回填数据处理（不同页面可重写）*/
function matchItem(target,value){
	return value;
}

/*判断标签类型*/
function matchTag(target){
	var tag = target[0].localName;
	var flag = true;
	switch(tag){
		case 'a':
		case 'li':
		case 'span':
		case 'p':
		case 'div':
			flag = false;
		break;
	}
	return flag;
}


/*ajax请求封装方法*/
function ajaxAction(method,url,json,async,success_func,error_func)
{
	var ajaxInfo = {
		type: method,
		url: url,
		async: async,
		dataType: "json",
		timeout: 600000,
		cache: true,
		success: function (resp, textStatus) {
			var errno = resp.errno;
			var errmsg = resp.errmsg;
			if (errno==0){
				success_func(resp, textStatus);
			}else{
				error_func(errno, errmsg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var errno = 10000;
			var errmsg = '未知错误';

			switch(XMLHttpRequest.status)
			{
				case 400:
					errno = 10400;
					errmsg = '接口参数错误';
					break;
				case 401:
					errno = 10401;
					errmsg = '未授权的接口调用';
					break;
				case 403:
					errno = 10403;
					errmsg = '对此接口无访问权限';
					break;
				case 404:
					errno = 10404;
					errmsg = '接口路径不存在';
					break;
				case 406:
					errno = 10406;
					errmsg = '请求无法被接受';
					break;
				case 0:
				case 408:
					errno = 10408;
					errmsg = '请求超时';
				case 409:
					errno = 10409;
					errmsg = '请求资源冲突，请重试';
					break;
				case 415:
					errno = 10415;
					errmsg = '不支持此用户代理';
					break;
				case 500:
					errno = 10500;
					errmsg = '服务器内部错误';
					break;
				default:
					errno = 10000;
					errmsg = '未知错误 '+XMLHttpRequest.status;
			}
			error_func(errno, errmsg);
		}
	}
	if(json) ajaxInfo.data = $.toJSON(json);
	$.ajax(ajaxInfo);
}

//uploadBtn是上传文件按钮的DOM元素，previewDiv是图片预览区域DIV的DOM元素，parameters是参数限制
//done_callback 是文件上传成功后的回调函数，err_callback是文件上传失败后的回调函数
function uploadImg(uploadBtn,previewDiv,parameters,done_callback,err_callback){
	var defaultParameters = {
		"unityType":0,   //0-3分别对应B、KB、MB、GB,其他的是TB
		"maxsize":'',     //文件最大不能超过
		"scaleValue":'',   //图片的尺寸
		"isPicture":false,
		"checkSizeErrMsg":"文件大小不匹配！",
		"checkScaleErrMsg":"图片比例不正确",
		"checkFormatErrMsg":"文件格式错误",
		"checkFormatFunction":function(){}
	}
	$.extend(defaultParameters,parameters);
	var hasFileApi = uploadBtn.files && uploadBtn.files[0];
	var filePath = uploadBtn.value;     //受浏览器的安全，会将文件路径隐藏，但可识别文件名
	var fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
	if(!filePath){
		uploadBtn.value = '';
		if(err_callback) err_callback();
		return;
	}             //uploadImg() 不判空，判空操作在外部处理
	console.log(defaultParameters);
	if(!defaultParameters.checkFormatFunction(fileExt)){           //判文件类型
		alert(defaultParameters.checkFormatErrMsg);
		uploadBtn.value = '';
		if(err_callback) err_callback();
		return;
	}

	$.when(getFileUrl(hasFileApi,uploadBtn,previewDiv))
		.done(function(){
			var resourceUrl = $(previewDiv).data("url");
			var fileSize = getFileSize(resourceUrl,hasFileApi);
			if(!limitFileSize(fileSize,defaultParameters)){
				alert(defaultParameters.checkSizeErrMsg);
				uploadBtn.value = '';
				if(err_callback) err_callback();
				return;
			};
			if (defaultParameters.isPicture) {
				var oImg = new Image();
				oImg.src = resourceUrl;
				$(previewDiv).html('');
				oImg.onload=function(){
					var width = this.width;
					var height = this.height;
					var calcScalue = width/height;
					var scaleValue = defaultParameters.scaleValue;
					$(previewDiv).data('width',width);
					$(previewDiv).data('height',height);
					if(scaleValue &&scaleValue!=calcScalue){
						alert(defaultParameters.checkScaleErrMsg);
						uploadBtn.value = '';
						if(err_callback) err_callback();
						return;
					};
					oImg.onload=null;
					$(previewDiv).append(oImg);
					matchSize(oImg,previewDiv);
					if (done_callback) done_callback();
				}
			}else{
				if (done_callback) done_callback();
			};
		})
		.fail(function(){
			alert("请升级浏览器的版本！");
		})
}

//获取文件的Url
//IE9不支持file Api，IE10、IE11支持，但是不支持readAsBinaryString
function getFileUrl(hasFileApi,uploadBtn,previewDiv){
	// var src='';
	var dtd = $.Deferred();
	if(hasFileApi && window.FileReader){
		var $file = new FileReader();
		$file.onload=function(e){
			var resourceUrl = e.target.result;
			$(previewDiv).data("url",resourceUrl)
			dtd.resolve();
		}
		$file.readAsDataURL(hasFileApi);
		console.log(dtd.promise());
		return dtd.promise();
	}else if(window.navigator.userAgent.indexOf("MSIE") >= 1 && !(navigator.userAgent.indexOf("MSIE 10.0") > 0)){
		$(uploadBtn).select();
		$(previewDiv).focus();
		var resourceUrl = document.selection.createRange().text;
		$(previewDiv).data("url",resourceUrl)
		dtd.resolve();
		return dtd.promise();
	}
}

//获取文件的大小
function getFileSize(url,hasFileApi){
	var fileSize='';
	if(hasFileApi && window.FileReader){
		fileSize = hasFileApi.size;
		return fileSize;
	}else if(window.navigator.userAgent.indexOf("MSIE") >= 1 && !(navigator.userAgent.indexOf("MSIE 10.0") > 0)){
		var fileobject = new ActiveXObject ("Scripting.FileSystemObject");//建立ActiveX对象
		fileSize = fileobject.GetFile(url).Size;
		return fileSize;
	}
}

//限定文件大小
function limitFileSize(fileSize,defaultParameters){
	var result = '';
	var type = defaultParameters.unityType;
	var maxValue = defaultParameters.maxsize;
	switch(type){
		case 0:
			result = 'B';
			break;

		case 1:
			result = 'KB';
			break;

		case 2:
			result = 'MB';
			break;

		case 3:
			result = 'GB';
			break;
	};
	for(var i=type;i>0;i--){
		maxValue *= 1024;
	}
	if(fileSize>maxValue){
		return false;
	}
	return true;
}

// 限定图片尺寸,target指图片DOM，scaleValue是宽高比
function limitImgScale(target,previewDiv,scaleValue,scaleJson){
	target.onload=function(){
		var width = this.width;
		var height = this.height;
		var calcScalue = Math.round(width/height);
		var scaleValue = Math.round(scaleValue);
		scaleJson.width= width;
		scaleJson.height= height;
		console.log(width+'/'+height);
		console.log(scaleValue);
		console.log(target);
		if(!scaleValue ||scaleValue==calcScalue)
			return true;
		else
			return false;
	}
}

//预览图片适应容器大小，等比缩小图片,container是DOM对象，target是DOM对象
function matchSize(target,container){
	var defaultWidth = $(container).width();
	var defaultHeight = $(container).height();
	var showImgWidth = target.naturalWidth;
	var showImgHeight = target.naturalHeight;
	var showImgAdjustWidth;
	var showImgAdjustHeight;
	if (showImgWidth<=defaultWidth && showImgHeight<=defaultHeight) return;
	if (showImgWidth>defaultWidth){
		showImgAdjustWidth = defaultWidth;
		showImgAdjustHeight = showImgAdjustWidth*showImgHeight/showImgWidth;
		if(showImgAdjustHeight > defaultHeight){
			showImgAdjustWidth = showImgAdjustWidth* defaultHeight/showImgAdjustHeight;
			showImgAdjustHeight = defaultHeight;
		}
		$(target).css('width',showImgAdjustWidth +'px');
		$(target).css('height',showImgAdjustHeight + 'px');
		return;
	};
	if(showImgHeight > defaultHeight){
		showImgAdjustHeight = defaultHeight;
		showImgAdjustWidth = showImgWidth*showImgAdjustHeight/showImgHeight;
		if(showImgAdjustWidth>defaultWidth){
			showImgAdjustHeight = showImgAdjustHeight* defaultWidth/showImgAdjustWidth;
			showImgAdjustWidth = defaultWidth;
		}
		$(target).css('height', showImgAdjustHeight + 'px');
		$(target).css('width',showImgAdjustWidth + 'px');
		return;
	};
}
