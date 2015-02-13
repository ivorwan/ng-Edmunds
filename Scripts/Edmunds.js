(function () {

    var app = angular.module('edmunds-module', []);

    app.factory('edmundsSvc', ['$http',
      function ($http) {
          return {
              getMakes: function () {

                  console.log('edmundsSvc.getMakes');
                  return $http.get("https://api.edmunds.com/api/vehicle/v2/makes?view=basic&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                    .then(function (response) {
                        return response.data;
                    });
              },

              getModels: function (make) {
                  return $http.get("https://api.edmunds.com/api/vehicle/v2/" + make + "/models?view=basic&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                    .then(function (response) {
                        return response.data;
                    })
              },

              getYears: function (make, model) {
                  return $http.get("https://api.edmunds.com/api/vehicle/v2/" + make + "/" + model + "/years?view=full&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                  .then(function (response) {
                      return response.data;
                  })
              },
              getStyles: function (niceMake, niceModel, year) {
                  return $http.get("https://api.edmunds.com/api/vehicle/v2/" + niceMake + "/" + niceModel + "/" + year + "/styles?view=basic&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                  .then(function (response) {
                      return response.data;
                  })
              },
              getStyle : function (styleId){
                  return $http.get("https://api.edmunds.com/api/vehicle/v2/styles/" + styleId + "?view=full&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                  .then(function (response) {
                      car = response.data;
                      return $http.get("https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId=" + styleId + "&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8");
                  }).then(function (response) {
                      car.photos = response.data;
                      return car;
                  });

              },
              getReviews : function(styleId){
                  return $http.get("https://api.edmunds.com/api/vehiclereviews/v2/styles/200421519?sortby=created%3ADESC&pagenum=1&pagesize=5&fmt=json&api_key=pmhmntqjtfp9qex4gyj9far8")
                      .then(function(response){
                          return response.data;
                      })

              }

              


          }
      }
    ]);

    


})();