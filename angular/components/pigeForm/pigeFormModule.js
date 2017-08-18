angular.module("pigeFormModule", [
    "dataServiceModule",
    "ui.bootstrap",
    "ui.select"
])
    
.controller("pigeFormController", function(
    $scope,
    $translate,
    dataService
) {
    
    this.$onInit = function() {

        // conjoints
        this.resetConjointsList();
        
    };

    this.trimCurrentUserName = function() {
        for (var key in this.currentUser.name) {
            if (this.currentUser.name[key]) {
                this.currentUser.name[key] = this.currentUser.name[key].trim();    
            }
        }
    };
    
    // updating current user data
    this.updateCurrentUserData = function() {
        
        this.trimCurrentUserName();
        
        // getting data related to the current user and his/her associated conjoint
        var guestData = dataService.getGuestDataFromName(this.currentUser.name.first, this.currentUser.name.last);
        var conjointData = dataService.getConjointDataFromName(this.currentUser.name.first, this.currentUser.name.last);

        // this user is already registered, we apply all previously saved information
        if (guestData) {
            this.currentUser.conjoint = guestData.conjoint;
            this.currentUser.isAdmin = guestData.isAdmin;            
        }
        
        // the name of this user is already associated with a guest, we display the name of the conjoint
        else if (conjointData) {
            this.currentUser.conjoint = conjointData.name.full;
        }
        
        // this user is not registered yet, we display default input values
        else if (!this.isEditUserActive()) {
            this.currentUser.conjoint = "";
            this.currentUser.isAdmin = false;
        }
        
    };
    
    // resetting list of conjoints
    this.resetConjointsList = function() {
        // getting full names of all guests with no associated conjoint
        this.conjoints = _.map(
            this.guests.filter(function(guest){
                return guest.conjoint === "";
            }),
            "name.full"
        );
        // removing name of current user
        this.conjoints.splice(this.conjoints.indexOf(this.currentUser.name.full), 0);
    };
    
    this.isEditUserActive = function() {
        return (this.mode.indexOf("/edit/") === 0);
    };
    
    this.hasNbAdminMaxBeingReached = function() {
        return (dataService.getNumberOfRegisteredAdmin() >= this.settings.nbAdminMax);
    };

    // conjoint ui-select
    
    // is disabled
    this.isConjointSelectorDisabled = function() {
        return !this.isEditUserActive() && dataService.isCurrentUserAlreadyRegistered(this.currentUser.name.first, this.currentUser.name.last);
    };
    
    // dynamic placeholder for conjoint ui-select
    this.getUISelectPlaceholder = function() {
        return (this.currentUser.conjoint !== null && this.currentUser.conjoint !== "")?
            this.currentUser.conjoint:
            $translate.instant("label.name.conjoint");
    };
    
    // refresh the list of conjoints
    this.refreshResults = function($select){
        var search = $select.search,
            list = angular.copy($select.items);
        if (!search) {
            $select.items = list;
        }
        else  {
            if (search.indexOf(list[0]) === 0) {
                $select.items = [search];
            }
            $select.selected = search;
        }
    };

    // admin checkbox
    
    this.isAdminCheckboxDisabled = function() {
        if (this.isEditUserActive()) {
            return this.hasNbAdminMaxBeingReached() && !this.currentUser.isAdmin;
        }
        else {
            return (this.hasNbAdminMaxBeingReached() || dataService.isCurrentUserAlreadyRegistered(
                this.currentUser.name.first, this.currentUser.name.last
            ));
        }
    };

})

/**
 * @ngdoc directive
 * @name braultPigeModule.directive:braultPige
 * @restrict E
 * @description
 * Webapp allowing Brault Grandpa to save some of his booze.
 */
.component('pigeForm', {
    templateUrl: './angular/components/pigeForm/pigeFormTemplate.html',
    controller: 'pigeFormController',
    controllerAs: '$pigeFormCtrl',
    bindings: {
        currentUser: "=",
        guests: "<",
        mode: "<",
        settings: "<"
    }
});