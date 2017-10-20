/**
 * todo list
 * create classBuilder
 * create fileExporter
 */

//dependencies
var comment = require('./src/comment.js'),
	fnBuilder = require('./src/fnBuilder'),
	readlineSync = require('readline-sync'),
	fs = require('fs'),
	filter = require('filter-object'),
	vs = require('./src/variables');

//build some instance
var commentInstance = new comment();
var fnBuilderInstance = new fnBuilder();

//global variables
var nl = vs.vs.nl,
	tab = vs.vs.tab,
	outputPath = vs.vs.outputPath,
	answers = vs.vs.answers,
	questions = vs.vs.questions,
	index = vs.vs.index;

function setQuestion(index) {
	if(questions[index] != undefined){
		answers[index] = readlineSync.question(questions[index] + ' ');
		if(answers[index] == ''){
			var q = questions[index].split(" ");
			answers[index] = q[q.length-1];	
		}
		if(index > 3){
			answers[index] = answers[index] == 'yes' ? true : false;
		}
		index++;
		setQuestion(index);
	}else{
		generateFile(answers[1], outputPath + '/controller');
	}	
}

function generateFile(fileName, filePath){

	if (!fs.existsSync(filePath)){
		fs.mkdirSync(filePath);
	}
	var file = filePath + '/' + fileName + '.php'
	var stream = fs.createWriteStream(file);
		stream.once('open', function(fd) {
		  stream.write(results());
		  stream.end();
		  console.log(file + ' successfully generated!');
		  process.exit(0);
		});
}

function results(){

	var ret = [];
	var path = answers[3] == '' ? '' : answers[3] + '/';
	var defaultExtendedController = answers[2];
	var defaultModelName = answers[0];
	var defaultControllerName = answers[1];
	var crudRead = answers[4];
	var crudCreate = answers[5];
	var crudUpdate = answers[6];
	var crudDelete = answers[7];

	ret.push('<?php ' + nl);
	ret.push('class ' + defaultControllerName + ' extends ' + defaultExtendedController + ' { 	');

	ret.push(buildMethod(
		commentInstance.getMethodComment('constructor'),
		fnBuilderInstance.addFunction(
			'public function __construct()', 
			['parent::__construct();', 
			'$this->load->model(\'' + defaultModelName + '\');']
		)
	));

	var methodName = 'index';
	ret.push(buildMethod(
		commentInstance.getMethodComment(methodName), 
		fnBuilderInstance.addFunction(
			'public function ' + methodName + '()', 
			['$data = array();', 
			'$data[\'list\'] = $this->' + defaultModelName + '->get();',
			'$this->load->view(\'' + path + 'index\', $data);']
		)
	));

	if(crudRead){
		methodName = 'view';
		ret.push(buildMethod(
			commentInstance.getMethodComment(methodName), 
			fnBuilderInstance.addFunction(
				'public function ' + methodName + '($id)', 
				['$data = array();',
				'$data[\'list\'] = $this->' + defaultModelName + '->get($id);',
				'$this->load->view(\'' + path + methodName + '\', $data);']
				)
		));
	}

	if(crudCreate){
		methodName = 'create';
		ret.push(buildMethod(
			commentInstance.getMethodComment(methodName), 
			fnBuilderInstance.addFunction(
				'public function ' + methodName + '()', 
				['$this->load->view(\'' + path + methodName + '\');']
			)
		));
		methodName = 'store';
		ret.push(buildMethod(
			commentInstance.getMethodComment(methodName), 
			fnBuilderInstance.addFunction(
				'public function ' + methodName + '()', 
				['$object = array();',
				'$this->' + defaultModelName + '->save($object);',
				'$this->session->set_flashdata(\'info\', \'Successfully Saved!\');',
				'return redirect(\''+ path + 'create\');']
			)
		));
	}	

	if(crudUpdate){
		methodName = 'edit';
		ret.push(buildMethod(
			commentInstance.getMethodComment(methodName), 
			fnBuilderInstance.addFunction(
				'public function ' + methodName + '($id)', 
				['$data["item"] =  $this->' + defaultModelName + '->get(array("id" => $id));',
				'$this->load->view(\'' + path + methodName + '\', $data);']
			)
		));
		methodName = 'update';
		ret.push(buildMethod(
			commentInstance.getMethodComment('update'), 
			fnBuilderInstance.addFunction(
				'public function update($id)', 
				['$object = array();',
				'$this->' + defaultModelName + '->update($object, $id);',
				'$this->load->view(\'' + path + 'update\');']
			)
		));
	}

	if(crudDelete){
		methodName = 'destroy';
		ret.push(buildMethod(
			commentInstance.getMethodComment(methodName), 
			fnBuilderInstance.addFunction(
				'public function ' + methodName + '($id)', 
				['$this->' + defaultModelName + '->' + methodName + '($id);',
				'$this->session->set_flashdata(\'info\', \'Successfully Deleted!\');',
				'return redirect(\''+ path + 'index\');']
			)
		));
	}

	ret.push(nl + '}');
	ret.push(nl + '?>');
	
	return ret.join('');
}

function buildMethod(comment, method){
	return comment + method;
}

setQuestion(index);
