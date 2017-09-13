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
var categroyId = Request.categroyId;
var order = Request.order;
var page = Request.page;
var rows = Request.rows;
var categroyId1 = Request.categroyId1;
var categroyId2 = Request.categroyId2;
var categroy2 = Request.categroy2;
var best = Request.best;
var sku = Request.sku;
var order = Request.order;
var orderNumber = Request.orderNumber;
var orderNo = Request.orderNo;
var keyword = Request.keyword;
var slug = Request.slug;
var main = Request.main;
var sub = Request.sub;
//url
function urlPath(url){
    var apiUrl = url;
    apiUrl = url;
    return apiUrl;
};
function apiPath(url){
    var apiUrl = url;
    apiUrl = url;
    return apiUrl;
};
//点击首页回到首页
$('.contTit span:eq(0)').on('click',function (){
    window.location.href=urlPath('/');
});
// 跳转到帮助中心
function toHelper(main,sub){
    var url = '';
    (!main && !sub) ? url = urlPath('/helper?main=0&sub=0') : url = urlPath('/helper?main='+main+'&sub='+sub);
    location.href = url;
};
//处理本地缓存
function getCookie(keyName){
    if(document.cookie.length > 0){
        start=document.cookie.indexOf(keyName + "=");
        if(start!=-1){
            start=start + keyName.length+1 ;
            end=document.cookie.indexOf(";",start);
            if (end==-1) end=document.cookie.length;
            return unescape(document.cookie.substring(start,end));
        }
    }
    return "";
};
function setCookie(keyName,value,expiretime){
    var date = new Date();
    date.setDate(date.getDate() + expiretime);
    document.cookie=keyName+ "=" +escape(value)+";expires="+date.toGMTString()+";path=/";
};
function setDomainCookie(keyName,value,expiretime){
    var date = new Date();
    date.setDate(date.getDate() + expiretime);
    document.cookie=keyName+ "=" +escape(value)+";domain=.i3jf.com;expires="+date.toGMTString()+";path=/";
};
function checkLocalStroge(){
    return (window.localStorage) ? true : false;
};
//localstroge
function setLocalStroge(key,value){
    if(!value) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key,value);
};
function getLocalStroge(key){
    return window.localStorage.getItem(key);
};
//session
function getSessionstronge(key){
    return window.sessionStorage.getItem(key);
};
function setSessionstronge(key,value){
    if(!value)window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key,value);
};
//loading效果
// function loadShow(parent){
//     parent.find('.loading').show();
// };
// function loadHide(parent){
//     parent.find('.loading').hide();
// };
function loadShow(parent){
    var child;
    if(parent=='#carousel'){ //banner
        child='#preload'
    }
    if(parent=='.showCases'){
        child='.imgPreLoad'
    }
    if(parent == '#top'){

    }
    // console.log(parent,child);
    $(parent).find(child).show();
}
function loadHide(parent){
    var child;
    if(parent=='#preload'){
        child='#preload'
    }
    if(parent=='.imgPreLoad'){
        child='.imgPreLoad'
    }
    if (parent == '.hDetail') {
        child='.loading'
    };
    console.log(parent,child);
    $(parent).find(child).hide();
}
//判断登录
function checkLogin(){
    var loginName = '';
    var loginList = '';
    var topOrderN = '';
    //获取session 判断登录
    var Login = sessionStorage.getItem("login");
    // var Login = getSessionstronge("login");
    if (Login == null) {  //没有登录
        // console.log("没登录");
        this.flag = false;
    }else{  //登录
        // console.log("已经登陆");
        this.flag = true;
        loginName +=    '<a data-href="/api/user/center" onclick="check_login(this);">'+
                            '<span id="username">'+Login+'</span>'+
                            '<img src="/static/i3jf/images/slideDownIcon.png" alt="">'+
                        '</a>';
        loginList +=    '<ul class=""><a data-href="/api/user/center" onclick="check_login(this);"></a>'+
                            '<li><a></a><a data-href="/api/user/center" onclick="check_login(this);" class="offline">个人设置</a></li>'+
                            '<li><a data-href="/api/user/center/point/inquire" onclick="check_login(this);" class="offline">积分查询</a></li>'+
                            '<li><a data-href="/api/user/recharge/hebao" onclick="check_login(this);" class="offline">积分兑换</a></li>'+
                            '<li><a data-href="/api/user/follow" onclick="check_login(this);" class="offline">我的关注</a></li>'+
                            '<li><a data-href="/api/user/trace" onclick="check_login(this);" class="offline">我的足迹</a></li>'+
                            '<li><a data-href="javascript:void(0);" class="offline" onclick="logout();">退出登录</a></li>'+
                        '</ul>';
        topOrderN +=    '<a href="/static/i3jf/full_order.html?slug=0" class="offline">我的订单'+
                            '<img src="/static/i3jf/images/slideDownIcon.png" alt="">'+
                        '</a>'+
                        '<ul class=""><a class="offline">'+
                            '</a><li><a class="offline"></a><a data-href="/api/order/?slug=0" onclick="check_login(this);" class="offline">全部订单</a></li>'+
                            '<li><a data-href="/api/order/?slug=1" onclick="check_login(this);" class="offline">待支付</a></li>'+
                            '<li><a data-href="/api/order/?slug=2" onclick="check_login(this);" class="offline">待发货</a></li>'+
                            '<li><a data-href="/api/order/?slug=3" onclick="check_login(this);" class="offline">已退货</a></li>'+
                        '</ul>';

        $("#loginMenu ul li").eq(0).find(".offline").hide();
        $("#loginMenu ul li").eq(1).find("a").hide();
        $("#loginMenu ul li").eq(0).addClass("userSetting");
        $("#loginMenu ul li").eq(1).addClass("topOrder");
        $(".userSetting").html(loginName);
        $(".userSetting").append(loginList);
        $(".topOrder").html(topOrderN);
    }
}
//退出登陆
function logout(){
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
            sessionStorage.removeItem("login");
            window.location.reload();
        },
        error:function(error){
            alert("退出登录失败，请刷新...");
        }
    })
}
//需要登录后的点击
function check_login(target){
    if (checkLogin.flag) {
        window.location.href = $(target).attr('data-href');
    }else{
        location.href = '/api/user/login'
    }
};

