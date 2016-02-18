angular.module("GmailApp")
    .factory("Storage", [function () {
        var exports = {};

        exports.sid = {};
        exports.user = {
            id: '',
            username: '',
            email: '',
            phone: '',
            firstName:'',
            lastName:''
        };

        return exports;
    }]);

