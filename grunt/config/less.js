module.exports = function(grunt) {
    
    grunt.config.set('less', {
        development: {
            files: {
              "dist/concat.css": 'styling/less/styling.less'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    
};  