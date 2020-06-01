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