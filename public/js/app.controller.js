angular.module('ngBoilerplate').controller('AppCtrl', ['$scope', '$uibModal', '$log', '$rootScope',
    function ($scope, $uibModal, $log, $rootScope) {
        $scope.dragoverCallback = function (event, index, external, type) {
            console.log('hello world')
            $scope.logListEvent('dragged over', event, index, external, type);
            // Disallow dropping in the third row. Could also be done with dnd-disable-if.
            return index < 10;
        };

        $scope.dropCallback = function (event, index, item, external, type, allowedType) {
            console.log('hello world')
            $scope.logListEvent('dropped at', event, index, external, type);
            if (external) {
                if (allowedType === 'itemType' && !item.label) return false;
                if (allowedType === 'containerType' && !angular.isArray(item)) return false;
            }
            return item;
        };

        $scope.logEvent = function (message, event) {
            console.log(message, '(triggered by the following', event.type, 'event)');
            console.log(event);
        };

        $scope.logListEvent = function (action, event, index, external, type) {
            var message = external ? 'External ' : '';
            message += type + ' element is ' + action + ' position ' + index;
            $scope.logEvent(message, event);
        };

        $scope.model = [];

        // Initialize model
        var id = 10;
        for (var i = 0; i < 3; ++i) {
            $scope.model.push([]);
            for (var j = 0; j < 2; ++j) {
                $scope.model[i].push([]);
                for (var k = 0; k < 7; ++k) {
                    $scope.model[i][j].push({
                        label: 'Item ' + id++,
                        name: 'Black',
                        country: 'US'
                    });
                }
            }
        }

        $scope.$watch('model', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        /**
         * dropdown
         */
        $scope.open = function (size, item) {
            $rootScope.selectedItem = item;

        };
        $scope.animationsEnabled = true;


        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    }
]);


angular.module('ngBoilerplate').controller('ModalInstanceCtrl', ['$scope', '$uibModal', '$log', '$stateParams', '$state', '$rootScope',
    function ($scope, $uibModal, $log, $stateParams, $state, $rootScope) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/dropdown.html',
            controller: 'ModalPopUpCtrl',
            /*size: size,*/
            resolve: {
                item: $rootScope.selectedItem
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
        /**
         *
         * @type {{item: (item|*)}}
         */
    }]);

angular.module('ngBoilerplate').controller('ModalPopUpCtrl', ['$scope', '$uibModalInstance', 'item', '$state',
    function ($scope, $uibModalInstance, item, $state) {
        $scope.selected = {
            item: item
        };

        $scope.update = function (obj) {
            $scope.selected.item = angular.copy(obj);
            $uibModalInstance.close($scope.selected.item);
            item.label = angular.copy(obj.label);
            item.name = angular.copy(obj.name);
            item.country = angular.copy(obj.country);
            $state.go('/');
        };

        $scope.cancel = function (param) {
            $scope.item = angular.copy($scope.selected.item);
            $uibModalInstance.dismiss('cancel');
            if (param){
                $state.go('/');
            }
        };

        $scope.cancel();

    }]);

angular.module('ngBoilerplate').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('/', {
                url: '/'
            })
            .state('item', {
                url: "/item/:item",
                controller: 'ModalInstanceCtrl'
            })
    }]);