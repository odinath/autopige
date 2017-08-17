module.exports = function(grunt) {
    
    grunt.config.set("concat", {

        css: {
            src: [
                "node_modules/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.css",
                "node_modules/bootstrap/dist/css/bootstrap.min.css",
                "node_modules/bootstrap-table/dist/bootstrap-table.min.css",
                "node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
                "node_modules/ui-select/dist/select.min.css",
                "dist/concat.css"
            ],
            dest: "dist/concat.css"
        },

        js: {
            src: [
                "node_modules/jquery/dist/jquery.min.js",
                "node_modules/moment/min/moment.min.js",
                "node_modules/angular/angular.min.js",
                "node_modules/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.js",
                "node_modules/angular-route/angular-route.min.js",
                "node_modules/angular-sanitize/angular-sanitize.min.js",
                "node_modules/angular-translate/dist/angular-translate.min.js",
                "node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
                "node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
                "node_modules/bootstrap-table/dist/bootstrap-table.min.js",
                "node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
                "node_modules/lodash/lodash.min.js",
                "node_modules/ui-select/dist/select.min.js",
                "angular/components/pigeForm/pigeFormModule.js",
                "angular/components/pigeSettings/pigeSettingsModule.js",
                "angular/services/dataServiceModule.js",
                "angular/app.js"
            ],
            dest: 'dist/concat.js'
        },        

        
        less: {
            src: [
                "styling/less/palette.less",
                "styling/less/styling.less"
            ],
            dest: "dist/temp-concat.less"
        }
        
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    
};