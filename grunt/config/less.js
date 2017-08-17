module.exports = function(grunt) {
    
    grunt.config.set('less', {
        development: {
            files: {
              "dist/concat.css": 'dist/temp-concat.less'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    
};  