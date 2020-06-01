(function(angular) {

    angular.module('infynectApp', ['ui.router', 'ui.grid', 'ui.grid.resizeColumns','nvd3ChartDirectives'])
           .config(config)
           .run(run)
           .factory('InterceptorFactory', InterceptorFactory);

    InterceptorFactory.$inject = ['$q', 'AuthenticationService', 'constants', '$location'];    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$compileProvider'];    
    run.$inject = ['$rootScope', 'AuthenticationService', '$location', 'SecurityService', 'UserService', '$state'];

    Date.prototype.subtractHours= function(h){
        var copiedDate = new Date(this.getTime());
        copiedDate.setHours(copiedDate.getHours()-h);
        return copiedDate;
    };

    Date.prototype.subtractMinutes= function(endTime,m){
        var ndate=new Date(endTime.getTime());          
        ndate.setMinutes(ndate.getMinutes()-m);
        return ndate;
    };

    function config($stateProvider, $urlRouterProvider, $httpProvider, $compileProvider) {
            
        $urlRouterProvider.otherwise('/login');     
//"SYS_ADMIN","ADMIN","ORG_ADMIN","SETUP","OPERATOR_ADMIN","OPERATOR_USER","CDN_ADMIN","CDN_USER","USER"
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                data:{
                    roles: []
                }
            })
            .state('main', {
                url: '',
                templateUrl: 'views/main.html',
                controller: 'MainController',
                controllerAs: 'vm',
                data:{
                    roles: []
                }

            })
            .state('main.dashboard', {
                url: '/dashboard',
                views: {
                    'main': {
                        templateUrl: 'views/home.html'/*,
                        controller: 'MainController',
                        controllerAs: 'vm'*/
                    }
                },
                data: {
                  roles: ["SYS_ADMIN","ADMIN","OPERATOR_ADMIN","OPERATOR_USER","DEV"]
                }
            })
            /*.state('main.register', {
                url: '/register',
                views: {
                    'main': {
                        templateUrl: 'views/register.html',
                        controller: 'MainController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                  roles: []
                }
            })*/
            .state('main.noaccess', {
                url: '/no-access',
                views: {
                    'main': {
                        templateUrl: 'views/no-access.html'
                    }
                },
                data: {
                  roles: []
                }
            });       

              $httpProvider.interceptors.push(InterceptorFactory);  

    }

    function run($rootScope, AuthenticationService, $location, SecurityService, UserService, $state) {
        $rootScope.infyLoading = false;
        $rootScope.$on('$locationChangeStart', function() {
            var getUserFromSession = JSON.parse(sessionStorage.getItem('currentLoggedInUser'));
            if(getUserFromSession && !AuthenticationService.token) {
                AuthenticationService.token = getUserFromSession.token;
                AuthenticationService.isAuthenticated = true;
                AuthenticationService.userId = getUserFromSession.userId;
                AuthenticationService.roles = getUserFromSession.roles ? getUserFromSession.roles.split(",") : [];
                AuthenticationService.sessionExpire = getUserFromSession.expireMin;
                UserService.setLoginUser(getUserFromSession);
                SecurityService.permission = getUserFromSession.domainPermission;                
            }
            if(AuthenticationService && !AuthenticationService.isAuthenticated && !AuthenticationService.token && !iCookie.getCookie('token') && !getUserFromSession) {
                $location.path('/login');
            }
        });  
         $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            if(AuthenticationService && !AuthenticationService.isAuthenticated && !AuthenticationService.token && !iCookie.getCookie('token') && !getUserFromSession) {
                $location.path('/login');
            }else if(!AuthenticationService.userHasRole(toState.data.roles) && toState.name != "main.noaccess" && toState.name != "login") {
                event.preventDefault();
                $state.go('main.noaccess');           
            }
       });      
    }

    function InterceptorFactory($q, AuthenticationService, constants, $location) {
        return {
            request: function(config) {
                var knownPaths = [ '/login', '/'];
                if(!iCookie.getCookie('token') && $location.$$path!=-1) {                    
                    $location.path('/login');
                }
                
                if(!config) {
                    return;
                }
                
                config.headers = config.headers || {};
                if(AuthenticationService && AuthenticationService.token && AuthenticationService.userId) {
                    config.headers['x-access-token'] = AuthenticationService.token;                    
                }
                return config;
            },
            requestError: function(error) {                
                
                if(!error) {
                    return;
                }
                
                return $q.reject(error);
            },
            response: function(response) {                
                
                if(!response) {
                    return;
                }
                
                return response;
            },
            responseError: function(error) {                                                               
                if(!error) {
                    return;
                }
                
                switch(error.status) {
                    case constants.HTTP_CODES.UNAUTHORIZED_CODE:
                        console.log(error.data.message || error.data);
                        break;
                    case constants.HTTP_CODES.FORBIDDEN_CODE:
                        console.log(error.data.message || error.data);
                        break;
                    case constants.HTTP_CODES.TOKEN_REQUIRED_CODE:
                        console.log(error.data.message || error.data);
                        break;    
                    case constants.HTTP_CODES.INTERNAL_SERVER_ERROR_CODE:
                        console.log(error.data.message || error.data);
                        break;
                    case constants.HTTP_CODES.METHOD_NOT_ALLOWED_CODE:
                        console.log(error.data.message || error.data);
                        break;    
                }          
                
                return $q.reject(error);
            }
        };
    }

})(angular);



