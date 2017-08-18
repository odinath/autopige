module.exports = function(grunt) {
    
    grunt.config.set("jshint", {
        options: {
            jshintrc: true,
            reporterOutput: ""
        },
        all: [
            "angular/components/**/*.js",
            "angular/services/**/*.js",
            "angular/app.js"
        ]
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    
};