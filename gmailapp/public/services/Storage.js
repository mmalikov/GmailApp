angular.module("GmailApp")
    .factory("Storage", [function () {
        var exports = {};

        exports.sid = {};
        exports.user = {
            id: '',
            username: '',
            address: '',
            country: '',
            email: '',
            phone:'',
            state:''
        };

        return exports;
    }]);

