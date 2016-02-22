/**
 * Created by mmalikov on 2/11/16.
 */
angular.module("GmailApp")
    .controller("InboxController", ['$scope', '$rootScope', '$location', '$log', '$mdDialog', 'Storage', 'API',
        function ($scope, $rootScope, $location, $log, $mdDialog, Storage, API) {

            var okMessage = 'Yes';
            var cancelMessage = 'No';

            $scope.user = Storage.user;
            $scope.currentBox = 'inbox';

            $scope.setBox = function (box) {
                if (angular.isDefined(box) && angular.isString(box)) {
                    $scope.currentBox = box;
                }
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


            $scope.deleteMessage = function () {
                var title = 'Would you like to delete your mail?';
                var confirmDialog = createConfirmDialog($mdDialog, title, okMessage, cancelMessage);

                $mdDialog.show(confirmDialog)
                    .then(function () {
                        $rootScope.$broadcast("deleteMessage");
                    });
            };

            $scope.logout = function () {
                var title = 'Would you like to logout?';
                var confirmDialog = createConfirmDialog($mdDialog, title, okMessage, cancelMessage);

                $mdDialog.show(confirmDialog)
                    .then(function () {
                        API.user.logout();
                        $location.path("/");
                    });
            };


        }]);

function SendDialogController($scope, $mdDialog) {
    $scope.message = {};
    $scope.send = function () {
        $mdDialog.hide($scope.message);

    }
}

function createConfirmDialog(mdDialog, title, okMessage, cancelMessage) {
    return mdDialog.confirm()
        .title(title)
        .ok(okMessage)
        .cancel(cancelMessage);
}