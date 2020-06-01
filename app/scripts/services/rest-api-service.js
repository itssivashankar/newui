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