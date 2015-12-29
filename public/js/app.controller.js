angular.module('ngBoilerplate').controller('AppCtrl', [ '$scope', '$uibModal', '$log',
    function($scope, $uibModal, $log) {
        $scope.dragoverCallback = function(event, index, external, type) {
            console.log('hello world')
            $scope.logListEvent('dragged over', event, index, external, type);
            // Disallow dropping in the third row. Could also be done with dnd-disable-if.
            return index < 10;
        };

        $scope.dropCallback = function(event, index, item, external, type, allowedType) {
            console.log('hello world')
            $scope.logListEvent('dropped at', event, index, external, type);
            if (external) {
                if (allowedType === 'itemType' && !item.label) return false;
                if (allowedType === 'containerType' && !angular.isArray(item)) return false;
            }
            return item;
        };

        $scope.logEvent = function(message, event) {
            console.log(message, '(triggered by the following', event.type, 'event)');
            console.log(event);
        };

        $scope.logListEvent = function(action, event, index, external, type) {
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

        $scope.$watch('model', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        /**
         * dropdown
         */

        $scope.animationsEnabled = true;

        $scope.open = function (size, item) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/dropdown.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    item: item
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    }
]);


angular.module('ngBoilerplate').controller('ModalInstanceCtrl', [ '$scope', '$uibModalInstance', 'item',
    function($scope, $uibModalInstance, item) {

        $scope.selected = {
            item: item
        };

        $scope.update = function (obj) {
            $scope.selected.item = angular.copy(obj);
            $uibModalInstance.close($scope.selected.item);
            item.label = angular.copy(obj.label);
            item.name = angular.copy(obj.name);
            item.country = angular.copy(obj.country);
        };

        $scope.cancel = function () {
            $scope.item = angular.copy($scope.selected.item);
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel();
}]);