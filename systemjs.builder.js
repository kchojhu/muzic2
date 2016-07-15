var path = require('path');
var Builder = require('systemjs-builder');
var del = require('del');

var webapp = './src/main/webapp/';
var builder = new Builder(webapp +'dist', webapp + 'systemjs.config.js');

builder.bundle(webapp + 'dist/app/main', webapp + 'dist/app/main.js', { minify: true, encodeNames: false })
    .then(function() {
        del([webapp + 'dist/app/**/*.js', '!' + webapp + 'dist/app/main.js']).then(function(paths) {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    })
    .catch(function(err) {
        console.log('Build error!');
        console.log(err);
    });