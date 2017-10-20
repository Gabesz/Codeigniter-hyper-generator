//dependencies
var filter = require('filter-object');
var vs = require('./variables');

module.exports = class comment {

	constructor(commentData){
		this.commentData = {
			name 		: '[name]',
			description	: '[description]',
			param		: '[param]',
			return		: '[type]'
		};
		this.vs = vs.vs;
		this.data = {};
	}

	getMethodComment(type){
		this.setType(type);
		var tabWidth = 1;
		var ret = '';
		ret += this.vs.nl.repeat(2) + this.vs.tab.repeat(tabWidth) + '/**';
		for(var i in this.data){
			ret += this.vs.nl + this.vs.tab.repeat(tabWidth) + '* @' + i + ' ' + this.data[i];
			if(i == 'description'){
				ret += this.vs.nl + this.vs.tab.repeat(tabWidth) + '*';
			}
		}
		ret += this.vs.nl + this.vs.tab.repeat(tabWidth) + '*/';
		return ret;
	}

	setType(type){
		var c = {};
		switch(type){
			case 'constructor':
				c = filter(this.commentData, ['!param']);
				c.name = 'Constructor method.';
				c.description = 'Load dependencies.';
				c.return = 'void';
				break;

			case 'index':
				c = filter(this.commentData, ['!param']);
				c.name = 'Index method.';
				c.description = 'Show all item from model.';
				c.return = 'void';
				break;

			case 'view':
				c = this.commentData;
				c.name = 'View method.';
				c.description = 'View item by index.';
				c.param = 'int $id';
				c.return = 'void';
				break;

			case 'create':
				c = filter(this.commentData, ['!param']);
				c.name = 'Create method.';
				c.description = 'Show create form.';
				c.return = 'void';
				break;

			case 'edit':
				c = this.commentData;
				c.name = 'Edit method.';
				c.description = 'Show edit form for seleted item.';
				c.param = 'int $id';
				c.return = 'void';
				break;

			case 'update':
				c = this.commentData;
				c.name = 'Update method.';
				c.description = 'Update the seleted item by id.';
				c.param = 'int $id';
				c.return = 'void';
				break;

			case 'destroy':
				c = this.commentData;
				c.name = 'Destroy method.';
				c.description = 'Destroy the seleted item by id.';
				c.param = 'int $id';
				c.return = 'void';
				break;

			case 'store':
				c = filter(this.commentData, ['!param']);
				c.name = 'Store method.';
				c.description = 'Store new item in database.';
				c.return = 'void';
				break;
		}
		
		this.data = c;
	}
}