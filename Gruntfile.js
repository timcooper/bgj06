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
			}
		},
		jshint: {
			files: ['src/*.js'],  //Just jshint on the files we create not libs
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['lib/phaser.min.js', 'src/min/*.js'],
				dest: 'game.js'
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
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'imagemin']);

};