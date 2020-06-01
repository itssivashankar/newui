'use strict';

(function(){    
    angular.module('infynectApp')
        .factory('SecurityService', SecurityService);
    
    SecurityService.$inject = [];
    
    function SecurityService() {
        
        var security = {
            
            permission: '',
            
            isActionPermitted : function(secureCategory, securePermission) {                
                if(!this.permission[secureCategory]) {
                    return;
                }
                var actionPermitted = this.permission[secureCategory].indexOf(securePermission.toUpperCase());                                
                return actionPermitted == -1 ? false : true;
            }       
        };
        
        return security;  
    }
    
}());