'use strict';

(function(){
    
    angular.module('infynectApp')
        .constant('constants', {
            HTTP_CODES : {
                BAD_REQUEST_CODE: 400,
                UNAUTHORIZED_CODE: 401,
                FORBIDDEN_CODE: 403,
                TOKEN_REQUIRED_CODE: 499,
                INTERNAL_SERVER_ERROR_CODE: 500
            },
            URLS: {
                login: {
                    method: 'POST', uri: '/auth/login'
                },
                logout: {
                    method: 'GET', uri: '/auth/logout'
                },
                register: {
                    method: 'POST', uri: '/auth/register'
                },
                getUserByUserId: {
                    method: 'GET', uri: '/users/{userId}'
                },
                getAllDevices: {
                    method: 'GET', uri: '/dev'
                },
                getDeviceById: {
                    method: 'GET', uri: '/dev/{deviceId}'
                },
                createDevice: {
                    method: 'POST', uri: '/dev'
                },
                updateDevice: {
                    method: 'PUT', uri: '/dev/{deviceId}'
                },
                deleteDevice: {
                    method: 'DELETE', uri: '/dev/{deviceId}'
                },
                getAllComplains: {
                    method: 'GET', uri: '/complain'
                },
                getComplainById: {
                    method: 'GET', uri: '/complain/{complainId}'
                },                
                createComplaint: {
                    method: 'POST', uri: '/complain'
                },
                getAllUsers: {
                    method: 'GET', uri: '/user'
                },
                getUserById: {
                    method: 'GET', uri: '/user/{userId}'
                },
                createUser: {
                    method: 'POST', uri: '/user'                    
                },
                updateUser: {
                    method: 'PUT', uri: '/user/{userId}'
                },
                deleteUser: {
                    method: 'DELETE', uri: '/user/{userId}'
                },
                getAllOrgs: {
                    method: 'GET', uri: '/org'
                },
                getOrgById: {
                    method: 'GET', uri: '/org/{orgId}'
                },
                createOrg: {
                    method: 'POST', uri: '/org'                    
                },
                updateOrg: {
                    method: 'PUT', uri: '/org/{orgId}'
                },
                deleteOrg: {
                    method: 'DELETE', uri: '/org/{orgId}'
                },
                remotecommand: {
                    method: 'POST', uri: '/monitor/rc'
                },
                getAppsById: {
                    method: 'GET', uri: '/monitor/{deviceId}'
                },
                getAllStats: {
                    method: 'GET', uri: '/stats/{userId}/{deviceId}/{startTime}/{endTime}'
                },
                uploadSSLCertificate: {
                    method: 'POST', uri: '/certificate/uploadSSLCertificate'
                },
                certificate: {
                    method: 'POST', uri: '/certificate/certificate'
                },
                acl: {
                    method: 'POST', uri: '/acl/acl'
                },
                qosstatic: {
                    method: 'POST', uri: '/qosstatic/qosstatic'
                },
                qoxstatic: {
                    method: 'POST', uri: '/qoxstatic/qoxstatic'
                },
                ott: {
                    method: 'POST', uri: '/ott/ott'
                 },
                live: {
                    method: 'POST', uri: '/live/live'
                },
                getAllStatic: {
                    method: 'GET', uri: '/qosstatic'
                },
                getAllAcl: {
                    method: 'GET', uri: '/acl'
                },
                getAllQox: {
                    method: 'GET', uri: '/qoxstatic'
                },
                getAllOtt: {
                    method: 'GET', uri: '/ott/{userId}'
                },
                getAllLive: {
                    method: 'GET', uri: '/live/{userId}'
                },
                getAllDomains: {
                    method: 'GET', uri: '/certificate'
                },
                deleteLive: {
                    method: 'DELETE', uri: '/live/{orgId}/{userId}/{domain}/{context}/{context_id}/{input_type}'
                },
                deleteStatic: {
                    method: 'DELETE', uri: '/qosstatic/{domain}/{userId}'
                },
                 getAllCertificate: {
                    method: 'GET', uri: '/certificate'
                },
                deleteDomainCertificates: {
                    method: 'DELETE', uri: '/certificate/{orgId}/{domainName}'
                },
                deleteOtt: {
                    method: 'DELETE', uri: '/ott/{orgId}/{domain}'
                },
                updateService: {
                    method: 'POST', uri: '/service'
                },
                getAllServices: {
                    method: 'GET', uri: '/service'
                },
                getDevByOrgId: {
                    method: 'GET', uri: '/dev/org/{userId}'
                },
                bypass: {
                    method: 'POST', uri: '/bypass'
                },
                getAllBypass: {
                    method: 'GET', uri: '/bypass/{orgId}'
                },
                deleteBypass: {
                    method: 'DELETE', uri: '/bypass/{bypassId}/{siteName}/{flag}'
                },
                installation: {
                    method: 'POST', uri: '/installationrequest'
                },
                getAllServiceRequest: {
                    method: 'GET', uri: '/servicerequest'
                },
                getInstallationRequest: {
                    method: 'GET', uri: '/installationrequest'
                },
                updateServiceRequest: {
                    method: 'PUT', uri: '/servicerequest/{reqInfo}'
                },
                createCategory: {
                    method: 'POST', uri: '/category'
                },
                getAllCategory: {
                    method: 'GET', uri: '/category'
                },
                deleteCategory:{
                     method: 'DELETE', uri: '/category/{category}'
                },
                updateCategory:{
                    method: 'PUT', uri: '/category/{categoryId}'
                },
                createBumpWhitelist: {
                    method: 'POST', uri: '/bump_whitelist'
                },
                getAllBumpWhitelist: {
                    method: 'GET', uri: '/bump_whitelist'
                },
                deleteWhitelistByOrgId: {
                    method: 'DELETE', uri: '/bump_whitelist/{orgId}/{domain}'
                },
                getAllSslbump: {
                    method: 'GET', uri: '/vas'
                },
                deleteBumplistByOrgId: {
                    method: 'DELETE', uri: '/vas/{orgId}/{domain}'
                },
                getReports: {
                    method: 'GET', uri: '/reports/{userId}/{deviceId}'
                },
                deleteTorrent: {
                    method: 'DELETE', uri: '/reports/{name}/{status}/{deviceId}'
                },
                deleteInstallation: {
                    method: 'DELETE', uri: '/installationrequest/{installationId}'
                },  
                updateStatusById: {
                    method: 'GET', uri: '/statistics/{deviceId}'
                },
                deleteServiceRequest: {
                    method: 'DELETE', uri: '/servicerequest/{Id}'
                },
                addCommand:{
                    method: 'POST', uri: '/rc_setup'
                },
                getCommandByRole:{
                    method: 'GET', uri: '/rc_setup/{info}'
                },
                deleteRemoteCommand:{
                    method: "DELETE", uri: '/rc_setup/{cmd}'
                },
                updateRemoteCommand:{
                    method: "PUT" , uri: '/rc_setup/{cmd}'
                },
                updateIR: {
                    method: 'PUT', uri: '/installationrequest/{installationId}'
                },
                createTariff: {
                    method: 'POST', uri: '/tariff'
                },
                getAllTariff: {
                    method: 'GET', uri: '/tariff'
                },
                updateTariff: {
                    method: 'PUT', uri: '/tariff'
                },
                deleteTariff: {
                    method: 'DELETE', uri: '/tariff/{tariffId}'
                },
                setUsage: {
                    method: 'POST', uri: '/usage'
                },
                getAllUsage: {
                    method: 'GET', uri:'/usage'
                },
                getUsageById: {
                    method: 'GET', uri:'/usage/{Id}'
                },
                getAllOrgUsage:{
                    method: 'GET', uri:'/usage/{orgId}/{userId}'
                },
                getServiceList: {
                    method: 'GET', uri: '/servicemapper/{deviceId}'
                },
                deleteService: {
                    method: 'DELETE', uri: '/service/{service}/{status}'
                },
                logStatusChange: {
                    method: 'POST', uri: '/servicemapper/changeStatus'
                },
                getDomainRecords : {
                    method: 'POST', uri: '/certificate/check'
                },
                requestChallenge : {
                    method: 'POST', uri: '/certificate/challenge'
                },
                acceptAcmeChallenge : {
                    method: 'POST', uri: '/certificate/validate'
                },
                uploadCertificate: {
                    method: 'POST', uri: '/certificate/upload'
                },
                updateSSLCertificate:{
                    method: 'PUT', uri:'/certificate'
                },
                getOrgSetting:{
                    method: 'GET',uri:'/org_setting'
                },
                updateSetting: {
                    method: 'PUT',uri:'/org_setting/{Id}'
                },
                createSetting: {
                    method: 'POST',uri:'/org_setting'
                },
                getDashBoardStats:{
                    method: 'GET' ,uri:'/statistics/{Id}/{filter}'
                }
            }
        });    
}())

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
            // $location.path("/register");
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
'use strict';

