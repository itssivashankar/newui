'use strict';

(function(){    
    angular
        .module('infynectApp')    
        .factory('UserLoginService', UserLoginService);


    UserLoginService.$inject = ['$http', 'AuthenticationService', '$location', '$state', 'UrlService', 'UserService'];

    function UserLoginService($http, AuthenticationService, $location,  $state, UrlService, UserService){
        
        function login(payload, redirectTo) {
            return UrlService.login(payload)
                .then(
                    function(data) {
                        console.log("sssucess",data);
                        if(data && data.token && data.userId) {                                                    
                            AuthenticationService.token = data.token;
                            AuthenticationService.isAuthenticated = true;
                            AuthenticationService.userId = data.userId;
                            AuthenticationService.sessionExpire = data.expireMin;
                           // AuthenticationService.roles = data.roles ? data.roles.split(",") : [];
                            AuthenticationService.roles = "SYS_ADMIN";     
                            sessionStorage.setItem('currentLoggedInUser', JSON.stringify(data));
                            sessionStorage.expireItem('currentLoggedInUser', data.expireMin);   
                            iCookie.setCookie('token', data.token, data.expireMin);                         
                           UserService.setLoginUser(data);
                            
                           // var role = AuthenticationService.roles[0];
                            var role = "SYS_ADMIN";

                            if ( role == "SYS_ADMIN" || role == "ADMIN" || role == "OPERATOR_ADMIN" || role == "OPERATOR_USER" || role == "dev" ){
                               console.log("SYS_ADMIN")                                
                                //$location.path(redirectTo);
                              $location.path("/dashboard");
                            }
                            if( role == "ORG_ADMIN" ||  role == "CDN_ADMIN" || role == "CDN_USER" || role == "SETUP" || role == "SETUP_ADVANCE"  || role == "USER"){
                                $location.path("/profile");
                            }
                            if( role == "SALES"){
                                $location.path("/installation");
                            }
                        }
                    }, function(data) {   
                        console.log("failer",data);                     
                        iPubSub.publish('/loginfailed', data);                        
                    }
                )             
        };

        function register(payload) {
            return UrlService.register(payload);
        }
        
        function showBanner() {
            iPubSub.publish('/warning', 'test');
        };
        
        function logout(redirectTo) {
            return UrlService.logout()
                .then(
                    function(data) {
                        AuthenticationService.isAuthenticated = false;
                        AuthenticationService.token = '';
                        AuthenticationService.isAdmin = false;   
                        AuthenticationService.roles = [];                         
                        sessionStorage.removeItem("currentLoggedInUser");
                        iCookie.deleteCookie("token");
                        $location.path(redirectTo);
                    },
                    function(data) {
                       
                    }
                )
        };     
        
        function resetPassword(email) {
            var obj = {
                email: email
            }
            return UriService.resetPassword(obj)
                .then(
                    function(data){                        
                        
                    }, 
                    function(data){
                        console.log(data);
                        
                    }
                )
        };
        
        function setItem(credentials) {            
            credentials.user = btoa(credentials.user);
            credentials.password = btoa(credentials.password);            
            localStorage.setItem("infyNect", JSON.stringify(credentials));
        };
        
        function getItem() {
            return localStorage.getItem('infyNect');            
        };
        
        function removeItem() {
            localStorage.removeItem('infyNect');
        };
        
        return {
            login : login,
            logout : logout,
            register: register,
            resetPassword: resetPassword,
            setItem: setItem,
            getItem: getItem,
            removeItem: removeItem
        }
    };
}());