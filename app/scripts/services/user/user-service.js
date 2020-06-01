'use strict';
(function(){
    angular
        .module('infynectApp')
        .factory('UserService', UserService);

    UserService.$inject = ['UrlService', '$http', '$filter'];

    
      function UserService(UrlService, $http, $filter) {

        var userService = {};
          userService.user = {};
          userService.setLoginUser = function(loginUser){
              console.log("loginUser",loginUser);
              userService.user = loginUser;
              function getUserByUserId(loginUser) {
                  iPubSub.publish('/userRefereshed', loginUser)
                /*  return UrlService.getUserByUserId(loginUser.userId)
                      .then(
                        function(data){
                            userService.user = data[0];                            
                            iPubSub.publish('/userRefereshed', data[0])
                        }, 
                        function(data){
                            console.log(data);
                        }
                    )*/
              }
              getUserByUserId(loginUser);              
          };
          userService.getLoginUser = function(){                            
              return userService.user;
          };
          
          userService.getUserByUserId = UrlService.getUserByUserId;
                    
        return userService;
    }   
})();