(function(){    
    angular.module('infynectApp')
        .directive('infyFocus', infyFocus)
        .directive('msgDestroy', msgDestroy)
        .directive('ngConfirmClick', ngConfirmClick);
        
        // Inject the DI for the directives
        infyFocus.$inject = ['$timeout'];
        msgDestroy.$inject = ['$timeout', '$rootScope'];
        ngConfirmClick.$inject = ['$timeout'];


        function infyFocus($timeout) {        	
        	return {
	            link: function(scope, element, attrs) {
	                $(element).focus(); 
	            }
	        }       
        };

        function msgDestroy($timeout, $rootScope) {
            return {
                link: function(scope, element, attrs) {
                    element.bind("click",function() {
                        element.remove();
                    });
                    $timeout(function() {
                        $rootScope.successMsg = null;
                        $rootScope.warningMsg = null;
                        $rootScope.errMsg = null;
                    }, 5000);
                }
            }
        };

        function ngConfirmClick($timeout){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }
    
}());
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
'use strict';
(function() {
    
    var iPubSub = window.iPubSub || {}, events = {}, hasProperty = events.hasOwnProperty;    
    
    iPubSub.subscribe = function(event, listener) {
        
        if(!hasProperty.call(events, event)) {
            events[event] = [];
        }
        
        var eventIndex = events[event].push(listener) - 1;
        
        return {
            remove: function() {
                delete events[event][eventIndex];
            }
        }
    };
    
    iPubSub.publish = function(event, data) {
        
        if(!hasProperty.call(events, event)) {
            return;
        };
        
        for(var i = events[event].length; i--;) {
            events[event][i](data != undefined ? data : {});
        };        
    };
    
    window.iPubSub = iPubSub;

}());

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
'use strict';

