'use strict';

(function () {
	angular.module('infynectApp')
		.controller('MainController', MainController);

	MainController.$inject = ['UserService','AuthenticationService','$location', 'UserLoginService'];

	function MainController(UserService, AuthenticationService, $location, UserLoginService) {
		var vm = this;
        var User = UserService.getLoginUser();
        vm.UserName = User.user_name;
        
		iPubSub.subscribe('/userRefereshed', function(data) {
			/*vm.loggedInUserName = data.user_name;
			AuthenticationService.roles = data.roles ? data.roles.split(",") : [];*/
				vm.loggedInUserName = "siva";
			AuthenticationService.roles = "SYS_ADMIN";
		})		

		vm.hasView=function(view){
			return AuthenticationService.userHasRoleForView(view);
		}

		vm.logout = function() {
			UserLoginService.logout('/login');			
		};
	}

}());	