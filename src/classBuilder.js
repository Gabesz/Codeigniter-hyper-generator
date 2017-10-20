//dependencies
var vs = require('./variables'),
    comment = require('./comment.js'),
    classBuilder =  require('./classBuilder.js'),
    fnBuilder = require('./fnBuilder');

//export module
module.exports = class classBuilder {
    constructor(classDefinition, openTag, closeTag){
        this.nl = vs.vs.nl;
        this.tab = vs.vs.tab;

        this.classDefinition = classDefinition;
        this.openTag = openTag + this.nl;
        this.closeTag = this.nl + closeTag;
        this.classSource = [];

        this.commentInstance = new comment();
        this.fnBuilderInstance = new fnBuilder();
    }

    addMethod(commentData, methodData, methodLines){
        var comment = this.commentInstance.getMethodComment(commentData);   
		var method = this.fnBuilderInstance.addFunction(methodData, methodLines);
        this.classSource.push(comment + method);
    }

    getClassSourceString(){
        return this.openTag + this.classDefinition + this.classSource.join("") + this.closeTag;
    }
};