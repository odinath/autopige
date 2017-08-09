(function () {
    "use strict";
    module.exports = function (grunt) {
        grunt.registerTask("build", [
            "clean:beforeBuild",
//            "ngtemplates",
//            "concat:js", "jsHint", "minifyJS",
            "concat:less", "lessHint", "less"
            "clean:afterBuild"
        ]);
    };
})();