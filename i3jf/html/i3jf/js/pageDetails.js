	var area={};	//存放code和内容
	var proviceCode='';
	var cityCode='';
	var categoryId = -1;
	var nums=1;
	var loadPrice=false;//看调接口是否成功
	var followFlag=false;	//加入关注标识符

	var userId = {};  //存放用户地址信息
	function checkNum(target){
		if(target.value<=0)target.value=1;
	}

	//页面加载完执行显示省份
	$(function (){	
		stopPropagation();	
		showDetailCategory();
		orderDetails(sku);
		enlarger();	
		//数量加减
		numBtn();
		joinFollow();
		// matchSku();
		productName(sku);	
		clickJump();

		detail_page(sku);
		get_price(sku);
		
		getHotList();//热卖	

		//获取用户id地址  并调用库存
		uesrId();

		provice(function (pCode){	
			// 省d份的 data-code
			city(pCode, function (cCode){
				district(cCode,function (dCode){
					$('#city em').html('');
					//判断cityID和districtID是否同时存在
					town(cCode,dCode,function (tCode){
						//页面加载调用区后直接调用库存
						stock({
							'sku':sku,
							'num':nums,
							'cityId':cCode,
							'countyId':dCode
						});
						//如果乡镇不为空
						if($('#towns').html()!='')
						{
							//判断有没有cookie
							// var wholeAddress=getCookie('area');
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
								$.each($('#districts li span'),function (){
									if($(this).attr('district-code')==wholeAddress.district.code)
									{
										$('#districts li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								$.each($('#towns li span'),function (){
									if($(this).attr('town-code')==wholeAddress.town.code)
									{
										$('#towns li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								pinAddr(true);
							}
							else
							{
								$('.upDown a:eq(0) span').html($('#provices li:eq(0) span').html());
								$('#provices li:eq(0) span').addClass('active');
								$('#citys li:eq(0) span').addClass('active');
								$('#districts li:eq(0) span').addClass('active');
								$('#towns li:eq(0) span').addClass('active');
								pinAddr(true);
							}
						}
						else
						{
							//当乡镇为空时
							$('.cityName').hide();
							$('.upDown a:eq(3)').hide();
							$('#towns').hide();
							//判断是否有cookie
							// var wholeAddress=$.evalJSON(getCookie('area'));
							//有cookie的话获取cookie中的值
							if(wholeAddress)
							{
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
								$.each($('#districts li span'),function (){
									if($(this).attr('district-code')==wholeAddress.district.code)
									{
										$('#districts li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								pinAddr(false);
							}
							else
							{
								$.each($('#provices li span'),function (){
									if($(this).attr('data-code')==pCode)
									{
										$('.upDown a:eq(0) span').html($(this).html());
										$('#provices li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								$.each($('#citys li span'),function (){
									if($(this).attr('city-code')==cCode)
									{
										$('#citys li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								$.each($('#districts li span'),function (){
									if($(this).attr('district-code')==dCode)
									{
										$('#districts li span').removeClass('active');
										$(this).addClass('active');
									}
								});
								pinAddr(false);
							}
						}
					});
				});
				// if(!defaultAddr)
    //             {
    //                 var defaultCityId = $('#citys span.active').attr("city-code");
    //                 var defaultDistrictId= $('#districts span.active').attr("district-code");
    //                 orderPrice(defaultCityId);
    //                 guessLike(defaultCityId);
				// 	getHotList(defaultCityId);
				// 	// stock({
				// 	// 	'sku':sku,
				// 	// 	'num':nums,
				// 	// 	'cityId':defaultCityId,
				// 	// 	'countyId':defaultDistrictId
				// 	// });
    //             }
			});
		});
		function detail_page(sku){
			console.log("产品详情接口进入");
			$.ajax({
				url:'/api/product/get_detail',
				type:'GET',
				datatype:'json',
				data:{
					'sku':sku
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					var errno = data.errno;
					var param = data.param;
					console.log(param);

					$(".byNow").attr("data-sku",sku);
					if (errno == 0) {
						console.log("产品详情接口回调成功");
						$('.gName').text(data.product.brand);

						var state = data.product.state;

						if (state == 1) {
							$('.shelf').text('新品上架');
						}
						if (state == 0) {
							$('shelf').text('商品已下架');
						}
						$(".pShows").html(data.product.introduction);
						//参数渲染
						var params = '';
						params += '<div class="param-panel"><table class="param-table"></table></div>'
						$(".paramShows").html(params);
						
						var paramPanel = '';
						$.each(param,function(i,c){
							$.each(c.param,function(j,cc){
								paramPanel += 
											'<tr class="param-tr">'
												+'<td class="param-td">'+cc.snparameterdesc+'</td>'
												+'<td class="param-td">'+cc.snparameterVal+'</td>'
											+'</tr>'
							})
						});
						
						$(".param-table").append(paramPanel);
						// $.each(param,function(index,content){
						// 	$(".paramShows").html();
						// })
						setTabChange();
						loadHide($(".contRight"));
					}else{
						console.log("产品详情接口回调异常");
					}
				},
				error:function(error){
					alert("产品详情接口失败,请刷新...");
				}
			})
		}


		//获取用户Id  并匹配  回填  调用库存
		function uesrId(){
			$.ajax({
				url:'/api/product/get_ip/',
				type:'GET',
				datatype:'json',
				data:{

				},
				success:function(data){
					console.log("获取用户id地址")
					var data = JSON.parse(data);
					console.log(data);
					console.log(data.province_id,data.city_id);
					userProvince(data.province_id,data.city_id);
				}
			})
		}
		//获取省份
		function userProvince(userProvid,userCityid){
			$.ajax({
				url:'/api/area/province/list',
				type:'GET',
				datatype:'json',
				data:{

				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					$.each(data.province,function(index,item){
						if (item.id == userProvid) {
							userId.userProvidName = item.name;  //存放用户信息
							userId.userProvidId = item.id;
							//调用市
							userCity(userProvid,userCityid);
						}
					})
				},
				error:function(error){
					alert("获取用户id省份失败")
				}
			})
		}
		//获取市
		function userCity(userProvid,userCityid){
			$.ajax({
				url:'/api/area/city/list',
				type:'GET',
				datatype:'json',
				data:{
					'id':userProvid
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					$.each(data.city,function(index,item){
						if (item.id == userCityid) {
							userId.userCityidName = item.name;
							userId.userCityidId = item.id;
							userDistrict(userProvid,userCityid,item.id)
						}
					})
				},
				error:function(error){
					alert("获取用户id市区失败")
				}
			})
		}
		//获取区县
		function userDistrict(userProvid,userCityid,userDistid){
			$.ajax({
				url:'/api/area/district/list',
				type:'GET',
				datatype:'json',
				data:{
					'id':userDistid
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					var districtId = data.district[0];
					userId.userDistidName = districtId.name;
					userId.userDistidNid = districtId.id;
					userId.userDistidPid = districtId.pid;
					userTown(userProvid,userCityid,districtId.id,districtId.pid);
				},
				error:function(error){
					alert("获取用户id区县失败")
				}
			})
		}
		function userTown(userProvid,userCityid,nid,pid){
			$.ajax({
				url:'/api/area/town/list',
				type:'GET',
				datatype:'json',
				data:{
					'nid':nid,
					'pid':pid
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					var townId = data.town[0];
					userId.userTownidName = townId.name;
					userId.userTownidId = townId.id;

					console.log(userId);

					$('#city em').html('<span class="pName">'+userId.userProvidName+'</span>'+
						'<span class="cName">'+userId.userCityidName+'</span>'+
						'<span class="dName">'+userId.userDistidName+'</span>'+
						'<span class="tName">'+userId.userTownidName+'</span>'
					);

					//页面加载调用库存  
					stock({
						'sku':sku,
						'num':nums,
						'cityId':userCityid,
						'countyId':'01'
					});
				},
				error:function(error){
					alert("获取用户id乡镇失败")
				}
			})
		}




		//获取商品价格
		function get_price(sku){
			console.log("获取商品价格进入");
			$.ajax({
				url:'/api/product/get_credit',
				type:'GET',
				datatype:'json',
				data:{
					'sku':sku
				},
				success:function(data){
					var data = JSON.parse(data);
					console.log(data);
					if (data.errno == 0) {
						$('.allScore').show();
						$('.score .getScore').show();
						$('.stockInt').hide();
						$('.nowscore').show();
						$('.allScore strong').text(data.amount);
						$('.score .nowscore strong').text(data.amount);

					}else{
						console.log("获取价格异常");
					}
				},
				error:function(error){
					alert("获取价格失败,请刷新...");
				}
			})
		}




		//点击购买
		$(".byNow").click(function(){
			console.log(checkLogin.flag);
			if (checkLogin.flag) {
				var num = $("#item-number").val();
				var detaildata = {
					"productLists":[
						{
							"name":$('.gName').text(),
							"sku":sku,
							"service":$('.saleUnit').text(),
							"number":$('#item-number').val(),
							"point":$('.allScore .ccc0a2a').text(),
							"sale":""
						}
					]
				};
				var detaildata = JSON.stringify(detaildata);
				console.log(detaildata);
				if (typeof(Stroage) == 'undefined') {
					localStorage.setItem('gDetails',detaildata);
					window.location.href = '/api/order/confirm';
				}else{
					alert("请用高版本浏览器打开");
				}
			}else{
				location.href='/api/user/login'
			}

			// purchase(sku,num);
		})
		function pinAddr(bool)
		{
			var pWords=$('#provices span.active').text();
			var cWords=$('#citys span.active').text();
			var dWords=$('#districts span.active').text();
			if(bool)
			{
				var tWords=$('#towns span.active').text();
				$('#city em').html('<span class="pName">'+pWords+'</span>'+
					'<span class="cName">'+cWords+'</span>'+
					'<span class="dName">'+dWords+'</span>'+
					'<span class="tName">'+tWords+'</span>'
				);
			}
			else
			{
				$('#city em').html('<span class="pName">'+pWords+'</span>'+
					'<span class="cName">'+cWords+'</span>'+
					'<span class="dName">'+dWords+'</span>'
				);
			}
		}
		//立即加入购物车处
		$('.shop button').on("mouseenter mouseleave",function(event){
		 	if(event.type == "mouseenter"){
		  		$(this).addClass('hover');
		 	}else if(event.type == "mouseleave"){
		  		$(this).removeClass('hover');
		 	}
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

		//点击送至的地址，显示全部的地址信息
		$('#city').on('click',function (){
			$('.cityName').show(function (){
				//省份、区、县内容可点
				proClick();
				// cityClick();
				// districtClick();
				if($('#towns').html()!='')
				{
					townClick();
				}
				else
				{
					$('.upDown a').eq(3).removeClass('active');
				}
				$('.upDown a:eq(1) span').html('请选择市');
				$('.upDown a:eq(2) span').html('请选择县区');
				$('.upDown a:eq(3) span').html('请选择乡镇');
			});
			$('.upDown a').removeClass('active');
			$('.upDown a').eq(0).addClass('active');		
			$('#provices').addClass('active');
		});
	});	


	//数量点击事件
	function numBtn(){
		$('.minus-num').off('click');
		$('.minus-num').on('click',function (){
			var numbers=$('#item-number').val();
			if(numbers<=1)
			{
				return;
			}
			numbers--;
			$('#item-number').val(numbers);
		})
		$('.plus-num').off('click');
		$('.plus-num').on('click',function (){
			var numbers=$('#item-number').val();
			$('#item-number').val(++numbers);
		});
	}

	//产品详情tab切换
	function setTabChange(){
		$('.tab-nav .tab-item').off('click');
		$('.tab-nav .tab-item').on('click',function(){
			var target = this;
			var tabId = $(target).attr('name');
			$('.tab-nav .tab-item').removeClass('chose-item');
			$(target).addClass('chose-item');
			$('.showItem').hide();
			$('.'+tabId).show();
		});
	}

	//点击头部的登陆，会跳转到登陆界面
	function unLoginAction(){
		setLoginBackUrl(urlPath('/super/goodsDetails?sku='+sku));			
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
    }

	//页面加载就调用商品大图的接口	
	diagram(sku);	
	//商品显示区大图
	function diagram(sku)
	{
		//商品详情轮播图数据
		$.ajax({
			url:'/api/product/get_image',
			type:'GET',
			datatype:'json',
			data:{
				'sku':sku
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log("轮播图");
				console.log(data);
				if(data.errno == 0){
					var allValue=data.urls;
					console.log(allValue);
					if(allValue.length>0)
					{
						var aLi='';
						var oLi='';

							$.each(allValue,function (index,element){
								oLi='<li class="active"><a href="javascript:;"><img src="'+element.image+'" placepic="true"></a></li>';
								
								$('.majorShow a img').attr('src',element.image);
								$('.imgEnlarge img').attr('src',element.image);
								
								
								
								aLi+='<li><a href="javascript:;"><img src="'+element.image+'" placepic="true"></a></li>';
								
							}); 
	
						$('.productSmall ul').html(oLi+aLi);				
						//商品小图处移入移出ul宽度
						var W=$('.productSmall ul li').length*($('.productSmall ul li').eq(0).outerWidth()+10);
						$('.productSmall ul').css('width',W+'px');
						productSmall();
					}			
					if(allValue.isSuccess==false)
					{
						console.log(allValue.returnMsg);
					}
				}else{
					console.log("获取产品轮播图片接口异常");
				}
			},
			error:function(error){
				alert("轮播图失败,请刷新...");
			}
		})
	}

	//产品详情调用接口
	//即为传过来的参数sku的编码
	var gDetails={};
	gDetails.productLists=[];
	var gD={};
	var priceStatus=false;	//判断价格是否为0或者是该地区暂不销售的标志
	function orderDetails(sku){
		loadShow($('.contRight'));
		//产品详情右侧上下架
		// $.ajax({
		// 	url:'/api/'
		// })
		// ajaxAction(
		// 	'GET',
		// 	apiPath('/api/product/retrieve?sku='+sku),
		// 	{},
		// 	true,
		// 	function (data,textStatus){		
		// 		var allValue=data.product;
		// 		if(allValue!=null && allValue.introduction!=null)
		// 		{
		// 			gD.name=allValue.name;
		// 			gD.sku=sku;
		// 			$('.contTit .orName').html(allValue.brand+'&nbsp;&nbsp;'+allValue.name);
		// 			var proIntro=allValue.introduction;
		// 			proIntro=proIntro.replace(/href=\".*?\"/ig,'class="cursorDefault"');
		// 			$('.pShows').html(proIntro);
		// 			$('.mainContRight h3 .gName').html(allValue.name);
		// 			if(allValue.state==1)
		// 			{
		// 				$('.mainContRight .shelf').html('新品上架');
		// 			}
		// 			if(allValue.state==0)
		// 			{
		// 				$('.mainContRight .shelf').html('产品下架');
		// 				$('.shop button').attr('disabled',true);
		// 			}
		// 			$('.paramShows .param-panel').append('<table class="param-table"></table>')
		// 			if(allValue.param)
		// 			{
		// 				$.each(allValue.param,function(index,content){
		// 					$('.paramShows .param-table').append(
		// 						'<tr>'+
		// 							'<th class="param-th" colspan="3">'+index+'</th>'+
		// 						'</tr>'
		// 					);
		// 					$.each(content,function(key,showValue){
		// 						var tableItem = '<tr class="param-tr">'+
		// 											'<td class="param-td">'+showValue.snparameterdesc+'</td>'+
		// 											'<td class="param-td">'+showValue.snparameterVal+'</td>'+
		// 										'</tr>';
		// 						$('.paramShows .param-table').append(tableItem);
		// 					});
		// 				});
		// 			}
		// 			loadHide($('.contRight'));
		// 		}	
		// 		if(allValue.isSuccess && allValue.isSuccess==false)
		// 		{
		// 			console.log(allValue.returnMsg);
		// 		}
		// 		setTabChange();
		// 	},function (errno,errmsg){
		// 		loadHide($('.contRight'));
		// 	}
		// );
	}	
	//转换成时间
	function userDate(uData){
		var myDate = new Date(uData*1000);
		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();
		return toDub(year) + '.' + toDub(month) + '.' + toDub(day);
	} 
	function toDub(n)
	{
		return n<10 ? '0'+n : ''+n;
	}


	function orderPrice(cityId)
	{
		// $('.score strong').html('');
		//产品促销
		// ajaxAction(
		// 	'GET',
		// 	apiPath('/api/product/score/price?sku='+sku+'&cityId='+cityId),
		// 	{},
		// 	true,
		// 	function (data,textStatus){		
		// 		if(data)
		// 		{
		// 			loadPrice=true;
		// 			if(data.amount!=0)
		// 			{
		// 				priceStatus=true;
		// 				var aIntit;//促销商品有货时显示的字样
		// 				var aIntit2;//促销商品无货时显示的字样
		// 				$('.score .allScore').show();
		// 				$('.score .nowscore').show();
		// 				if(data.saleId)
		// 				{
		// 					$('.byNow').attr('data-saleId',data.saleId);
		// 					$('.score .promo').show();
		// 					$('.mainContRight .sales-promotion').show();
		// 					var oDate=new Date();
		// 					var nowTime=parseInt(oDate.getTime());
		// 					var oSTime=parseInt((data.stime))*1000;
		// 					if(nowTime>oSTime)
		// 					{
		// 						if(data.inventory)
		// 						{
		// 							btnOffClick();
		// 							$('.score .saleScore').show();
		// 							$('.score .getScore').show();
		// 							$('.score .getScore strong').html(data.saleAmount);
		// 							$('.score .saleScore strong').html(data.amount);
		// 							$('#cu-inventory').show();
		// 							$('#cu-number').html(data.inventory);
		// 							aIntit='<span class="cred">'+data.saleName+'，活动时间：'+userDate(data.stime)+'~'+userDate(data.etime)+'</span>';
		// 							aIntit2='';
		// 						}
		// 						else
		// 						{
		// 							numBtn();
		// 							$('#item-number').attr('disabled',false);
		// 							$('.score .saleScore').hide();
		// 							$('.score .getScore').show();
		// 							$('.score .getScore strong').html(data.amount);
		// 							$('#cu-inventory').hide();
		// 							aIntit='<span class="cred lineThrough">'+data.saleName+'，活动时间：'+userDate(data.stime)+'~'+userDate(data.etime)+'</span><br/>';
		// 							aIntit2='<span class="cred">【所有促销商品已被抢完，谢谢您的惠顾，您还可继续以日常价进行购买】</span>';
		// 						}
		// 						$('.score .cuTit').html(aIntit+aIntit2);
		// 					}
		// 					else
		// 					{
		// 						numBtn();
		// 						$('#item-number').attr('disabled',false);
		// 						$('.score .saleScore').hide();
		// 						$('.score .getScore').show();
		// 						$('.score .getScore strong').html(data.amount);
		// 						$('#cu-inventory').hide();
		// 						aIntit='<span class="cred">'+data.saleName+'，活动时间：'+userDate(data.stime)+'~'+userDate(data.etime)+'</span><br/>';
		// 						aIntit2='';
		// 						$('.score .cuTit').html(aIntit+aIntit2);
		// 					}
							
		// 				}
		// 				else
		// 				{
		// 					numBtn();
		// 					$('#item-number').attr('disabled',false);
		// 					$('.score .saleScore').hide();
		// 					$('.score .getScore').show();
		// 					$('.sales-promotion').hide();
		// 					$('.score .getScore strong').html(data.amount);
		// 				}
		// 				$('.score .nowscore strong').html('&yen;'+data.price);
		// 				$('.score .stockInt').hide();						
		// 			}
		// 			else
		// 			{
		// 				priceStatus=false;
		// 				$('.score .allScore').hide();
		// 				$('.score .stockInt').show();
		// 				$('.score .nowscore').hide();
		// 				if(data.saleId)
		// 				{
		// 					$('.sales-promotion').show();
		// 					btnOffClick();
		// 				}
		// 				else
		// 				{
		// 					$('.sales-promotion').hide();
		// 					numBtn();
		// 					$('#item-number').attr('disabled',false);
		// 				}
		// 			}
		// 		}
		// 	},function (errno,errmsg){
				
		// 	}
		// );
	}
	//商品数量不可点
	function btnOffClick()
	{
		$('.minus-num').off('click');
		$('.plus-num').off('click');
		$('#item-number').attr('disabled',true);
	}

	//获取产品分类名称
	function productName(sku)
	{
		//上侧产品分类名
		$.ajax({
			url:'/api/product/get_getcategory_detail',
			type:'GET',
			datatype:'json',
			data:{
				'sku':sku
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					if(data)
					{
						$('.fCheck').html(data.frist.name).attr({'data-Id':data.frist.id,'title':data.frist.name});
						$('.faCheck').html(data.second.name).attr({'data-Id':data.second.id,'data-Id1':data.frist.id,'title':data.categoryD2Name});
						// $('.fbCheck').html(data.name).attr({'data-Id':data.categoryD3Id,'data-Id1':data.categoryD1Id,'title':data.categoryD3Name}).after('&nbsp;>&nbsp;');
						$('.orName').html(data.name);
						categoryId = data.categoryD1Id;
						getHotList();
						guessLike();
					}
				}
			}
		})
	}

	//点击全部商品分类上面的首页等部分
	function clickJump()
	{
		$('.contTit span:eq(0)').on('click',function ()
		{
			window.location.href=urlPath('/');
		});
		$('.contTit .faCheck').on('click',function (){
			window.location.href=urlPath('/api/product/search/?categroyId1='+$(this).attr('data-Id1')+'&categroyId2='+$(this).attr('data-Id'));
		});	
		$('.contTit .fCheck').on('click',function (){
			window.location.href=urlPath('/api/product/search/?categoryId='+$(this).attr('data-Id'));
		});
		// $('.contTit .fbCheck').on('click',function (){
		// 	window.location.href=urlPath('/super/order?keywordId='+$(this).attr('data-Id')+'&categoryId='+$(this).attr('data-Id1'));
		// });	
	}

	//移入大图显示右边的大图
	function enlarger(){
		// 移入商品展示区显示放大的图片
		var oDiv1=$('.majorShow');
		var oDiv2=$('.imgEnlarge');
		var oSpan=$('.block');
		var oImg=$('.imgEnlarge img');
		var nMaxLeft=oDiv1.outerWidth()-oSpan.outerWidth();
		var nMaxTop=oDiv1.outerHeight()-oSpan.outerHeight();
		var nMaxImgLeft=oImg.outerWidth()-oDiv2.outerWidth();
		var nMaxImgTop=oImg.outerHeight()-oDiv2.outerHeight();
		oDiv1.mouseenter(function (){		
			oDiv2.show();
			oSpan.show();	
		});		
		oDiv1.mouseleave(function (){
			oDiv2.hide();
			oSpan.hide();
		});		
		oDiv1.mousemove(function (ev){
			var left=ev.pageX-oDiv1.offset().left-oSpan.outerWidth()/2;
			var top=ev.pageY-oDiv1.offset().top-oSpan.outerHeight()/2;
			if (left < 0)
			{
				left=0;
			}
			else if (left > nMaxLeft)
			{
				left=nMaxLeft;
			}			
			if (top < 0)
			{
				top=0;
			}
			else if (top > nMaxTop)
			{
				top=nMaxTop;
			}
			
			oSpan.css({
				left:left+'px',
				top:top+'px'
			});
			var nImgLeft=left/nMaxLeft*nMaxImgLeft;
			var nImgTop=top/nMaxTop*nMaxImgTop;
			// 算比例
			// 实际/最大
			oImg.css({
				top:-nImgTop+'px',
				left:-nImgLeft+'px'
			});
		});	
	}
	
	//移入小的图商品展示处的大图换
	function productSmall(){
		$('.productSmall ul li').hover(function (){
			$('.productSmall ul li').removeClass('active');
			$(this).addClass('active');
			$('.majorImg a img').attr('src',$(this).find('img').attr('src'));
			$('.imgEnlarge img').attr('src',$(this).find('img').attr('src'));
		});
		//点击商品展示区右边按钮
		var L=$('.productSmall ul li').eq(1).outerWidth()+8;
		var count=0;
		var Wid=$('.productSmall ul').width();
		$('.productR').on('click',function (){
			if($('.productSmall ul').position().left<=(394-Wid))return false;
			count--;
			$('.productSmall ul').css('left',count*L+'px');
		});

		//点击商品展示区左边按钮
		$('.productL').on('click',function (){
			if($('.productSmall ul').position().left==0)return false;
			count++;
			$('.productSmall ul').css('left',count*L+'px');
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
	function provice(fn){
		console.log("省份调用")
		$.ajax({
			url:'/api/area/province/list',
			type:'GET',
			datatype:'json',
			data:{

			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					var allValue=data.province;
					if(allValue)
					{
						var aLi='';
						$.each(allValue,function (index,content){
							aLi+='<li title="'+content.name+'"><span title='+content.name+' data-code='+content.id+'>'+content.name+'</span></li>';	
						});
						$('#provices').html(aLi);
						// var whole=getCookie('area');				
						// if(whole)
						// {
							// whole = $.evalJSON(getCookie('area'));
							// proviceCode=whole.provice.code;
							// area.provice={
							// 	'code':proviceCode
							// };
							// fn(whole.provice.code);
							// $('.upDown a:eq(0) span').html($('#provices span.active').html());
						// }
						// else
						// {
						// 	area.provice={
						// 		'code':$('#provices li:eq(0) span').attr('data-code')
						// 	};
						// 	proviceCode=$('#provices li:eq(0) span').attr('data-code');
						// 	fn(area.provice.code);
						// 	$('.upDown a:eq(0) span').html($('#provices li:eq(0) span').html());
						// }
					}
					else
					{
						console.log('地址获取失败，请稍后再试');
					}
				}else{
					console.log("获取省份接口回调异常");
				}
			},
			error:function(error){
				alert("获取省份失败，请刷新...");
			}
		})

	}
	
	//点击省份名后显示要选择的市

	function proClick()
	{
		$('#provices li span').off('click');
		$('#provices li span').on('click',function (){	
			proviceCode=$(this).attr('data-code');
			city(proviceCode,cityClick);
			$('#provices li span').removeClass('active');
			$(this).addClass('active');
			area.provice={
				'code':proviceCode
			};		
			$('.upDown a').removeClass('active');						
			$('.upDown a').eq(1).addClass('active');
			$('.cityName ul').removeClass('active');
			$('#citys').addClass('active');
			$('.upDown a:eq(0) span').text($(this).text());
		});					
	}
	
	//城市列表调用接口
	function city(code,fn){
		console.log("市区调用")
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
				if (data.errno == 0) {
					var allValue=data.city;
					if(allValue)
					{
						var aLi='';
						$.each(allValue,function (index,content){
							aLi+='<li title="'+content.name+'"><span city-code='+content.id+'>'+content.name+'</span></li>';
						});
						$('#citys').html(aLi);
						$('#citys li:eq(0) span').addClass('active');
						// var whole=getCookie('area');
						// if(whole)
						// {
						// 	// whole = $.evalJSON(getCookie('area'));
						// 	cityCode=whole.city.code;
						// 	area.city={
						// 		'code':whole.city.code
						// 	};
						// 	fn(whole.city.code);
						// 	// orderPrice(sku,cityCode);
						// 	// guessLike(defaultCityId);
						// 	// getHotList(defaultCityId);
						// }
						// else
						// {
						// 	cityCode=$('#citys li:eq(0) span').attr('city-code');
						// 	area.city={
						// 		'code':cityCode
						// 	};
						// 	fn(area.city.code);
						// 	// guessLike(defaultCityId);
						// 	// getHotList(defaultCityId);
						// 	// orderPrice(sku,cityCode);
						// }
					}
					cityClick()  //点击选择市

				}else{
					console.log("获取市接口异常");
				}
			},
			error:function(error){
				alert("获取市失败，请刷新...");
			}
		})
	}

	//点击市名显示县区
	
	function cityClick(){
		console.log(111111);
		$('.cityName ul:eq(1) li span').on('click',function (){
			console.log(2222);
			$('.cityName ul:eq(1) li span').removeClass('active');
			$(this).addClass('active');
			cityCode=$(this).attr('city-code');
			area.city={
				'code':cityCode
			};
			$('.cityName ul').removeClass('active');
			$('#districts').addClass('active');
			$('.upDown a').removeClass('active');						
			$('.upDown a').eq(2).addClass('active');
			$('.upDown a:eq(1) span').html($(this).html());
			district(cityCode,districtClick);
			// orderPrice(sku,cityCode);
		});
	}

	//县区列表调用接口
	function district(code,fn){
		console.log("县区调用")
		$.ajax({
			url:'/api/area/district/list',
			type:'GET',
			datatype:'json',
			data:{
				'id':code
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					var allValue=data.district;
					if(allValue)
					{
						var aLi='';
						$.each(allValue,function (index,content){
							aLi+='<li title="'+content.name+'">'+'<span district-code='+content.id+' pid-code='+content.pid+'>'+content.name+'</span>'+'</li>';
						});
						$('#districts').html(aLi);
						$('#districts li:eq(0) span').addClass('active');
						// var whole=getCookie('area');
						// if(whole)
						// {
						// 	// whole = $.evalJSON(getCookie('area'));
						// 	districtCode=whole.district.code;
						// 	area.district={
						// 		'code':districtCode
						// 	};
						// 	fn(whole.district.code);
						// 	$('.upDown a:eq(2) span').html($('#districts li span.active').text());
						// }
						// else
						// {
						// 	districtCode=$('#districts li:eq(0) span').attr('district-code');
						// 	area.district={
						// 	'code':districtCode
						// 	};
						// 	fn(area.district.code);
						// 	$('.upDown a:eq(2) span').html($('#districts li:eq(0) span').html());
						// }
						districtClick()   //点击选择区县
					}
					
				}else{
					console.log("获取县区接口异常");
				}
			},
			error:function(error){
				alert("获取县区失败,请刷新...");
			}
		})
	}

	//点击区显示乡镇

	function districtClick(){
		$('#districts li span').on('click',function (){
			$('#districts li span').removeClass('active');
			$(this).addClass('active');	
			nid=$(this).attr('district-code');
			pid=$(this).attr('pid-code');

			console.log(nid,pid);
			var pWords=$('#provices span.active').text();	
			var cWords=$('#citys span.active').text();
			var targetCont=$(this).text();
			$('.upDown a:eq(2) span').html($(this).html());
			$('.cityName ul').removeClass('active');
			$('#towns').addClass('active');
			$('.upDown a').removeClass('active');						
			$('.upDown a').eq(3).addClass('active');
			town(nid,pid,function (){
				if($('#towns').html()!='')
				{
					$('.upDown a').eq(3).show().addClass('active');
                    $('#towns').show();
					townClick();
				}
				else
				{
					loadPrice=false;
		            $('.byNow').off("mouseenter mouseleave");
					$('.joinCart').off("mouseenter mouseleave");
					$('.joinCart').attr('disabled',true);
					$('.byNow').attr('disabled',true);
					$('#warn').css('color','#333');
					//页面加载调用区后直接调用库存
					stock({
						'sku':sku,
						'num':nums,
						'cityId':cityCode,
						'countyId':districtCode
					});
					$('.cityName ul').removeClass('active');
					$('.cityName').hide();
					$('#city em').html('');
					$('#city em').html('<span class="pName">'+pWords+'</span>'+
						'<span class="cName">'+cWords+'</span>'+
						'<span class="dName">'+targetCont+'</span>'
					);
					var defaultCityId = $('#citys span.active').attr("city-code");
                    orderPrice(defaultCityId);
                    guessLike(defaultCityId);
					getHotList(defaultCityId);
					// setCookie('area',$.toJSON(area),3);
				}
			});	
		});
	}

	//乡镇接口调用
	function town(nid,pid,fn){
		console.log("乡镇调用")
		console.log(nid,pid);
		$.ajax({
			url:'/api/area/town/list',
			type:'GET',
			datatype:'json',
			data:{
				'nid':nid,
				'pid':pid
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					var allValue=data.town;
					if(allValue!=null)
					{
						var aLi='';
						$.each(allValue,function (index,content){
							aLi+='<li title="'+content.name+'">'+
									'<span town-code='+content.id+'>'+
										content.name+
									'</span>'+
								'</li>';
						});
						$('#towns').html(aLi);
						$('#towns li span').removeClass('active');
						$('#towns li:eq(0) span').addClass('active');
						area.town={
						'code':$('#towns li:eq(0) span').attr('town-code')
						};
						// var whole=getCookie('area');
						// if(whole)
						// {
						// 	// whole = $.evalJSON(getCookie('area'));
						// 	fn(whole.town.code);
						// }
						// else
						// {
						// 	fn(area.town.code);
						// }
						townClick()//选择乡镇
					}
					
				}else{
					console.log("获取乡镇接口异常");
				}
			},
			error:function(error){
				alert("获取乡镇失败,请刷新...");
			}
		})
	}

	//点击乡镇列表
	var townCode='';
	function townClick()
	{
		$('#towns li span').on('click',function (){
			$('#towns li span').removeClass('active');
			$('.cityName ul').removeClass('active');
			$(this).addClass('active');
			var targetCont=$(this).text();
			$('.cityName').hide();
			$('.upDown a span').eq(3).html($(this).html());
			var aSpan=$('.upDown a span');	
			var pWords=$('#provices span.active').text();	
			var cWords=$('#citys span.active').text();
			var dWords=$('#districts span.active').text();			
			//调用库存函数
			area.town={
				'code':$(this).attr('town-code')
			};
			$('#city em').html('<span class="pName">'+pWords+'</span>'+
				'<span class="cName">'+cWords+'</span>'+
				'<span class="dName">'+dWords+'</span>'+
				'<span class="tName">'+targetCont+'</span>'
			);
			var defaultCityId = $('#citys span.active').attr("city-code");
			var defaultDistrictId= $('#districts span.active').attr("district-code");
            loadPrice=false;
            $('.byNow').off("mouseenter mouseleave");
			$('.joinCart').off("mouseenter mouseleave");
			$('.joinCart').attr('disabled',true);
			$('.byNow').attr('disabled',true);
			$('#warn').css('color','#333');
            orderPrice(defaultCityId);
            guessLike(defaultCityId);
			getHotList(defaultCityId);
			//选择区后直接调用库存函数
			stock({
				'sku':sku,
				'num':1,
				'cityId':defaultCityId,
				'countyId':defaultDistrictId,
			});	
			// setCookie('area',$.toJSON(area),3);
		});		
	}
	
	//查询库存
	function stock(json){
		console.log(json);
		var skuArr = [sku];
		console.log(skuArr);
		$.ajax({
			url:'/api/product/get_stock/',
			type:'GET',
			datatype:'json',
			data:{
				'sku':skuArr,
				'city_id':json.cityId
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					var status=data.state;	
					if(status==00)
					{				
						$('#warn').html('商品有货');
						$('#cu-inventory').hide();
						//当数据返回空时，加入购物车和立即购买不可用
						$('.byNow').off("mouseenter mouseleave");
						$('.joinCart').off("mouseenter mouseleave");
						$('.joinCart').removeAttr('disabled');
						$('.byNow').removeAttr('disabled');
						$('#warn').css('color','red');
						// $('#warn').html(allValue.returnMsg);
						// var loadSet=setInterval(function (){
						// 	if(!loadPrice)
						// 	{
						// 		console.log(1);
						// 		$('.byNow').off("mouseenter mouseleave");
						// 		$('.joinCart').off("mouseenter mouseleave");
						// 		$('.joinCart').attr('disabled',true);
						// 		$('.byNow').attr('disabled',true);
						// 	}
						// 	else
						// 	{
						// 		console.log(2);
						// 		// clearInterval(loadSet);
						// 		//还要判断买没买过促销商品
						// 		if(priceStatus!=true)
						// 		{
						// 			console.log(3);
						// 			$('.byNow').off("mouseenter mouseleave");
						// 			$('.joinCart').off("mouseenter mouseleave");
						// 			$('.joinCart').attr('disabled',true);
						// 			$('.byNow').attr('disabled',true);
						// 			$('#warn').css('color','#333');
						// 		}
						// 		else
						// 		{
						// 			console.log(4);
						// 			// var salesId=$('.byNow').attr('data-saleId');
						// 			// if(salesId)
						// 			// {
						// 				$('#warn').css('color','#333');
						// 				$('.joinCart').attr('disabled',false);
						// 				$('.byNow').attr('disabled',false);
						// 				//加入购物车等点击事件
						// 				shopBtn();
						// 			// }
						// 			// else
						// 			// {
						// 			// 	$('#warn').css('color','#333');
						// 			// 	$('.joinCart').attr('disabled',false);
						// 			// 	$('.byNow').attr('disabled',false);
						// 			// 	//加入购物车等点击事件
						// 				// shopBtn();
						// 			// }
						// 		}
						// 	}
						// },100);

					}
					else if(status==01){
						$('#warn').html('此地区暂不销售');
						$('#cu-inventory').hide();
						//当数据返回空时，加入购物车和立即购买不可用
						$('.byNow').off("mouseenter mouseleave");
						$('.joinCart').off("mouseenter mouseleave");
						$('.joinCart').attr('disabled',true);
						$('.byNow').attr('disabled',true);
						$('#warn').css('color','red');
						$('#warn').html(allValue.returnMsg);
					}else if (status==02) {
						$('#warn').html('此商品无货');
						$('#cu-inventory').hide();
						//当数据返回空时，加入购物车和立即购买不可用
						$('.byNow').off("mouseenter mouseleave");
						$('.joinCart').off("mouseenter mouseleave");
						$('.joinCart').attr('disabled',true);
						$('.byNow').attr('disabled',true);
						$('#warn').css('color','red');
						$('#warn').html(allValue.returnMsg);
					}else if (status==03) {
						$('#warn').html('此商品库存不足');
						$('#cu-inventory').hide();
						//当数据返回空时，加入购物车和立即购买不可用
						$('.byNow').off("mouseenter mouseleave");
						$('.joinCart').off("mouseenter mouseleave");
						$('.joinCart').attr('disabled',true);
						$('.byNow').attr('disabled',true);
						$('#warn').css('color','red');
						$('#warn').html(allValue.returnMsg);
					}
					else
					{
						$('#warn').html('库存异常');
						$('#cu-inventory').hide();
						//当数据返回空时，加入购物车和立即购买不可用
						$('.byNow').off("mouseenter mouseleave");
						$('.joinCart').off("mouseenter mouseleave");
						$('.joinCart').attr('disabled',true);
						$('.byNow').attr('disabled',true);
						$('#warn').css('color','red');
						$('#warn').html(allValue.returnMsg);
					}
					// get_price(sku);  //再调用价格接口
				}else{
					console.log("查询库存接口异常");
				}
			},
			error:function(error){
				alert("查询库存失败,请刷新...");
			}
		})
	}
	/*--------------加入购物车和立即购买----------*/
	//调用加入购物车接口
	function joinGoods(json){
		console.log("购物车接口进入");
		console.log(json.amount);
		console.log(sku);
		$.ajax({
			url:'/api/user/cart/create/',
			type:'POST',
			datatype:'json',
			data:{
				'sku':sku,
				'amount':json.amount
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log(data);
				if (data.errno == 0) {
					$('.order').hide();
					$('.shopCar').show();
					$('.shopCar h2').text('商品已成功加入购物车！');
					$('.goOn a').click(function(){
						$('.order').show();
						$('.shopCar').hide();
					})
				}else{
					$('.order').hide();
					$('.shopCar').show();
					$('.shopCar h2').text('商品已成功加入购物车！');
					$('.goOn a').click(function(){
						$('.order').show();
						$('.shopCar').hide();
					})
				}
			},
			error:function(error){
				$('.order').hide();
				$('.shopCar').show();
				$('.shopCar h2').text('商品加入购物车失败！请刷新...');
				$('.goOn a').click(function(){
					$('.order').show();
					$('.shopCar').hide();
				})
			}
		})
	}

	//添加关注接口
	function payAttention(btn){
		$.ajax({
			url:'/api/user/favourite/create/',
			type:'POST',
			datatype:'json',
			data:{
				'sku':sku
			},
			success:function(data){
				var data = JSON.parse(data);
				console.log("关注商品");
				console.log(data);
				if (data.errno == 0) {
					// makeSure(btn);
					// setFollow(sku);
					btn.text('已关注');
					btn.off('click');
					$('.toolback').show();
					$('.tooltip').show();
					$('.cancel .abolish').hide();
					$('.tooltip strong').text("商品关注成功！");
					$('.cancel .confirm').text("确定");

					$('.cancel .confirm').click(function(){
						$('.toolback').hide();
						$('.tooltip').hide();
					});
					btn.attr("disabled","disabled");
				}else if (data.errno == 1) {
					btn.attr("disabled","disabled");
					btn.text('已关注');
					btn.off('click');
					$('.toolback').show();
					$('.tooltip').show();
					$('.cancel .abolish').hide();
					$('.tooltip strong').text("商品已关注！");
					$('.cancel .confirm').text("确定");
					$('.cancel .confirm').click(function(){
						$('.toolback').hide();
						$('.tooltip').hide();
					});
				}else{
					console.log("添加关注接口异常");
				}
			},
			error:function(error){
				$('.toolback').show();
				$('.tooltip').show();
				$('.cancel .abolish').hide();
				$('.tooltip strong').text("商品关注失败，请刷新！");
				$('.cancel .confirm').text("确定");
				$('.cancel .confirm').click(function(){
					$('.toolback').hide();
					$('.tooltip').hide();
				});
			}
		})
	}
	// function makeSure(btn)
	// {	a
	// 	$('.mask').show();
	// 	$('.tooltip').show();	
	// 	var sure='商品关注成功！';
	// 	var msgInfo={
	// 		'mainMsg':sure,
	// 		'alertType':true
	// 	};		
	// 	// diyAlert(msgInfo,true);
	// 	// followFlag=false;
	// 	btn.off('click');
	// 	btn.text('已关注');
	// }
	function makeSure2(btn,errmsg)
	{	
		$('.mask').show();
		$('.tooltip').show();	
		var sure=errmsg+'！';
		var msgInfo={
			'mainMsg':sure,
			'alertType':true
		};		
		// diyAlert(msgInfo,true);
	}
	// shopBtn();
	// function shopBtn(){
	// 	//立即购买
	// 	$('.byNow').off('click');
	// 	$('.byNow').on('click',function (){			
	// 		function doSomething(){
	// 			var pNum=$('#item-number').val();
	// 			joinGoods({
	// 				'btnName':$('.byNow'),
	// 				'skuId':sku,
	// 				'amount':pNum
	// 			},function (){
	// 				var service=$('#city em .cName').html();
	// 				gD.service=$('.saleUnit').html();
	// 				gD.number=$('#item-number').val();
	// 				gD.point=$('.score strong').html();
	// 				gD.sale=$('.byNow').attr('data-saleId');
	// 				gDetails.productLists=[];
	// 				gDetails.productLists.push(gD);
	// 				setLocalStroge('gDetails',$.toJSON(gDetails));
	// 				window.location.href=urlPath('/super/orderList/confirm');
	// 			});					
	// 		}
	// 		doSomething();
			
	// 	});

		//加入购物车
		$('.joinCart').off('click');
		$('.joinCart').on('click',function (){
			if (checkLogin.flag) {
				function doSomething(){
					var pNum=$('#item-number').val();
					joinGoods({
						'btnName':$('.joinCart'),
						'skuId':sku,
						'amount':pNum
					});
				};
				doSomething();
			}else{
				location.href='/api/user/login/';
			};
		});


	//加入关注
	function joinFollow()
	{
		//关注
		$('.shop .follow').off('click');
		$('.shop .follow').on('click',function (){
			if (checkLogin.flag) {
				// if(followFlag) return;
				// followFlag=true;
				// $(this).attr('disabled',true);
				// var sku=$(this).parents('.searchInfo').attr('data-sku');
				var btn=$(this);
				payAttention(btn);
				// function doSomething(){
				// 	payAttention(btn);
				// }
				// doSomething();
				//}
			}else{
				location.href='/api/user/login/'
			}
		});
	};

	//猜你喜欢			
	function guessLike()
	{
		// $('.seller .displayList').html('');
		// loadShow($('.seller'));
		// var whole = getCookie('area');
		// var nowCode = $('#citys .active').attr('city-code');
		// if(!nowCode && !whole){
		// 	setTimeout(function(){
		// 		guessLike();
		// 	},1000);
		// }else{
		// 	var setCode = (!nowCode) ? $.evalJSON(whole).city.code : nowCode;
		// 	ajaxAction(
		// 		'GET',
		// 		apiPath('/api/guess/list/price?channelId='+categoryId+'&cityId='+setCode),
		// 		{},
		// 		true,
		// 		function (data,textStatus){	
		// 			var aLi='';
		// 			var allValue=data.list;
		// 			var skuList=[];
		// 			if(allValue!=null)
		// 			{
		// 				$.each(allValue,function (index,element){
		// 					if(index>=5) return;
		// 					skuList.push(element.sku);
		// 					var amountItem = '';
		// 					if(!element.amount || element.amount <= 0){
		// 						amountItem = '<span class="unit">该地区暂不销售</span>';
		// 					}else{
		// 						amountItem = '<strong>'+element.amount+'</strong>'+
		// 									'<span class="unit">积分</span>';
		// 					}
		// 					$('li[data-sku = '+element.sku+'] .g-price').html(amountItem);
		// 					aLi+='<li class="li-guess" data-sku="'+element.sku+'">'+
		// 							'<div class="g-pic w198">'+
		// 								'<a href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
		// 									'<img src="'+
		// 									element.image+
		// 									'" class="size1" placepic="true"/>'+
		// 								'</a>'+
		// 							'</div>'+	
		// 							'<div class="g-name">'+
		// 								'<a href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
		// 									'<p title="'+element.name+'" class="moreLine">'+element.name+'</p>'+
		// 								'</a>'+
		// 							'</div><div class="g-price clearFix">'+
		// 								amountItem+
		// 							'</div>'+
		// 						'</li>';
		// 				});
		// 				$('.seller .displayList').html(aLi);
		// 				loadHide($('.seller'));
		// 				// sellerDetails();
		// 			}else{
		// 				$('li.li-guess .load-price').text('未能读取');
		// 				loadHide($('.seller'));
		// 			}
		// 		},function (errno,errmsg){
					
		// 		}
		// 	);
		// }
	}

	//获取热卖商品
	function getHotList(){
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
									'<a data-sku="'+element.sku+'" href="'+urlPath('/static/i3jf/detail_page.html?sku='+element.sku)+'" target="_blank">'+
										'<img src="'+
										element.image+
										'" class="size1" placepic="true" />'+
									'</a>'+
								'</div>'+	
								'<div class="g-name">'+
									'<a href="'+urlPath('/static/i3jf/detail_page.html?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
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
		// $('.hotSale .displayList').html('');
		// var whole = getCookie('area');
		// var nowCode = $('#citys .active').attr('city-code');
		// if(!nowCode && !whole){
		// 	setTimeout(function(){
		// 		getHotList();
		// 	},1000);
		// }else{
		// 	var setCode = (!nowCode) ? $.evalJSON(whole).city.code : nowCode;
		// 	$.ajax({
		// 		url:'/api/'
		// 	})
		// 	ajaxAction(
		// 		'GET',
		// 		apiPath('/api/channel/list/price?channelId='+categoryId+'&cityId='+setCode),
		// 		{},
		// 		true,
		// 		function (data,textStatus){
		// 			var aLi='';
		// 			var allValue=data.list;
		// 			var skuList=[];
		// 			if(allValue!=null)
		// 			{
		// 				$.each(allValue,function (index,element){
		// 					if(index>=5) return;
		// 					skuList.push(element.sku);
		// 					var amountItem = '';
		// 					if(!element.amount || element.amount <= 0){
		// 						amountItem = '<span class="unit">该地区暂不销售</span>';
		// 					}else{
		// 						amountItem = '<strong>'+element.amount+'</strong>'+
		// 									'<span class="unit">积分</span>';
		// 					}
		// 					$('li[data-sku = '+element.sku+'] .g-price').html(amountItem);
		// 					aLi+='<li class="li-hot" data-sku="'+element.sku+'">'+
		// 							'<div class="g-pic w198">'+
		// 								'<a data-sku="'+element.sku+'" href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" target="_blank">'+
		// 									'<img src="'+
		// 									element.image+
		// 									'" class="size1" placepic="true" />'+
		// 								'</a>'+
		// 							'</div>'+	
		// 							'<div class="g-name">'+
		// 								'<a href="'+urlPath('/super/goodsDetails?sku='+element.sku)+'" target="_blank" data-sku="'+element.sku+'">'+
		// 									'<p title="'+element.name+'" class="moreLine">'+element.name+'</p>'+
		// 								'</a>'+
		// 							'</div><div class="g-price clearFix">'+
		// 								amountItem+
		// 							'</div>'+
		// 						'</li>';
		// 				});
		// 				$('.hotSale .displayList').html(aLi);
		// 				// hotSaleDetails();
		// 			}else{
		// 				$('li.li-hot .load-price').text('未能读取');
		// 			}
		// 		},function (errno,errmsg){

		// 		}
		// 	);
		// }
	}
