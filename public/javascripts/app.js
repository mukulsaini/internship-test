angular.module('node', [])

.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.userData = {};

   
     $scope.generateCouponCode = function(todoID) {
        console.log('jkh');
        $http.post('/generate', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.userData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };   

    $scope.shareCouponCode = function(todoID) {
        console.log("&&&&&&&&"+todoID.name);
        $scope.formData = todoID;

        $http.post('/share', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.userData = data;
                console.log(data);
                var orderId = Math.floor(Math.random()*1000);
                 var orderAmount = Math.floor(Math.random()*1000);
                window.location.href= "/ad?name="+todoID.name+"&orderId="+orderId+"&orderAmount="+orderAmount;
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
         
    };


    $scope.order = function(fsd, asd, lsd){
        console.log('/placeorder?username='+fsd+'&amount='+lsd+'&orderId='+asd);
        $http.get('/placeorder?username='+fsd+'&amount='+lsd+'&orderId='+asd, $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.userData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }
});