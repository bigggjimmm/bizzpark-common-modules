(function() {
	"use strict";
	/**
	 * author : JIMMY BAHOLE
	 */
	var bu2 = document.querySelector("script[src$='Module-Misc.js']");
	var currentScriptPath = bu2.src; 
	var baseUrl = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
	var dependencies = ['ngAnimate', 'ngMaterial', 'pascalprecht.translate'];
	var moduleName = 'BPMiscModule';
	var factoryName = 'miscFact';
	var factoryRooterName = 'rooterFact';
	
	
	var providerName = 'miscPrv';
	var STATICLINKSName = moduleName+'STATICLINKS';
	var STATICLINKS = {
		TMPLPANEL : baseUrl+'tmpl.panel.html',
		TMPLDIALOG : baseUrl+'tmpl.dialog.html',
		TMPLERRORLIST : baseUrl+'tmpl.error-list.html',
		TMPLMSGSLIST : baseUrl+'tmpl.msgs-list.html',
		TMPLBTMSHEET : baseUrl+'tmpl.bottomsheet.html',
		TMPLTOAST : baseUrl+'tmpl.toast-errors.html',
	};
	var factory = {
		rootScope : undefined,
		$injector : undefined,
		init : function($rootScope) {
			this.rootScope = $rootScope;
			return this;
		},

		alertToast : function(parent, message) {
			var $mdToast = this.$injector.get('$mdToast');
			var positionScope = this.$injector.get('positionScope');
			var STATICLINKS = this.$injector.get(STATICLINKSName);
			var ToastController = function($scope, $mdToast) {
				$scope.errorMsg = message;
				$scope.closeToast = function() {
					$mdToast.hide();
				};
			};
			$mdToast.show({
				hideDelay : 10000,
				position : 'top right',
				controller : ToastController,
				parent : parent,
				templateUrl : positionScope.scope + STATICLINKS.TMPLTOAST,

			});
		},

		alertSheet : function() {
			var $mdBottomSheet = this.$injector.get('$mdBottomSheet');
			var positionScope = this.$injector.get('positionScope');
			var $document = this.$injector.get('$document');
			var STATICLINKS = this.$injector.get(STATICLINKSName);
			var BottomSheetController = function($scope, $mdBottomSheet) {
				$scope.ok = function() {
					$mdBottomSheet.hide();
				};
				$scope.showMore = function() {
					console.log('show more');
				};
			};
			$mdBottomSheet.show({
				controller : BottomSheetController,
				locals : {

				},
				templateUrl : positionScope.scope + STATICLINKS.TMPLBTMSHEET,
				clickOutsideToClose : false
			});
		},

		dialogMessages : function(msgs, title, subtitle) {
			var _this = this;
			var miscPrv = this.$injector.get(providerName);
			var STATICLINKS = this.$injector.get(STATICLINKSName);
			
			var OPTS = {
				scope : {
					TITLE : title,
					SUBTITLE : subtitle,
					msgs : msgs,
					mdTheme : miscPrv.mdMsgTheme,
				},
				id : 'dialog-messages-id',
				parent : angular.element(document.body), 
				trapFocus : true,
				clickOutsideToClose : true,
				escapeToClose : true,
				focusOnOpen : true,
				hasBackdrop : true,
			};
			var bounds = {
				xs : {
					width : 90,
					height : 80
				},
				sm : {
					width : 50,
					height : 50
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
			var CTTmpl =  STATICLINKS.TMPLMSGSLIST;
			 
			var TBBTmpl = "<md-button md-theme='{{mdTheme}}' class='md-primary md-raised' ng-click='cancel()' >{{'CLOSE' | translate | lowercase}}</md-button>";
			var TBTTmpl = "<span flex>{{TITLE | translate | lowercase}}</span>";
			TBTTmpl += "<i ng-click='cancel()' class='material-icons'>close</i>";
			this.openDialog(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl);
		},

		dialogErrors : function(errors, title, subtitle) {
			var _this = this;
			var $mdDialog = this.$injector.get('$mdDialog');
			var miscPrv = this.$injector.get(providerName);

			var $templateRequest = this.$injector.get('$templateRequest');
			var STATICLINKS = this.$injector.get(STATICLINKSName);

			var OPTS = {
				scope : {
					TITLE : title,
					SUBTITLE : subtitle,
					msgs : errors,
					mdTheme : miscPrv.mdErrorTheme,
				},
				id : 'dialog-errors-id',
				parent : angular.element(document.body), 
				trapFocus : true,
				clickOutsideToClose : true,
				escapeToClose : true,
				focusOnOpen : true,
				hasBackdrop : true, 
			};
			var bounds = {
				xs : {
					width : 90,
					height : 80
				},
				sm : {
					width : 50,
					height : 50
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
			var CTTmpl =  STATICLINKS.TMPLMSGSLIST;
			var TBBTmpl = "<md-button md-theme='{{mdTheme}}' class='md-primary md-raised' ng-click='cancel()' >{{'CLOSE' | translate | lowercase}}</md-button>";
			var TBTTmpl = "<span flex>{{TITLE | translate | lowercase}}</span>";
			TBTTmpl += "<i ng-click='cancel()' class='material-icons'>close</i>";

			this.openDialog(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl);
		},

		openDialog : function(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl) {
			if (!CTTmpl || !OPTS || !bounds)
				return;
			var _this = this;
			var $mdDialog = this.$injector.get('$mdDialog'); 
			var $templateRequest = this.$injector.get('$templateRequest');
			var STATICLINKS = this.$injector.get(STATICLINKSName);

			var DialogController = function($scope, $document, $timeout, $compile, $translate, $mdDialog) {
				if (OPTS.scope)  
					angular.extend($scope, OPTS.scope);
				
				if (!angular.equals(TBTTmpl, undefined)) {
					$scope.TBT = true;
					$scope.TBTSelector = 'TBTSelector' + Date.now();
				}

				if (!angular.equals(TBBTmpl, undefined)) {
					$scope.TBB = true;
					$scope.TBBSelector = 'TBBSelector' + Date.now();
				}

				$scope.CTSelector = 'CTSelector' + Date.now();
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
				var setListerners = function() {
					var removeResizer = _this.panelResizer($scope, bounds);
					$scope.cancel = function() {
						removeResizer();
						$mdDialog.cancel();
					};
				};

				var setContents = function() { 
					$scope. TBTEL = angular.equals($scope.TBT, false) || _this.elInDom('.' + $scope.TBTSelector);
					$scope. CTEL = _this.elInDom('.' + $scope.CTSelector);
					$scope. TBBEL = angular.equals($scope.TBB, false) || _this.elInDom('.' + $scope.TBBSelector);
					if (!$scope.TBTEL || !$scope.TBBEL || !$scope.CTEL) {
						$timeout(setContents, 100);
						return;
					} 
					if (angular.equals($scope.TBT, true))
						angular.element($scope.TBTEL).append($compile(TBTTmpl)($scope));
					if (angular.equals($scope.TBT, true))
						angular.element($scope.TBBEL).append($compile(TBBTmpl)($scope));

					if(CTTmpl){ 
						$templateRequest(CTTmpl).then(function(html) { 
							angular.element($scope.CTEL).append($compile(html)($scope));
							if($scope.init){
								$scope.init();
							}
						}, function(e) {
							angular.element($scope.CTEL).append("RESOURCE MISSING : " + CTTmpl);
						}); 
					}else if($scope.init){
						$scope.init();
					}
				};
				setListerners();
				setContents();
			};
		 
			$mdDialog.show({
				controller : DialogController,
				templateUrl :   STATICLINKS.TMPLDIALOG,
				parent : OPTS.parent,
				clickOutsideToClose : OPTS.clickOutsideToClose,
				escapeToClose : OPTS.escapeToClose,
				targetEvent :OPTS.targetEvent,
				fullscreen :OPTS.fullscreen,
			});
		},

		openPanel : function(OPTS, bounds, CTTmpl, TBBTmpl, TBTTmpl) {
			var _this = this;
			var $templateRequest = this.$injector.get('$templateRequest');
			var $mdPanel = this.$injector.get('$mdPanel');
			var DialogController = function($scope, $document, $window, $timeout, $compile, $translate, mdPanelRef) {
				if (OPTS.scope)
					angular.extend($scope, OPTS.scope);

				if (!angular.equals(TBTTmpl, undefined)) {
					$scope.TBT = true;
					$scope.TBTSelector = 'TBTSelector' + Date.now();
				}

				if (!angular.equals(TBBTmpl, undefined)) {
					$scope.TBB = true;
					$scope.TBBSelector = 'TBBSelector' + Date.now();
				}

				$scope.CTSelector = 'CTSelector' + Date.now();
				$scope.cancel = function() {
					mdPanelRef.close("CANCEL-PROCESS");
				};
				var setListerners = function() {
					var removeResizer = _this.panelResizer($scope, bounds);
					$scope.cancel = function() {
						removeResizer();
						mdPanelRef.close("CANCEL-PROCESS");
					};
					
					mdPanelRef.config.onCloseSuccess = function(panelRef, string) {
						removeResizer();
					};
					mdPanelRef.config.onDomRemoved = function() {

					};
				};
				var setContents = function() {
					$scope. TBTEL = angular.equals($scope.TBT, false) || _this.elInDom('.' + $scope.TBTSelector);
					$scope. CTEL = _this.elInDom('.' + $scope.CTSelector);
					$scope. TBBEL = angular.equals($scope.TBB, false) || _this.elInDom('.' + $scope.TBBSelector);
					if (!$scope.TBTEL || !$scope.TBBEL || !$scope.CTEL) {
						$timeout(setContents, 100); 
						return;
					}
					if (angular.equals($scope.TBT, true))
						angular.element($scope.TBTEL).append($compile(TBTTmpl)($scope));
					if (angular.equals($scope.TBT, true))
						angular.element($scope.TBBEL).append($compile(TBBTmpl)($scope));

				 
					
					if(CTTmpl){ 
						$templateRequest(CTTmpl).then(function(html) { 
							angular.element($scope.CTEL).append($compile(html)($scope));
							if($scope.init){
								$scope.init();
							}
						}, function(e) {
							angular.element($scope.CTEL).append("RESOURCE MISSING : " + CTTmpl);
						}); 
					}else if($scope.init){
						$scope.init();
					}
				};
				setListerners();
				setContents();
			};

			var config = {
				id : OPTS.id,
				attachTo : OPTS.attachTo,
				controller : DialogController,
				templateUrl :   STATICLINKS.TMPLPANEL,

				panelClass : OPTS.panelClass,
				position : OPTS.position ? OPTS.position : $mdPanel.newPanelPosition().absolute().center(),
				openFrom : OPTS.openFrom,
				trapFocus : OPTS.trapFocus,
				clickOutsideToClose : OPTS.clickOutsideToClose,
				escapeToClose : OPTS.escapeToClose,
				focusOnOpen : OPTS.focusOnOpen,
				hasBackdrop : OPTS.hasBackdrop,
				zIndex : !angular.equals(OPTS.zIndex,undefined) ? OPTS.zIndex : 80,
			};
			var panelRef = $mdPanel.create(config);
			panelRef.open();
		},
		panelResizer : function($scope, bounds) {
			if (!bounds.xs || !bounds.xs.width || !bounds.xs.height) {
				bounds.xs = {
					width : 100,
					height : 100
				};
			}
			if (!bounds.sm || !bounds.sm.width || !bounds.sm.height) {
				bounds.sm = {
					width : 100,
					height : 100
				};
			}
			if (!bounds.md || !bounds.md.width || !bounds.md.height) {
				bounds.md = {
					width : 100,
					height : 100
				};
			}
			if (!bounds.lg || !bounds.lg.width || !bounds.lg.height) {
				bounds.lg = {
					width : 100,
					height : 100
				};
			}

			var $window = this.$injector.get('$window');
			var _this = this;
			$scope.ngStyle = {
				width : 0,
				height : 0
			};

			var resizer = function(v1, v2) {
				var size = bounds.lg;
				if (v1 < 768) {
					size = bounds.xs;
				} else if (v1 < 992) {
					size = bounds.sm;
				} else if (v1 < 1200) {
					size = bounds.md;
				}    
				$scope.ngStyle.height = (parseInt(($window.innerHeight * size.height) / 100)   ) + 'px';
				$scope.ngStyle.width = (parseInt((v1 * size.width) / 100)) + 'px';
			};
			var apply = function() {
				$scope.$apply();
			};
			resizer($window.innerWidth);
			var window = angular.element($window);
			var watch = $scope.$watch(function() {
				return $window.innerWidth;
			}, resizer, true);
			window.bind('resize', apply);
			return function() {
				watch();
				window.unbind('resize', apply);
			};
		},

		translateFields : function(formFields) {
			var $translate = this.$injector.get('$translate');
			try {
				for (var i = 0; i < formFields.length; i++) {
					formFields[i].label = $translate.instant(formFields[i].label);
					for (var y = 0; y < formFields[i].elements.length; y++) {
						formFields[i].elements[y].placeholder = $translate.instant(formFields[i].elements[y].placeholder);
						if (formFields[i].elements[y].patternLabelError) {
							formFields[i].elements[y].patternLabelError = $translate.instant(formFields[i].elements[y].patternLabelError);
						}
						if (angular.equals(formFields[i].elements[y].type, 'select-box')) {
							console.log();
							for (var z = 0; z < formFields[i].elements[y].items.length; z++) {
								formFields[i].elements[y].items[z].label = $translate.instant(formFields[i].elements[y].items[z].label);
							}
						}

					}
				}
				return true;
			} catch (e) {
				console.log(e);
			}
			return false;
		},

		createPostData : function(formFields) {
			var $translate = this.$injector.get('$translate');
			var object = {
				postData : {},
				messages : [],
				hasErrors : false,
			}
			for (var i = 0; i < formFields.length; i++) {
				var error = formFields[i].validator();
				if (error) {
					object.hasErrors = true;
					object.messages.push($translate.instant(error));
				} else {
					angular.extend(object.postData, formFields[i].getExtends());
				}
			}
			return object;
		},

		isNotEmpty : function(item) {
			return (typeof item !== 'undefined' && angular.isDefined(item) && item != null && angular.toJson(item).length > 2 && !angular.equals('undefined', item));
		},
		isEmpty : function(item) {
			return (typeof item === 'undefined' || angular.isUndefined(item) || item == null || angular.toJson(item).length === 2 || angular.equals('undefined', item));
		},

		elInDom : function(selector) {
			var $document = this.$injector.get('$document');

			var EL = angular.element($document[0].querySelector(selector));
			if (!angular.equals(undefined, EL) && !angular.equals(undefined, EL[0]))
				return EL;
			else
				return false;

		},

		funcTimeOut : function(tm, cb) {
			var _this = this;
			var $timeout = this.$injector.get('$timeout');
			if (tm && tm > 0) {
				$timeout(function() {
					try {
						_this.rootScope.$apply(function() {
							if (angular.isFunction(cb)) {
								cb();
							}
						});
					} catch (e) {
						if (angular.isFunction(cb)) {
							cb();
						}
						console.log(e);
					}
				}, tm);
			} else {
				$timeout(function() {
					try {
						_this.rootScope.$apply(function() {
							if (angular.isFunction(cb)) {
								cb();
							}
						});
					} catch (e) {
						if (angular.isFunction(cb)) {
							cb();
						}
						console.log(e);
					}
				});
			}
		},
		duplicateCheck : function(arr, o, attrs) { 
			if (arr.length == 0) {
				return false;
			}
			var isDuplicat = true;
			for (var r = 0; r < arr.length; r++) {
				for (var d = 0; d < attrs.length; d++) {
					if (!angular.equals(o[attrs[d]], arr[r][attrs[d]])) {
						isDuplicat = false;
						break;
					}
				}
				if (angular.equals(isDuplicat, false)) {
					break;
				}
			}
			return isDuplicat;
		},
		fetchedPagination : function(object, d, dca) { 
			if(!object || !object.pagination || !d || !angular.isArray(d) || !dca){
				object.fetching = false; return; 
			} 
			var _this = this;
			try {
				object.pagination.skip += d.length;
				angular.forEach(d, function(v, k) {
					 
					var contains = _this.duplicateCheck(this.fetched, v, dca);
					if (angular.equals(contains, false)) {
						this.fetched.push(v);
					}
				}, object);
				var isEnd = d.length < object.pagination.pageSet;
				if (isEnd) {
					object.fileEnded = true;
				}
				object.fetching = false;
			} catch (e) {
				console.log('catch : ', e);
			}
		}
	};

	var factoryRoot = {
			viewStackTrace : [],
			currentViewIndex : undefined,
			init : function() {
				this.viewStackTrace = [], this.currentViewIndex = undefined;
			},
			beforeRoot : undefined,
			changeLocation : function(view, query, miscObject) {
				if (this.beforeRoot && angular.isFunction(this.beforeRoot)) {
					this.beforeRoot();
					return;
				}
				this.beforeRoot = undefined;
				
				var args = {
					'view' : view,
					'query' : query,
					'miscObject' : miscObject
				};
			 
				var viewNavigate = -1;
				for (var i = 0; i < this.viewStackTrace.length; i++) {
					var v = this.viewStackTrace[i];
					var eqView = angular.equals(v.view, args.view);
					var eqQuery = angular.equals(v.query, args.query);
					var eqMiscObject = angular.equals(v.miscObject, args.miscObject);
					if (eqView && eqQuery && eqMiscObject) {
						viewNavigate = i;
						break;
					}
				}
				if (angular.equals(this.currentViewIndex, viewNavigate)) {
					return;
				}
				if (viewNavigate === -1) {
					this.viewStackTrace.push(args);
					this.currentViewIndex = this.viewStackTrace.length - 1;
				} else {
					this.currentViewIndex = viewNavigate;
				}
				var $location = this.$injector.get('$location');
				var $route = this.$injector.get('$route');
				var miscFact = this.$injector.get('miscFact');
				var _path = '/';
				var query = {};
				if (miscFact.isNotEmpty(args.view)) {
					_path += args.view;
				}
				if (miscFact.isNotEmpty(args.query)) {
					query = args.query;
					//_path += '?' + args.query;
				}
				 
				$location.path(_path).search(query); 
				$route.reload();
				miscFact.funcTimeOut(100);
			}

};
	
	var provider = function() {
		var fileScope;
		var mdMsgTheme;
		var mdErrorTheme;
		this.setValues = function(v) {
			if (v.mdMsgTheme)
				mdMsgTheme = v.mdMsgTheme;
			if (v.mdErrorTheme)
				mdErrorTheme = v.mdErrorTheme;
			if (v.fileScope)
				fileScope = v.fileScope;
		};
		this.$get = function() {
			return {
				mdMsgTheme : mdMsgTheme,
				mdErrorTheme : mdErrorTheme,
				fileScope : fileScope
			};
		}
	};
	var factoryController = function($injector) {
		factory.$injector = $injector;
		return factory;
	};
	var factoryRooterController = function($injector) {
		factoryRoot.$injector = $injector;
		return factoryRoot;
	};
	angular.module(moduleName, dependencies)
	.constant(STATICLINKSName, STATICLINKS)
	.provider(providerName, provider)
	.factory(factoryName, factoryController)
	.factory(factoryRooterName, factoryRooterController)
	;
})(); 