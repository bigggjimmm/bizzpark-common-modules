(function() {
	"use strict";
	/**
	 * author : JIMMY BAHOLE
	 */
	var bu2 = document.querySelector("script[src$='Module-Request.js']");
	var currentScriptPath = bu2.src; 
	var baseUrl = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
	var dependencies = ['AppConfigs','ngResource' ];
	var moduleName = 'BPRequestModule';  
	var factoryRequestName = 'reqFact';
	var factoryConnName = 'cnnFact';
	var providerName = 'requestPrv'; 
	var FactoryConn  = function($injector){
		 
		return {
			$injector : $injector,
			AUTHATTR : {
			requestType : undefined,
			applicationType : undefined,
			userAgent : undefined,
			localeId : undefined,
			lang : undefined,
			tzoffset : undefined,
			muk : undefined,
			id : undefined
		},
		
		init : function() {  
			 
			var $locale = this.$injector.get('$locale');
			var $filter = this.$injector.get('$filter');  
			var _this = this;
			// this.AUTHATTR.requestType = provider.requestType;
			// this.AUTHATTR.applicationType = provider.applicationType;

			
			this.AUTHATTR.userAgent = navigator.userAgent;
			this.AUTHATTR.localeId = $locale.id; 
			this.AUTHATTR.tzoffset = $filter('date')(new Date(), 'Z'); 
			this.preferedLangLoc((navigator.language || navigator.userLanguage), function(lang,localeId){
						_this.AUTHATTR.lang = lang;
						_this.AUTHATTR.localeId = localeId; 
					}); 
			 
			return this;
		},
		
		preferedLangLoc : function(lang,cb) {
			var Language = undefined,Locale = undefined;
			var APPLOCALES = this.$injector.get('APPLOCALES');
			var APPLANGUAGES = this.$injector.get('APPLANGUAGES');
			try {  
				var lang = navigator.language || navigator.userLanguage; 
				var regex = new RegExp('^' + lang, 'i');
				var l = 0;
				for (l = 0; l < APPLANGUAGES.length; l++) {
					if (angular.equals(lang, APPLANGUAGES[l]) || regex.test(APPLANGUAGES[l])) {
						Language = APPLANGUAGES[l];
						 
						break;
					}
				}
				for (l = 0; l < APPLOCALES.length; l++) {
					if (angular.equals(lang, APPLOCALES[l]) || regex.test(APPLOCALES[l])) {
						Locale = APPLOCALES[l];
						break;
					}
				}
				if (!Language) {
					Language = "fr-FR";
				} 
				if (!Locale) {
					Locale = "fr-fr";
				} 
				cb(Language,Locale);
			} catch (e) {
				console.log('catch : ', e);
			}
		}
	};}; 
	var FactoryRequest = function ($injector){
		return { 
		$injector : $injector,
		prefix : undefined,
		authData : undefined, 
		jsonprocess : 'jsonprocess',
		jsonkeyobject : 'jsonkeyobject',
		jsonmessage : 'jsonmessage',  
		jsonerror : 'jsonerror',
		jsonpolling : 'jsonpolling', 
	init : function() {
		return this;
	}, 
	/**
	 * used for get request, witch returns json format
	 */
	fetchG : function( url, getData) { 
		var _this = this;
		var $q = this.$injector.get('$q');
		var $http = this.$injector.get('$http');
		var $timeout = this.$injector.get('$timeout'); 
		var data = angular.extend({}, getData, this.authData);
		var _deferred = $q.defer();
		$timeout(function(){
			$http.get(_this.prefix+url, {
				params : data
			}).success(function(d, status, headers, config, statusText) {
				_deferred.resolve({
					d : d,
					status : status,
					headers : headers,
					config : config,
					statusText : statusText,
				});
			}).error(function(d, status, headers, config) {
				_deferred.reject({
					d : d,
					status : status,
					headers : headers,
					config : config,
				});
			});
		});
	
		return _deferred.promise;
	},
	/**
	 * used for post request, witch returns json format
	 */
	fetchP : function( url,  postData) { 
		var _this = this;
		var $q = this.$injector.get('$q');
		var $http = this.$injector.get('$http');
		var $timeout = this.$injector.get('$timeout'); 
		var data = angular.extend({}, postData, this.authData);
		var _deferred = $q.defer();
		var headers = {
			'headers' : {
				'Content-Type' : 'application/json'
			}
		}; 
		$timeout(function(){
			$http.post(_this.prefix+url , JSON.stringify(data), headers).success(function(d, status, headers, config, statusText) {
				_deferred.resolve({
					d : d,
					status : status,
					headers : headers,
					config : config,
					statusText : statusText,
				});
			}).error(function(d, status, headers, config) {
				_deferred.reject({
					d : d,
					status : status,
					headers : headers,
					config : config,
				});
			});
		}); 
		return _deferred.promise;
	},
	/**
	 * used for posting files on server, witch returns json format
	 */
	fetchMP : function( url, formData) {
		var _this = this; 
		var $q = this.$injector.get('$q');
		var $http = this.$injector.get('$http'); 
		var $timeout = this.$injector.get('$timeout'); 
		var _deferred = $q.defer();
		var headers = {
			'headers' : {
				'Content-Type' : undefined// 'multipart/form-data'//
			}
		}; 
		$timeout(function(){ 
			$http.post(_this.prefix+url, formData, {
				transformRequest : angular.identity,headers
				 
			}).success(function(d, status, headers, config, statusText) {
				_deferred.resolve({
					d : d,
					status : status,
					headers : headers,
					config : config,
					statusText : statusText,
				});
			}).error(function(d, status, headers, config) {
				var err = {};
				err.d = d;
				err.status = status;
				err.headers = headers;
				err.config = config;
				_deferred.reject(err);
			}); 
		});
		return _deferred.promise;
	},
	
	
	defFuncS : function(args){ 
		/**
		 * default success Function Process
		 */
		var obj= {
				object : undefined,
				errors : undefined,
				messages : undefined,
		}
		if (args && args.d) {
			 obj.messages = args.d[this.jsonmessage]; 
			if (args.d && angular.equals(args.d[this.jsonprocess], true)) {
				obj.object = args.d[this.jsonkeyobject];
			 
			}else if (angular.equals(args.d[this.jsonprocess], false)) {
				obj.errors = args.d[this.jsonerror]; 
			} 	
		 
	} 
		return obj;
	},

	 
	defFuncF : function(args){ 
		var provider = this.$injector.get(providerName);
		var obj= { 
				errors : provider.getdefaultUrlMsgs(), 
		}
		return obj;
	},
	 
};}; 

	
	
	var factoryRequestController = function($injector) { 
		return { 
		    get: function (prefix, authData ) {
		    	var newFactory = new FactoryRequest($injector);
		    	newFactory.init(); 
		    	newFactory['prefix'] = prefix,
		    	newFactory['authData'] = authData;
		    	return newFactory;
		    }
		}
	};
	var factoryCnnController = function($injector) { 
		return { 
		    get: function (authExtend ) { 
		    	var newFactory = new FactoryConn($injector);
		    	newFactory.init(); 
		    	angular.extend(newFactory.AUTHATTR,authExtend);
		    	return newFactory;
		    }
		}
	};
	angular.module(moduleName, dependencies)  
	.factory(factoryRequestName, ['$injector',factoryRequestController])
	.factory(factoryConnName, ['$injector',factoryCnnController]);
})();


/*
 * 
 * .provider(providerName, providerFunc) var providerFunc = function() { var
 * requestType ; var applicationType; var defaultUrlMsgs; var URL; var
 * URLSOCKET; this.setValues = function(v){ if(v.requestType) requestType =
 * v.requestType; if(v.applicationType) applicationType = v.applicationType;
 * if(v.defaultUrlMsgs) defaultUrlMsgs = v.defaultUrlMsgs; if(v.URL) URL =
 * v.URL; if(v.URLSOCKET) URLSOCKET = v.URLSOCKET; } this.$get = function () {
 * return { get_requestType: function() { return requestType; },
 * get_applicationType: function() { return applicationType; },
 * get_defaultUrlMsgs: function() { return defaultUrlMsgs; }, get_URL:
 * function() { console.log("get URL : ", URL ); return URL; }, get_URLSOCKET:
 * function() { return this.URLSOCKET; }} }; }
 */