//购物车数量
function cartAmount(){
    $.ajax({
        url:'/api/user/cart/amount',
        type:'GET',
        datatype:'json',
        data:{

        },
        success:function(data){
            var data = JSON.parse(data);
            // console.log("购物车数量");
            // console.log(data);
            if (data.errno == 0) {
                console.log(data.amount);
                $(".myCart span").text('('+data.amount+')');
                $("#goodsNum").text(data.amount);
            }else{
                // console.log("购物车异常");
            }
        },
        error:function(error){
            alert("获取购物车数量失败");
        }
    })
}

//二级分类的hover事件
function setSortListHover(){
    $('.sortList').on('mouseenter','li',function(){
        $(this).find('.subSorts').css('visibility','visible');
    });
    $('.sortList').on('mouseleave','li',function(){
        $(this).find('.subSorts').css('visibility','hidden');
    })
}
// 获取分类列表
function getCategoryList(){
    $.ajax({
        url:'/api/main/list_category',
        type:'GET',
        datatype:'json',
        data:{

        },
        success:function(data){
            var data = JSON.parse(data);
            // console.log(data);

                // console.log("获取分类列表接口回调成功");

                // var datas = initCategoryData(data.channel_list);
                var categoryLists = '';
                var keyWordsL = '';
                var iconUrl='';

                    $.each(data,function(index,content){

                        // iconUrl ='<img src="'+ content.webPicUrl +'" alt=""/>';
                        var oneId = content.id;
                        $.each(content.categroy1,function(ind,value){
                            var keyW = '';
                            // $.each(value.keyWordList,function(num,keyword){
                            //  var hasProduct3 = keyword.hasProduct;
                            //  // var keywordHref3 = urlPath("/static/order?keywordId="+keyword.id+"&categoryId=")+value.categoryId;
                            //  keywordHref3 = 'href="'+keywordHref3+'" target="_blank"';
                            //  if(!hasProduct3){
                            //      keywordHref3 = 'javascript:void(0);'
                            //  }
                            //  keyW += '<span class="ite product-'+hasProduct3+'">'
                            //              +'<a '+keywordHref3+'>'
                            //              + keyword.name
                            //              +'</a>'
                            //          +'</span>';
                            // });
                            // var hasProduct2 = value.hasProduct;
                            // var keywordHref2 = urlPath("/static/order?subCategoryId="+value.id+"&categoryId=")+value.categoryId;
                            // keywordHref2 = 'href="'+keywordHref2+'" target="_blank';
                            // if(!hasProduct2){
                            //  keywordHref2 = '';
                            // }
                            var twoId = value.id;
                            $.each(value.categroy2,function(i,con){
                                keyW += '<span class="ite">'
                                          +'<a href="/api/product/search/?order=asc&page=1&rows=30&keyword='+con.name+'&categroy2='+twoId+'">'
                                          + con.name
                                          +'</a>'
                                     +'</span>'
                            });

                            keyWordsL += '<div class="subSortsContent">'
                                    +'<div class="subSortTittle">'
                                        +'<a href="/api/product/search/?categroyId1='+oneId+'&categroyId2='+value.id+'">'
                                            +value.name
                                        +'</a>'
                                    +'</div>'
                                    +'<span class="">|</span>'
                                    +'<div class="subSortLists">'
                                        + keyW
                                    +'</div>'
                                    +'</div>';
                            // keyW = '';

                        });
                        var hasProduct = content.hasProduct;
                        var keywordHref = '/static/i3jf/order.html?categoryId='+content.id;
                        keywordHref = 'href="'+keywordHref+'" target="_blank"';
                        if(!hasProduct){
                            keywordHref = 'javascript:void(0);'
                        }
                        categoryLists += '<li channelId="'+content.id+'" channelName="'+content.name+'">'
                                +'<div class="sortIcon">'
                                        + iconUrl
                                +'</div>'
                                +'<div class="sortDetail product-'+hasProduct+'"><a href="/api/product/search/?categroyId='+content.id+'">'
                                    + content.name
                                +'</a></div>'
                                +'<div class="subSorts">'
                                    + keyWordsL
                                +'</div>'
                                +'</li>';
                        //subCategory ='';
                        keyWordsL = '';
                    })




                $(categoryLists).appendTo($('#topList ul.categoryUl'));

                if($('div.sortList').get(0)){
                    carouselHeight = $('div.sortList').get(0).clientHeight;
                    if(carouselHeight>450){
                        $('.subSorts').css('height',carouselHeight-40);
                        if($('#carousel').get(0)){
                            $('#carousel').css('height',carouselHeight);
                            $('.centerCarousel').css('height',carouselHeight);
                            $('.bannerPic').css('height',carouselHeight);
                            $('.notice').css('height',carouselHeight);
                        }
                    }
                }
                $(".ite a").unbind('click');
                $(".ite a").bind('click',function(){
                    // console.log(1111111);
                    var kname = $(this).text();
                    sessionStorage.setItem("kname",kname);
                })

        },
        error:function(error){
            alert("获取分类列表接口失败");
        }
    })
};


