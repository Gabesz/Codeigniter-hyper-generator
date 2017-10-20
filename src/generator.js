//dependencies
var classBuilder = require('./classBuilder.js');

//export module
module.exports = class generator {
    constructor(answers, vs){
        this.vs = vs;
        this.defaultModelName = answers[0];
        this.defaultExtendedModel = answers[1];
        this.defaultControllerName = answers[2];
        this.defaultExtendedController = answers[3];
        this.path = answers[4] == '' ? '/' : answers[4] + '/';
        this.crudRead = answers[5] == 'yes';
        this.crudCreate = answers[6] == 'yes';
        this.crudUpdate = answers[7] == 'yes';
        this.crudDelete = answers[8] == 'yes';
        this.table_name = answers[9];
        this.table_fields = answers[10];
    }

    generateController(){
        var classDefinition = 'class ' + this.defaultControllerName + ' extends ' + this.defaultExtendedController + ' {';
        var classBuilderInstance = new classBuilder(classDefinition, '<?php defined(\'BASEPATH\') OR exit(\'No direct script access allowed\');' + this.vs.nl, '} '+ this.vs.nl + '?>');
    
        classBuilderInstance.addMethod('constructor', 'public function __construct()', [
            'parent::__construct();', 
            '$this->load->model(\'' + this.defaultModelName + '\');'
        ]);
    
        var methodName = 'index';
        classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '()', [
            '$data = array();', 
            '$data[\'list\'] = $this->' + this.defaultModelName + '->get();',
            '$this->load->view(\'' + this.path + 'index\', $data);'
        ]);
    
        if(this.crudRead){
            methodName = 'view';
            classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '($id)', [
                '$data = array();',
                '$data[\'list\'] = $this->' + this.defaultModelName + '->get($id);',
                '$this->load->view(\'' + this.path + this.methodName + '\', $data);'
            ]);
        }
    
        if(this.crudCreate){
            methodName = 'create';
            classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '()', [
                '$this->load->view(\'' + this.path + methodName + '\');'
            ]);
            
            methodName = 'store';
            classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '()', [
                '$object = array();',
                '$this->' + this.defaultModelName + '->save($object);',
                '$this->session->set_flashdata(\'info\', \'Successfully Saved!\');',
                'return redirect(\''+ this.path + 'create\');'
            ]);
        }	
    
        if(this.crudUpdate){
            methodName = 'edit';
            classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '($id)', [
                '$data["item"] =  $this->' + this.defaultModelName + '->get(array("id" => $id));',
                '$this->load->view(\'' + this.path + methodName + '\', $data);'
            ]);
            
            methodName = 'update';
            classBuilderInstance.addMethod('update', 'public function update($id)', [
                '$object = array();',
                '$this->' + this.defaultModelName + '->update($object, $id);',
                '$this->load->view(\'' + this.path + 'update\');'
            ]);
        }
    
        if(this.crudDelete){
            methodName = 'destroy';
            classBuilderInstance.addMethod(methodName, 'public function ' + methodName + '($id)', [
                '$this->' + this.defaultModelName + '->' + methodName + '($id);',
                '$this->session->set_flashdata(\'info\', \'Successfully Deleted!\');',
                'return redirect(\''+ this.path + 'index\');'
            ]);
        }
        
        return classBuilderInstance.getClassSourceString();
    }

    generateModel(){
        var classDefinition = 'class ' + this.defaultModelName + ' extends ' + this.defaultExtendedModel + ' {';
        var classBuilderInstance = new classBuilder(classDefinition, '<?php defined(\'BASEPATH\') OR exit(\'No direct script access allowed\');' + this.vs.nl, '} '+ this.vs.nl + '?>');
        
        classBuilderInstance.addVariable('String', '$_table_name', 'Database table name.', this.table_name );

        classBuilderInstance.addVariable('String', '$_table_fields', 'Database table fields.', this.table_fields );
        
        classBuilderInstance.addMethod('constructor', 'public function __construct()', [
            'parent::__construct();'
        ]);
        return classBuilderInstance.getClassSourceString();
    }
}