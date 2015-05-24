"use strict;"

function Data(){
    this.data = {};
};

Data.prototype.setData = function(data){
    this.data = data;
};

Data.prototype.get = function(variable, number, added_value){
    if('$' === variable){
        if(undefined !== this.data[number]){
            return this.data[number];
        }
        return number;
    }
    var memory = this.data;
    variable += ';';
    var state = '.';
    var value = '';
    var symbol = '';

    for(i = 0, length = variable.length; i < length; ++i){
        symbol = variable.charAt(i);
        if('$' === symbol){
            symbol = number;
        }

        if((('[' === symbol || ']' === symbol || '{' === symbol || '}' === symbol  || '.' === symbol || ';' === symbol))){
            if('' !== value){
                if(state === '.'){
                    if(undefined !== memory[value]){
                        memory = memory[value];
                    } else {
                        throw new Error('Cann\'t find the variable "' + variable.substr(0, length - 1)+ '".');
                    }
                } else if('{' === state){
                    if(undefined !== memory[value]){
                        memory = memory[value];
                    } else {
                        throw new Error('Cann\'t find the variable "' + variable.substr(0, length - 1) + '".');
                    }
                } else {
                    if(undefined !== memory[value]){
                        memory = memory[value];
                    } else {
                        throw new Error('Cann\'t find the variable "' + variable.substr(0, length - 1) + '".');
                    }
                }
            }

            value = '';
            state = symbol;
            continue;
        }  else {
            value += symbol;
        }
    }
    if(undefined !== added_value && 'string' === typeof memory){
        memory = memory.replace(/\{\{value\}\}/gi, added_value)
    }
    return memory;
};

Data.prototype.func = function(name, args, value , number){
    if('function' === typeof window[name]){
        var args_for_call = [];
        for(var i in args){
            if('var' === args[i].type){
                args_for_call[args_for_call.length] = this.get(args[i].value, number, null);
            } else {
                args_for_call[args_for_call.length] = args[i].value;
            }
        }
        if(value){
            args_for_call[args_for_call.length] = value;
        }
        return window[name].apply(this, args_for_call);
    } else {
        throw new Error('Function "' + name + '" doesn\'t exists.');
    }
};
//@todo call functions