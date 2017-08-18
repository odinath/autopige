module.exports = function(grunt) {
    
    grunt.config.set("clean", {
        beforeBuild: {
            src: ["dist/*"]
        },
        afterBuild: {
            src: ["dist/temp-*"]
        },  
        
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    
};