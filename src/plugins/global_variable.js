const requestURL = "http://47.96.156.169:8090";
const apiController = {
    article:{
        prefix:"/article",
        // /article/{articleId}/cancel_like
        cancel_like:"/cancel_like",
        // /article/{articleId}/like
        like:"/like",
        // /article/{id}
        info:"/",
        // /article/{{articleId}}/request_trans
        request_trans:"/request_trans",
        // /article/{id}/delete
        delete:"/delete",
        // /article/{id}/segs
        segs:"/segs",
        // /article/modify
        modify:"/modify",
        // /article/upload
        upload:"/upload",
        // /article/{id}/comments
        comments:"/comments",
        // /article/all
        all:"/all",
        // /article/{id}/trans
        trans:"/trans",
        // /article/uploader/{id}
        uploader:"/uploader",
        // /article/{id}/view
        view:"/view",
        comment:{
            prefix:"/comment", 
            // /article/comment/{id}/delete
            delete:"/delete",
            // /article/comment/add
            add:"/add"
        }
    },
    login:{
        prefix:"/login",
        // /login/captcha
        captcha:"/captcha"
    },
    sms:"/sms",
    translation:{
        prefix:"/trans",
        // /trans/{id}
        info:"/",
        // /trans/{id}/comments
        comments:"/comments",
        // /trans/{id}/delete
        delete:"/delete",
        // /trans/{id}/modify
        modify:"/modify",
        // /trans/{id}/like
        like:"/like",
        // /trans/{id}/cancel_like
        cancel_like:"/cancel_like",
        // //tans/upload
        upload:"/upload",
        comment:{
            prefix:"/comment",
            // /trans/comment/{id}/delete
            delete:"/delete",
            // /trans/comment/add
            add:"/add"
        },
        detail:{
            // /trans/{id}/detail
            prefix:"detail",
            // /trans/detail/{id}/like
            like:"/like",
            // /trans/detail/{id}/cancel_like
            cancel_like:"/cancel_like",
            // /trans/detail/comment/add
            add_comment:"/comment/add"
        }
    },
    user:{
        prefix:"/user",
        // /user/id
        info:"/",
        // /user/add
        all:"/all",
        // /user/modify
        modify:"/modify"
    }
};

//expTime is set to be an Integer, represent minutes
function setCookie(name, value, expMinutes){
    var expTime = new Date();
    expTime.setTime(expTime.getTime() + expMinutes * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + expTime.toGMTString();
}

function getCookie(name){
    var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(document.cookie.match(reg)){
        var arr = document.cookie.match(reg); 
        return unescape(arr[2]);
    }
    else
        return null;
}

//Let the cookie expire
function delCookie(name){
    var expTime = new Date();
    expTime.setTime(expTime.getTime() - 1);
    var cval = getCookie(name);
    document.cookie = name + "=" + cval + ";expires="+expTime.toGMTString();
}

function seconds2String(seconds){
    //慢了13小时
    seconds += 13 * 3600;
    var dateObj = new Date();
    dateObj.setTime(seconds * 1000);
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth()+1;
    var day = dateObj.getDate();
    var hour = dateObj.getHours();
    var min = dateObj.getMinutes();
    var sec = dateObj.getSeconds();
    if(month < 10)month = "0" + month;
    if(day < 10)day = "0" + day;
    if(hour < 10)hour = "0"+ hour;
    if(min < 10)min = "0"+ min;
    if(sec < 10)sec = "0"+ sec;
    return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
}

export default{
    requestURL,
    apiController,
    setCookie,
    getCookie,
    delCookie,
    seconds2String
}