/*alert提示*/
function myAlert(msgInfo,bool){
    alert(msgInfo);
}

/*  自定义提示
    msgInfo为json对象，内容如下：
    title-提示标题，默认为提示
    mainMsg-主要提示内容
    subMsg-字体提示内容
    sureBtn-确认按钮文案，默认为确认
    cancelBtn-取消按钮文案，默认为取消
    sureFun-确认操作回调函数
    cancelFun-取消操作回调函数
*/
function diyAlert(msgInfo,bool){
    if(bool){
        var title = (!msgInfo.title) ? '提示' : msgInfo.title;
        var mainMsg = (!msgInfo.mainMsg) ? '' : msgInfo.mainMsg;
        var subMsg = (!msgInfo.subMsg) ? '' : msgInfo.subMsg;
        var sureBtn = (!msgInfo.sureBtn) ? '确认' : msgInfo.sureBtn;
        var cancelBtn = (!msgInfo.cancelBtn) ? '取消' : msgInfo.cancelBtn;
        $('.tooltip .cue h3').text(title);
        $('.tooltip .delBox strong').html(mainMsg);
        $('.tooltip .delBox p').html(subMsg);
        $('.tooltip .confirm').text(sureBtn);
        $('.tooltip .abolish').text(cancelBtn);
        $('.mask').show();
        $('.toolback').show();
        $('.tooltip').show();
        $('.tooltip .confirm').on('click',function (){
            if(msgInfo.sureFun) msgInfo.sureFun(msgInfo);
            diyAlert('',false);
        });
        if(!msgInfo.alertType)
        {
            $('.tooltip .abolish').on('click',function (){
                if(msgInfo.cancelFun) msgInfo.cancelFun(msgInfo);
                diyAlert('',false);
            });
        }
        else
        {
            $('.tooltip .abolish').hide();
        }

        $('.tooltip .cue span').on('click',function (){
            diyAlert('',false);
        });
    }else{
        $('.tooltip .cue h3').text('');
        $('.tooltip .delBox strong').text('');
        $('.tooltip .delBox p').text('');
        $('.mask').hide();
        $('.toolback').hide();
        $('.tooltip').hide();
        $('.tooltip .confirm').off('click');
        $('.tooltip .abolish').off('click');
        $('.tooltip .cue span').off('click');
    }
}

