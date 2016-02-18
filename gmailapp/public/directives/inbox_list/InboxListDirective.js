angular.module("GmailApp")
    .directive("inboxList", [function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "directives/inbox_list/inbox-list.tmpl.html",
            controller: function ($scope, $route, $log, $rootScope, API, Storage) {
                var promise = API.message.getMessages();
                if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                    promise.then(angular.bind(this, function (data) {
                        if (angular.isArray(data)) {
                            $scope.messageList = data;
                        }
                    }));
                }

                var selectedMessageIndex = 0;
                $scope.messageID = {};
                $scope.messageList = {};

                $scope.selectMessage = function (message) {
                    if (angular.isDefined(message)) {
                        $scope.messageID = message.id;
                        selectedMessageIndex = $scope.messageList.indexOf(message);
                        $rootScope.$broadcast("changeCurrentMessage", {message: message});
                    }
                };

                $scope.toggleFavorite = function () {
                    $rootScope.$broadcast("toggleFavorite");
                };

                $scope.$on("deleteMessage", function () {
                    var promise = API.message.deleteMessage($scope.messageList[selectedMessageIndex].id);
                    if (angular.isDefined(promise) && angular.isDefined(promise.then)) {
                        promise.then(function () {
                            $scope.messageList.splice(selectedMessageIndex, 1);
                        });
                    }
                });

                dpd.on("messages:create", function (data) {
                    if (data.from == Storage.user.name || data.to == Storage.user.name) {
                        $scope.messageList.push(data);
                        $route.reload();
                    }
                });
            }
        }
    }])
    .filter("box", function ($filter, Storage) {
        return function (data, box) {
            if (angular.isString(box)) {
                switch (box) {
                    case 'inbox':
                    {
                        return $filter('filter')(data, {to: Storage.user.name});
                    }
                        break;
                    case 'sent':
                    {
                        return $filter('filter')(data, {from: Storage.user.name});
                    }
                        break;
                    case 'favorite':
                    {
                        return $filter('filter')(data, {favorite: true});
                    }
                        break;
                }
            }

            return data;
        }
    });


