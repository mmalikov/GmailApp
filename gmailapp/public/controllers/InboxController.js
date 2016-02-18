/**
 * Created by mmalikov on 2/11/16.
 */
angular.module("GmailApp")
    .controller("InboxController", ['$scope', '$rootScope', '$location', '$log', '$mdDialog', 'Storage', 'API',
        function ($scope, $rootScope, $location, $log, $mdDialog, Storage, API) {

            $scope.user = Storage.user;
            $scope.currentBox = 'inbox';

            $scope.setBox = function (box) {
                if (angular.isDefined(box) && angular.isString(box)) {
                    $scope.currentBox = box;
                }
            };

            $scope.deleteMessage = function () {

                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete your mail?')
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm)
                    .then(function () {
                        $rootScope.$broadcast("deleteMessage");
                    });
            };

            $scope.sendMessage = function () {
                $mdDialog.show({
                    controller: SendDialogController,
                    templateUrl: 'templates/send_dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                }).then(function (message) {
                    API.message.sendMessage(message);
                });
            };

            $scope.logout = function () {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to logout?')
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm)
                    .then(function () {
                        API.user.logout();
                        $location.path("/");
                    });
            }


        }]);

function SendDialogController($scope, $mdDialog) {
    $scope.message = {};
    $scope.send = function () {
        $mdDialog.hide($scope.message);

    }
}