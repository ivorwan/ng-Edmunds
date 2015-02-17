(function () {
    var app = angular.module('App', ['edmunds-module', 'ngRoute', 'ui.bootstrap']);


    app.config(function ($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider
          .when('/', {
              templateUrl: 'includes/main.html',
              controller: 'mainCtrl'
          })

          .when('/detail/:styleId', {
              templateUrl: 'includes/detail.html',
              controller: 'detailCtrl'
          })
          .otherwise({ redirectTo: '/' });


    });




    app.directive('iwHeader', function () {

        return {
            restrict: 'E',
            templateUrl: "includes/header.html"
        }
    });

    app.directive('iwFooter', function () {
        return {
            restrict: 'E',
            templateUrl: "includes/footer.html"
        }
    });


    app.directive('shake', ['$animate',
        function($animate) {
            return {
                scope: {
                    carData: '='
                },
                link: function(scope, element, attrs) {

                    scope.$watch('carData.reviews', function(newValue, oldValue) {
                        console.log('change');

                        if (newValue === oldValue) return;

                        $animate.addClass(element, 'shake').then(function() {
                            element.removeClass('shake');
                        });
                    });
                }
            };
        }
    ]);


    //----- controllers
    app.controller('mainCtrl', ['$scope', 'edmundsSvc',
      function ($scope, edmundsSvc) {
          $scope.name = 'Eita';
          var niceMake;
          var niceModel
          var year;
          $scope.makes = [{id:0, name: 'Loading Data...'}];
          $scope.make = 0;//makes[0];


          edmundsSvc.getMakes().then(function (data) {

              $scope.makes = data.makes;
              //console.log($scope.makes);
              /*
              $scope.makes = data.makes.map(function(item) {
                return {
                  id: item.niceName,
                  name: item.name
                };
              });
              */

          });

          $scope.getModels = function (make) {
              //console.log($scope.makes);
              for (var i = 0; i <= $scope.makes.length; i++) {
                  if ($scope.makes[i].id === make) {

                      this.niceMake = $scope.makes[i].niceName;
                      $scope.models = $scope.makes[i].models;
                      //console.log(this.niceMake);
                      break;
                  }

                  //console.log($scope.makes[i].id);
              }
              /*
              edmundsSvc.getModels(make).then(function(data) {
                $scope.models = data.models.map(function(item) {
                  return {
                    id: item.niceName,
                    name: item.name
                  };
                });
              })
              */
          };

          $scope.getYears = function (make, model) {

              for (var i = 0; i <= $scope.models.length; i++) {
                  if ($scope.models[i].id === model) {
                      this.niceModel = $scope.models[i].niceName;
                      $scope.years = $scope.models[i].years.map(function (item) {
                          return {
                              id: item.year,
                              name: item.year
                          }
                      });
                      //console.log(this.niceModel);
                      //console.log($scope.years);
                      break;
                  }
              }
              /*
              edmundsSvc.getYears(make, model).then(function(data){
                $scope.years = data.years.map(function(item){
                  return {
                    id: item.year,
                    name: item.year
                  }
                })
              })
              */
          }

          $scope.getStyles = function (niceMake, niceModel, year) {
              edmundsSvc.getStyles(this.niceMake, this.niceModel, $scope.year).then(function (data) {
                  //console.log(this.niceMake + ' - ' + this.niceModel + ' - ' + $scope.year)
                  $scope.styles = data.styles.map(function (item) {
                      /*
                      edmundsSvc.getPhotos(item.id).then(function (data) {
                          item.media = data;
                      });
                      */
                      // no mapping necessary
                      return item;

                  });
              })
          }

      }
    ]);


    app.controller('detailCtrl', ['$scope', '$routeParams', '$anchorScroll', '$location', 'edmundsSvc', function ($scope, $routeParams, $anchorScroll, $location, edmundsSvc) {
        $scope.styleId = $routeParams.styleId;

        $scope.currentPage = 1;
        $scope.totalItems = 0;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 5;
        $scope.loadingReviews = true;

        var gotoAnchor = function(x) {
            var newHash = x;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(x);
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        };

        $scope.pageChanged = function() {

            console.log('Page changed to: ' + $scope.currentPage);
            $scope.loadingReviews = true;
            edmundsSvc.getReviews($scope.styleId, $scope.itemsPerPage, $scope.currentPage)
                .then(function(data){
                    $scope.carData.reviews = data;
                    $scope.loadingReviews = false;
                });
            //gotoAnchor('div-reviews');
        };



        //console.log($routeParams.styleId);
        // loads carData first, then loads reviews
        edmundsSvc.getStyle($scope.styleId)
            .then(function (data) {
                $scope.carData = data;
                return ($scope.carData);
            })
            .then(function(carData){
                $scope.loadingReviews = true;
                setTimeout(function(){
                    edmundsSvc.getReviews($scope.styleId, $scope.itemsPerPage, 1)
                        .then(function(data){

                            carData.reviews = data;
                            $scope.loadingReviews = false;

                        });

                },5000);


            });





        
    }]);


})();