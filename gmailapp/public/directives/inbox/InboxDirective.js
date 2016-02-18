angular.module("GmailApp")
    .directive("inbox", [function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "directives/inbox/inbox.tmpl.html",
            controller: function ($scope, API) {
                $scope.message = {};

                $scope.$on("changeCurrentMessage", function (event, args) {
                    $scope.message = args.message;
                });

                $scope.$on("toggleFavorite", function () {
                    var property = {
                        favorite: !$scope.message.favorite
                    };

                    var promise = API.message.updateMessage($scope.message.id, property);
                    if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                        promise.then(function () {
                            $scope.message.favorite = !$scope.message.favorite;
                        });
                    }
                });
            }
        }
    }]);

