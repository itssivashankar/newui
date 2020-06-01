'use strict';

(function(){    
    
    var iCookie = window.iCookie || {};
    
    iCookie.setCookie = function(cookieName, cookieValue, expireLimit) {
        
        if(!cookieName || !cookieValue || !expireLimit) {
            return;
        };        
        var now = new Date();
        now.setTime(now.getTime() + (expireLimit * 60 * 1000));
        document.cookie = cookieName + '=' + cookieValue + ";expires=" + now.toGMTString() + "; path=/";
    };
    
    iCookie.getCookie = function(cookieName) {
        var nameEQ = cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };
    
    iCookie.deleteCookie = function(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    };
    
    window.iCookie = iCookie;
    
    Storage.prototype.expireItem = function(key, expireLimit, cb, userId, redirectTo) {        
        var self = this, 
            timeOutValue = expireLimit * 60 * 1000 //calculating the time in minutes value * 60(seconds) * 1000(milliseconds);        
        self.getItem(key);                
        setTimeout(function() {
            self.removeItem(key);
            cb(userId, redirectTo);
        }, timeOutValue);
    };
    
    Storage.prototype.alertBanner = function(timeLimit, cb) {
        timeLimit = (timeLimit - 5) * 60 * 1000;
        setTimeout(function() {            
            cb();
        }, timeLimit);
    };
}())