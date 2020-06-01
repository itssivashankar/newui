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
