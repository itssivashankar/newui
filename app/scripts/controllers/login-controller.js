'use strict';

(function(){    
    angular.module('infynectApp')
        .controller('LoginController', LoginController);
    
    LoginController.$inject = ['UserLoginService', 'constants', '$location', '$state', '$scope', 'UserService'];
    
    function LoginController(UserLoginService, constants, $location, $state, $scope, UserService){


        document.body.style.background = "#1375be url('images/bg.jpg') no-repeat";
        
        // JQuery References  
        var loginFormLink = $('#login-form-link');  
        var loginForm = $("#login-form")
        var registrationFormLink = $('#register-form-link');  
        var registerForm = $("#register-form");
        var forgotPasswordForm = $('#forgot-password');  
        var forgotPasswordBtn = $('#forgot-password-btn')
        var loginRegisterPanel = $('#login-register-panel');
              
        loginFormLink.click(function(e) {
            loginForm.delay(100).fadeIn(100);        
            forgotPasswordForm.fadeOut(100);
            registerForm.fadeOut(100);
            registrationFormLink.removeClass('active');
            forgotPasswordForm.removeClass('active');
            $(this).addClass('active');
            e.preventDefault();            
        });
          
        registrationFormLink.click(function(e) {
            registerForm.delay(100).fadeIn(100);
            loginForm.fadeOut(100);
            forgotPasswordForm.fadeOut(100);
            loginFormLink.removeClass('active');
            forgotPasswordForm.removeClass('active');
            $(this).addClass('active');
            e.preventDefault();            
        });  
        
        forgotPasswordBtn.click(function(et) {
            forgotPasswordForm.delay(100).fadeIn(100);
            loginForm.fadeOut(100);
            loginForm.removeClass('active');
            $(this).addClass('active');        
        });

        // Taking reference for the 'this' keyword.
        var vm = this;      
        
        vm.doLogin = function() {
            // Login rest endponit.
            var payLoad = {
                email: vm.user,
                password: vm.password
            };            
            UserLoginService.login(payLoad, '/dashboard')

            iPubSub.subscribe('/loginfailed', function(data){                                
                vm.loginFailed = "Please enter valid Credentials";
                setTimeout(function(){
                    vm.loginFailed = null;
                    $scope.$digest();
                },2000);                
            });
        };  

        vm.doSingin = function(){
            console.log("check")
            $location.path("/register");
        }   

        vm.registerUser = function() {
            UserLoginService.register(vm.registration).then(function(data){
                if (data) {
                    alert('User Registered Successfully');
                    vm.registration = {};
                }
            }, function(data) {
                if (data && data.errorMsg) {
                    alert(data.errorMsg);
                }
            })
        };
        
        vm.resetPassword = function() {                        
            // Reset password rest end point.
        };
        
        vm.staySignIn = function() {
            
            if(!vm.rememberMe && JSON.parse(UserLoginService.getItem())) {
                UserLoginService.removeItem();
                return;
            }
            
            var rememberMe = {
                user: vm.user,
                password: vm.password,                
            }
            UserLoginService.setItem(rememberMe);  
        };
        
        vm.loadStaySignIn = function() {            
            var getItem = JSON.parse(UserLoginService.getItem());         
            if(getItem) {                
                vm.user = atob(getItem.user);
                vm.password = atob(getItem.password);
                vm.rememberMe = true;
            }
        };
        
        vm.loadStaySignIn();
        
    };
    
}());