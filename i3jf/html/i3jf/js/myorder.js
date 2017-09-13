
	var maxinfo=5;	//每页最大的条数
	var pageinfo=6;	//一共在页面上显示几条页码

	$(function (){
		console.log(slug,typeof(slug));
		slug = slug.substr(0,1);
		showOrders(slug);
		goodsBtn();
		guessLike();
	});
	//标题如：待支付等部分的
	function commonFun(slug)
	{
		var slugs = parseInt(slug); //转数值返回一个整数
		$('#goodsTit b').removeClass('show');
		$('#goodsTit b').eq(slugs).addClass('show');
		$('#wholeOrderShow li').removeClass('active');
		$('#wholeOrderShow li').eq(slugs).addClass('active');
	}
	function showOrders(slug)
	{
		console.log(slug,typeof(slug));
		if(slug==0 || !slug)
		{
			commonFun(0);
			wholeOrders(maxinfo,1,$('#wholeOrderShow li').eq(0));
		}
		else if(slug==1)
		{
			commonFun(slug);
			beShipped(maxinfo,1,$('#wholeOrderShow li').eq(slug));
		}
		else if(slug==2)
		{
			commonFun(slug);
			noPaid(maxinfo,1,$('#wholeOrderShow li').eq(slug));
		}
		else
		{
			commonFun(slug);
			hasReturned(maxinfo,1,$('#wholeOrderShow li').eq(slug));
		}
	}

	/*================全部订单点击事件===================*/
	function goodsBtn()
	{
		$('.goodsTit b').off('click');
		$('.goodsTit b').on('click',function (){
			console.log(this);
			// location.reload();
			$('#prev').removeClass('disBtn');
			$('#prev').attr('disabled',false).css('background','#fff');
			$('#next').removeClass('disBtn');
			$('#next').attr('disabled',false).css('background','#fff');
			$('.more-item').remove();
			$('.page-item').remove();
			$('.goodsTit b').removeClass('show');
			$(this).addClass('show');
			$('.tcdPageCode').attr('page','1');
			$('#wholeOrderShow li').removeClass('active');
			$('#wholeOrderShow li').eq($(this).index()).addClass('active');
			location.href=location.href.split('?')[0]+'?slug='+$(this).index();
			return;
		});
	}


	//订单接口调用时的公共部分
	function orderCommon(currentEle,data,dIndex)
	{
		console.log(currentEle,data,dIndex);
		var allValue=data.list;
		console.log(allValue);
		var orderTit='';
		var aDivs='';
		var oA='';//拼接操作列
		if(allValue.length>0)
		{
			console.log('length');
			currentEle.find('.detailTit').show();
			var maxPage=0;
			//创建页码
			if(data.amount%maxinfo == 0){
				maxpage = data.amount/maxinfo;
			}else{
				maxpage = parseInt(data.amount/maxinfo) + 1;
			}
			//设置分页
			if(maxpage > 0){
				SetPage(maxpage);
				setPageAction(maxpage,dIndex);
			}
			$.each(allValue,function (index,element){
				var oH=opeStatus(element,oA);
				aDivs+=createGoods(element,oH);
			});
			currentEle.find('.orderDetails').html(aDivs);
			Operation(currentEle);	//操作部分的事件
			$('.tcdPageCode').show();
			loadHide(currentEle);
			// imgBtn();
			orderNum();
			// orderNameBtn();
			//再次购买
		}
		else
		{
			currentEle.find('.hDetail').hide();
			loadHide(currentEle);
			$('.tcdPageCode').hide();
			currentEle.find('.nDetail').show();
		}
	}
	//全部订单接口
	function wholeOrders(rows,page,currentEle)
	{
		console.log(rows,page);
		$('.tcdPageCode').hide();
		$('#wholeOrderShow .orderDetails').html('');
		loadShow(currentEle);
		console.log("全部订单接口进入");
		$.ajax({
			url:'/api/order/list_all',
			type:'GET',
			datatype:'json',
			data:{
				'rows':rows,
				'page':page
			},
			success:function(data){
				loadHide(currentEle);
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("全部订单接口回调成功---"+data);
					loadHide(".hDetail");
					orderCommon(currentEle,data,0);
				}else if(errno == 1){
					$(".hDetail").hide();
					$(".nDetail").show();
				}else{
					console.log("全部订单接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("全部订单接口失败,请刷新...");
			}
		})
	}
	//根据status判断拼接字符串
	function opeStatus(element,oA)
	{
		console.log("state"+element.state);
		switch(element.state)
		{
			case 0:
				oA='<a href="javascript:;" class="goToPay" data-Id="'+element.orderId+'" >去支付'+
					'</a>'+
					'<a href="javascript:;" data-Id="'+element.orderId+'" class="cueOrder coa1a1a1">取消订单'+
					'</a>';
				return oA;
			case 1:
				oA='<a href="javascript:;" class="goToPay" data-Id="'+element.orderId+'" >去支付'+
					'</a>'+
					'<a href="javascript:;" data-Id="'+element.orderId+'" class="cueOrder coa1a1a1">取消订单'+
					'</a>';
				return oA;
			case 2:
				oA='<a href="javascript:;" data-Id="'+element.orderId+'" class="buy-again">再次购买'+
					'</a>'+
					'<a href="javascript:;" data-Id="'+element.orderId+'" class="cueOrder coa1a1a1">取消订单'+
					'</a>';
				// oA='<a href="javascript:;" data-Id="'+element.orderNumber+'" class="backOrder">退换货'+
				// 	'</a>';
				return oA;
			case 4:
				oA='<a href="javascript:;" data-Id="'+element.orderId+'" class="buy-again">再次购买'+
					'</a>';
				return oA;
			case 8:
				oA='';
				return oA;
		}

	}

	//操作部分的事件
	function Operation(currentEle){
		var cueOrderBtns=currentEle.find('.orderDetails').find('.delOrder .cueOrder');
		var byAgainBtns=currentEle.find('.orderDetails').find('.delOrder .buy-again');
		var goToPayBtns=currentEle.find('.orderDetails').find('.delOrder .goToPay');
		var backOrderBtns=currentEle.find('.orderDetails').find('.delOrder .backOrder');
		var delOrderBtns=currentEle.find('.orderDetails').find('.delete-order');
		$.each(cueOrderBtns,function (){
			cueBtn($(this));
		});
		$.each(byAgainBtns,function (){
			buyAgainBtn($(this));
		});
		$.each(goToPayBtns,function (){
			toPayFor($(this));
		});
		$.each(backOrderBtns,function (){
			backBtn($(this));
		});
		$.each(delOrderBtns,function (){
			delBtn($(this));
		});
	}
	//点击待付款
	function beShipped(rows,page,currentEle)
	{
		console.log("待付款");
		$('.tcdPageCode').hide();
		$('#wholeOrderShow .orderDetails').html('');
				console.log(currentEle);
		loadShow(currentEle);
		console.log("待付款接口进入"+rows,page);
		$.ajax({
			url:'/api/order/list_unpay',
			type:'GET',
			datatype:'json',
			data:{
				'rows':rows,
				'page':page
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("待付款接口回掉成功---"+data);
					loadHide(".hDetail");
					orderCommon(currentEle,data,1);
				}else if(errno == 1){
					$(".hDetail").hide();
					$(".nDetail").show();
				}else{
					console.log("待付款接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("待付款接口失败,请刷新...");
			}
		})
	}

	//点击待发货
	function noPaid(rows,page,currentEle)
	{
		$('.tcdPageCode').hide();
		$('#wholeOrderShow .orderDetails').html('');
		loadShow(currentEle);
		console.log("代发货接口进入"+rows,page);
		$.ajax({
			url:'/api/order/list_unsend',
			type:'GET',
			datatype:'json',
			data:{
				'rows':rows,
				'page':page
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("待付款发货回掉成功---"+data);
					loadHide(".hDetail");
					orderCommon(currentEle,data,2);
				}else if(errno == 1){
					$(".hDetail").hide();
					$(".nDetail").show();
				}else{
					console.log("待发货接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("待付发货口失败,请刷新...");
			}
		})
	}
	//点击已退货
	function hasReturned(rows,page,currentEle)
	{
		$('.tcdPageCode').hide();
		$('#wholeOrderShow .orderDetails').html('');
		console.log(currentEle);
		loadShow(currentEle);
		$.ajax({
			url:'/api/order/list_canceled',
			type:'GET',
			datatype:'json',
			data:{
				'rows':rows,
				'page':page
			},
			success:function(data){
				console.log("退货接口");
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					loadHide(".hDetail");
					orderCommon(currentEle,data,3);
				}else if(errno == 1){
					$(".hDetail").hide();
					$(".nDetail").show();
				}else{
					console.log("退货接口异常");
				}
			},
			error:function(error){
				alert("退货接口失败,请刷新...");
			}
		})
		// ajaxAction(
		// 	'GET',
		// 	apiPath('/api/order/refund/list?rows='+rows+'&page='+page),
		// 	{},
		// 	true,
		// 	function (data,textStatus){
		// 		orderCommon(currentEle,data,3);
		// 	},function (errno,errmsg){

		// 	}
		// );
	}

	//去支付
	function toPayFor(obj)
	{
		obj.off('click');
		obj.on('click',function (){
			var productNo=obj.parents('.wholeOrder').find('.orderNum').html();
			console.log("支付订单："+productNo);
			// window.location.replace(urlPath('/super/orderList/pay?nb='+productNo));
		});
	}

	//创建商品
	function createGoods(element,oH)
	{
		var aOrderImg='';
		var oDel;
		var pays;
		var orderState;
		switch(element.state)
		{
			case 0:
				orderState = '<div class="payGoods">订单完成</div>';
				oDel='';
				break;
			case 1:
				orderState = '<div class="payGoods">订单待支付</div>';
				oDel='';
				break;
			case 2:
				orderState = '<div class="payGoods">订单待发货</div>';
				oDel='';
				break;
			case 3:
				orderState = '<div class="payGoods">订单取消中</div>';
				oDel='';
				break;
			case 5:
				orderState = '<div class="payGoods">订单审批中</div>';
				oDel='';
				break;
			case 6:
			case 7:
			case 8:
			case 4:
				oDel='<a href="javascript:;" class="delete-order right" data-Id="'+
						element.id+'">删除</a>';
				orderState = '<div class="payGoods">订单已取消</div>';
				break;
			default:
				oDel='';
				break;
		};
		switch(element.payment){
			case '08':
				pays='<span>在线支付</span>';
				break;
		};

		var len = element.product_list.length;
		for(var i=0; i<len; i++)
		{
			var newN;//促销
			if(element.product_list[i].saleId)
			{
				newN='<span class="sales-promotion c0a2a">【促销】</span>';
			}
			else
			{
				newN='';
			}

			aOrderImg+='<div class="orderImg clearFix">'+
							'<a class="order-pic left" href="/api/product/detail/?sku='+element.product_list[i].skuid+' " target="_blank">'+
								'<img src="'+element.product_list[i].image+'" data-Id="'+element.product_list[i].skuid+'" placepic="true">'+
							'</a>'+
							'<a class="order-tit left" href="/api/product/detail/?sku='+element.product_list[i].skuid+' " target="_blank">'+
								'<p data-Id="'+element.product_list[i].skuid+'" class="moreLine">'+newN+element.product_list[i].name+'</p>'+
							'</a>'+
						'</div>';
		}
		return '<div class="wholeOrder">'+
					'<div class="orderTit clearFix">'+
						'<div class="orderTime left">'+
							'<span class="c999">下单时间：</span>'+
							'<span>'+element.date_created+'</span>'+
						'</div>'+
						'<div class="orderTime left">'+
							'<span class="c999">订单编号：</span>'+
							'<span class="orderNum">'+element.orderId+'</span>'+
						'</div>'+
						oDel+
					'</div>'+
					'<div class="orderIntro">'+
						'<div class="orderWords">'+aOrderImg+'</div>'+
							'<div class="pay">'+
								'<div class="payStyle">'+
									'<p>'+element.amount+'</p>'+
									pays+
								'</div>'+
							'</div>'+
							orderState+
							'<div class="delOrder">'+
								oH+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	}

	var anotherList=[];	//把每一个元素都push进去
	var signFlag=false;	//标志再次购买可点不可点
	var cueFlag=false;
	//取消订单
	function cueBtn(obj)
	{
		obj.off('click');
		obj.on('click',function (index,element){
			var ele=$(this);
			cueSure(ele.attr('data-Id'));
		});
	}
	//退换货
	function backBtn(obj)
	{
		obj.off('click');
		obj.on('click',function (index,element){
			var ele=$(this);
			backSure(ele.attr('data-Id'));
		});
	}
	//删除
	function delBtn(obj)
	{
		obj.off('click');
		obj.on('click',function (index,element){
			var ele=$(this);
			delSure(ele.attr('data-Id'));
		});
	}
	//再次购买
	function buyAgainBtn(obj)
	{
		obj.off('click');
		obj.on('click',function (index,element){
			if(signFlag)return;
			signFlag=true;
			var ele=$(this);
			var par=ele.parents('.orderIntro').find('.orderImg p');
			$.each(par,function (index,content){
				anotherList.push(false);
				var pSku=$(content).attr('data-Id');
				buyAgain(pSku,index);
			});
		});
	}
	//取消订单确认
	function cueSure(orderNumber)
	{
		console.log(orderNumber);
		if(cueFlag) return;
		var sure='您确定要取消该订单吗？';
		var msgs='取消后将不可恢复';
		var msgInfo={
			'mainMsg':sure,
			'subMsg':msgs,
			'sureFun':function (){
				cueOrder(orderNumber);
			}
		};
		diyAlert(msgInfo,true);
	}
	//退换货确认
	function backSure(orderNumber)
	{
		var sure='您确定要退换该商品吗？';
		var msgs='点击确定后将不可恢复';
		var msgInfo={
			'mainMsg':sure,
			'subMsg':msgs,
			'sureFun':function (){
				cueOrder(orderNumber);
			}
		};
		diyAlert(msgInfo,true);
	}
	//删除订单确认
	function delSure(orderNumber)
	{
		var sure='您确定要删除该订单吗？';
		var msgs='删除后订单将不可恢复';
		var msgInfo={
			'mainMsg':sure,
			'subMsg':msgs,
			'sureFun':function (){
				delOrder(orderNumber);
			}
		};
		diyAlert(msgInfo,true);
	}

	//取消订单接口
	function cueOrder(orderNumber)
	{
		cueFlag=true;
		console.log("取消订单接口进入"+orderNumber);
		$.ajax({
			url:'/api/order/cancelorder/',
			type:'POST',
			datatype:'json',
			data:{
				'orderId':orderNumber
			},
			success:function(data){
				console.log("取消订单接口进入");
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("取消订单接口回调成功---"+data);
					window.location.reload();
				}else{
					console.log("取消订单接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("取消订单失败,请刷新...");
				cueFlag=false;
			}
		})
	}
	//删除订单接口
	function delOrder(orderNumber)
	{
		console.log(orderNumber);
		$.ajax({
			url:'/api/order/remove/',
			type:'POST',
			datatype:'json',
			data:{
				'order_no':orderNumber
			},
			success:function(data){
				console.log("删除订单接口回调");
				var data = JSON.parse(data);
				console.log(data);
				var errno = data.errno;
				if (errno == 0) {
					console.log("删除订单接口回调成功---"+data);
					window.location.reload();
				}else{
					console.log("删除订单接口回调异常---"+data);
				}
			},
			error:function(error){
				alert("删除订单失败,请刷新...");
			}
		})
	}

	//再次购买
	function buyAgain(proSku,index)
	{
		joinGoods({
			'skuId':proSku
		},index);
	}

	//调用加入购物车接口
	function joinGoods(json,index){
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
				var data = JSON.parse(data)
				var errno = data.errno;
				if (errno == 0) {
					console.log("加入购物车接口回调成功--"+data);
					anotherList[index] = true;
					checkJoin();
					window.location.href = "/api/user/mycart";
				}else{
					console.log("加入购物车接口回调异常--"+data);
				}
			},
			error:function(error){
				alert("加入购物车接口失败,请刷新...");
				signFlag=false;
				anotherList=[];
				makeSure2(errmsg);
			}
		})
	}

	function makeSure2(errmsg)
	{
		$('.mask').show();
		$('.tooltip').show();
		var sure=errmsg+'！';
		var msgInfo={
			'mainMsg':sure,
			'alertType':true
		};
		diyAlert(msgInfo,true);
	}

	function checkJoin(){
		// console.log(111);
		
		// var flag = true;
		// $.each(anotherList,function(index,content){
		// 	if(!content){
		// 		flag = false;
		// 		return false;
		// 	}
		// });
		// if(flag) window.location.href=urlPath('/super/joinCartSuccess');
	}

	/*================== 分页 start================*/
	//设置分页
	function SetPage(maxpage){
		var now_page = parseInt($('.tcdPageCode').attr('page'));
		$('.more-item').remove();
		$('.page-item').remove();
		$('.page1').text(now_page);
		$('.page2').text(maxpage);
		var start = '<div position="'+1+'" class="page-item">'+1+'</div>';
		var end = '<div position="'+maxpage+'" class="page-item">'+maxpage+'</div>';
		if(maxpage <= pageinfo){
			if(maxpage==1)
			{
				$('#next').before(start);
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
		location.href =location.href.split('#')[0]+'#' + now_page;
		if(now_page==maxpage)
		{
			$('#prev').removeClass('disBtn');
			$('#next').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
		}
		if(now_page==1)
		{
			$('#next').removeClass('disBtn');
			$('#prev').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
		}
		if(now_page>1 && now_page<maxpage)
		{
			$('#next').removeClass('disBtn');
			$('#prev').removeClass('disBtn');
			$('#next').attr('disabled',false).css('background','#fff');
			$('#prev').attr('disabled',false).css('background','#fff');
		}
	}

	//页码操作
	function setPageAction(maxpage,dataIndex){
		//对页码中的数字键进行点击操作
		$('.page-item').unbind('click');
		$('.page-item').bind('click',function(){
			var now_page = parseInt($(this).attr('position'));
			if(now_page==maxpage)
			{
				$('#prev').attr('disabled',false).css('background','#fff');
				$('#next').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
			}
			if(now_page==1)
			{
				$('#next').attr('disabled',false).css('background','#fff');
				$('#prev').attr('disabled',true).css({'background':'#f5f5f5','color':'#333'});
			}
			if(now_page>1 && now_page<maxpage)
			{
				$('#next').attr('disabled',false).css('background','#fff');
				$('#prev').attr('disabled',false).css('background','#fff');
			}
			/*-传参数dataIndex来判断点击页码时执行的接口函数--开始*/
			switchIndex(now_page,dataIndex);
			/*-传参数dataIndex来判断点击页码时执行的接口函数--结束*/
			$('.tcdPageCode').attr('page',now_page);
			location.href = location.href.split('#')[0] + '#' + now_page;
		});
		//上一页，下一页点击事件
		$('.page-button').unbind('click');
		$('.page-button').bind('click',function(){
			var type = $(this).attr('id');
			var now_page = parseInt($('.tcdPageCode').attr('page'));
			switch(type){
				case 'prev':
					if(now_page > 1){
						$('.tcdPageCode').attr('page',--now_page);
					}
				break;

				case 'next':
					if(now_page < maxpage){
						$('.tcdPageCode').attr('page',++now_page);
					}
				break;
			}
			if(now_page==1)
			{
				$('#next').removeClass('disBtn');
				$('#next').attr('disabled',false).css('background','#fff');
			}
			if(now_page>1 && now_page<maxpage)
			{
				$('#next').removeClass('disBtn');
				$('#prev').removeClass('disBtn');
			}
			/*-传参数dataIndex来判断点击页码时执行的接口函数--开始*/
			switchIndex(now_page,dataIndex);
			/*-传参数dataIndex来判断点击页码时执行的接口函数--结束*/
			if(now_page==maxpage)
			{
				$('#prev').attr('disabled',false).css('background','#fff');
				$('#prev').removeClass('disBtn');
				$('#next').addClass('disBtn');
			}
			location.href = location.href.split('#')[0] + '#' + now_page;
		});
	}
	//通过index判断函数的调用
	function switchIndex(now_page,dataIndex)
	{
		console.log("index判断"+dataIndex,maxinfo);
		switch(dataIndex)
		{
			case 0:
				wholeOrders(maxinfo,now_page,$('#wholeOrderShow li').eq(dataIndex));
				break;
			case 1:
				beShipped(maxinfo,now_page,$('#wholeOrderShow li').eq(dataIndex));
				break;
			case 2:
				noPaid(maxinfo,now_page,$('#wholeOrderShow li').eq(dataIndex));
				break;
			default:
				hasReturned(maxinfo,now_page,$('#wholeOrderShow li').eq(dataIndex));
				break;
		}
	}

	//点击订单编号，跳转到订单详情页
	function orderNum(){
		$('.orderNum').off('click');
		$('.orderNum').on('click',function (){
			location.href='/api/order/detail?orderNumber='+$(this).html();
		});
	}

	//点击商品名跳转到商品详情页
	// function orderNameBtn(){
	// 	$('.orderImg p').off('click');
	// 	$('.orderImg p').on('click',function (){
	// 		location.href=urlPath('/super/goodsDetails?sku='+$(this).attr('data-Id'));
	// 	})
	// }
	//猜你喜欢
	function guessLike()
	{
		// $('.seller .displayList').html('');
		// loadShow($('.seller'));
		// var whole = getCookie('area');
		// var setCode = (whole) ? $.evalJSON(whole).city.code : '';
		// ajaxAction(
		// 	'GET',
		// 	apiPath('/api/guess/list/price?channelid=&cityId='+setCode),
		// 	{},
		// 	true,
		// 	function (data,textStatus){
		// 		var aLi='';
		// 		var allValue=data.list;
		// 		var skuList=[];
		// 		if(allValue.length>0)
		// 		{
		// 			$.each(allValue,function (index,element){
		// 				if(index>=5) return;
		// 				skuList.push(element.sku);
		// 				var amountItem = '';
		// 				if(!element.amount || element.amount <= 0){
		// 					amountItem = '<span class="unit">该地区暂不销售</span>';
		// 				}else{
		// 					amountItem = '<strong>'+element.amount+'</strong>'+
		// 								'<span class="unit">积分</span>';
		// 				}
		// 				$('li[data-sku = '+element.sku+'] .g-price').html(amountItem);
		// 				aLi+='<li class="li-guess" data-sku="'+element.sku+'">'+
		// 						'<div class="g-pic w198">'+
		// 							'<a href="'+urlPath('/super/goodsDetails?sku='+element.sku)+' " target="_blank" data-sku="'+element.sku+'">'+
		// 								'<img src="'+
		// 								element.image+
		// 								'" placepic="true"/>'+
		// 							'</a>'+
		// 						'</div>'+
		// 						'<div class="g-name">'+
		// 							'<a href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
		// 								'<p title="'+element.name+'" class="moreLine">'+element.name+'</p>'+
		// 							'</a>'+
		// 						'</div><div class="g-price clearFix">'+
		// 							amountItem+
		// 						'</div>'+
		// 					'</li>';
		// 			});
		// 			$('.seller .displayList').html(aLi);
		// 			loadHide($('.seller'));
		// 			// sellerDetails();
		// 		}else{
		// 			$('li.li-guess .load-price').text('未能读取');
		// 			loadHide($('.seller'));
		// 		}
		// 	},function (errno,errmsg){

		// 	}
		// );
	}

	//猜你喜欢中点击进入到商品详情页
	// function sellerDetails()
	// {
	// 	$('.seller .displayList li a').off('click');
	// 	$('.seller .displayList li a').on('click',function (){
	// 		location.href=urlPath('/super/goodsDetails?sku='+$(this).attr('data-sku'));
	// 	});
	// }
