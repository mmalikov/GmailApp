'use strict';

angular.module('GmailApp', ['ngRoute', 'ngMaterial', 'ngSanitize'])
    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;

        $routeProvider.when("/inbox", {
            templateUrl: "templates/inbox.html"
        });

        $routeProvider.otherwise({
            templateUrl: "templates/auth.html"
        });
    })
    .controller("MainController", ['$scope', '$log', function ($scope, $log) {


    }])
    .controller("AuthController", ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $mdDialog.show({
            controller: LoginDialogController,
            templateUrl: 'templates/login_dialog.tmpl.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    }]);

function LoginDialogController($scope, $log, $location, $mdDialog, API) {
    $scope.user = {};
    $scope.login = function () {
        $log.debug('Login');

        var promise = API.user.login($scope.user);
        if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
            promise.then(function (data) {

                $log.debug("Login succsess");

                var promise = API.user.getCurrentUser();
                if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                    promise.then(function () {
                        $mdDialog.hide();
                        $location.path("/inbox");
                    });
                }

            }, function (error) {
                $location.path("/");
                $log.error("Error with data" + error);
            });
        }
    }
}