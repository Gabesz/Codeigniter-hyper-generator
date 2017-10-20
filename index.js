/**
 * todo list
 * create modelBuilder
 * create viewBuilder
 */

//dependencies
var classBuilder = require('./src/classBuilder.js'),
	generator = require('./src/generator.js'),
	fileExporter = require('./src/fileExporter.js'),
	readlineSync = require('readline-sync'),
	vs = require('./src/variables');

//global variables
var outputPath = vs.vs.outputPath,
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
		index++;
		setQuestion(index);
	}else{
		var results = new generator(answers);
		new fileExporter(answers[1], outputPath + '/controller', results.generate());
	}	
}

setQuestion(index);
