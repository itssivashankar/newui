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
            .state('main.register', {
                url: '/register',
                views: {
                    'main': {
                        templateUrl: 'views/register.html'/*,
                        controller: 'MainController',
                        controllerAs: 'vm'*/
                    }
                },
                data: {
                  roles: []
                }
            })
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