//搜索产品
$(".searchBtn").bind("click",function(){
    var key = $(".searchInput").val();
    // setLocationstronge('search',key);
    location.href='/api/product/search/?keyword='+key;
});
function searchKey(e){
    if(e.keyCode == 13){
        var key = $(".searchInput").val();
        // setSessionstronge('search',key);
        location.href='/api/product/search/?keyword='+key;
    }
};

function diyAlert(msgInfo,bool){
    if(bool){
        var title = (!msgInfo.title) ? '提示' : msgInfo.title;
        var mainMsg = (!msgInfo.mainMsg) ? '' : msgInfo.mainMsg;
        var subMsg = (!msgInfo.subMsg) ? '' : msgInfo.subMsg;
        var sureBtn = (!msgInfo.sureBtn) ? '确认' : msgInfo.sureBtn;
        var cancelBtn = (!msgInfo.cancelBtn) ? '取消' : msgInfo.cancelBtn;
        $('.tooltip .cue h3').text(title);
        $('.tooltip .delBox strong').html(mainMsg);
        $('.tooltip .delBox p').html(subMsg);
        $('.tooltip .confirm').text(sureBtn);
        $('.tooltip .abolish').text(cancelBtn);
        $('.mask').show();
        $('.toolback').show();
        $('.tooltip').show();
        $('.tooltip .confirm').on('click',function (){
            if(msgInfo.sureFun) msgInfo.sureFun(msgInfo);
            diyAlert('',false);
        });
        if(!msgInfo.alertType)
        {
            $('.tooltip .abolish').on('click',function (){
                if(msgInfo.cancelFun) msgInfo.cancelFun(msgInfo);
                diyAlert('',false);
            });
        }
        else
        {
            $('.tooltip .abolish').hide();
        }

        $('.tooltip .cue span').on('click',function (){
            diyAlert('',false);
        });
    }else{
        $('.tooltip .cue h3').text('');
        $('.tooltip .delBox strong').text('');
        $('.tooltip .delBox p').text('');
        $('.mask').hide();
        $('.toolback').hide();
        $('.tooltip').hide();
        $('.tooltip .confirm').off('click');
        $('.tooltip .abolish').off('click');
        $('.tooltip .cue span').off('click');
    }
};