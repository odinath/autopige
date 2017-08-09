module.exports = function(grunt) {
    
    grunt.config.set("clean", {
        beforeBuild: {
            src: ["grunt/dist/*"]
        },
        afterBuild: {
            src: ["grunt/dist/temp-*.js"]
        },
        
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    
};