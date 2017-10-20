//export variables
exports.vs = {
	nl: "\n",
	tab : "\t",
	outputPath : 'output',
	answers : [],
	questions : [
		'Model name? (PascalCase convention ex.: BlogModel) enter -> BlogModel',
		'Extended model name? (PascalCase convention ex.: MY_Model) enter -> MY_Model',
		'Controller name? (PascalCase convention ex.: BlogController) enter -> BlogController',
		'Extended controller name? (PascalCase convention ex.: MY_Controller) enter -> MY_Controller',
		'Path for views? (Use relative path from view folder ex.: admin/blog) enter -> admin/blog',
		'Add Read to CRUD operations? enter -> yes',
		'Add Create to CRUD operations? enter -> yes',
		'Add Update to CRUD operations? enter -> yes',
		'Add Delete to CRUD operations? enter -> yes',
		'Database table name? enter -> blog',
		'Database table fields name? (id -> automatic) enter -> name,slug,created_at',
	],
	index : 0
};