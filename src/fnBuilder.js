//dependencies
var vs = require('./variables');

//export module
module.exports = class fnBuilder {
    constructor() {
        this.vs = vs.vs;
    }

    addVariable(type, variable, val) {
        return this.vs.nl + this.vs.tab + type + ' ' + variable + ' = \'' + val.replace(',', ', ') + '\';';
    }

    addFunction(functionDetails, lines = []){
        return this.vs.nl + this.vs.tab + functionDetails + this.vs.nl + this.vs.tab + '{' + this.addLines(lines) + this.vs.tab + '}';
    }
    
    addLines(lines){
        var inline = this.vs.tab + this.vs.nl;
        if(lines.length >0){
            for(var i = 0; i < lines.length; i ++){
                inline +=  this.vs.tab.repeat(2) + lines[i] + this.vs.nl ;
            }
        }
        return inline;
    } 
};

