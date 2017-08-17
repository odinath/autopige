angular.module("pigeSettingsModule", [
    "dataServiceModule",
    "ui.bootstrap",
    "ui.toggle"
])
    
.controller("pigeSettingsController", function(
    $scope,
    $translate,
    dataService
) {

    this.$onInit = function() {
        
        $(function () {
            $('#datetimepicker').datetimepicker({
                sideBySide: true,
                minDate: new Date()
            });
        });
        
    };
    
    this.openDateTimePicker = function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDateTimePickerOpen = true;
    };
    
    this.isDateTimePickerOpen = false;
    
})

/**
 * @ngdoc directive
 * @name braultPigeModule.directive:braultPige
 * @restrict E
 * @description
 * Webapp allowing Brault Grandpa to save some of his booze.
 */
.component('pigeSettings', {
    templateUrl: './angular/components/pigeSettings/pigeSettingsTemplate.html',
    controller: 'pigeSettingsController',
    controllerAs: '$pigeSettingsCtrl',
    bindings: {
        settings: "="
    }
});