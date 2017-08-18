module.exports = function(grunt) {
    
    grunt.config.set('ngtemplates', {
        options: {
            htmlmin: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            },
            module: 'ngtemplates',
            standalone: true
        },
        run: {
            src: ['../angular/components/**/*Template.html'],
            dest: '../dist/ngtemplates.js'
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    
};