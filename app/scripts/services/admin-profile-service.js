'use strict';
(function(){
    angular
        .module('infynectApp')
        .factory('AdminProfileService', AdminProfileService);

    AdminProfileService.$inject = ['UrlService', '$http', '$filter'];
    
      function AdminProfileService(UrlService, $http, $filter) {
        
        function getAllUsers() {
          return UrlService.getAllUsers()            
        }

        function getUserById(id) {
          return UrlService.getUserByUserId(id);
        }

        function createUser(user) {
          return UrlService.createUser(user);
        }

        function updateUser(userId, user) {
          return UrlService.updateUser(userId, user);
        }

        function deleteUser(userId) {
          return UrlService.deleteUser(userId);
        }

        function updateService(payload, redirectTo) {
            return UrlService.updateService(payload);
        };

        return {
          getAllUsers: getAllUsers,
          getUserById: getUserById,
          createUser: createUser,
          updateUser: updateUser,
          deleteUser: deleteUser,
          updateService : updateService
        }

      }   
})();
