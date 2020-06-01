'use strict';
    
(function(){    
    angular.module('infynectApp')
        .factory('AuthenticationService', AuthenticationService);
    
    AuthenticationService.$inject = [];
    
    function AuthenticationService(){
        var auth = {
            isAuthenticated: false,
            isAdmin: false,
            token: '',
            sessionExpire: '',
            roles:[],
            userHasRole: function(data){
                var access=false;
                for (var i = data.length - 1; i >= 0; i--) {
                    if(auth.roles.indexOf(data[i])>-1){
                        access=true;
                        break;                        
                    }
                };
                return access;
            },
            views:{
                dashboard:["SYS_ADMIN","ADMIN","OPERATOR_ADMIN","OPERATOR_USER","DEV"],
                static:["SYS_ADMIN","ADMIN","CDN_ADMIN","CDN_USER","DEV"],
                ott:["SYS_ADMIN","ADMIN","CDN_ADMIN","CDN_USER","DEV"],
                stream:["SYS_ADMIN","ADMIN","CDN_ADMIN","CDN_USER","DEV"],
                admin_profile:["SYS_ADMIN","ADMIN"],
                org_setting:["SYS_ADMIN"]
            },
            userHasRoleForView: function(view){                
                return auth.views.hasOwnProperty(view) ? auth.userHasRole(auth.views[view]) : false;
            }
        }
        
        return auth;
    };
}());






                
