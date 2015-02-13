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


    //----- controllers
    app.controller('mainCtrl', ['$scope', 'edmundsSvc',
      function ($scope, edmundsSvc) {
          $scope.name = 'Eita';
          var niceMake;
          var niceModel
          var year;


          edmundsSvc.getMakes().then(function (data) {
              $scope.makes = data.makes;
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
                      console.log(this.niceMake);
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


    app.controller('detailCtrl', ['$scope', '$routeParams', 'edmundsSvc', function ($scope, $routeParams, edmundsSvc) {
        $scope.styleId = $routeParams.styleId;

        //console.log($routeParams.styleId);
        // loads carData first, then loads reviews
        edmundsSvc.getStyle($scope.styleId)
            .then(function (data) {
                $scope.carData = data;
                return ($scope.carData);
            })
            .then(function(carData){
                setTimeout(function(){
                    edmundsSvc.getReviews($scope.styleId)
                        .then(function(data){
                            carData.reviews = data;
                        });

                },5000);

            });





        
    }]);


})();