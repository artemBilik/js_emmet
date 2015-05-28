"use strict;"

function Tree(){
    this.first_child = null;
    this.right_sibling = null;
    this.parent = null;
    this.is_root = false;
};
Tree.prototype.addTo = function(parent){
    if(!(parent instanceof Tree)){
        throw new Error('Tree::addTo. Parent is not a Tree.')
    }

    if(this.is_root){
        throw new Error('You cann\'t add a root node to another node.');
    }
    if(this.parent){
        this.parent.addTo(parent);
    } else {
        this.parent = parent;
        if (null === parent.first_child) {
            parent.first_child = this;
        } else {
            var left_sibling = parent.first_child;
            while (null !== left_sibling.right_sibling) {
                left_sibling = left_sibling.right_sibling;
            }
            left_sibling.right_sibling = this;
        }
    }
};
Tree.prototype.addSibling = function(sibling){
    if(!(sibling instanceof Tree)){
        throw new Error('Tree::addSibling. Sibling is not a Tree.')
    }

    if(null !== this.right_sibling){
        return this.right_sibling.addSibling(sibling);
    }
    sibling.parent = this.parent;
    this.right_sibling = sibling;
    return true;
};

Tree.prototype.hasParent = function(){
    return Boolean(this.parent);
};

Tree.prototype.setRoot  = function(){
    this.is_root = true;
};

function Node(data){
    this.type = 'tag';
    this.tag = [];
    this.attributes = [];
    this.id = [];
    this.class_name = [];
    this.value = [];
    this.multiplication = [];
    this.number = 0;
    if(data instanceof Data){
        this.data = data;
    } else {
        throw new Error('Node::construct() data is not a Data.');
    }

    var self_closing_tags = '%hr%br%input%link%meta%img%';

    this.getSelfClosingTags = function(){
        return self_closing_tags;
    };

    Tree.apply(this, arguments);
};

Node.prototype = Object.create(Tree.prototype);
Node.prototype.constructor = Node;

Node.prototype.setType = function(type){
    if('tag' === type || 'text_node' === type || 'html' === type) {
        this.type = type;
    } else if('root' === type) {
        this.type = 'root';
        this.setRoot();
    } else {
        throw new Error('Node::setType(). Undefined type of Node. Use "tag", "text_node", "html".');
    }
};

