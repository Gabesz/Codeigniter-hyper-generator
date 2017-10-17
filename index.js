let readlineSync = require('readline-sync');
let fs = require('fs');
let nl = '\n';
let dnl = '\n\n';
let tab = '\t'
let dtab = '\t\t'
let resourcePath = 'resource'

let answers = [];
let questions = [
	'Model name? (PascalCase convention ex.: BlogModel) enter -> BlogModel',
	'Controller name? (PascalCase convention ex.: BlogController) enter -> BlogController',
	'Extended controller name? (PascalCase convention ex.: MY_Controller) enter -> MY_Controller',
	'Route? (lowercase convention ex.: admin/blog) enter -> admin/blog',
	'Path for views? (Use relative path from view folder ex.: admin/blog) enter -> admin/blog',
	'Add Read to CRUD operations? enter -> yes',
	'Add Create to CRUD operations? enter -> yes',
	'Add Update to CRUD operations? enter -> yes',
	'Add Delete to CRUD operations? enter -> yes',
];
let index = 0;

function setQuestion(index){
	if(questions[index] != undefined){
		answers[index] = readlineSync.question(questions[index] + ' ');
		if(answers[index] == ''){
			let q = questions[index].split(" ");
			answers[index] = q[q.length -1];	
		}
		if(index > 4){
				answers[index] = answers[index] == 'yes' ? true : false;
		}
		index++;
		setQuestion(index);
	}else{
		generateFile();
	}	
}

function generateFile(){
	let fileContent = results();
	let file = resourcePath + '/' + answers[1] + '.php'
	let stream = fs.createWriteStream(file);
		stream.once('open', function(fd) {
		  stream.write(fileContent);
		  stream.end();
		  console.log(file + ' successfully generated!')
		  process.exit(0)
		});
}

function results(){
	let ret = [];
	let path = answers[4] == '' ? '' : answers[4] + '/';
	let route = answers[3] == '' ? '' : answers[3] + '/';
	let defaultExtendedController = answers[2];
	let defaultModelName = answers[0];
	let defaultControllerName = answers[1];
	let crudRead = answers[5]  ;
	let crudCreate = answers[6];
	let crudUpdate = answers[7];
	let crudDelete = answers[8];

	ret.push('<?php ' + nl);
	ret.push('class ' + defaultControllerName + ' extends ' + defaultExtendedController + ' { 	');

	ret.push(buildMethod('constructor function', 'public function __construct()', 
		['parent::__construct();', 
		'$this->load->model(\'' + defaultModelName + '\');'
		])
	);

	ret.push(buildMethod('index function', 'public function index()', 
		['$data = array();', 
		'$data[\'list\'] = $this->' + defaultModelName + '->get();',
		'$this->load->view(\'' + path + 'index\', $data);'
		])
	);

	if(crudRead){
		ret.push(buildMethod('view function', 'public function view($id)', 
			['$data = array();',
			'$data[\'list\'] = $this->' + defaultModelName + '->get($id);',
			'$this->load->view(\'' + path + 'view\', $data);'
			])
		);
	}

	if(crudCreate){
		ret.push(buildMethod('create function', 'public function create()', ['$this->load->view(\'' + path + 'create\');']));

		ret.push(buildMethod('store function', 'public function store()', 
			['$object = array();',
			'$this->' + defaultModelName + '->save($object);',
			'$this->session->set_flashdata(\'info\', \'Successfully Saved!\');',
			'return redirect(\''+ route + 'create\');'
			])
		);
	}	

	if(crudUpdate){
		ret.push(buildMethod('edit function', 'public function edit($id)', ['$this->load->view(\'' + path + 'edit\');']));
		ret.push(buildMethod('update function', 'public function update($id)', 
			['$object = array();',
			'$this->' + defaultModelName + '->update($object, $id);',
			'$this->load->view(\'' + path + 'update\');'])
		);
	}

	if(crudDelete){
		ret.push(buildMethod('destroy function', 'public function destroy($id)', 
			['$this->' + defaultModelName + '->destroy($id);',
			'$this->load->view(\'' + path + 'destroy\');'])
		);
	}

	ret.push(nl + '}');
	ret.push(nl + '?>');
	
	return ret.join('');
}

function addComment(comment){
	let ret = '';
	ret += dnl + tab +'/*';
	ret += nl + tab + '*  ' + comment;
	ret += nl + tab +'*/';
	return ret;
}

function addFunction(functionDetails, lines = []){
	return nl + tab + functionDetails + nl + tab + '{' + addLines(lines) + tab + '}';
}

function addLines(lines){
	let inline = tab + nl;
	if(lines.length >0){
		for(let i = 0; i < lines.length; i ++){
			inline +=  dtab + lines[i] + nl ;
		}
	}
	return inline;
}

function buildMethod(comment, method, lines = []){
	return addComment(comment) + addFunction(method, lines);
}

setQuestion(index);