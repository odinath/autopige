(function(){
    
    "use strict";
    
    angular.module("dataServiceModule", [])

    .service('dataService', function(
        $http,
        $q
    ) {
        
        /* ---------
        [ settings ]
        --------- */
        
        // initial

        var _settings = {};
        
        this.fetchSettings = function() {
            return $http.get('data/settings.json')
                .then(function onSuccess(response) {
                    $q.defer().resolve();    
                    return response.data;
                })
                .catch(function onError(response) {
                    console.log(response);
                });
        };

        this.resetSettings = function() {
            this.fetchSettings().then(function(settings){
                _settings = settings;
            });            
        };
        
        this.resetSettings();

        this.getSettings = function() {
            return _settings;
        };

        // current
        
        var _currentSettings = {};

        this.resetCurrentSettings = function() {
            _currentSettings = angular.copy(_settings);
        };

        this.resetCurrentSettings();

        this.getCurrentSettings = function() {
            return _settings;
        };
        
        // update
        this.updateCurrentSettings = function(updatedSettings) {
            _currentSettings = updatedSettings;
        };
        
        /* -------
        [ guests ]
        ------- */ 
        
        var _guests = [];
        
        this.fetchGuests = function() {
            return $http.get('data/guests.json')
                .then(function onSuccess(response) {
                    $q.defer().resolve();    
                    return response.data.guests;
                })
                .catch(function onError(response) {
                    console.log(response);
                });
        };

        this.fetchGuests().then(function(guests){
            _guests = guests;
        });

        // upload
//        this.uploadGuests = function() {
//        };
        
        // get all guests
        this.getGuests = function() {
            return _guests;
        };

        // reset
        this.resetGuests = function() {
            _guests = [];
//            this.uploadGuests();
        };        
        
        // add
        this.addGuest = function(currentUser) {
            _guests.push(currentUser);
            var conjointNameSplit = currentUser.conjoint.split(" ");
            var conjoint = this.getGuestDataFromName(conjointNameSplit[0], conjointNameSplit[1]);
            if (conjoint) {
                conjoint.conjoint = currentUser.name.first + " " + currentUser.name.last;
            }
        };

        // remove
        this.removeGuest = function(currentUser) {
            // removing guest from guest list
            var index = _.findIndex(_guests, currentUser);
            if (index !== -1) {
                _guests.splice(index, 1);    
            }
            // removing any related conjoint association
            var associatedConjoint = this.getAssociatedConjoint(currentUser.name.first, currentUser.name.last);
            if (associatedConjoint) {
                associatedConjoint.conjoint = "";
            }
        };

        // update
        this.updateGuest = function(initialCurrentUser, currentUser) {
          
            if (currentUser.conjoint === null) {
                currentUser.conjoint = "";
            }
            
            // replacing guest in guest list with new value
            var index = _.findIndex(_guests, initialCurrentUser);
            if (index !== -1) {
                _guests.splice(index, 1, currentUser);
            }
            
            // updating any related guest association
            var associatedConjoint = this.getAssociatedConjoint(initialCurrentUser.name.first, initialCurrentUser.name.last);
            if (associatedConjoint) {
                associatedConjoint.conjoint =
                    (currentUser.conjoint === "" || associatedConjoint.name.full !== currentUser.conjoint)?
                        "" :
                        currentUser.name.full;
            }
            else if (currentUser.conjoint !== "") {
                
                // reflecting guest association to the other conjoint
                var splitConjointName = currentUser.conjoint.split(" ");
                var conjoinedGuest = this.getGuestDataFromName(splitConjointName[0], splitConjointName[1]);
                if (conjoinedGuest) {
                    conjoinedGuest.conjoint = currentUser.name.full;
                }
                
            }

        };
        
        // apply guest selection
        this.applyGuestPige = function(currentUser, pigedGuestFullName) {
            var index = _.findIndex(_guests, currentUser);
            if (index !== -1) {
                _guests[index].pigedGuest = pigedGuestFullName;    
            }
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
            }.bind(this));
        };
        
        // get conjoint from name
        this.getConjointDataFromName = function(first, last) {
            return _guests.find(function(guest){
                return (guest.conjoint === first + " " + last);
            }.bind(this));
        };
        
        this.getNumberOfRegisteredAdmin = function() {
            return _guests.filter(function(guest){
                return guest.isAdmin;
            }).length;
        };


        /* -------------
        [ current user ]
        ------------- */

        this.fetchCurrentUser = function() {
            return $http.get('data/guests.json')
                .then(function onSuccess(response) {
                    $q.defer().resolve();    
                    return response.data.defaultUser;
                })
                .catch(function onError(response) {
                    console.log(response);
                });
        };
        
        this.getCurrentUser = function() {
            return this.fetchCurrentUser().then(function(data){
                return data;
            });
        };

        /* --------
        [ session ]
        -------- */
        
//        this.isCurrentUserAlreadyRegistered = function() {
//            return this.guests.some(function(object){
//                return (object.name.first === this.currentUser.name.first && object.name.last === this.currentUser.name.last);
//            }.bind(this));
//        };
        
        this.isCurrentUserAlreadyRegistered = function(first, last) {
            return _guests.some(function(object){
                return (object.name.first === first && object.name.last === last);
            }.bind(this));
        };
        
    });
    
})();