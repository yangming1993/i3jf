var phoneReg = new RegExp(/^1[34578]\d{9}$/);
/*手机号校验*/
function checkPhone(value,msg,bool){
	var flag = true;
	if(bool){
		flag = checkNull(value,msg);
	}
	if(flag){
		if(!phoneReg.test(value)){
			myAlert('手机号码不规范，请重新输入');
			flag = false;
		}
	}
	return flag;
}

/*密码校验*/
var passwordPatten = /^(?=.*[a-zA-Z])(?=.*[0-7])[a-zA-Z0-9]{6,20}$/;   //数字和字母
function checkPassword(value,checkValue,msg){
	if(!checkNull(value,msg)) return false;
	if(!passwordPatten.test(value)){
		myAlert('密码由6-20位字母和数字组成');
		return false;
	}
	if(value.length < 6 || value.length > 20){
		myAlert('密码由6-20位字母和数字组成');
		return false;
	}
	if(!checkNull(checkValue,'请确认密码')) return false;
	if(value != checkValue){
		myAlert('两次密码输入不同，请重新输入');
		return false;
	}
	return true;
}

/*邮箱校验*/
var emailPatten = new RegExp(/^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/);
function checkEmail(value,msg){
	if(!checkNull(value,msg)) return false;
	if(emailPatten.test(value)){
		myAlert('邮箱格式不正确，请重新填写邮箱');
		return false;
	}
	return true;
}

/*空校验*/
function checkNull(value,msg,callBack){
	if(!$.trim(value)){
		if(callBack){
			callBack(value,msg);
			return false;
		}
		if(msg){
			myAlert(msg);
			return false;
		}
		return false;
	}
	return true;
}

/*重置提示*/
function initShowError(targetID,intmsg){
	if(!intmsg) intmsg = '&nbsp;';
	$('#'+targetID).html(intmsg);
}

/*限制输入整数*/
function checkNaN(target){
	target.value=target.value.replace(/\D/g,'');
}

/*限制输入整数或小数*/
function checkDecimal(target){
	target.value = target.value.replace(/[^\d.]/g,"");      /* 替换除小数和小数点以外的字符 */
    target.value = target.value.replace(/^\./g,"");         /* 不能以小数点开头 */
    target.value = target.value.replace(/\.{2,}/g,".");     /*  */
    target.value = target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    if(!(/^-?\d+\.?\d{0,2}$/.test(target.value)) && !isNaN(parseFloat(target.value))){
        //var changeNum;
		//var floatV = parseFloat(target.value)%1;
        //if( floatV - floatV.toFixed(2)>= 0.0049){
    		//changeNum = 0.01;
        //}else{
		//	changeNum = 0;
		//}
        //target.value = eval(parseFloat(target.value).toFixed(2)) + eval(changeNum);
		//target.value = parseFloat(target.value).toFixed(2);
		var val = target.value;
		var index = val.indexOf('.');
		if(index!=-1){
			target.value = parseFloat(val.substring(0,index+3));
		};
    }
}