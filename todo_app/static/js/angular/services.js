Todo_app.service('EndpointService',function($q, $rootScope,$http) {

    var service = this;
    var http = $http;
    var builder = function (api, resource, method){
        return function (args) {
              var deferred = $q.defer();
              gapi.client[api][resource][method](args).execute(function(resp) {
                 $rootScope.$apply(deferred.resolve(resp));
              });
              return deferred.promise;
        };
    }
    var loaded = false;
    this.isLoaded = function() { return loaded; };

    this.loadService = function(api, version){
        service.apiName = api;
        service.apiVersion = version;
        var apiRoot = '//' + window.location.host + '/_ah/api';
        gapi.client.load(service.apiName, service.apiVersion, function() {
            var apiUrl = '';
            http.get(apiRoot+'/discovery/v1/apis/'+service.apiName+'/'+service.apiVersion+'/rest').success( function(data) {
                console.log(data);
                for (resource in data.resources){
                    for(method in data.resources[resource].methods){
                        service[method+resource] = builder(service.apiName,resource,  method);
                        console.log("Method "+method+resource+" created");
                    }
                }
                loaded = true;
                //$rootScope.$$phase || $rootScope.$apply();
            });
            $rootScope.$$phase || $rootScope.$apply();
        }, apiRoot);
    }
});