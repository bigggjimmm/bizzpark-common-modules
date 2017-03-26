(function() {
	"use strict";
	/**
	 * author : JIMMY BAHOLE
	 */
	var bu2 = document.querySelector("script[src$='Module-Entities.js']");

	var currentScriptPath = bu2.src;
	var baseUrl = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);

	var moduleName = 'BPEntityModule';
	var factoryName = 'entFact';
	var STATICLINKSName = moduleName + 'STATICLINKS';
	var ENTITIESLINKSName = 'ENTITIES';
	var PROVIDERName = moduleName + 'ProviderName';
	var STATICLINKS = {
		TMPLCOUNTRYLIST : baseUrl + 'tmpl.country-list.html',
		TMPLSTATELIST : baseUrl + 'tmpl.state-list.html',

	};
	var ENTITIESLINKS = {
		COUNTRYLIST : '/wsbpentities/entities/country-list/',
		STATELIST : '/wsbpentities/entities/state-list/',
	};
	var mEntities = 'mEntities';

	var dependencies = ['AppConfigs', 'BPMiscModule', 'BPRequestModule', 'pascalprecht.translate'];

	var factory = {
		$injector : undefined,
		industries : {
			pagination : {
				pageSet : -1,
				skip : -1,
				sorting : undefined,
				filters : undefined
			},
			fetched : [],
			fileEnded : false
		},
		industrySubs : {
			pagination : {
				pageSet : -1,
				skip : -1,
				sorting : undefined,
				filters : undefined
			},
			fetched : [],
			fileEnded : false
		},
		countries : {
			pagination : {
				pageSet : -1,
				skip : -1,
				sorting : undefined,
				filters : undefined
			},
			fetched : [],
			fileEnded : false
		},
		states : {
			pagination : {
				pageSet : -1,
				skip : -1,
				sorting : undefined,
				filters : undefined
			},
			fetched : [],
			fileEnded : false
		},

		initIndustries : function() {
			this.industries.pagination = {
				pageSet : 10,
				skip : 0,
				sorts : [ /*
							 * { field : 'name', direction : 1 }
							 */],
				filters : [/*
							 * { field : 'name', value : 1 }
							 */]
			};
			this.industries.fileEnded = false;
			this.industries.fetched.splice(0, this.industries.fetched.length);
		},
		initIndustrySubs : function() {
			this.industrySubs.pagination = {
				pageSet : 10,
				skip : 0,
				sorts : [ /*
							 * { field : 'name', direction : 1 }
							 */],
				filters : [/*
							 * { industryIndexes:2 }
							 */]
			}
			this.industrySubs.fileEnded = false;
			this.industrySubs.fetched.splice(0, this.industrySubs.fetched.length);
		},
		initCountries : function() {
			this.countries.pagination = {
				pageSet : 10,
				skip : 0,
				sorts : [ /*
							 * { field : 'name', direction : 1 }
							 */],
				filters : [/*
							 * { field : 'name', value : 1 }
							 */]
			};
			this.countries.fileEnded = false;
			this.countries.fetched.splice(0, this.countries.fetched.length);

		},
		initStates : function() {
			this.states.pagination = {
				pageSet : 10,
				skip : 0,
				sorts : [ /*
							 * { field : 'name', direction : 1 }
							 */],
				filters : [/*
							 * { field : 'name', value : 1 }
							 */]
			};
			this.states.fileEnded = false;
			this.states.fetched.splice(0, this.states.fetched.length);

		},
		init : function() {
			this.reinit();
			return this;
		},
		reinit : function() {
			this.initIndustries();
			this.initIndustrySubs();
			this.initCountries();
			this.initStates();
			return this;
		},

		dialogCountries : function(evt, chooseCallBack) {
			var _this = this;
			var miscFact = this.$injector.get('miscFact');
			var $translate = this.$injector.get('$translate');
			var panelClass = 'panelClass' + Date.now();
			var extendList = function() {
				var __this = this;
				__this.searching = true;
				_this.fetchCountries(function() {
					/*
					 * _this.countries.fetched.forEach(function(element, index,
					 * array) { if (!angular.equals(undefined, element)) {
					 * //__this.countries.push(element); } });
					 */
					__this.searching = false;
					__this.reachEnd = _this.countries.fileEnded;
					miscFact.funcTimeOut(0);
				});
			};

			var OPTS = {
				id : 'dialog-countries-id',
				attachTo : angular.element(document.body),
				panelClass : panelClass,
				targetEvent : evt,
				clickOutsideToClose : true,
				escapeToClose : true,
				fullscreen : true,
				scope : {
					mdTheme : 'infoTheme',
					countries : _this.countries.fetched,
					searching : false,
					reachEnd : _this.countries.fileEnded,
					extendList : extendList,
					chooseCountry : function(i) {
						this.cancel();
						chooseCallBack(i);
					},
					init : function() {
						/*
						 * this.$watch('reachEnd', function(v1, v2) {
						 * console.log('$watch reachEnd ',v1); }, true);
						 */
						this.extendList();
					},
				},
			};
			var STATICLINKS = this.$injector.get(STATICLINKSName);

			var bounds = {
				xs : {
					width : 100,
					height : 100
				},
				sm : {
					width : 50,
					height : 60
				},
				md : {
					width : 30,
					height : 60
				},
				lg : {
					width : 30,
					height : 60
				}
			};
			var CTTmpl = STATICLINKS.TMPLCOUNTRYLIST;
			var TBTTmpl = "<div flex='90' layout-margin layout-align='start start'><span class='md-headline' flex>{{'COUNTRIES' | translate }}</span></div><i flex ng-click='cancel()' class='material-icons'>close</i>";
			var TBBTmpl = "<md-button md-theme='{{mdTheme}}' class='md-primary md-raised' ng-click='cancel()' >{{'CLOSE' | translate | lowercase}}</md-button>";

			miscFact.openDialog(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl);
		},

		dialogStates : function(evt, country, chooseCallBack) {
			var _this = this;
			var miscFact = this.$injector.get('miscFact');
			var $translate = this.$injector.get('$translate');
			var panelClass = 'panelClass' + Date.now();
			var extendList = function() {	
				var __this = this;
				__this.searching = true;
				_this.fetchStates(country, function() {  
					__this.searching = false;
					__this.reachEnd = _this.states.fileEnded;
					miscFact.funcTimeOut(0);
				}); 
			};

			var OPTS = {
				id : 'dialog-states-id',
				attachTo : angular.element(document.body),
				panelClass : panelClass,
				targetEvent : evt,
				clickOutsideToClose : true,
				escapeToClose : true,
				fullscreen : true,
				scope : {
					mdTheme : 'infoTheme',
					states : _this.states.fetched,
					searching : false,
					reachEnd : _this.states.fileEnded,
					extendList : extendList  ,
					chooseState : function(i) {
						this.cancel();
						chooseCallBack(i);
					},
					init : function() {
						/*
						 * this.$watch('reachEnd', function(v1, v2) {
						 * console.log('$watch reachEnd ',v1); }, true);
						 */
						this.extendList();
					},
				},
			};
			var STATICLINKS = this.$injector.get(STATICLINKSName);

			var bounds = {
				xs : {
					width : 100,
					height : 100
				},
				sm : {
					width : 50,
					height : 60
				},
				md : {
					width : 30,
					height : 60
				},
				lg : {
					width : 30,
					height : 60
				}
			};
			var CTTmpl = STATICLINKS.TMPLSTATELIST;  
			var TBTTmpl = "<div flex='90' layout-margin layout-align='start start'><span class='md-headline' flex>{{'STATES' | translate }}</span></div><i flex ng-click='cancel()' class='material-icons'>close</i>";
			var TBBTmpl = "<md-button md-theme='{{mdTheme}}' class='md-primary md-raised' ng-click='cancel()' >{{'CLOSE' | translate | lowercase}}</md-button>";

			miscFact.openDialog(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl); 
		},
		 
		fetchCountries : function(callBack) {

			if (this.countries.fileEnded) {
				callBack();
				return;
			}
			var _this = this;

			var p = this.getProvider();
			var miscFact = this.$injector.get('miscFact');
			var ENTITIES = this.$injector.get(ENTITIESLINKSName);
			var fetchSuccess = function(results) {
				var r = p.getFR().defFuncS(results);

				if (r.messages) {

				}
				if (r.object) {
					miscFact.fetchedPagination(_this.countries, r.object, ['id']);

				} else if (r.errors) {

				}
				callBack();
			};
			var fetchFailed = function(results) {
				var r = p.getFR().defFuncF(results);
				callBack();
			};
			p.getFR().fetchP(ENTITIES.COUNTRYLIST, this.countries.pagination).then(fetchSuccess, fetchFailed);
		},

		fetchStates : function(i, callBack) { 
			if (this.states.fileEnded) {
				callBack();
				return;
			}
			var _this = this;

			var p = this.getProvider();
			var miscFact = this.$injector.get('miscFact');
			var ENTITIES = this.$injector.get(ENTITIESLINKSName);
			var fetchSuccess = function(results) {
				var r = p.getFR().defFuncS(results);  
				if (r.messages) {

				}
				if (r.object) {
					miscFact.fetchedPagination(_this.states, r.object, ['id']);

				} else if (r.errors) {

				}
				callBack();
			};
			var fetchFailed = function(results) {
				var r = p.getFR().defFuncF(results);
				callBack();
			};
			this.states.pagination.filters = [{
				field : 'countryIndex',
				value : i.index + '',
				clss : 'i'
			}];
			p.getFR().fetchP(ENTITIES.STATELIST, this.states.pagination).then(fetchSuccess, fetchFailed);

		},

		 

		getProvider : function() {
			var constant = this.$injector.get(PROVIDERName);
			var provider = this.$injector.get(constant);
			return provider;
		},
	};
	var factoryController = function($injector) {
		factory.$injector = $injector;
		return factory;
	};

	var FieldCountryState = function(positionScope, entFact, $timeout) {
		return {
			restrict : 'E',
			scope : {
				displayOnly : '=',
				name : '=',
				model : '=',
				triggerAction : '=',
				placeholder : '@',
				styleHeight : '@',
				styleWidth : '@',
				callBackChooser : '&'
			},
			templateUrl : positionScope.scope + 'staticcontents/partials/directives/field-country-state.html',
			controller : function($rootScope, $scope, $element) {
				if (!$scope.model) {
					$scope.model = {
						country : {},
						state : {}
					};
				} else {
					if (!$scope.model.country) {
						$scope.model.country = {};
					}
					if (!$scope.model.state) {
						$scope.model.state = {};
					}
				}

				$scope.erase = function() {
					if (angular.equals($scope.displayOnly, true)) {
						return;
					}
					$scope.model.country = {};
					$scope.model.state = {};
				};

				$scope.trigger = function(evt) {
					if (angular.equals($scope.displayOnly, true)) {
						return;
					}
					entFact.dialogCountries(evt, function(c) {
						if (!$scope.model || !$scope.model.country || !angular.equals($scope.model.country.id, c.id)) {
							entFact.initStates();
						}
						entFact.dialogStates(evt, c, function(s) {
							$scope.model.country['id'] = c.id;
							$scope.model.country['name'] = c.name;
							$scope.model.country['code'] = c.code;
							$scope.model.state['id'] = s.id;
							$scope.model.state['name'] = s.name;
							$scope.model.state['code'] = s.code;
							if ($scope.callBackChooser) {
								$timeout($scope.callBackChooser);
							}
						});
					});
				};
				if ($scope.triggerAction) {
					$timeout($scope.trigger);
				}
			},
			link : function($scope, element, attrs) {
			}
		};
	};
	var FieldCountry = function(positionScope, entFact, $timeout, $mdDialog) {
		return {
			restrict : 'E',
			scope : {
				displayOnly : '=',
				name : '=',
				model : '=',
				triggerAction : '=',
				placeholder : '@',
				callBackChooser : '&'
			},
			templateUrl : positionScope.scope + 'staticcontents/partials/directives/field-country.html',
			controller : function($rootScope, $scope, $element) {

				if (!$scope.model) {
					$scope.model = {
						country : {}
					};
				} else {
					if (!$scope.model.country) {
						$scope.model.country = {};
					}
				}

				$scope.erase = function() {
					if (angular.equals($scope.displayOnly, true)) {
						return;
					}
					$scope.model.country = {};
				};

				$scope.trigger = function(evt) {
					if (angular.equals($scope.displayOnly, true)) {
						return;
					}
					entFact.dialogCountries(evt, function(c) {
						$scope.model.country['id'] = c.id;
						$scope.model.country['name'] = c.name;
						$scope.model.country['code'] = c.code;

					});

				};
				if ($scope.triggerAction) {
					$timeout($scope.trigger);
				}
			},
			link : function($scope, element, attrs) {
			}
		};
	};

	var providerFunc = function( /* cnnFact , reqFact */) {
		var injector = angular.injector(['BPRequestModule']);
		var cnnFact = injector.get('cnnFact');
		var reqFact = injector.get('reqFact');

		var _this = this;
		/*
		 * this.FactoryRequest = undefined; this.FactoryConn = undefined;
		 * this.DREM = undefined;
		 */
		/* set Factory Request */
		var setFR = function(prefix) {
			this.FactoryRequest = reqFact.get(prefix, this.FactoryConn.AUTHATTR);
		};
		/* set Factory Conn */
		var setFC = function(authData) {
			this.FactoryConn = cnnFact.get(authData);
		};
		/* set Default Request Error Msgs */
		var setDREM = function(msgs) {
			this.DREM = msgs;
		};
		/*
		 * this.setFR = setFR; this.setFC = setFC; this.setDREM = setDREM;
		 */

		this.$get = function() {
			return {
				FactoryConn : undefined,
				FactoryRequest : undefined,
				DREM : undefined,
				getFR : function() {
					return this.FactoryRequest;
				},
				setFR : setFR,
				setFC : setFC,
				setDREM : setDREM,
				getFC : function() {
					return this.FactoryConn;
				},
				getDREM : function() {
					return this.DREM = undefined;
				},
			}

		};
	};
	angular.module(moduleName, dependencies).constant(STATICLINKSName, STATICLINKS).constant(ENTITIESLINKSName, ENTITIESLINKS).constant(PROVIDERName, mEntities).factory(factoryName, factoryController).directive("fieldCountryState", ['positionScope', 'entFact', '$timeout', FieldCountryState]).directive("fieldCountry", ['positionScope', 'entFact', '$timeout', '$mdDialog', FieldCountry]).provider(mEntities, /*
																																																																																																						 * ['cnnFact',
																																																																																																						 * 'reqFact',
																																																																																																						 * providerFunc ]
																																																																																																						 */providerFunc)

	/*
	 * .config(['appScopeProvider', mEntities+'Provider',
	 * function(appScopeProvider, mEntities) {
	 * 
	 * 
	 * }])
	 */;
})();
