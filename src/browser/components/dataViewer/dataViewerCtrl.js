angular.module('app').controller('dataViewerCtrl', [
  '$scope',
  '$rootScope',
  '$log',
  '$state',
  '$timeout',
  'alertService',
  'keypressService',
  'modalService',
  function($scope, $rootScope, $log, $state, $timeout, alertService, keypressService, modalService) {
    $scope.setTitle('Mongotron Data Viewer');

    $scope.currentCollections = []; //collections stored while user is querying

    registerKeypressEvents();

    $scope.closeActiveCollectionWindow = function() {
      var activeCollection = _.findWhere($scope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        activeCollection.active = false;
        var index = $scope.currentCollections.indexOf(activeCollection);
        $scope.currentCollections.splice(index, 1);
      }
    };

    $scope.activatePreviousCollectionWindow = function() {
      if ($scope.currentCollections.length === 1) return;

      var activeCollection = _.findWhere($scope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        var index = $scope.currentCollections.indexOf(activeCollection);
        var previousCollection = index === 0 ? $scope.currentCollections[$scope.currentCollections.length - 1] : $scope.currentCollections[index - 1];
        previousCollection.active = true;
        activeCollection.active = false;
      }
    };

    $scope.activateNextCollectionWindow = function() {
      if ($scope.currentCollections.length === 1) return;

      var activeCollection = _.findWhere($scope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        var index = $scope.currentCollections.indexOf(activeCollection);
        var nextCollection = (index === ($scope.currentCollections.length - 1)) ? $scope.currentCollections[0] : $scope.currentCollections[index + 1];
        nextCollection.active = true;
        activeCollection.active = false;
      }
    };

    $scope.showConnections = function($event) {
      if ($event) $event.preventDefault();
      modalService.openConnectionManager();
    };

    function registerKeypressEvents() {
      // unregister keypress events on scope destroy
      $scope.$on('$destroy', function() {
        keypressService.unregisterCombo(keypressService.EVENTS.CLOSE_WINDOW);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_LEFT);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_RIGHT);
        keypressService.unregisterCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
      });

      keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
        console.log(keypressService.EVENTS.CLOSE_WINDOW);
        $scope.closeActiveCollectionWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
        console.log(keypressService.EVENTS.MOVE_LEFT);
        $scope.activatePreviousCollectionWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
        console.log(keypressService.EVENTS.MOVE_RIGHT);
        $scope.activateNextCollectionWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER, function() {
        console.log(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
        $scope.showConnections();
      });
    }
  }
]);
