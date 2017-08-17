(function () {
    "use strict";
    module.exports = function (grunt) {
        grunt.registerTask("build", [
            "clean:beforeBuild",
            "jshint",
            "concat:js",
//            "uglify",
//            "lessHint",
            "concat:less",
            "less",
            "concat:css",
//            "minify",
//            "ngtemplates",
            "clean:afterBuild",
//            "ngdocs"
            
        ]);
    };
})();