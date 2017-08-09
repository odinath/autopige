module.exports = function(grunt) {
    
    grunt.config.set('less', {
        development: {
            files: [
                {
                    expand: true,
                    cwd: "../styling/less",
                    src: "styling.less",
                    dest: "grunt/dist",
                    ext: ".css"
                }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    
};