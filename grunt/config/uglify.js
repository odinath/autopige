module.exports = function(grunt) {
    
    grunt.config.set("uglify", {
        files: {
            "dist/temp-concat.js": ["dist/temp-concat.js"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    
};