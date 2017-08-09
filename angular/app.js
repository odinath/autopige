(function(){
    
    "use strict";

    angular.module("app", [
        "dataServiceModule",
        "ngRoute",
        "ngSanitize",
        "pascalprecht.translate",
        "pigeFormModule",
        "pigeSettingsModule"
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
            .when('/settings', {
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
          $routeParams,
         $sanitize,
         $translate,
         dataService
    ){
        
        this.$onInit = function() {
                                    
            // settings
            this.resetSettings();
            this.setBothSettings();
            
            // guests
            this.setGuests();

            // set app to initial state
            this.onLogout();
            
            console.log($routeParams);
            
        };
        
        this.isCurrentUserAlreadyRegistered = function() {
            return this.guests.some(function(object){
                return (object.name.first === this.currentUser.name.first && object.name.last === this.currentUser.name.last);
            }.bind(this));
        };        
        
        this.areRequiredFieldsFilledIn = function() {
            return (
                this.currentUser.name.first !== "" &&
                this.currentUser.name.last !== ""
            );
        };
        
        this.isSignInDisabled = function() {
            return (!this.currentUser.name.first || !this.currentUser.name.last) || this.isCurrentUserAlreadyRegistered();
        };
        
        this.isSignUpDisabled = function() {
            return (!this.currentUser.name.first || !this.currentUser.name.last) || this.isCurrentUserAlreadyRegistered();
        };
                
        this.viewGuestIsDisplayed = function() {
            return $location.path().indexOf('/view') === 0;
        };
        
        /* -------------
        [ current user ]
        ------------- */

        this.resetCurrentUser = function() {
            this.currentUser = angular.copy(dataService.getCurrentUser());
        };
        
        this.resetInitialCurrentUser = function() {
            this.initialCurrentUser = angular.copy(this.currentUser);
        };
        
        /* -------
        [ guests ]
        ------- */
        
        this.setGuests = function() {
            this.guests = dataService.getGuests();
        };
        
        this.resetGuests = function() {
            dataService.resetGuests();
            this.guests = dataService.getGuests();
        };
        
        /* ----------------
        [ button handling ]
        ---------------- */
        
        // guest
        
        this.onEditGuest = function() {
            this.navigateToEditUser();
        };
        
        this.onRemoveGuest = function() {
            dataService.removeGuest(angular.copy(this.currentUser));
            this.onLogout();
        };
        
        this.onSaveUser = function() {
            this.currentUser.name.full = this.currentUser.name.first + " " + this.currentUser.name.last;
            dataService.updateGuest(this.initialCurrentUser, angular.copy(this.currentUser));
            this.resetInitialCurrentUser();
        };
        
        this.isSaveUserDisabled = function() {
            return (JSON.stringify(this.currentUser) === JSON.stringify(this.initialCurrentUser));
        };
        
        // session
        
        this.onLogout = function() {
            this.resetCurrentUser();
            this.setGuests();
            this.isUserLoggedIn = false;
            this.isPigeStarted = false;
            $location.path("default");
        };
        
        this.onSignIn = function() {
            // updating user name values
            this.currentUser.name.full = this.currentUser.name.first + ' ' + this.currentUser.name.last;
            for (var key in this.currentUser.name){
                this.currentUser.name[key] = this.currentUser.name[key].trim();
            };
            // adding user to dataService
            dataService.addGuest(angular.copy(this.currentUser));
            // flagging the user as logged in
            this.isUserLoggedIn = true;
            // displaying user view
            this.navigateToViewUser();
        };
        
        this.onSignUp = function() {
            this.currentUser.name.full = this.currentUser.name.first + ' ' + this.currentUser.name.last;
            this.isUserLoggedIn = true;
            this.navigateToViewUser();
        };
        
        this.onSwitchLanguage = function() {
            $translate.use(($translate.use() === "fr_CA")? "en_US": "fr_CA");
        };
        
        this.getViewMode = function() {
          return $location.path();  
        };
        
        this.isEditUserActive = function() {
            return (this.getViewMode().indexOf("/edit/") === 0);
        };
        
        this.isEditSettingsActive = function() {
            return (this.getViewMode().indexOf("/settings") === 0);
        };
        
        // pige
        
        this.onPigeGuest = function() {
            console.log("pige guest");
        };
        
        this.onAutoPige = function() {
            console.log("auto pige");
        };
        
        this.onResetPige = function() {
            this.resetCurrentUser();
            this.resetGuests();
            this.resetSettings();
            this.setBothSettings();
            this.onLogout();
        };
        
        // settings

        this.onEditPigeSettings = function() {
            $location.path("settings");
        };

        
        this.setSettings = function() {
            this.settings = angular.copy(dataService.getSettings());
        };
        
        this.setInitialSettings = function() {
            this.initialSettings = angular.copy(dataService.getSettings());
        };
        
        this.onSaveSettings = function() {
            dataService.updateSettings(this.settings);
            this.setInitialSettings();
        };

        this.isSaveSettingsDisabled = function() {
            return (JSON.stringify(this.settings) === JSON.stringify(this.initialSettings));
        };
        
        this.resetSettings = function() {
            dataService.resetSettings();
        };
        
        this.setBothSettings = function() {
            this.setSettings();
            this.setInitialSettings();
        };
        
        // validation
        
        this.onCancel = function() {
            this.navigateToViewUser();
        };

        this.onUpdate = function() {
            console.log("update");
        };
        
        // navigate
        
        this.navigateToViewUser = function() {
            $location.path("/view/" + this.currentUser.name.full);
        };
        
        this.navigateToEditUser = function() {
            this.resetInitialCurrentUser();
            $location.path("/edit/" + this.currentUser.name.full);
        };

        this.navigateToEditSettings = function() {
            $location.path("/settings");
        };

        
    });
    
})();