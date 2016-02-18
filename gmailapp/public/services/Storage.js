angular.module("GmailApp")
    .factory("Storage", [function () {
        var exports = {};

        exports.sid = {};
        exports.user = {
            id: '',
            name: '',
            address: '',
            country: '',
            email: '',
            phone:'',
            state:''
        };

        return exports;
    }]);

