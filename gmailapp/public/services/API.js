/**
 * Created by mmalikov on 2/9/16.
 */
angular.module("GmailApp")
    .constant("BASE_URL", "http://localhost:5050")
    .constant("USER", "/users/")
    .constant("MESSAGE", "/messages/")
    .factory("API", ['$q', '$http', '$log', 'Storage', 'BASE_URL', 'MESSAGE', 'USER', function ($q, $http, $log, Storage, BASE_URL, MESSAGE, USER) {
        var exports = {};

        exports.user = {
            create: function (user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + USER, user)
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            login: function (user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + USER + "login",
                    {
                        username: user.name,
                        password: user.password
                    })
                    .then(function (data) {
                        Storage.sid = data.data.id;
                        Storage.user.id = data.data.uid;

                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            logout: function () {
                $http.post(BASE_URL + USER + "logout");
            },
            getUsers: function () {
                var deferred = $q.defer();

                $http.get(BASE_URL + USER)
                    .then(function (data) {
                        deferred.resolve(data.data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            getCurrentUser: function () {
                var deferred = $q.defer();
                $http.get(BASE_URL + USER + "me", {sid: Storage.sid})
                    .then(function (data) {
                        var properties = ['username', 'email', 'phone', 'firstName', 'lastName'];

                        properties.forEach(function (property) {
                            Storage.user[property] = data.data[property];
                        });

                        deferred.resolve(data.data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        };

        exports.message = {
            getMessages: function () {
                var deferred = $q.defer();

                $http.get(BASE_URL + "/messages?" + '{\"$or\":[{\"from\":\"' + Storage.user.username + '\"},{\"to\":\"' + Storage.user.username + '\"}]}')
                    .then(function (data) {
                        deferred.resolve(data.data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            updateMessage: function (id, property) {
                var deferred = $q.defer();

                $http.put(BASE_URL + MESSAGE + id, property)
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            deleteMessage: function (id) {
                var deferred = $q.defer();

                $http.delete(BASE_URL + MESSAGE + id)
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            sendMessage: function (message) {
                if (angular.isDefined(message)) {

                    message.date = Date.now();
                    message.from = Storage.user.username;
                    message.favorite = false;
                    message.read = false;

                    $http.post(BASE_URL + "/messages", message);
                }
            }
        };

        return exports;
    }]);

function makeRequestToServer(httpRequestType, url, property) {

    var deferred = $q.defer();

    $http[httpRequestType](url, property ? property : null)
        .then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
}