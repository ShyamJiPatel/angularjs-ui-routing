"use strict";

var app = angular.module('myApp', [ 'ui.router' ]);

app.controller('EmployeeCTRL', [ '$scope', '$http', '$timeout',
		'EmployeeService', function($scope, $http, $timeout, EmployeeService) {

			$scope.employees = [];

			$scope.isLoding = true;

			EmployeeService.get().then(function success(response) {

				$timeout(function() {
					$scope.isLoding = false;
					$scope.employees = response.data;
					console.log(response.data);
				}, 1000);

			}, function error(response) {
				console.log("Error occured : " + response);
			});

		} ]);

app.controller('EmpDetailCTRL', [ '$scope', '$http', '$timeout',
		'$stateParams', 'EmployeeService',
		function($scope, $http, $timeout, $stateParams, EmployeeService) {

			$scope.employee = {};

			$scope.isNotFound = true;

			var empno = $stateParams.empno;

			EmployeeService.get().then(function success(response) {

				$timeout(function() {

					var employees = response.data;

					for ( var i in employees) {
						if (employees[i].id == parseInt(empno)) {
							$scope.isNotFound = false;
							$scope.employee = employees[i];
							break;
						}
					}

					// angular.forEach(employees, function(value, key) {
					// if (key == "id" && value == empno) {
					// $scope.isNotFound = false;
					// break;
					// }
					// });

					console.log(response.data);
				}, 1000);

			}, function error(response) {
				console.log("Error occured : " + response);
			});

		} ]);

app.factory("EmployeeService", function($http) {

	var oEmployeeService = {
		get : function() {
			return $http.get("data/employees.json");
		}
	}
	return oEmployeeService;
});

app.config([ '$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise('/');

			$stateProvider.state('employees', {
				views : {
					"" : {
						templateUrl : 'employees.html',
						controller : "EmployeeCTRL"
					},
					"emp_title@employees" : {
						templateUrl : "emptitle.html"
					}
				}
			}).state("employees.list", {
				url : "/employees",
				views : {
					"emp_data@employees" : {
						templateUrl : "empdetail.html",
						controller : "EmployeeCTRL"
					}
				}
			}).state("detail", {
				parent : "employees",
				url : "/employees/:empno",
				views : {
					"sel_emp@employees" : {
						templateUrl : "selectemp.html",
						controller : "EmpDetailCTRL"
					}
				}
			}).state('home', {
				url : '/',
				template : '<p>Please select a link from left panel.</p>'
			});

		} ]);