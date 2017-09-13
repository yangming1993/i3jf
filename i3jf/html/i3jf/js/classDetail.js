
	$(function (){
		stopPropagation();
		snPositions();
		//默认和排序
		defaultBtn();	
		//全部搜索分类
		leftClassify(categoryId,keywords,sort,order);	
		//调用产品搜索的接口
		if (keywords == 'undefined' || !keywords) {
		}else{
			$('.searchInput').val(keywords);
		}
		

		if (keyword != undefined) {
			search({
				'categroy2':categroy2,
				'rows':40,
				'page':1,
				'keyword':keywords
			}); //搜索
		}else if(typeof(categroyId) != 'undefined'){
			oneProduct({
				'categroyId':categroyId,
				'rows':40,
				'page':1
			}); //一级商品
		}else if(typeof(categroyId1) != 'undefined' && typeof(categroyId2) != 'undefined'){
			twoProduct({
				'categroyId1':categroyId1,
				'categroyId2':categroyId2,
				'rows':40,
				'page':1
			}); //二级商品
		}else if(typeof(categroy2) != 'undefined'){
			threeProduct({
				'categroyId2':categroyId2,
				'rows':40,
				'page':1
			}); //三级商品
		}else{
			allProduct({
				'rows':'40',
				'page':'1',
				'order':'asc'
			});//调全部
		}

		//全部商品分类
		showDetailCategory(); 
		//与地址相关的接口		
		provice(function (pCode){				
			// 省份的 data-code
			city(pCode, function (cCode,bool){
				var wholeAddress=getCookie('area');
				//有cookie的话，从cookie中获取数据
				if(wholeAddress)
				{
					wholeAddress = $.evalJSON(wholeAddress);
					$.each($('#provices li span'),function (){
						if($(this).attr('data-code')==wholeAddress.provice.code)
						{
							$('.upDown a:eq(0) span').html($(this).html());
							$('#provices li span').removeClass('active');
							$(this).addClass('active');
						}
					});
					$.each($('#citys li span'),function (){
						if($(this).attr('city-code')==wholeAddress.city.code)
						{
							$('#citys li span').removeClass('active');
							$(this).addClass('active');
						}
					});
					getAddr();
				}
				else
				{
					$('.upDown a:eq(0) span').html($('#provices li:eq(0) span').html());
					$('#provices li:eq(0) span').addClass('active');
					$('#citys li:eq(0) span').addClass('active');
					getAddr();
				}
			},false);
		},false);
		hotProduct(categoryId);
	});	
	function getAddr()
	{
		var pWords=$('#provices span.active').text();
		var cWords=$('#citys span.active').text();
		$('#city em').html('<span class="pName">'+pWords+'</span>'+
			'<span class="cName">'+cWords+'</span>'
		);
	}
	var cuxiao='【促销】';
	
	var pageinfo=6;	//一共在页面上显示几条页码

	//判断有没有这个class
	function change(){
		$(this).hasClass('active') ? $(this).removeClass('active'):$(this).addClass('active');
	}



	/*-------------全部搜索类-----------*/
	function leftClassify(categoryId,keywords,type,sortOrder){
		$.ajax({
			url:'/api/main/list_category',
			type:'GET',
			datatype:'json',
			data:{

			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				console.log("获取频道列表接口回调成功");
				$('.leftClassify').html('');
				
				
				var oD = '';
				$.each(data,function(i,c){
					$.each(c.categroy1,function(ii,cc){
						var oDs = '';
						var categroyId2 = cc.id;
						$.each(cc.categroy2,function(iii,ccc){
							oDs +=  '<a href="/api/product/search/?categroy2='+categroyId2+'&keyword='+ccc.name+'" did="87" data-cid="'+ccc.id+'">'+ccc.name+'</a>'
						});

						oD += '<div class="item close">'+
									'<h4>'+
										'<a href="javascript:;" did="'+cc.id+'">'+cc.name+'</a>'+
									'</h4>'+
									'<div class="mainCont">'+
										oDs+
									'</div>'+
								'</div>'
					});
				});
				$('.leftClassify').html(oD);
				typeName();
				// if(allValue.length>0)
				// {
				// 	var oD='';
				// 	var oH='';
				// 	var aA='';				
				// 	$.each(allValue,function (index,element){
				// 		if(element.id==categoryId)
				// 		{	
				// 			$('.gCheck').html('');					
				// 			$('.gCheck').html(element.name).attr({'data-Id':element.id,'title':element.name}).after('<b class="left">></b>');
				// 		}
				// 		//循环list
				// 		$.each(element.list,function (index,element){
				// 			if(categoryId && element.categoryId==categoryId)
				// 			{	
				// 				var listItem = '<h4>'+
				// 						'<a href="javascript:;" dId="'+element.id+'">'+element.name+
				// 						'</a>'+
				// 					'</h4>';

				// 				var listHasProduct = element.hasProduct;
				// 				if(!listHasProduct){

				// 					listItem='';
				// 				}
				// 				oH=listItem;
				// 				//循环得到关键字
				// 				aA='';
				// 				$.each(element.keyWordList,function (index,content){
				// 					var keywordHasProduct = content.hasProduct;
				// 					var keywordItem = '<a href="/super/order?keywordId='+content.id+'&categoryId='+element.categoryId+'" dId="'+content.id+'" data-cId="'+element.categoryId+'">'+content.name+
				// 						'</a>';
				// 					if(!keywordHasProduct){
				// 						// keywordItem = '<a class="product-'+keywordHasProduct+'" dId="'+content.id+'" data-cId="'+element.categoryId+'">'+content.name+
				// 						// '</a>';
				// 						keywordItem='';
				// 					}
				// 					aA+= keywordItem;			
				// 				});	
				// 				oD+='<div  class="item close">'+oH+
				// 						'<div  class="mainCont">'+aA+
				// 						'</div>'+
				// 					'</div>';			
				// 			}
				// 			else if(categoryId == -1)
				// 			{
				// 				var listItem = '<h4>'+
				// 						'<a href="javascript:;" dId="'+element.id+'">'+element.name+
				// 						'</a>'+
				// 					'</h4>';
				// 				var listHasProduct = element.hasProduct;
				// 				if(!listHasProduct){

				// 					listItem='';
				// 				}
				// 				oH=listItem;
				// 				//循环得到关键字
				// 				aA='';
				// 				$.each(element.keyWordList,function (index,content){
				// 					var keywordHasProduct = content.hasProduct;
				// 					var keywordItem = '<a href="/super/order?keywordId='+content.id+'&categoryId='+element.categoryId+'" dId="'+content.id+'" data-cId="'+element.categoryId+'">'+content.name+'</a>';
				// 					if(!keywordHasProduct){
				// 						// keywordItem = '<a class="product-'+keywordHasProduct+'" dId="'+content.id+'" data-cId="'+element.categoryId+'">'+content.name+'</a>';
				// 						keywordItem='';
				// 					}
				// 					aA+= keywordItem;			
				// 				});	
				// 				oD+='<div  class="item close">'+oH+
				// 						'<div  class="mainCont">'+aA+
				// 						'</div>'+
				// 					'</div>';
				// 			}
				// 		});					
				// 	});
				// 	$('.leftClassify').html(oD);
				// 	goodsKeySearch();
				// 	if((!keywords || keywords=='') && !keywordId)
				// 	{						
				// 		if(!subCategoryId || subCategoryId=='')
				// 		{
				// 			$('.item .mainCont a').removeClass('active');
				// 			$('#check').html('全部');
				// 		}
				// 		else
				// 		{
				// 			$.each($('.item h4 a'),function (){
				// 				if(subCategoryId==$(this).attr('did'))
				// 				{
				// 					$('.item .mainCont a').removeClass('active');
				// 					$('#check').html($(this).text()).attr('title',$(this).text());
				// 				}
				// 			});
				// 		}
				// 	}
				// 	else
				// 	{
				// 		if(!keywordId){
				// 			$('.item .mainCont a').removeClass('active');
				// 			$('#check').html(keywords);
				// 		}else{
				// 			$.each($('.item .mainCont a'),function (){
				// 				if(keywordId==$(this).attr('did'))
				// 				{
				// 					$('.item .mainCont a').removeClass('active');
				// 					$(this).addClass('active');
				// 					$(this).parent().parent().removeClass('close').addClass('open');
				// 					var $P=$(this).parents('.item').find('h4 a');
				// 					$('#faCheck').html('');
				// 					$('#faCheck').html($P.html()).attr({'data-Id':categoryId,'title':$P.html(),'data-sub':$(this).parents('.item').find('h4 a').attr('did')}).after('<b class="left">></b>');
				// 					$('#check').html($(this).text()).attr('title',$(this).text());
				// 				}
				// 			});
				// 		}
				// 	}
				// 	typeName();	
				// }
				// if(data.isSuccess==false)
				// {
				// 	console.log(data.returnMsg);
				// }
			},
			error:function(error){
				alert("获取频道列表失败,请刷新...");
			}
		})
	}

	//全部搜索分类上面的点击商品分类和商品关键字
	function goodsKeySearch()
	{
		$('#check').off('click');
		$('#check').on('click',function (){
			return false;
		});
		$('#faCheck').off('click');
		$('#faCheck').on('click',function (){
			var word=$(this).html().split('&')[0];
			location.href=urlPath('/super/order?categoryId='+$(this).attr('data-Id')+'&subCategoryId='+$(this).attr('data-sub'));
		});
		$('.gCheck').off('click');
		$('.gCheck').on('click',function (){
			location.href=urlPath('/super/order?categoryId='+$(this).attr('data-Id'));
		});
	};
	//全部搜索类处点击二级标题展开收回子标题
	function typeName()
	{
		$('.item h4').on('click',function (){
			var parent=$(this).parent();
			parent.hasClass('close') ? parent.removeClass('close'):parent.addClass('close');
		});
		//二级子菜单点击事件
		$('.item .mainCont a').off('click');
		$('.item .mainCont a').on('click',function (){
			var type=$('.goodsRnav .active').attr('data-type');
			var sortOrder=$('.goodsRnav .active').attr('data-order');
			$('.item .mainCont a').removeClass('active');
			$(this).addClass('active');
			search();
			// window.location.href=urlPath($(this).attr('href'));
			// search({
			// 	'keyword':encodeURIComponent($(this).html()),
			// 	'rows':maxinfo,
			// 	'page':1,
			// 	'categoryId':matchSearchId(),
			// 	'sort':type,
			// 	'order':sortOrder
			// });
			// $('#check').html($(this).html()).attr('title',$(this).html());
			// $('#gTit').html($(this).html());
		});
		$('.item .mainCont a.product-false').off('click');
	};

	function matchSearchId(){
		var searchId = (!subCategoryId) ? categoryId : subCategoryId;
		searchId = (!keywordId) ? searchId : keywordId;
		return searchId;
	};

	/*--------全部商品分类点击展开---------*/
	var flag = false;
    function showDetailCategory() {
        $('.sortMenu').on('click', function () {
            if ($(this).hasClass('activeSortMenu') && flag) {
                $('.activeSortMenu').removeClass('activeSortMenu');
                $('.sortListContainer').slideUp(function () {
                    setTimeout('flag=false', 500);
                });
            } else if (!$(this).hasClass('activeSortMenu') && !flag) {
                $(this).addClass('activeSortMenu');
                $('.sortListContainer').slideDown(function () {
                    setTimeout('flag=true', 500);
                });
            };
        });
    };

	/*----------------选择地址处--------------*/
	var area={};	//存放code和内容
	function snPositions(){
		//点击送至的地址，显示全部的地址信息
		$('#city').on('click',function (){
			$('.cityName').show(function (){
				proClick();
				// cityClick(area.provice.code);
				$('.upDown a:eq(1) span').html('请选择市');
			});
			$('.upDown a').removeClass('active');
			$('.upDown a').eq(0).addClass('active');		
			$('#provices').addClass('active');
		});

		//点击关闭按钮（城市右侧的X的时候）的时候
		$('#closed').on('click',function (){
			$('.cityName').hide();
		    $('.upDown a').removeClass('active');
		    $('.cityName ul').removeClass('active');
		    $('#provices').addClass('active');
		});

		//点击选择地区下的选择省份、市、区、乡镇
		$('.upDown a').on('click',function (){
			$('.upDown a').removeClass('active');
			$(this).addClass('active');
			$('.cityName ul').removeClass('active');
			$('.cityName ul').eq($(this).index()).addClass('active');	
		});
	}

	//选择城市部分，如果点击其他地方，选择城市的区域会关闭
	function stopPropagation(){
        $('body').bind('click',function(e){
            var e = e || window.event;
            var elem = e.target || e.srcElement;
            while (elem) {
                if ((elem.className && elem.className.indexOf('wholeCitys')>-1) || (elem.className && elem.className.indexOf('cityName')>-1)) {
                    return;
                }
                elem = elem.parentNode;
            }
            $('.cityName').hide();
            $('.cityName ul').removeClass('active');
            $('.cityName ul').eq(0).addClass('active');
        });
    }

	//省份列表接口调用
	function provice(fn,bool){
		$.ajax({
			url:'/api/area/province/list',
			type:'GET',
			datatype:'json',
			data:{

			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("省份列表接口回调成功---"+data);
					var allValue=data.province;
					if(allValue)
					{
						var aLi='';
						$.each(allValue,function (index,content){	
							aLi+='<li title="'+content.name+'">'+
									'<span title='+content.name+' data-code='+content.id+'>'+content.name+
									'</span>'+
								'</li>';	
						});
						$('#provices').html(aLi);
						// $('#provices li:eq(0) span').addClass('active');
						area.provice={
							'code':$('#provices li:eq(0) span').attr('data-code')
						};
						// var whole=getCookie('area');
						// if(whole)
						// {
						// 	whole = $.evalJSON(getCookie('area'));
						// 	fn(whole.provice.code);
						// 	$('.upDown a:eq(0) span').html($('#provices span.active').html());
						// }
						// else
						// {
						// 	fn(area.provice.code);
						// 	$('.upDown a:eq(0) span').html($('#provices li:eq(0) span').html());
						// }								
					}
					proClick(); //点击事件
				}else{
					console.log("省份列表接口回调异常---");
				}
			},
			error:function(error){
				alert("省份列表失败,请刷新...");
			}
		})
	}
	
	//点击省份名后显示要选择的市
	var proviceCode='';
	function proClick()
	{
		$('.cityName ul:eq(0) li span').on('click',function (){	
			proviceCode=$(this).attr('data-code');
			city(proviceCode,true);
			$('.cityName ul:eq(0) li span').removeClass('active');
			$(this).addClass('active');
			area.provice={
				'code':proviceCode
			};		
			$('.upDown a').removeClass('active');						
			$('.upDown a').eq(1).addClass('active');
			$('.cityName ul').removeClass('active');
			$('#citys').addClass('active');
			$('.upDown a:eq(0) span').html($(this).html());
		});
	}
	
	//城市列表调用接口
	function city(code,bool){
		console.log("市列表接口进入",code);
		$.ajax({
			url:'/api/area/city/list',
			type:'GET',
			datatype:'json',
			data:{
				'id':code
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("市列表接口回调成功---"+data);
					var allValue=data.city;
					if(allValue)
					{
						var aLi='';
						$.each(allValue,function (index,content){
							aLi+='<li title="'+content.name+'">'+
									'<span city-code='+content.code+'>'+
										content.name+
									'</span>'+
								'</li>';
						});
						$('#citys').html(aLi);
						$('#citys li:eq(0) span').addClass('active');
						area.city={
						'code':$('#citys li:eq(0) span').attr('city-code')
						};
						// var whole=getCookie('area');
						// if(whole)
						// {
						// 	whole = $.evalJSON(getCookie('area'));
						// 	fn(whole.city.code);
						// }
						// else
						// {
						// 	fn(area.city.code);
						// }
						cityClick()//点击市
					}
				}else{
					console.log("市列表接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("市列表失败,请刷新...");
			}
		})

	}

	//点击市名后
	function cityClick()
	{
		$('.cityName ul:eq(1) li span').on('click',function (){	
			proviceCode=$(this).attr('data-code');
			city(proviceCode,true);
			$('.cityName ul:eq(1) li span').removeClass('active');
			$(this).addClass('active');
			area.provice={
				'code':proviceCode
			};		
			$('.upDown a').removeClass('active');						
			$('.upDown a').eq(1).addClass('active');
			$('.cityName ul').removeClass('active');
			$('.cityName').hide();
			$('.upDown a:eq(1) span').html($(this).html());
			var pWords=$('#provices span.active').text();
			var cWords=$('#citys span.active').text();
			$('#city em').html('<span class="pName">'+pWords+'</span>'+
				'<span class="cName">'+cWords+'</span>'
			);
		});
	}


/*=================== 分页  start=================*/	
	var maxinfo=40;	//每页最大的条数
	//设置分页
	function SetPage(maxpage){
		console.log("设置分页进入");
		var now_page = parseInt($('.tcdPageCode').attr('page'));
		$('.more-item').remove();
		$('.page-item').remove();
		$('.page1').text(now_page);
		$('.page2').text(maxpage);
		$('.page-info').text(now_page+'/'+maxpage);
		var start = '<div position="'+1+'" class="page-item">'+1+'</div>';
		var end = '<div position="'+maxpage+'" class="page-item">'+maxpage+'</div>';
		if(maxpage <= pageinfo){
			if(maxpage==1)
			{
				$('#next').before(start);
				$('.rBtn').removeClass('active');
				$('.pageBtn a').off('click');
			}
			else
			{
				for(i = 2;i < maxpage;i++){
					start+='<div position="'+i+'" class="page-item">'+i+'</div>';
				}
				start+=end;
				$('#next').before(start);
			}
		}else{
			console.log(222);
			if(now_page >= 4){
				start+= '<span class="more-item">……</span>';
			}
			if(now_page <= maxpage-3){
				end = '<span class="more-item">……</span>' + end;
			}
			var start_page = now_page - 1;
			var end_page = now_page + 1;
			if(now_page - 1 <= 1){
				start_page = 2;
				end_page=4;
			}

			if(now_page + 1 >= maxpage-1){
				start_page = maxpage - 3;
				end_page = maxpage - 1;
			}

			for(i = start_page;i <= end_page;i++){
				start+='<div position="'+i+'" class="page-item">'+i+'</div>';
			}
			start+=end;
			$('#next').before(start);
		}
		$('[position = '+now_page+']').addClass('active');
		// location.href =location.href.split('#')[0] + '#' + now_page;
		$('#next').attr('disabled',false).css('background','#fff');
		$('#prev').attr('disabled',false).css('background','#fff');
		if(now_page>=maxpage)
		{
			$('#prev').removeClass('disBtn');
			$('#next').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
		}
		if(now_page<=1)
		{
			$('#next').removeClass('disBtn');
			$('#prev').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
		}
	}

	//页码操作
	function setPageAction(maxpage,sign){
		//对页码中的数字键进行点击操作
		console.log("页码操作",maxpage);
		$('.page-item').unbind('click');
		$('.page-item').bind('click',function(){

			console.log('页码操作');

			if(!searchFlag) return;
			if($(this).hasClass('active')) return;

			var type=$('.goodsRnav .active').attr('data-type');
			var sortOrder=$('.goodsRnav .active').attr('data-order');
			var now_page=$(this).text();

			if(now_page==maxpage)
			{
				$('#prev').attr('disabled',false).css('background','#fff');
				$('#next').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
				$('.pageBtn a').removeClass('active');
				$('.lBtn').addClass('active');
			}
			if(now_page==1)
			{
				$('#next').attr('disabled',false).css('background','#fff');
				$('#prev').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
				$('.pageBtn a').removeClass('active');
				$('.rBtn').addClass('active');
			}
			if(now_page>1 && now_page<maxpage)
			{
				$('#next').attr('disabled',false).css('background','#fff');
				$('#prev').attr('disabled',false).css('background','#fff');
				$('.pageBtn a').addClass('active');
			}
			$('.tcdPageCode').attr('page',$(this).text());
			// location.href = location.href.split('#')[0];
			if (sign == 1) {
				console.log("全部商品翻页");
				allProduct({
					'rows':maxinfo,
					'page':$(this).text(),
					'categroyId':matchSearchId(),
					'sort':type,
					'order':'asc'
				});//调全部
			}
			if (sign == 2) {
				console.log("搜索商品翻页");
				search({
					'categroy2':categroy2,
					'rows':maxinfo,
					'page':$(this).text(),
					'keyword':keywords
				})
			}
			if (sign == 3) {
				console.log("一级商品翻页");
				oneProduct({
					'categroyId':categroyId,
					'rows':maxinfo,
					'page':$(this).text()
				})
			}
			if (sign == 4) {
				console.log("二级商品翻页");
				twoProduct({
					'categroyId1':categroyId1,
					'categroyId2':categroyId2,
					'rows':maxinfo,
					'page':$(this).text()
				})
			}
			if (sign == 5) {
				console.log("三级商品翻页");
				threeProduct({
					'categroyId2':categroyId2,
					'rows':maxinfo,
					'page':$(this).text()
				})
			}
		});
		//上一页，下一页点击事件
		$('.page-button').unbind('click');
		$('.page-button').bind('click',function(){
			console.log("上下");
			if(!searchFlag) return;
			var srotType=$('.goodsRnav .active').attr('data-type');
			var sortOrder=$('.goodsRnav .active').attr('data-order');
			console.log(this);
			var type = $(this).attr('id');
			var now_page = parseInt($('.tcdPageCode').attr('page'));
			switch(type){
				case 'prev':
					if(now_page > 1){
						$('.tcdPageCode').attr('page',--now_page);
					}
				break;

				case 'next':
				console.log(now_page,maxpage);
					if(now_page < maxpage){
						$('.tcdPageCode').attr('page',++now_page);
					}
				break;
			}			
			if(now_page==1)
			{
				$('#next').removeClass('disBtn');
				$('#next').attr('disabled',false).css('background','#fff');
				$('.pageBtn a').removeClass('active');
				$('.rBtn').addClass('active');
			}
			if(now_page>1 && now_page<maxpage)
			{
				$('#next').removeClass('disBtn');
				$('#prev').removeClass('disBtn');
				$('.pageBtn a').addClass('active');
			}			
			if(now_page==maxpage)
			{
				$('#prev').attr('disabled',false).css('background','#fff');
				$('#prev').removeClass('disBtn');
				$('#next').addClass('disBtn');
				$('.pageBtn a').removeClass('active');
				$('.lBtn').addClass('active');
			}


			// search({
			// 	'keyword':keywords,
			// 	'rows':maxinfo,
			// 	'page':now_page,
			// 	'categoryId':matchSearchId(),
			// 	'sort':srotType,
			// 	'order':sortOrder
			// });
			// location.href = location.href.split('#')[0] + '#' + now_page;
			if (sign == 1) {
				console.log("全部商品翻页");
				allProduct({
					'rows':maxinfo,
					'page':$(".tcdPageCode").attr("page"),
					'categroyId':matchSearchId(),
					'sort':type,
					'order':'asc'
				});//调全部
			}
			if (sign == 2) {
				console.log("搜索商品翻页");
				search({
					'categroy2':categroy2,
					'rows':maxinfo,
					'page':$(".tcdPageCode").attr("page"),
					'keyword':keywords
				})
			}
			if (sign == 3) {
				console.log("一级商品翻页");
				oneProduct({
					'categroyId':categroyId,
					'rows':maxinfo,
					'page':$(".tcdPageCode").attr("page")
				})
			}
			if (sign == 4) {
				console.log("二级商品翻页");
				twoProduct({
					'categroyId1':categroyId1,
					'categroyId2':categroyId2,
					'rows':maxinfo,
					'page':$(".tcdPageCode").attr("page")
				})
			}
			if (sign == 5) {
				console.log("三级商品翻页");
				threeProduct({
					'categroyId2':categroyId2,
					'rows':maxinfo,
					'page':$(".tcdPageCode").attr("page")
				})
			}
		});
	}
	
	//点击换页	
	//上面的页码点击的时候
	function topPageBtn(){
		$('.lBtn').off('click');
		$('.rBtn').off('click');
		$('.lBtn').on('click',function (){
			console.log("上下切换");
			if(!searchFlag) return;
			var type=$('.goodsRnav .active').attr('data-type');
			var sortOrder=$('.goodsRnav .active').attr('data-order');
			var n=parseInt($('.page1').html());
			var num=parseInt($('.page2').html());			
			if(n>1 && n<=num)
			{					
				//调用数据查询接口
				$('.pageBtn a').addClass('active');
				n--;
				// search({
				// 	'keyword':keywords,
				// 	'rows':maxinfo,
				// 	'page':n,
				// 	'categoryId':matchSearchId(),
				// 	'sort':type,
				// 	'order':sortOrder
				// });
			}
			$('.page1').html(n);
			if(n==1)
			{
				$(this).removeClass('active').off('click');
				$('#prev').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
			}
			//循环，然后给下面的页码中的html为n的页，添加class名
			$('.page-item').removeClass('active');
			$('.tcdPageCode').attr('page',n);
			$('.page-info').text(n+'/'+num);
			$.each($('.page-item'),function (index,element){
				if($(this).html()==n && $(this).html()!=num)
				{
					$(this).addClass('active');
					$('#next').attr('disabled',false).css('background','#fff');
				}
			});
			// location.href =location.href.split('#')[0] + '#' + n;
			setPageAction(num);
		});
		
		$('.rBtn').on('click',function (){
			if(!searchFlag) return;
			var type=$('.goodsRnav .active').attr('data-type');
			var sortOrder=$('.goodsRnav .active').attr('data-order');
			var n=parseInt($('.page1').html());
			var num=parseInt($('.page2').html());
			if(n>=1 && n<num)
			{		
				$('.pageBtn a').addClass('active');
				$('#prev').attr('disabled',false).css('background','#fff');
				//调用数据查询接口
				n++;
				// search({
				// 	'keyword':keywords,
				// 	'rows':maxinfo,
				// 	'page':n,
				// 	'categoryId':matchSearchId(),
				// 	'sort':type,
				// 	'order':sortOrder
				// });			
			}			
			$('.page1').html(n);
			if(n==num)
			{
				$(this).removeClass('active');
				$(this).off('click');
				$('#next').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});			
			}
			$('.tcdPageCode').attr('page',n);
			$('.page-info').text(n+'/'+num);
			$('.page-item').removeClass('active');
			//循环，然后给下面的页码中的html为n的页，添加class名
			$.each($('.page-item'),function (){
				if($(this).html()==n && $(this).html()!=1)
				{
					$(this).addClass('active');
					$('#prev').attr('disabled',false).css('background','#fff');
				}
			});
			// location.href = location.href.split('#')[0] + '#' + n;
			setPageAction(num);
		});
	}

	var searchFlag = true;
	var cartFlag=false;	//加入购物车标识符
	var followFlag=false;	//加入关注标识符


	//全部商品
	function allProduct(json){

		$.ajax({
			url:'/api/product/get_all_product',
			type:'GET',
			datatype:'json',
			data:{
				'rows':json.rows,
				'page':json.page,
				'order':json.order
			},
			success:function(data){
				console.log("全部商品接口进入");
				var data = JSON.parse(data);
				console.log(data);
				var aLi='';
				var ll = data.list.length
				if (ll > 0) {
					$.each(data.list,function(i,c){		
						aLi+='<li class="w225 searchInfo" title="'+c.name+'" data-sku="'+c.sku+'">'+
								'<div class="g-pic w223">'+
									'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'">'+
										'<img wait="true" src="'+c.image+'" placepic="true" data-sku="'+c.sku+'" />'+
									'</a>'+
								'</div>'+	
								'<div class="g-name">'+
									'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'" class="dis clearFix">'+
										'<p data-sku="'+c.sku+'" class="moreLine left">'+c.name+'</p>'+
									'</a>'+
								'</div>'+
								'<div class="g-price clearFix">'+
									'<strong class="left">'+c.credit_amount+'</strong>'+
									'<span class="unit">积分</span>'+
								'</div>'+
								'<div class="join-btn clearFix">'+
									'<button class="join-cart">加入购物车</button>'+
									'<button class="join-follow">关注</button>'+
								'</div>'+
							'</li>'
					});
					$("#dataList").html(aLi);
				}else{
					$(".tcdPageCode").hide();
					var ww = '<div class="goodsEmpty clearFix" style="display: block;">'+
								'<img src="./images/magnifier.png" class="left">'+
								'<div class="left">'+
									'<p>抱歉，没有找到“<span class="skuName" title="">该商品</span>”的搜索结果~</p>'+
									'<a href="/">去首页看看</a>'+
								'</div>'+
							'</div>'
					$("#dataList").html(ww);
				}

				loadHide();
				joinBtn();//鼠标悬浮
				joinCartFollow() //购物车
				//分页
				if(parseInt(data.amount)>0)
				{
					maxinfo=40;
					var maxPage=0;
					//创建页码
					if(data.amount%maxinfo == 0){
						maxpage = data.amount/maxinfo;
					}else{
						maxpage = parseInt(data.amount/maxinfo) + 1;
					}
					//设置分页
					if(maxpage > 0){
						topPageBtn();					
						SetPage(maxpage);
						setPageAction(maxpage,1);
						$('.showPage .page2').html(maxpage);
					}
				}
			},
			error:function(error){
				alert("全部商品失败,请刷新...");
			}
		})
	};

	// if(typeof(categroyId) != 'undefined'){
	// 	oneProduct();
		//获取一级标题商品
		function oneProduct(json){
			$.ajax({
				url:'/api/product/get_categroy1_product',
				type:'GET',
				datatype:'json',
				data:{
					'categroyId':json.categroyId,
					'order':'desc',
					'rows':json.rows,
					'page':json.page
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					console.log("一级商品回调");
					var aLi='';
					var ll = data.list.length
					if (ll > 0) {
						$.each(data.list,function(i,c){		
							aLi+='<li class="w225 searchInfo" title="'+c.name+'" data-sku="'+c.sku+'">'+
									'<div class="g-pic w223">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'">'+
											'<img wait="true" src="'+c.image+'" placepic="true" data-sku="'+c.sku+'" />'+
										'</a>'+
									'</div>'+	
									'<div class="g-name">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'" class="dis clearFix">'+
											'<p data-sku="'+c.sku+'" class="moreLine left">'+c.name+'</p>'+
										'</a>'+
									'</div>'+
									'<div class="g-price clearFix">'+
										'<strong class="left">'+c.credit_amount+'</strong>'+
										'<span class="unit">积分</span>'+
									'</div>'+
									'<div class="join-btn clearFix">'+
										'<button class="join-cart">加入购物车</button>'+
										'<button class="join-follow">关注</button>'+
									'</div>'+
								'</li>'
						});
						$("#dataList").html(aLi);
						//分页
						if(parseInt(data.amount)>0)
						{
							maxinfo=40;
							var maxPage=0;
							//创建页码
							if(data.amount%maxinfo == 0){
								maxpage = data.amount/maxinfo;
							}else{
								maxpage = parseInt(data.amount/maxinfo) + 1;
							}
							//设置分页
							if(maxpage > 0){
								topPageBtn();					
								SetPage(maxpage);
								setPageAction(maxpage,3);
								$('.showPage .page2').html(maxpage);
							}
						}
					}else{
						$(".tcdPageCode").hide();
						var ww = '<div class="goodsEmpty clearFix" style="display: block;">'+
									'<img src="./images/magnifier.png" class="left">'+
									'<div class="left">'+
										'<p>抱歉，没有找到“<span class="skuName" title="">该商品</span>”的搜索结果~</p>'+
										'<a href="/">去首页看看</a>'+
									'</div>'+
								'</div>'
						$("#dataList").html(ww);
					}

					loadHide();
					joinBtn();//鼠标悬浮
					joinCartFollow() //购物车
				},
				error:function(error){
					alert("一级商品失败,请刷新...");
				}
			})
		}
	// }else{

	// };

	// if(typeof(categroyId1) != 'undefined' && typeof(categroyId2) != 'undefined'){
	// 	twoProduct();
		//获取二级标题商品
		function twoProduct(json){
			$.ajax({
				url:'/api/product/get_categroy2_product',
				type:'GET',
				datatype:'json',
				data:{
					'categroyId1':json.categroyId1,
					'categroyId2':json.categroyId2,
					'order':'desc',
					'rows':json.rows,
					'page':json.page
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					console.log("二级商品回调");
					var aLi='';
					var ll = data.list.length
					if (ll > 0) {
						$.each(data.list,function(i,c){		
							aLi+='<li class="w225 searchInfo" title="'+c.name+'" data-sku="'+c.sku+'">'+
									'<div class="g-pic w223">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'">'+
											'<img wait="true" src="'+c.image+'" placepic="true" data-sku="'+c.sku+'" />'+
										'</a>'+
									'</div>'+	
									'<div class="g-name">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'" class="dis clearFix">'+
											'<p data-sku="'+c.sku+'" class="moreLine left">'+c.name+'</p>'+
										'</a>'+
									'</div>'+
									'<div class="g-price clearFix">'+
										'<strong class="left">'+c.credit_amount+'</strong>'+
										'<span class="unit">积分</span>'+
									'</div>'+
									'<div class="join-btn clearFix">'+
										'<button class="join-cart">加入购物车</button>'+
										'<button class="join-follow">关注</button>'+
									'</div>'+
								'</li>'
						});
						$("#dataList").html(aLi);
						//分页
						if(parseInt(data.amount)>0)
						{
							maxinfo=40;
							var maxPage=0;
							//创建页码
							if(data.amount%maxinfo == 0){
								maxpage = data.amount/maxinfo;
							}else{
								maxpage = parseInt(data.amount/maxinfo) + 1;
							}
							//设置分页
							if(maxpage > 0){
								topPageBtn();					
								SetPage(maxpage);
								setPageAction(maxpage,4);
								$('.showPage .page2').html(maxpage);
							}
						}
					}else{
						$(".tcdPageCode").hide();
						var ww = '<div class="goodsEmpty clearFix" style="display: block;">'+
									'<img src="./images/magnifier.png" class="left">'+
									'<div class="left">'+
										'<p>抱歉，没有找到“<span class="skuName" title="">该商品</span>”的搜索结果~</p>'+
										'<a href="/">去首页看看</a>'+
									'</div>'+
								'</div>'
						$("#dataList").html(ww);
					}

					loadHide();
					joinBtn();//鼠标悬浮
					joinCartFollow() //购物车
				},
				error:function(error){
					alert("一级商品失败,请刷新...");
				}
			})
		}
	// }else{

	// };

	// if(typeof(categroy2) != 'undefined'){
	// 	threeProduct();
		//获取三级标题商品
		function threeProduct(json){
			//获取session
			var kname = sessionStorage.getItem("kname");
			$.ajax({
				url:'/api/product/search',
				type:'GET',
				datatype:'json',
				data:{
					'categroyId2':json.categroyId2,
					'order':'desc',
					'rows':json.rows,
					'page':json.page,
					'keyword':kname
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					console.log("三级商品回调");
					var aLi='';
					var ll = data.list.length
					if (ll > 0) {
						$.each(data.list,function(i,c){
							aLi+='<li class="w225 searchInfo" title="'+c.name+'" data-sku="'+c.sku+'">'+
									'<div class="g-pic w223">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'">'+
											'<img wait="true" src="'+c.image+'" placepic="true" data-sku="'+c.sku+'" />'+
										'</a>'+
									'</div>'+	
									'<div class="g-name">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'" class="dis clearFix">'+
											'<p data-sku="'+c.sku+'" class="moreLine left">'+c.name+'</p>'+
										'</a>'+
									'</div>'+
									'<div class="g-price clearFix">'+
										'<strong class="left">'+c.credit_amount+'</strong>'+
										'<span class="unit">积分</span>'+
									'</div>'+
									'<div class="join-btn clearFix">'+
										'<button class="join-cart">加入购物车</button>'+
										'<button class="join-follow">关注</button>'+
									'</div>'+
								'</li>'
						});
						$("#dataList").html(aLi);
						//分页
						if(parseInt(data.amount)>0)
						{
							maxinfo=40;
							var maxPage=0;
							//创建页码
							if(data.amount%maxinfo == 0){
								maxpage = data.amount/maxinfo;
							}else{
								maxpage = parseInt(data.amount/maxinfo) + 1;
							}
							//设置分页
							if(maxpage > 0){
								topPageBtn();					
								SetPage(maxpage);
								setPageAction(maxpage,5);
								$('.showPage .page2').html(maxpage);
							}
						}
					}else{
						$(".tcdPageCode").hide();
						var ww = '<div class="goodsEmpty clearFix" style="display: block;">'+
									'<img src="./images/magnifier.png" class="left">'+
									'<div class="left">'+
										'<p>抱歉，没有找到“<span class="skuName" title="">该商品</span>”的搜索结果~</p>'+
										'<a href="/">去首页看看</a>'+
									'</div>'+
								'</div>'
						$("#dataList").html(ww);
					}

					loadHide();
					joinBtn();//鼠标悬浮
					joinCartFollow() //购物车
				},
				error:function(error){
					alert("三级商品失败,请刷新...");
				}
			})
		}
	// };


	//搜索
	function search(json){
		console.log(keywords,typeof(keywords));
		console.log("产品搜索",categroy2,keywords);
		if (keywords == 'undefined') {
			$(".searchInput").val("");
			console.log("产品为空");
		}else{
			$.ajax({
				url:'/api/product/search_product',
				type:'GET',
				datatype:'json',
				data:{
					'categroyId2':json.categroy2,
					'order':'desc',
					'rows':json.rows,
					'page':json.page,
					'keyword':json.keyword
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log("搜索产品");
					console.log(data);
					var aLi='';
					var ll = data.list.length;

					console.log('total:'+parseInt(data.amount));


					if (ll > 0) {
						$.each(data.list,function(i,c){		
							aLi+='<li class="w225 searchInfo" title="'+c.name+'" data-sku="'+c.sku+'">'+
									'<div class="g-pic w223">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'">'+
											'<img wait="true" src="'+c.image+'" placepic="true" data-sku="'+c.sku+'" />'+
										'</a>'+
									'</div>'+	
									'<div class="g-name">'+
										'<a target="_blank" href="'+urlPath('/api/product/detail/?sku='+c.sku)+'" class="dis clearFix">'+
											'<p data-sku="'+c.sku+'" class="moreLine left">'+c.name+'</p>'+
										'</a>'+
									'</div>'+
									'<div class="g-price clearFix">'+
										'<strong class="left">'+c.credit_amount+'</strong>'+
										'<span class="unit">积分</span>'+
									'</div>'+
									'<div class="join-btn clearFix">'+
										'<button class="join-cart">加入购物车</button>'+
										'<button class="join-follow">关注</button>'+
									'</div>'+
								'</li>'
						});
						$("#dataList").html(aLi);
					}else{
						$(".tcdPageCode").hide();
						var ww = '<div class="goodsEmpty clearFix" style="display: block;">'+
									'<img src="/static/i3jf/images/magnifier.png" class="left">'+
									'<div class="left">'+
										'<p>抱歉，没有找到“<span class="skuName" title="'+keywords+'">'+keywords+'</span>”的搜索结果~</p>'+
										'<a href="/">去首页看看</a>'+
									'</div>'+
								'</div>'
						$("#dataList").html(ww);
					}

					//分页
					if(parseInt(data.amount)>0)
					{
						maxinfo=40;
						var maxPage=0;
						//创建页码
						if(data.amount%maxinfo == 0){
							maxpage = data.amount/maxinfo;
						}else{
							maxpage = parseInt(data.amount/maxinfo) + 1;
						}
						//设置分页
						if(maxpage > 0){
							topPageBtn();
							SetPage(maxpage);
							setPageAction(maxpage,2);
							$('.showPage .page2').html(maxpage);
						}
					}
					loadHide();
					joinBtn();//鼠标悬浮
					joinCartFollow() //购物车
				},
				error:function(error){
					// alert("搜索产品失败,请刷新...");
				}
			})
		}

	}

	//调用产品搜索接口
	// function search(json){
		// if(!searchFlag) return;
		// searchFlag = false;
		// document.documentElement.scrollTop = document.body.scrollTop =0;
		// $('#dataList').html('');
		// if(!$.trim(json.keyword)) json.keyword='';
		// if(!json.sort) json.sort='';
		// loadShow();
		// $('.tcdPageCode').attr('page',json.page);
		// console.log("产品搜索接口进入");
		// $.ajax({
		// 	url:'/api/product/search',
		// 	type:'GET',
		// 	datatype:'json',
		// 	data:{

		// 	},
		// 	success:function(data){
		// 		alert("产品搜索接口回调");
		// 		var data = JSON.parse(data);
		// 		console.log(data);
		// 		var errno = data.errno;
		// 		if (errno == 0) {
		// 			console.log("产品搜索接口回调成功---"+data);
		// 			var allValue=data.list;
		// 			console.log('total:'+parseInt(data.total));
		// 			if(parseInt(data.total)>0)
		// 			{	
		// 				maxinfo=json.rows;
		// 				var maxPage=0;
		// 				//创建页码
		// 				if(data.total%maxinfo == 0){
		// 					maxpage = data.total/maxinfo;
		// 				}else{
		// 					maxpage = parseInt(data.total/maxinfo) + 1;
		// 				}
		// 				//设置分页
		// 				if(maxpage > 0){
		// 					topPageBtn();					
		// 					SetPage(maxpage);
		// 					setPageAction(maxpage);
		// 					$('.showPage .page2').html(maxpage);
		// 				}
		// 				var aLi='';			
		// 				$.each(allValue,function (index,element){
		// 					var amountItem = '';
		// 					var joinBtn='';
		// 					var aSpan='<span class="sales-promotion c0a2a"></span>';
		// 					// var aOld;
		// 					if(!element.price || element.price <= 0){
		// 						amountItem = '<span class="unit">该地区暂不销售</span>';
		// 						joinBtn='<button class="join-cart cart-disabled">加入购物车</button>';
		// 					}else{
		// 						var nowCode = $('#provices .active').attr('data-code');
		// 						var showPrice = '--';
		// 						var whole = getCookie('area');
		// 						if(!whole){
		// 							// if(element.saleId)
		// 							// {
		// 							// 	showPrice=element.saleAmount;
		// 							// 	aOld='<span class="oldPrice right">'+element.price+'</span>';
		// 							// }
		// 							// else
		// 							// {
		// 							// 	showPrice = element.price;
		// 							// 	aOld='';
		// 							// 	aSpan='';
		// 							// }
		// 							showPrice=element.price;
		// 						}
		// 						amountItem = '<strong class="left">'+showPrice+
		// 						'</strong>'+'<span class="unit">积分</span>';
		// 						joinBtn='<button class="join-cart">加入购物车</button>';
		// 					}
		// 					aLi+='<li class="w225 searchInfo" title="'+element.name+'" data-sku="'+element.sku+'">'+
		// 							'<div class="g-pic w223">'+
		// 								'<a target="_blank" href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'">'+
		// 									'<img wait="true" load-src="'+element.image+'" placepic="true" data-sku="'+element.sku+'" />'+
		// 								'</a>'+
		// 							'</div>'+	
		// 							'<div class="g-name">'+
		// 								'<a target="_blank" href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" class="dis clearFix">'+
		// 									'<p data-sku="'+element.sku+'" class="moreLine left">'+aSpan+element.name+'</p>'+
		// 								'</a>'+
		// 							'</div>'+
		// 							'<div class="g-price clearFix">'+
		// 								amountItem+
		// 							'</div>'+
		// 							'<div class="join-btn clearFix">'+
		// 								joinBtn+
		// 								'<button class="join-follow">关注</button>'+
		// 							'</div>'+
		// 						'</li>'		
		// 				});
		// 				$('#dataList').html(aLi);
		// 				joinBtn();
		// 				loadHide();
		// 				setScrollPics();
		// 				$('.tcdPageCode').show();
		// 				//搜索出来的商品，点击跳转到商品详情页
		// 				// setListAction();
		// 				joinCartFollow();
		// 				matchFollow(allValue);
		// 				var useDefault = (!json.useDefault) ? false : true;
		// 				checkSkuList(allValue,useDefault);
		// 				searchFlag = true;
		// 			}
		// 			else
		// 			{
		// 				// $('.showPage .page2').html('1');
		// 				$('.showPage').hide();
		// 				$('.contRight .goodsDisplay').hide();
		// 				$('.goodsEmpty').show();
		// 				$('.pageBtn a').removeClass('active');
		// 				if(!keywords)
		// 				{
		// 					$('.skuName').html('该类');
		// 				}
		// 				else
		// 				{
		// 					$('.skuName').html(backKey).attr('title',backKey).before('“').after('”');
		// 				}
		// 				loadHide();
		// 			}
		// 		}else{
		// 			console.log("产品搜索接口回调异常---"+data);
		// 		}
		// 	},
		// 	error:function(error){
		// 		alert("产品搜索接口失败---"+error);
		// 		console.log("+++++++++++++++++++")
		// 	}
		// })
	// }

	//匹配关注商品
	function matchFollow(dataList){
		if(!checkLogin() || !checkLocalStroge()) return;
		if(!getLocalStroge('follow')){
			getFollow(dataList);
		}else{
			var followList = $.evalJSON(getLocalStroge('follow'));
			$.each(dataList,function(index,content){
				$.each(followList,function(key,value){
					if(content.sku == value.sku){
						var followItem = $('#dataList li[data-sku = '+content.sku+'] .join-follow');
						followItem.off('click');
						followItem.text('已关注');
						return false;
					}
				});
			});
		}
	}

	//获取关注列表
	function getFollow(dataList){
		console.log("获取关注列表接口进入");
		$.ajax({
			url:'/api/user/favourite/list',
			type:'GET',
			datatype:'json',
			data:{

			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("获取关注列表接口回调成功---"+data);
					if(data.list.length <= 0) return;
					initFollow(data.list);
					$.each(dataList,function(index,content){
						$.each(data.list,function(key,value){
							if(content.sku == value.sku){
								var followItem = $('#dataList li[data-sku = '+content.sku+'] .join-follow');
								followItem.off('click');
								followItem.text('已关注');
								return false;
							}
						});
					});
				}else{
					console.log("获取关注列表接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("获取关注列表失败,请刷新...");
			}
		})
	}

	//加入购物车
	function joinBtn()
	{
		//立即加入购物车处
		$('.join-btn button').off("mouseenter mouseleave");
		$('.join-btn button').on("mouseenter mouseleave",function(event){
		 	if(event.type == "mouseenter"){
		  		$(this).addClass('hover');
		 	}else if(event.type == "mouseleave"){
		  		$(this).removeClass('hover');
		 	}
		});
		//移入显示按钮
		$('.displayList.w1000 li').off("mouseenter mouseleave");
		$('.displayList.w1000 li').on("mouseenter mouseleave",function(event){
		 	if(event.type == "mouseenter"){
		  		$(this).find('.join-btn').show();
		 	}else if(event.type == "mouseleave"){
		  		$(this).find('.join-btn').hide();
		 	}
		});
	}

	function makeSure(btn)
	{	
		$('.mask').show();
		$('.tooltip').show();	
		var sure='商品关注成功！';
		var msgInfo={
			'mainMsg':sure,
			'alertType':true
		};		
		diyAlert(msgInfo,true);
		followFlag=false;
		changeBind(btn[0],false);
		btn.off('click');
		btn.text('已关注');
		btn.removeClass('hover');	
	}

	function checkSkuList(list,useCookie){
		var eachList;
		var skuList = [];
		var bool=true;
		var limit = 16;				
		if(list.length>=limit)
		{
			bool=false;
			eachList=list.slice(0,limit);
		}
		else
		{
			bool=true;
			eachList = list;
		}
		$.each(eachList,function(index,content){
			var sId;
			if(content.saleId)
			{
				sId=content.saleId;
			}
			else
			{
				sId='';
			}
			var skus={
				'sku':content.sku,
				'saleId':sId
			};
			skuList.push(skus);
			// skuList.push(content.sku);
		});
		getProductAmount(skuList,useCookie,list);
		if(!bool){
			var newList = list.slice(limit);
			checkSkuList(newList,useCookie,list);
		}
	}

	var loadList = [];
	//获取积分价格
	function getProductAmount(skuList,bool,allValue){
			var whole = getCookie('area');
			var nowCode = $('#citys .active').attr('city-code');
		/*if(!nowCode && !whole){
			setTimeout(function(){
				getProductAmount(skuList);
			},500);
		}else{*/
			var json = {
				'skuList':skuList		
			}
			if(whole)
			{
				json.cityId=$.evalJSON(whole).city.code;
			}
			loadList.push(false);
			var loadItem = loadList.length-1;
			console.log("获取积分价格接口进入");
			$.ajax({
				url:'/api/product/batch_query_price/',
				type:'POST',
				datatype:'json',
				data:{
					'sku':skuList,
					'city_id':allValue
				},
				success:function(data){
					var errno = data.errno;
					if (errno == 0) {
						console.log("获取积分接口回调成功---"+data);
						loadList[loadItem] = true;
						var amountList = data.priceList;
						$.each(skuList,function(key,showValue){
							var nowSku = showValue.sku;
							var hasMatch = false;
							$.each(amountList,function(index,content){
								try{
									if(nowSku == content.skuId){
										var amountItem = '';
										if(!content.amount || content.amount <= 0){
											if(content.saleId)
											{
												$('.g-name p[data-sku = '+content.skuId+'] .sales-promotion').html(cuxiao);
											}
											amountItem = '<span class="unit">该地区暂不销售</span>';
											$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').off('click');
											$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').addClass('cart-disabled');
											disableJoinCar();
										}else{
											if(content.saleId)
											{
												var oDate=new Date();
												var nowTime=parseInt(oDate.getTime());
												var oSTime=parseInt((content.stime))*1000;
												$('.g-name p[data-sku = '+content.skuId+'] .sales-promotion').html(cuxiao);
												if(content.inventory && nowTime>oSTime)
												{
													amountItem = '<strong class="left">'+content.saleAmount+'</strong>'+
														'<span class="unit">积分</span>'+
														'<span class="oldPrice">'+content.amount+'</span>';
												}
												else
												{
													amountItem = '<strong class="left">'+content.amount+'</strong>'+
															'<span class="unit">积分</span>';
												}
												$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').removeClass('cart-disabled');
												// if(content.inventory)
												// {
												// 	$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').removeClass('cart-disabled');
												// }
												// else
												// {
												// 	$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').addClass('cart-disabled');
												// 	disableJoinCar();
												// }
											}
											else
											{
												amountItem = '<strong class="left">'+content.amount+'</strong>'+
															'<span class="unit">积分</span>';
												$('.searchInfo[data-sku = '+content.skuId+'] .join-cart').removeClass('cart-disabled');
											}
										}
										$('.searchInfo[data-sku = '+content.skuId+'] .g-price').html(amountItem);
										hasMatch = true;
									}
								}catch(e){
									console.log(e);
								}
							});
							if(!hasMatch){
								var amountItem = '<span class="unit">该地区暂不销售</span>';
								$('.searchInfo[data-sku = '+nowSku+'] .join-cart').off('click');
								$('.searchInfo[data-sku = '+nowSku+'] .join-cart').addClass('cart-disabled');
								$('.searchInfo[data-sku = '+nowSku+'] .g-price').html(amountItem);
							}
						});
						checkLoadPrice(allValue);
					}else{
						console.log("获取积分接口回调异常---"+data);
					}
				},
				error:function(error){
					alert("获取积分失败,请刷新...");
					loadList[loadItem] = true;
					checkLoadPrice(allValue);
				}
			})
		// }
	}

	function checkLoadPrice(allValue){
		var flag = true;
		$.each(loadList,function(index,content){
			if(!content){
				flag = false;
				return false;
			}
		});
		if(flag){
			loadList = [];
		}
	}

	//loading效果
	function loadShow(){
		$('.loading').show();
	}
	function loadHide(){
		$('.loading').hide();
	}

	// //搜索出来的商品进行点击操作，跳转到对应的商品详情页
	// function setListAction(){
	// 	$('#dataList li .g-pic img').off('click');
	// 	$('#dataList li .g-pic img').on('click',function (){
	// 		var dataSku=$(this).attr('data-sku');
	// 		window.location.href=urlPath('/super/goodsDetails?sku='+dataSku);
	// 	});
	// 	$('#dataList li .g-name p').off('click');
	// 	$('#dataList li .g-name p').on('click',function (){
	// 		var dataSku=$(this).attr('data-sku');
	// 		window.location.href=urlPath('/super/goodsDetails?sku='+dataSku);
	// 	});
	// }

	//调用加入购物车接口
	function joinGoods(json,btn){
		if(!json.amount)
		{
			json.amount=1;
		}
		console.log("加入购物车接口进入");
		$.ajax({
			url:'/api/user/cart/create/',
			type:'POST',
			datatype:'json',
			data:{
				'sku':json.skuId,
				'amount':json.amount
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("加入购物车接口回调成功---"+data);
					// window.location.href=urlPath('/super/joinCartSuccess');
				}else{
					console.log("加入购物车接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("加入购物车失败,请刷新...");
				makeSure2(btn,errmsg);
				cartFlag=false;	
				btn.attr('disabled',false);
				btn.removeClass('cart-disabled');
			}
		})
	}
	function makeSure2(btn,errmsg)
	{	
		$('.mask').show();
		$('.tooltip').show();	
		var sure=errmsg+'！';
		var msgInfo={
			'mainMsg':sure,
			'alertType':true,
			'sureFun':function (){
				cartFlag=false;	
				btn.attr('disabled',false);
				btn.removeClass('cart-disabled');
			}
		};		
		diyAlert(msgInfo,true);
	}

	//添加关注接口
	function payAttention(sku,btn){
		console.log("添加关注接口进入");
		$.ajax({
			url:'/api/user/favourite/create/',
			type:'POST',
			datatype:'json',
			data:{
				'sku':sku
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("添加关注接口回调成功---"+data);

					makeSure(btn);
				}else{
					console.log("添加关注接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("添加关注失败,请刷新...");
				followFlag=false;	
				btn.attr('disabled',false);
			}
		})
	}

	function disableJoinCar(){
		$('.cart-disabled').off('click');
	}

	function joinCartFollow()
	{
		//加入购物车
		$('.join-cart').off('click');
		$('.join-cart').on('click',function (){
			console.log("购物车");
			var target = this;
			if(cartFlag) return;
			cartFlag=true;
			$(target).attr('disabled',true);
			var sku=$(target).parents('.searchInfo').attr('data-sku');
			//判断登录状态
			var Login = getSessionstronge("login");
			if (Login == null) {
				location.href = '/static/i3jf/login.html'
			}else{
				function doSomething(){
					joinGoods({
						'skuId':sku
					},$(target));
				}
				doSomething();
			};
		});
		//关注
		$('.join-follow').off('click');
		$('.join-follow').on('click',function (){
			if(followFlag) return;
			followFlag=true;
			$(this).attr('disabled',true);
			var tBtn=$(this);
			var sku=$(this).parents('.searchInfo').attr('data-sku');

			//判断登录状态
			if (checkLogin.flag) {
				function doSomething(){
					payAttention(sku,tBtn);
				}
				doSomething();
			}else{
				location.href = '/static/login/index.html'
			};
		});
	};

	//默认和价格排序
	var count=0;
	function defaultBtn()
	{
		$('.goodsRnav a').off('click');
		$('.goodsRnav a').on('click',function (){			
			if(!searchFlag) return;
			var type=$(this).attr('data-type');
			var sortOrder=$(this).attr('data-order');
			var isDefault = $(this).hasClass('active');
			if(type=='amount')
			{
				$('.contRight .goodsDisplay').show();
				count++;
				if((count%2)==1)
				{
					//升序
					$('.goodsRnav .prices i').css({
						'background-image':"url(./images/sort-dec.png)",
						'transform':'rotate(180deg)'
					});
					sortOrder='asc';
				}
				else
				{
					//降序
					$('.goodsRnav .prices i').css({
						'background-image':"url(./images/sort-dec.png)",
						'transform':'rotate(0deg)'
					});
					sortOrder='desc';
				}
				$(this).attr('data-order',sortOrder);			
			}
			else
			{
				count=0;
				if(isDefault) return;
				// $('.gCheck').html('');	
				// $('#faCheck').html('');
				// $('#check').html('');		
				// $('.contTit b').remove();
				$('.contRight .goodsDisplay').show();
				$('.goodsRnav .prices i').css('background-image',"url('./images/priceSU.png')");
			}
			loadShow();	
			$('.goodsEmpty').hide();
			$('#dataList').html('');
			$('.tcdPageCode').hide();
			$('.goodsRnav a').removeClass('active');
			$(this).addClass('active');	
			//调用产品搜索的接口
			if (keywords == 'undefined' || !keywords) {
				$('.searchInput').val("");
			}else{
				$('.searchInput').val(keywords);
			}
			
			$('.tcdPageCode').attr('page',1)
			// search({
			// 	'keyword':keywords,
			// 	'rows':maxinfo,
			// 	'page':1,
			// 	'categoryId':matchSearchId(),
			// 	'sort':type,
			// 	'order':sortOrder
			// });	
		});
	}
	
	function setScrollPics(){
		loadPicture();
		$(window).scroll(function(){
            loadPicture();
        });
	}

	//热卖商品
	function hotProduct()
	{
		$.ajax({
			url:'/api/main/list_hotsale',
			type:'GET',
			datatype:'json',
			data:{
				'channel_id':best
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log("热卖");
				console.log(data);
				if (data.errno == 0) {
					var aLi = '';
					$.each(data.list,function (index,element){
						aLi+='<li class="li-hot" data-sku="'+element.sku+'">'+
								'<div class="g-pic w198">'+
									'<a data-sku="'+element.sku+'" href="'+urlPath('/api/product/detail/?sku='+element.sku)+'" target="_blank">'+
										'<img src="'+
										element.image+
										'" class="size1" placepic="true" />'+
									'</a>'+
								'</div>'+	
								'<div class="g-name">'+
									'<a href="'+urlPath('/api/product/detail/?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
										'<p title="'+element.name+'" class="moreLine">'+element.name+'</p>'+
									'</a>'+
								'</div><div class="g-price clearFix">'+
									'<strong>'+element.amount+'</strong>'+
										'<span class="unit">积分</span>'+
								'</div>'+
							'</li>';
					});
					$('.hotSale .displayList').html(aLi);
				}else{
					console.log("热卖异常");
					$('li.li-hot .load-price').text('未能读取');
				}
			},
			error:function(error){
				alert("热卖商品失败,请刷新...");
			}
		})
	}
	//热卖商品中点击进入到商品详情页
	// function hotSaleDetails()
	// {
	// 	$('.hotSale .displayList li a').off('click');
	// 	$('.hotSale .displayList li a').on('click',function (){
	// 		location.href=urlPath('/super/goodsDetails?sku='+$(this).attr('data-sku'));
	// 	});
	// }