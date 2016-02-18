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
            getCurrentUser: function () {
                var deferred = $q.defer();
                $http.get(BASE_URL + USER + "me", {sid: Storage.sid})
                    .then(function (data) {
                        $log.info(data);
                        $log.info(data.data);

                        Storage.user.name = data.data.username;
                        Storage.user.address = data.data.address;
                        Storage.user.country = data.data.country;
                        Storage.user.state = data.data.state;
                        Storage.user.email = data.data.email;
                        Storage.user.phone = data.data.phone;

                        $log.debug("Storage.user: " + Storage.user.name);
                        $log.debug("Storage.user: " + Storage.user.address);
                        $log.debug("Storage.user: " + Storage.user.country);
                        $log.debug("Storage.user: " + Storage.user.state);
                        $log.debug("Storage.user: " + Storage.user.email);
                        $log.debug("Storage.user: " + Storage.user.phone);

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

                $http.get(BASE_URL + "/messages?" + '{\"$or\":[{\"from\":\"' + Storage.user.name + '\"},{\"to\":\"' + Storage.user.name + '\"}]}')
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
                if(angular.isDefined(message)){

                    message.date = Date.now();
                    message.from = Storage.user.name;
                    message.favorite = false;
                    message.read = false;

                    $http.post(BASE_URL + "/messages", message);
                }
            }
        };

        return exports;
    }]);