// @todo слияние текста с текстом внедрить
Node.prototype.createValue = function(element, value, type){
    switch(type){
        case 'text':
            element[element.length] = {"type" : 'text', "value" : value};
            break;
        case 'func':
            element[element.length] = {"type" : 'func', "name" : value, "args" : []};
            break;
        case 'var' :
            element[element.length] = {"type" : 'var', "name" : value};
            break;
        default:
            if(0 === element.length || 'func' !== element[element.length - 1].type){
                throw new Error('Node::createValue(). Wrong type of added value - ' + type + '.');
            }
            var func = element[element.length - 1];
            if('arg_var' === type){
                func.args[func.args.length] = {"type" : 'var', "value" : value};
            }else if('arg_txt' === type){
                func.args[func.args.length] = {"type" : 'text', "value" : value};
            } else {
                throw new Error('Node::createValue(). Wrong type of added value - ' + type + '.');
            }
            break;
    }
    return true;
};
Node.prototype.addValueToTag = function(value, type){
    this.createValue(this.tag, value, type);
};
Node.prototype.addValueToAttributes = function(value, type){
    this.createValue(this.attributes, value, type);
};
Node.prototype.addValueToId = function(value, type){
    this.createValue(this.id, value, type);
};
Node.prototype.addValueToClass = function(value, type){
    this.createValue(this.class_name, value, type);
};
Node.prototype.addValueToValue = function(value, type){
    this.createValue(this.value, value, type);
};
Node.prototype.addValueToMultiplication = function(value, type){
    this.createValue(this.multiplication, value, type);
};
Node.prototype.getHtml = function(number){
    number = parseInt(number);
    this.number = number;
    if('tag' === this.type){
        return this.getHtmlForTag(number);
    } else if('html' === this.type){
        return this.getHtmlForHtml(number);
    } else if('text_node' === this.type) {
        return this.getHtmlForTextNode(number);
    } else if('root' === this.type) {
        return this.getHtmlForRoot();
    } else {
        return '';
    }
};
Node.prototype.getHtmlForRoot = function(){
    if(null !== this.first_child){
        return this.first_child.getHtml(0);
    }
};
Node.prototype.getHtmlForTag = function(number){
    var result = '',
        multiplication = this.get('multiplication'),
        tag = this.get('tag');

    for(var i = 0; i < multiplication; i++){
        if(1 < multiplication) {
            this.setNumber(i);
        }
        if(-1 !== this.getSelfClosingTags().indexOf('%'+tag+'%')){ // @todo add ' ' $tag throw tests
            result += this.selfClosingElement(tag);
        } else {
            if(null !== this.first_child){
                result += this.closingElement(tag, this.get('value') + this.first_child.getHtml(this.number));
            } else {
                result += this.closingElement(tag, this.get('value'));
            }
        }
    }

    if(this.right_sibling){
        result += this.right_sibling.getHtml(number);
    }

    return result;
};
Node.prototype.getHtmlForHtml = function(number) {
    var result = '',
        multiplication = this.get('multiplication');
    for(var i = 0; i < multiplication; ++i){
        if(1 < multiplication){
            this.setNumber(i);
        }
        var value = '';
        if(this.first_child){
            this.first_child.setNumber(i);
            value += this.first_child.getHtml(this.number);
        }
        result += this.get('value', value);

    }
    if(this.right_sibling){
        result += this.right_sibling.getHtml(number);
    }
    return result;
};
Node.prototype.getHtmlForTextNode = function(number) {
    var result = '',
        multiplication = this.get('multiplication');
    for(var i = 0; i < multiplication; ++i){
        if(1 < multiplication){
            this.setNumber(i);
        }
        result += this.get('value');
    }
    if(this.right_sibling){
        return result + this.right_sibling.getHtml(number);
    }

    return result;

}

Node.prototype.get = function(variable, value){
    if('multiplication' === variable && 0 === this.multiplication.length){
        return 1;
    }

    if(undefined !== this[variable]){
        var res = '',
            value_object = this[variable];

        for(var i in value_object){
            switch(this[variable][i].type){
                case 'text':
                    res += this[variable][i].value;
                    break;
                case 'var':
                    res += this.data.get(this[variable][i].name, this.number, value);
                    break;
                case'func':
                    res += this.data.func(this[variable][i].name, this[variable][i].args, value, this.number);
                    break
                default:
                    res += '';
                    break;
            }
        }
        return res;
    }
    return '';
};
Node.prototype.selfClosingElement = function(tag){
    return "<" + tag + this.getAttributes() + " />";
};
Node.prototype.closingElement = function(tag, value){
    return "<" + tag + this.getAttributes() + ">" + value + "</" + tag + ">";
};
Node.prototype.setNumber = function(number){
    this.number = parseInt(number);
};
Node.prototype.getAttributes = function(){
    var attributes = {},
        id = this.get('id'),
        class_name = this.get('class'),
        attributes_list = (this.get('attributes')).split(' '),
        attr = '',
        attr_str = '';
    if(id){
        attributes.id = id;
    }
    if(class_name){
        attributes.class_name = class_name;
    }
    for(var i in attributes_list){
        attr = attributes_list[i].split('=');
        if('class' === attr[0]){
            if(undefined !== attributes.class_name){
                attributes.class_name += ' ' + ((undefined !== attr[1]) ? attr[1] : '');
            } else {
                attributes.class_name = ((undefined !== attr[1]) ? attr[1] : '');
            }
        } else if('' === attr[0]) {
            continue;
        } else {
            attributes[attr[0]] = (undefined !== attr[1]) ? attr[1] : attr[0];
        }
    }

    for( var key in attributes){
        attr_str += ' ' + key + '="' + attributes[key] + '"';
    }
    return attr_str;
};