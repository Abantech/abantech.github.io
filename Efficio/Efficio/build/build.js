({
    baseUrl: "../src",
    name: "main",
    out: "../Output/min/Efficio.min.js",
	findNestedDependencies: true,
	paths: {
        'postal': 'empty:',
		'THREE': 'empty:',
		'leapjs': 'empty:',
		'annyang': 'empty:',
    },
    optimize: "none"
})