(function() {
    angular.module('infynectApp')
        .factory('RestApiService', RestApiService);
    
    RestApiService.$inject = ['ApiHost', '$http', '$q', 'constants'];
    
    function RestApiService(ApiHost, $http, $q, constants) {
        
        var restApiService = {};        
        
        function builurlWithParameters (url, params) {
            var len = params.length;
            for(var i=0; i < len; i++) {
                var val = params[i];
                var regEx = new RegExp('{(.*?)}', 'i');
                url = url.replace(regEx, val)
            }
            return url;
        }
        
        restApiService.createOperation = function(operation) {

            function fn() {               

                var routeParametersCount = (operation.baseUrl.match(/{/g) || []).length,
                    postOrPut = (operation.httpVerb == 'POST' || operation.httpVerb == 'PUT'),
                    routeParameters=[], payload = {}, config = {}, deferred = $q.defer();                
                                
                for(var i = 0; i < routeParametersCount; i++) {
                    routeParameters.push(arguments[i])
                };
                
                if(postOrPut) {
                    payload = arguments[routeParametersCount];                
                    routeParametersCount++;
                }
                
                if(arguments[routeParametersCount]) {
                    config = arguments[routeParametersCount];
                }
                
                config.method = operation.httpVerb;

                config.rejectUnauthorized= false;
                
                config.url = builurlWithParameters(ApiHost + operation.baseUrl, routeParameters);
                
                if(config.params) {
                        
                    var initialOperator = '?', paramsStr;
                    var len = config.params.length;
                    
                    for(var i= 0; i< len; i++) {
                        if(i===0) {
                            initialOperator;
                        } else {
                            initialOperator = '&';
                        }
                        
                        /*paramsStr = initialOperator + 'searchPropery=' + config.params[i].searchProperty +
                                    '&searchOperator=' + config.params[i].searchOperator + '&searchValue='
                                    + config.params[i].searchValue;*/
                        paramsStr = initialOperator + config.params[i].name + '=' + config.params[i].value;
                        
                        config.url = config.url.concat(paramsStr)
                    }
                    
                    delete config.params;                  
                    
                }
                
                if(payload) {
                    config.data = payload;  
                };
                
                $http(config)
                    .success(function(data, status, headers, config, statusText) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config, statusText) {
                        console.log(data);
                        switch(status) {
                            case constants.HTTP_CODES.BAD_REQUEST_CODE: 
                                iPubSub.publish('/authorization', "Error Occured");
                                break;
                            case constants.HTTP_CODES.UNAUTHORIZED_CODE:
                                /*console.log(error.data.message || error.data);*/
                                iPubSub.publish('/authorization', "You don't have permission to do this operation");
                                break;
                            case constants.HTTP_CODES.FORBIDDEN_CODE:
                                /*console.log(error.data.message || error.data);*/
                                iPubSub.publish('/authorization', "You don't have permission to do this operation");
                                break;
                            case constants.HTTP_CODES.TOKEN_REQUIRED_CODE:
                                /*console.log(error.data.message || error.data);*/
                                iPubSub.publish('/authorization', "Please login");
                                break;    
                            case constants.HTTP_CODES.INTERNAL_SERVER_ERROR_CODE:
                                /*console.log(error.data.message || error.data);*/
                                iPubSub.publish('/authorization', "Something went wrong. Please contact administrator");
                                break;
                            case constants.HTTP_CODES.METHOD_NOT_ALLOWED_CODE:
                                /*console.log(error.data.message || error.data);*/
                                iPubSub.publish('/authorization', "You don't have permission to do this operation");
                                break;    
                        }
                        deferred.reject(data);
                    })
                
                return deferred.promise;
            }

            return fn;
        };

        restApiService.createGET = function(url) {
            return this.createOperation({
                httpVerb: 'GET',
                name: '',
                baseUrl: url
            })
        };

        restApiService.createPOST = function(url) {
            return this.createOperation({
                httpVerb: 'POST',
                name: '',
                baseUrl: url
            })
        };

        restApiService.createPUT = function(url) {
            return this.createOperation({
                httpVerb: 'PUT',
                name: '',
                baseUrl: url
            })
        };

        restApiService.createDELETE = function(url) {
            return this.createOperation({
                httpVerb: 'DELETE',
                name: '',
                baseUrl: url
            })
        };
          
        return restApiService;
    }    
}());
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
'use strict';

