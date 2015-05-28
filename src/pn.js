"use strict;"

function PN(){
    this.output = [];
    this.stack  = [];
};

PN.prototype.setOperand = function(operand) {
    if(!(operand instanceof Node)){
        throw new Error('PN::setOperand() operand must be a Node.');
    }
    this.output.push(operand);
};

PN.prototype.setOperator = function(operator){
    switch(operator){
        case '(':
            this.stack.push('(');
            return true;
        case ')':
            operator = null;
            var up = -2;
            do{
                if(null !== operator){
                    this.output[this.output.length] = operator;
                }
                operator = this.stack.pop();

                if('>' === operator){
                    up++;
                }
                if(undefined === operator){
                    throw new Error('Incorrectly placed brackets.');
                }
            } while('(' !== operator);
            while(up > 0){
                this.output[this.output.length] = '^';
                up--;
            }
            return true;
        case '+':
            this.stack.push('+');
            return true;
        case '>':
            this.stack.push('>');
            return true;
        case '^':
            do{
                operator = this.stack.pop();

                if(0 === this.stack.length){
                    throw new Error('The "^" operator is excess.');
                }

                this.output[this.output.length] = operator;
            } while('>' !== operator);
            this.output[this.output.length] = '^';
            return true;
        default:
            throw new Error('Undefined operator "' + operator + '".');
    }
};

PN.prototype.endOutput = function(){
    var operator = null;
    while(true){
        operator = this.stack.pop();
        if(undefined === operator){
            break;
        } else if('(' === operator){
            throw new Error('Incorrectly placed brackets.');
        } else {
            this.output[this.output.length] = operator;
        }
    }
    return this.output;
};

PN.prototype.generateTree = function(){
    this.endOutput();
    var el = null;
    var right = null;
    var left = null;
    var child = null;
    var parent = null;

    while(0 !== this.output.length){
        el = this.output.shift();
        if(el instanceof Node){
            this.stack.push(el);
        } else {
            if('>' === el){
                child = this.stack.pop();
                parent = this.stack.pop();
                if(parent instanceof Node && child instanceof Node){
                    child.addTo(parent);
                    this.stack.push(parent);
                } else {
                    throw new Error('The number of operands less than operations.');
                }
            } else if('+' === el){
                right = this.stack.pop();
                left = this.stack.pop();
                if(left instanceof Node && right instanceof Node){
                    left.addSibling(right);
                    this.stack.push(left);
                } else {
                    throw new Error('The number of operands less than operations.');
                }
            } else if('^' === el){
                child = this.stack.pop();
                if(child instanceof Node){
                    parent = child.parent;
                    if(null !== parent){
                        this.stack.push(parent)
                    } else {
                        if(!child.is_root){
                            this.stack.push(child);
                        } else {
                            throw new Error('You are out of the tree. Check "^" operator.');
                        }
                    }
                } else {
                    throw new Error('The number of operands less than operations.');
                }
            } else {
                throw new Error('Undefined Operation. "' + el + '".');
            }
        }
    }
    var res = this.stack.pop();

    while(null !== res.parent){
        res = res.parent;
    }
    return res;
};