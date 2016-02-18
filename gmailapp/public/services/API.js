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

                        $log.info("Storage.sid  = " + Storage.sid);
                        $log.info(" Storage.user.id  = " + Storage.user.id);

                        deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            logout: function () {
                $http.post(BASE_URL + USER + "logout");
            },
            getCurrentUser: function () {
                var deferred = $q.defer();
                $http.get(BASE_URL + USER + "me", {sid: Storage.sid})
                    .then(function (data) {
                        var properties = ['username', 'address', 'country', 'state', 'email', 'phone'];

                        properties.forEach(function (property) {
                            console.log(property);
                            console.log(data.data[property]);
                            Storage.user[property] = data.data[property];
                        });

                        deferred.resolve(data.data);
                    }, function (error) {
                        $log.error(error);
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
                        $log.info("messages: " + data.data);
                        deferred.resolve(data.data);
                    }, function (error) {
                        $log.debug(error);
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

                $http.delete(BASE_URL + MESSAGE + id).then(function (data) {
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



