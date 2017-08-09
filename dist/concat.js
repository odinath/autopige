(function(){
    
    "use strict";

    angular.module("app", [
        "dataServiceModule",
        "ngRoute",
        "pascalprecht.translate"
    ])

    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('');
    }])    
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: "angular/views/default.html"
            })
            .when('/view/:guestname', {
                templateUrl: "angular/views/viewGuest.html"
            })
            .when('/edit/:guestname', {
                templateUrl: "angular/views/editGuest.html"
            })
            .when('/edit/settings', {
                templateUrl: "angular/views/editSettings.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    }])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/i18n-',
            suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider.preferredLanguage('en_US');
    }])    

    .controller("appController", function(
         $location,
         $translate,
         dataService
    ){
        
        this.$onInit = function() {
            console.log("appController init");
            this.message = dataService.getMessage();
        };
        
        this.onEditGuest = function() {
            console.log("edit guest");
//            $location.path("/edit/" + this.user.fullName);
        };
        
        this.onLogout = function() {
            console.log("logout");
        };
        
        this.onSignIn = function() {
            console.log("sign in");
        };
        
        this.onSignUp = function() {
            console.log("sign up");
        };
        
        this.onPigeGuest = function() {
            console.log("pige guest");
        };
        
        this.onAutoPige = function() {
            console.log("auto pige");
        };
        
        this.onEditPigeSettings = function() {
            console.log("edit pige settings");
        };
        
        this.onCancel = function() {
            console.log("cancel");
        };

        this.onUpdate = function() {
            console.log("update");
        };
        
        this.onSwitchLanguage = function() {
            $translate.use(($translate.use() === "fr_CA")? "en_US": "fr_CA");
        };
        
//        this.navigateToGuest = function() {
//            $location.path("/guest/" + this.guestname);        
//        };
        
    });
    
})();