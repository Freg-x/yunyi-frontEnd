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
        // /article/{id}/comments
        comments:"/comments",
        // /article/all
        all:"/all",
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
    translation:"/trans",
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

export default{
    requestURL,
    apiController,
    setCookie,
    getCookie,
    delCookie
}