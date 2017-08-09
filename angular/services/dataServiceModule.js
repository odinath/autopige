(function(){
    
    "use strict";
    
    angular.module("dataServiceModule", [])

    .service('dataService', function() {
        
        // todo: make it an external json file read through BLOB + File
        var _initialSettings = {
             autoPige: false,
             nbAdminMax: 1,
             scheduleDate: ""
        };
        
        var _settings = {};
        
        var _currentUser = {
            conjoint: "",
            isAdmin: false,
            name: {
                first: "",
                full: "",
                last: "",
            },
            pigedGuest: ""
        };

        var _guests = [];
        
        /* -------------
        [ current user ]
        ------------- */
        
        this.getCurrentUser = function() {
            return _currentUser;
        };
        
        /* -------
        [ guests ]
        ------- */ 
        
        // add
        this.addGuest = function(currentUser) {
            _guests.push(currentUser);
            var conjointNameSplit = currentUser.conjoint.split(" ");
            var conjoint = this.getGuestDataFromName(conjointNameSplit[0], conjointNameSplit[1]);
            if (conjoint) {
                conjoint.conjoint = currentUser.name.first + " " + currentUser.name.last;
            }
        };
                
        this.updateGuest = function(initialCurrentUser, currentUser) {
          
            if (currentUser.conjoint === null) {
                currentUser.conjoint = "";
            }
            
            // replacing guest in guest list with new value
            _guests.splice(_.findIndex(_guests, initialCurrentUser), 1, currentUser);
            
            // updating any related guest association
            var associatedConjoint = this.getAssociatedConjoint(initialCurrentUser.name.first, initialCurrentUser.name.last);
            if (associatedConjoint) {
                associatedConjoint.conjoint = (currentUser.conjoint === "")? "" : currentUser.name.full;
            }

            // applying any newly affected guest association
            else if (currentUser.conjoint !== "") {
                var splitConjointName = currentUser.conjoint.split(" ");
                var conjoinedGuest = this.getGuestDataFromName(splitConjointName[0], splitConjointName[1]);
                if (conjoinedGuest) {
                    conjoinedGuest.conjoint = currentUser.name.full;
                }                           
            }

        };
        
        // remove
        this.removeGuest = function(currentUser) {
            // removing guest from guest list
            _guests.splice(_.findIndex(_guests, currentUser), 1);
            // removing any related conjoint association
            var associatedConjoint = this.getAssociatedConjoint(currentUser.name.first, currentUser.name.last);
            if (associatedConjoint) {
                associatedConjoint.conjoint = "";
            }
        };
        
        // get all guests
        this.getGuests = function() {
            return _guests;
        };

        // reset all
        this.resetGuests = function() {
            _guests = [];    
        };
        
        // get associated conjoint
        this.getAssociatedConjoint = function(first, last) {
            return _guests.find(function(guest){
                return (guest.conjoint === first + " " + last);
            }.bind(this));
        };
        
        // get guest from name
        this.getGuestDataFromName = function(first, last) {
            return _guests.find(function(guest){
                return (guest.name.full === first + " " + last);
            }.bind(this))
        };
        
        // get conjoint from name
        this.getConjointDataFromName = function(first, last) {
            return _guests.find(function(guest){
                return (guest.conjoint === first + " " + last);
            }.bind(this))
        };

        /* ---------
        [ settings ]
        --------- */
        
        // get
        this.getSettings = function() {
            return _settings;
        };
        
        // update
        this.updateSettings = function(updatedSettings) {
            _settings = updatedSettings;
        };
        
        // reset
        this.resetSettings = function() {
            _settings = angular.copy(_initialSettings);
        };
        
        /* ------
        [ admin ]
        ------ */
        
        this.getNumberOfAdmin = function() {
            return _guests.filter(function(guest){
                return guest.isAdmin;
            }).length;
        };
    
        /* --------
        [ session ]
        -------- */
        
        this.isCurrentUserAlreadyRegistered = function() {
            return this.guests.some(function(object){
                return (object.name.first === this.currentUser.name.first && object.name.last === this.currentUser.name.last);
            }.bind(this));
        };
        
    })
    
})();