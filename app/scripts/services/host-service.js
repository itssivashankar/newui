'use strict';

(function(){
    angular.module('infynectApp')
        .factory('ApiHost', ApiHost);
    
    function ApiHost() {
        var host;       
        
        if(location.href.indexOf('localhost') > -1) {
            host = 'http://localhost:8001/api';
        } else if(location.href.indexOf('portal.infynect.com') > -1) {
            host = 'https://portal.infynect.com/api';
        }else if(location.href.indexOf('staging.infynect.com') > -1) {
            host = 'https://staging.infynect.com/api';
        }
        
        return host;
    };    
}());
