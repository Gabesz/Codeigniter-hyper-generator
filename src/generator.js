var classBuilder = require('./classBuilder.js');

module.exports = class generator {
    
    constructor(answers){
        this.defaultModelName = answers[0];
        this.defaultControllerName = answers[1];
        this.defaultExtendedController = answers[2];
        this.path = answers[3] == '' ? '/' : answers[3] + '/';
        this.crudRead = answers[4] == 'yes';
        this.crudCreate = answers[5] == 'yes';
        this.crudUpdate = answers[6] == 'yes';
        this.crudDelete = answers[7] == 'yes';
    }

    generate(){
        var classDefinition = 'class ' + this.defaultControllerName + ' extends ' + this.defaultExtendedController + ' { 	';
        var classBuilderInstance = new classBuilder(classDefinition, '<?php', '?>');
    
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
}