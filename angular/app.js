(function(){
    
    "use strict";

    angular.module("app", [
        "dataServiceModule",
        "ngRoute",
        "ngSanitize",
        "pascalprecht.translate",
        "pigeFormModule",
        "pigeSettingsModule",
        "smart-table"
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
            });
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
            this.initializeGuests();
            
            // current user
            this.resetBothCurrentUser();

            // set app to initial state
            this.onLogout();
            
        };
                
        this.areRequiredFieldsFilledIn = function() {
            return (
                (this.currentUser.name.first && this.currentUser.name.first !== "") &&
                (this.currentUser.name.last && this.currentUser.name.last !== "")
            );
        };
        
        this.isSignInDisabled = function() {
            return !this.areRequiredFieldsFilledIn() || !dataService.isCurrentUserAlreadyRegistered(
                this.currentUser.name.first, this.currentUser.name.last
            );
        };
        
        this.isSignUpDisabled = function() {
            return !this.areRequiredFieldsFilledIn() || dataService.isCurrentUserAlreadyRegistered(
                this.currentUser.name.first, this.currentUser.name.last
            );            
        };
                
        this.viewGuestIsDisplayed = function() {
            return $location.path().indexOf('/view') === 0;
        };
        
        /* -------------
        [ current user ]
        ------------- */

        this.resetCurrentUser = function() {
            dataService.getCurrentUser().then(function(currentUser){
                this.currentUser = currentUser;
            }.bind(this));
        };
        
        this.resetInitialCurrentUser = function() {
            this.initialCurrentUser = angular.copy(this.currentUser);
        };

        this.resetBothCurrentUser = function() {
            this.resetCurrentUser();
            this.resetInitialCurrentUser();
        };

        
        /* -------
        [ guests ]
        ------- */
        
        this.initializeGuests = function() {
            dataService.fetchGuests().then(function(guests){
                this.guests = angular.copy(guests);
            }.bind(this));            
        };
        
        this.setGuests = function() {
            this.guests = dataService.getGuests();
        };
        
        this.resetGuests = function() {
            dataService.resetGuests();
            this.setGuests();
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
            this.setGuests();
            this.resetInitialCurrentUser();
        };
        
        this.isSaveUserDisabled = function() {
            return (
                JSON.stringify(this.currentUser) === JSON.stringify(this.initialCurrentUser) ||
                !this.currentUser.name.first ||
                !this.currentUser.name.last ||
                (
                    dataService.getGuestDataFromName(this.currentUser.name.first, this.currentUser.name.last) &&
                    (
                        this.currentUser.conjoint === this.initialCurrentUser.conjoint &&
                        this.currentUser.isAdmin === this.initialCurrentUser.isAdmin
                    )
                )
            );
        };
        
        // session
        
        this.onLogout = function() {
            this.resetCurrentUser();
            this.setGuests();
            this.isUserLoggedIn = false;
            $location.path("default");
        };
        
        this.onSignUp = function() {
            // updating user name values
            this.currentUser.name.full = this.currentUser.name.first + " " + this.currentUser.name.last;
            for (var key in this.currentUser.name){
                this.currentUser.name[key] = this.currentUser.name[key].trim();
            }
            // adding user to dataService
            dataService.addGuest(angular.copy(this.currentUser));
//            this.guests.push(angular.copy(this.currentUser));
            // flagging the user as logged in
            this.isUserLoggedIn = true;
            // todo: tobe removed once file upload has been implemented
            this.setGuests();
            // displaying user view
            this.navigateToViewUser();
        };
        
        this.onSignIn = function() {
            // fetching all data related to registered user
            this.currentUser = dataService.getGuestDataFromName(this.currentUser.name.first, this.currentUser.name.last);
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
        
        this.triggerPigeByGuest = function(guest) {
            
            // getting list of all guests
            var potentialPicks = _.map(this.guests, 'name.full');

            // removing names of all previously picked guests
//            potentialPicks = _.difference(potentialPicks, _.map(this.guests, 'pigedGuest')).filter(function(pigedGuest){
//                return pigedGuest !== "";
//            });
            potentialPicks = _.difference(potentialPicks, _.map(this.guests, 'pigedGuest'));

            // removing name of current user (might have been removed already)
            var index = potentialPicks.indexOf(guest.name.full);
            if (index !== -1){
                potentialPicks.splice(index, 1);    
            }
            
            // removing name of associated conjoint (might be missing or removed already)
            index = potentialPicks.indexOf(guest.conjoint);
            if (index !== -1) {
                potentialPicks.splice(index, 1);    
            }
            
            // random selection of guest name
            var pigedGuestFullName = potentialPicks[Math.floor(Math.random() * potentialPicks.length)];

            // applying selection on stored data
            dataService.applyGuestPige(angular.copy(guest), pigedGuestFullName);
            this.setGuests();
            
            // updating current user data
            guest.pigedGuest = pigedGuestFullName;
            
        };
        
        this.onPigeGuest = function() {
            this.triggerPigeByGuest(this.currentUser);
        };
        
        this.onAutoPige = function() {
            
            this.resetPigedGuests();
            
            var getPigedGuestInList = function() {
                return _.map(this.guests, "pigedGuest");
            }.bind(this);
            
            var getConjointsStillInTheList = function(index) {

                // getting names of all remaining guests
                var guestsStillInTheList = this.guests.slice(0, i + 1);

                // removing names of guests already picked
                var namesOfGuestsStillInTheList = _.difference(_.map(guestsStillInTheList, "name.full"), getPigedGuestInList());

                // returning names of conjoints still in the list
                return _.intersection(namesOfGuestsStillInTheList, _.map(guestsStillInTheList, "conjoint"));   
            
            }.bind(this);
            
            // applying a selection to each guest
            for (var i = (this.guests.length - 1); i >= 0; i--) {
                
                // we want to avoid having conjoints as last two guests with no association
                if (i < 4 && getConjointsStillInTheList(i).length !== 0) {
                    this.guests[i].pigedGuest = getConjointsStillInTheList(i)[Math.floor(Math.random()) * (getConjointsStillInTheList(i).length - 1)];
                }
                // applying basic guest selection
                else {
                    this.triggerPigeByGuest(this.guests[i]);
                }
            }
            
        };
        
        this.onResetPige = function() {
            this.resetCurrentUser();
            this.resetGuests();
            this.resetCurrentSettings();
            this.setBothSettings();
            this.onLogout();
        };
        
        this.resetPigedGuests = function() {
            this.guests.forEach(function(guest){
                guest.pigedGuest = "";
            });
        };
        
        // settings

        this.onEditPigeSettings = function() {
            $location.path("settings");
        };

        
        this.setSettings = function() {
            dataService.fetchSettings().then(function(settings){
                this.settings = angular.copy(settings);
            }.bind(this));
        };
        
        this.setInitialSettings = function() {
            dataService.fetchSettings().then(function(settings){
                this.initialSettings = angular.copy(settings);
            }.bind(this));
        };

        // enforcing update of data-binding
        this.updateSettings = function() {
            this.settings = angular.copy(this.settings);
        };
        
        this.updateInitialSettings = function() {
            this.initialSettings = angular.copy(this.settings);
        };
        
        this.onSaveSettings = function() {
//            dataService.updateSettings(this.settings);
            this.updateInitialSettings();
        };

        this.isSaveSettingsDisabled = function() {
            return (JSON.stringify(this.settings) === JSON.stringify(this.initialSettings));
        };
        
        this.resetSettings = function() {
            dataService.resetCurrentSettings();
        };
        
        this.setBothSettings = function() {
            dataService.fetchSettings().then(function(settings){
                this.settings = angular.copy(settings);
                this.initialSettings = angular.copy(settings);
            }.bind(this));
        };
        
        // validation
        
        this.onCancel = function() {
            this.navigateToViewUser();
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