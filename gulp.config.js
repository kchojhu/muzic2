module.exports = function() {
	var resourceDir = 'src/main/resources/webapp';
	var appDir = resourceDir + "/app";
	var jsFiles = appDir + "/**/*.js";
	var indexFile = resourceDir + "/index.html";
	
	
//    this.source = './src/';
//    this.sourceApp = this.source + 'app/';
//
//    this.tsOutputPath = this.source + '/js';
//    this.allJavaScript = [this.source + '/js/**/*.js'];
//    this.allTypeScript = this.sourceApp + '/**/*.ts';
//
//    this.typings = './tools/typings/';
//    this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
	
	
	var config = {
			appDir : appDir,
			jsFiles: jsFiles,
			indexFile: indexFile
	};
	
	
	
	return config;
};