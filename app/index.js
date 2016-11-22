import angular from 'angular';

angular.module('formFlickr', [])
    .controller('FlickrController',
        ['$scope', '$http', function ($scope, $http) {
            $scope.images = {};
            
            $scope.search = function (tags) {
            // build URL for Flickr API
            var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne";
            
            flickrAPI = flickrAPI + "?jsoncallback=JSON_CALLBACK"
            + "&tags=" + encodeURIComponent($scope.tags)
            + "&tagmode=all"
            + "&format=json";
            
            $http
                .jsonp(flickrAPI)
                .success(
                    function (data, status, headers, config) {
                        $scope.images = data;
                        $scope.imagesStatus = status;
                    }
                )
            };
}]);