(function() {    
    
    angular.module('infynectApp')
        .factory('UrlService', UrlService);
    
    UrlService.$inject = ['RestApiService', 'constants'];
    
    function UrlService(RestApiService, constants) {
        
        var urlService = {};

        // Add all the url here for the application
        // For Ex:  urlService.service = RestApiService.createGET('url of the api'); 
        
        urlService.login = RestApiService.createPOST(constants.URLS.login.uri);
        urlService.logout = RestApiService.createGET(constants.URLS.logout.uri);
        urlService.register = RestApiService.createPOST(constants.URLS.register.uri);

        // UserList
        urlService.getAllUsers = RestApiService.createGET(constants.URLS.getAllUsers.uri);
        urlService.getUserByUserId = RestApiService.createGET(constants.URLS.getUserById.uri);
        urlService.createUser = RestApiService.createPOST(constants.URLS.createUser.uri);
        urlService.updateUser = RestApiService.createPUT(constants.URLS.updateUser.uri);
        urlService.deleteUser = RestApiService.createDELETE(constants.URLS.deleteUser.uri);

        // UserList
        urlService.getAllOrgs = RestApiService.createGET(constants.URLS.getAllOrgs.uri);
        urlService.getOrgById = RestApiService.createGET(constants.URLS.getOrgById.uri);
        urlService.createOrg = RestApiService.createPOST(constants.URLS.createOrg.uri);
        urlService.updateOrg = RestApiService.createPUT(constants.URLS.updateOrg.uri);
        urlService.deleteOrg = RestApiService.createDELETE(constants.URLS.deleteOrg.uri);

        // DeviceList
        urlService.getAllDevices = RestApiService.createGET(constants.URLS.getAllDevices.uri);
        urlService.getDeviceById = RestApiService.createGET(constants.URLS.getDeviceById.uri);
        urlService.createDevice = RestApiService.createPOST(constants.URLS.createDevice.uri);
        urlService.updateDevice = RestApiService.createPUT(constants.URLS.updateDevice.uri);
        urlService.deleteDevice = RestApiService.createDELETE(constants.URLS.deleteDevice.uri);

        // ComplainList
        urlService.getAllComplains = RestApiService.createGET(constants.URLS.getAllComplains.uri);
        urlService.getComplainById = RestApiService.createGET(constants.URLS.getComplainById.uri);
        urlService.createComplaint = RestApiService.createPOST(constants.URLS.createComplaint.uri);

        urlService.remotecommand = RestApiService.createPOST(constants.URLS.remotecommand.uri);
        urlService.getAppsById = RestApiService.createGET(constants.URLS.getAppsById.uri);
        urlService.updateStatusById = RestApiService.createGET(constants.URLS.updateStatusById.uri);

        // StatsList
        urlService.getAllStats = RestApiService.createGET(constants.URLS.getAllStats.uri);

        // SSL Certificate
        urlService.uploadSSLCertificate = RestApiService.createPOST(constants.URLS.uploadSSLCertificate.uri);
        urlService.certificate = RestApiService.createPOST(constants.URLS.certificate.uri);
        urlService.acl = RestApiService.createPOST(constants.URLS.acl.uri);
        
        //QoX
        urlService.qoxstatic = RestApiService.createPOST(constants.URLS.qoxstatic.uri);

        urlService.ott = RestApiService.createPOST(constants.URLS.ott.uri);
        
        urlService.qosstatic = RestApiService.createPOST(constants.URLS.qosstatic.uri);
        
        urlService.live = RestApiService.createPOST(constants.URLS.live.uri);
        urlService.getAllStatic = RestApiService.createGET(constants.URLS.getAllStatic.uri);
        urlService.getAllOtt = RestApiService.createGET(constants.URLS.getAllOtt.uri);
        urlService.getAllAcl = RestApiService.createGET(constants.URLS.getAllAcl.uri);
        urlService.getAllQox = RestApiService.createGET(constants.URLS.getAllQox.uri);
        urlService.getAllLive = RestApiService.createGET(constants.URLS.getAllLive.uri);
        urlService.getAllAcl = RestApiService.createGET(constants.URLS.getAllAcl.uri);
        urlService.deleteLive = RestApiService.createDELETE(constants.URLS.deleteLive.uri);
        urlService.deleteStatic = RestApiService.createDELETE(constants.URLS.deleteStatic.uri);
        urlService.getAllCertificate = RestApiService.createGET(constants.URLS.getAllCertificate.uri);
        urlService.deleteDomainCertificates = RestApiService.createDELETE(constants.URLS.deleteDomainCertificates.uri);
        urlService.deleteOtt = RestApiService.createDELETE(constants.URLS.deleteOtt.uri);
        urlService.updateService = RestApiService.createPOST(constants.URLS.updateService.uri);
        urlService.getAllServices = RestApiService.createGET(constants.URLS.getAllServices.uri);

        urlService.getAllDomains = RestApiService.createGET(constants.URLS.getAllDomains.uri);
        urlService.getDevByOrgId = RestApiService.createGET(constants.URLS.getDevByOrgId.uri);
        urlService.bypass = RestApiService.createPOST(constants.URLS.bypass.uri);
        urlService.getAllBypass = RestApiService.createGET(constants.URLS.getAllBypass.uri);
        urlService.deleteBypass = RestApiService.createDELETE(constants.URLS.deleteBypass.uri);
        urlService.installation = RestApiService.createPOST(constants.URLS.installation.uri);
        urlService.getAllServiceRequest = RestApiService.createGET(constants.URLS.getAllServiceRequest.uri);
        urlService.getInstallationRequest = RestApiService.createGET(constants.URLS.getInstallationRequest.uri);
        urlService.updateServiceRequest = RestApiService.createPUT(constants.URLS.updateServiceRequest.uri);
        urlService.deleteInstallation = RestApiService.createDELETE(constants.URLS.deleteInstallation.uri);
        urlService.deleteServiceRequest = RestApiService.createDELETE(constants.URLS.deleteServiceRequest.uri);
        
        urlService.createCategory = RestApiService.createPOST(constants.URLS.createCategory.uri);
        urlService.getAllCategory = RestApiService.createGET(constants.URLS.getAllCategory.uri);
        urlService.deleteCategory = RestApiService.createDELETE(constants.URLS.deleteCategory.uri);
        urlService.updateCategory = RestApiService.createPUT(constants.URLS.updateCategory.uri);

        urlService.createBumpWhitelist = RestApiService.createPOST(constants.URLS.createBumpWhitelist.uri);
        urlService.getAllBumpWhitelist = RestApiService.createGET(constants.URLS.getAllBumpWhitelist.uri);
        urlService.deleteWhitelistByOrgId = RestApiService.createDELETE(constants.URLS.deleteWhitelistByOrgId.uri);

        urlService.getAllSslbump = RestApiService.createGET(constants.URLS.getAllSslbump.uri);
        urlService.deleteBumplistByOrgId = RestApiService.createDELETE(constants.URLS.deleteBumplistByOrgId.uri);

        urlService.getReports = RestApiService.createGET(constants.URLS.getReports.uri);
        urlService.deleteTorrent = RestApiService.createDELETE(constants.URLS.deleteTorrent.uri);
     
        urlService.addCommand = RestApiService.createPOST(constants.URLS.addCommand.uri);
        urlService.getCommandByRole = RestApiService.createGET(constants.URLS.getCommandByRole.uri);
        urlService.deleteRemoteCommand = RestApiService.createDELETE(constants.URLS.deleteRemoteCommand.uri);
        urlService.updateRemoteCommand = RestApiService.createPUT(constants.URLS.updateRemoteCommand.uri);

        urlService.updateIR = RestApiService.createPUT(constants.URLS.updateIR.uri);
        urlService.createTariff = RestApiService.createPOST(constants.URLS.createTariff.uri);
        urlService.getAllTariff = RestApiService.createGET(constants.URLS.getAllTariff.uri);
        urlService.updateTariff = RestApiService.createPUT(constants.URLS.updateTariff.uri);
        urlService.deleteTariff = RestApiService.createDELETE(constants.URLS.deleteTariff.uri);

        urlService.setUsage = RestApiService.createPOST(constants.URLS.setUsage.uri);
        urlService.getAllUsage= RestApiService.createGET(constants.URLS.getAllUsage.uri);
        urlService.getUsageById= RestApiService.createGET(constants.URLS.getUsageById.uri);
        urlService.getAllOrgUsage= RestApiService.createGET(constants.URLS.getAllOrgUsage.uri);

        urlService.getServiceList = RestApiService.createGET(constants.URLS.getServiceList.uri);
        urlService.deleteService = RestApiService.createDELETE(constants.URLS.deleteService.uri);
        urlService.logStatusChange = RestApiService.createPOST(constants.URLS.logStatusChange.uri);

        urlService.getDomainRecords = RestApiService.createPOST(constants.URLS.getDomainRecords.uri);
        urlService.requestChallenge = RestApiService.createPOST(constants.URLS.requestChallenge.uri);        
        urlService.acceptAcmeChallenge = RestApiService.createPOST(constants.URLS.acceptAcmeChallenge.uri);
        urlService.uploadCertificate = RestApiService.createPOST(constants.URLS.uploadCertificate.uri);
        urlService.updateSSLCertificate = RestApiService.createPUT(constants.URLS.updateSSLCertificate.uri);
        
        urlService.createSetting = RestApiService.createPOST(constants.URLS.createSetting.uri);
        urlService.updateSetting = RestApiService.createPUT(constants.URLS.updateSetting.uri);
        urlService.getOrgSetting = RestApiService.createGET(constants.URLS.getOrgSetting.uri);
        urlService.getDashBoardStats = RestApiService.createGET(constants.URLS.getDashBoardStats.uri);

        return urlService;
    }    
}());

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
