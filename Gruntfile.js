module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			build: {
				files: [
					{
						expand: true,     // Enable dynamic expansion.
						cwd: 'src',
						src: ['*.js'], // Actual pattern(s) to match.
						dest: 'src/min',   // Destination path prefix.
					},
				]
			},
			libs: {
				files: [
					{
						expand: true,     // Enable dynamic expansion.
						cwd: 'phaser',
						src: ['*.js'], // Actual pattern(s) to match.
						dest: 'phaser/min',   // Destination path prefix.
					},
				]
			},
			modules: {
				files: {}
			}
		},
		jshint: {
			files: ['src'],  //Just jshint on the files we create not libs
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
					expand: true,
					cwd: 'assets/img',
					src: ['*.png'],
					dest: 'assets/img/',
					ext: '.png'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['jshint', 'uglify', 'imagemin']);

};