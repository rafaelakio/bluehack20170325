var ang = angular.module('bluehack', []);

ang.controller('TodoController', ['$scope', function ($scope) {
    $scope.todos = [
      { name: 'AngularJS Directives', completed: true },
      { name: 'Data binding', completed: true },
      { name: '$scope', completed: true },
      { name: 'Controllers and Modules', completed: true },
      { name: 'Templates and routes', completed: true },
      { name: 'Filters and Services', completed: false },
      { name: 'Get started with Node/ExpressJS', completed: false },
      { name: 'Setup MongoDB database', completed: false },
      { name: 'Be awesome!', completed: false },
    ];
  }]);