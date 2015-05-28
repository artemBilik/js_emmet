"use strict;"

function Emmet(emmet_string){

    this.error = false;
    this.tree = null;
    this.data = new Data();

    this.getEmmet = function() {
        return emmet_string;
    };

    this.build();

};
Emmet.prototype.create = function(data) {
    if(this.error) {
        return null;
    }
    try{
        this.data.setData(data);
        return this.tree.getHtml();
    } catch(e){
        this.throwError(e.message);
    }
};

Emmet.prototype.build = function() {
    try {
        var emmet_string = 'root>' + this.getEmmet(),
            pn = new PN(),
            fsm = new FSM(),
            node = new Node(this.data),
            str = '',
            i = 0,
            length = emmet_string.length - 1,
            symbol = '',
            prev_sym = null;
        node.setType('root');

        while ('end' !== fsm.state) {
            if (i > length) {
                symbol = '';
            } else {
                symbol = emmet_string.charAt(i);
            }

            if ('/' === symbol) {
                if (i === length) {
                    i++;
                    continue;
                } else {
                    str += emmet_string[++i];
                    ++i;
                    continue;
                }
            }



            if ('error' === fsm.state) {
               throw new Error('There was an error in your Emmet string. ' + this.getCheckTheDocumentation(i));
            }
            // @todo попробовать вернуть результат массивом
            fsm.setState(symbol);

            if (fsm.is_state_changed) {

                switch (fsm.prev_state) {
                    case 'operator':
                        prev_sym = emmet_string[i - 2];
                        if ((prev_sym !== '^' && prev_sym !== ')') && '(' !== str) {
                            pn.setOperand(node);
                            node = new Node(this.data);
                        }
                        pn.setOperator(str);
                        break;
                    case 'tag':
                        node.addValueToTag(str, 'text');
                        break;
                    case 'tag_var':
                        node.addValueToTag(str, 'var');
                        break;
                    case 'tag_func':
                        if('tag' !== fsm.state){
                            node.addValueToTag(str, 'func');
                        }
                        break;
                    case 'tag_args':
                        break;
                    case 'tag_arg_txt':
                        node.addValueToTag(str, 'arg_txt');
                        break;
                    case 'tag_arg_var':
                        node.addValueToTag(str, 'arg_var');
                        break;
                    case 'id':
                        node.addValueToId(str, 'text');
                        break;
                    case 'id_var':
                       node.addValueToId(str, 'var');
                        break;
                    case 'id_func':
                        if('id' !== fsm.state){
                            node.addValueToId(str, 'func');
                        }
                        break;
                    case 'id_args':
                        break;
                    case 'id_arg_txt':
                        node.addValueToId(str, 'arg_txt');
                        break;
                    case 'id_arg_var':
                        node.addValueToId(str, 'arg_var');
                        break;


                    case 'class_name':
                        node.addValueToClass(str, 'text');
                        break;
                    case 'class_name_var':
                        node.addValueToClass(str, 'var');
                        break;
                    case 'class_name_func':
                        if('class_name' !== fsm.state){
                            node.addValueToClass(str, 'func');
                        }
                        break;
                    case 'class_name_args':
                        break;
                    case 'class_name_arg_txt':
                        node.addValueToClass(str, 'arg_txt');
                        break;
                    case 'class_name_arg_var':
                        node.addValueToClass(str, 'arg_var');
                        break;


                    case 'attr':
                        node.addValueToAttributes(str, 'text');
                        break;
                    case 'attr_var':
                        node.addValueToAttributes(str, 'var');
                        break;
                    case 'attr_func':
                        if('attr' !== fsm.state){
                            node.addValueToAttributes(str, 'func');
                        }
                        break;
                    case 'attr_args':
                        break;
                    case 'attr_arg_txt':
                        node.addValueToAttributes(str, 'attr_txt');
                        break;
                    case 'attr_arg_var':
                        node.addValueToAttributes(str, 'attr_var');
                        break;
                    case 'after_attr':
                        break;



                    case 'text':
                        node.addValueToValue(str, 'text');
                        break;
                    case 'text_var':
                        node.addValueToValue(str, 'var');
                        break;
                    case 'text_func':
                        if('text' !== fsm.state){
                            node.addValueToValue(str, 'func');
                        }
                        break;
                    case 'text_args':
                        break;
                    case 'text_arg_txt':
                        node.addValueToValue(str, 'arg_txt');
                        break;
                    case 'text_arg_var':
                        node.addValueToValue(str, 'arg_var');
                        break;
                    case 'after_text':
                        break;


                    case 'text_node':
                        node.addValueToValue(str, 'text');
                        break;
                    case 'text_node_var':
                        node.addValueToValue(str, 'var');
                        break;
                    case 'text_node_func':
                        if('text_node' !== fsm.state){
                            node.addValueToValue(str, 'func');
                        }
                        break;
                    case 'text_node_args':
                        break;
                    case 'text_node_arg_txt':
                        node.addValueToValue(str, 'arg_txt');
                        break;
                    case 'text_node_arg_var':
                        node.addValueToValue(str, 'arg_var');
                        break;
                    case 'after_text_node':
                        node.setType('text_node');
                        break;


                    case 'multi':
                        node.addValueToMultiplication(str, 'text');
                        break;
                    case 'multi_var':
                        node.addValueToMultiplication(str, 'var');
                        break;
                    case 'multi_func':
                        if('multi' !== fsm.state){
                                node.addValueToMultiplication(str, 'func');
                        }
                        break;
                    case 'multi_args':
                        break;
                    case 'multi_arg_txt':
                        node.addValueToMultiplication(str, 'arg_txt');
                        break;
                    case 'multi_arg_var':
                        node.addValueToMultiplication(str, 'arg_var');
                        break;


                    case 'html':
                        node.setType('html');
                        break;
                    case 'html_var':
                        node.addValueToValue(str, 'var');
                        break;
                    case 'html_func':
                        if('html' !== fsm.state){
                            node.addValueToValue(str, 'func');
                        }
                        break;
                    case 'html_args':
                        break;
                    case 'html_arg_txt':
                        node.addValueToValue(str, 'arg_txt');
                        break;
                    case 'html_arg_var':
                        node.addValueToValue(str, 'arg_var');
                        break;
                    default:
                        throw new Error('Unhandled Finite State Machine State. ' + this.getCheckTheDocumentation(i));
                        break;
                }
                if((
                    'operator' === fsm.state || 'tag' === fsm.state || 'html_arg_txt' === fsm.state ||
                    'text_arg_txt' === fsm.state || 'text_node_arg_txt' === fsm.state ||
                    'tag_arg_txt' === fsm.state || 'id_arg_txt' === fsm.state ||
                    'class_name_arg_txt' === fsm.state || 'attr_arg_txt' === fsm.state || 'multi_arg_txt' === fsm.state)
                    && ('`' !== symbol && '%' !== symbol)
                ){
                    str = symbol;
                } else {
                    str = '';
                }
            } else {
                if('skip' !== fsm.state){
                    str += symbol;
                }
            }
            ++i;
        }

        if ('end' === fsm.state && 'operator' !== fsm.prev_state) {
            pn.setOperand(node);
        }

        this.tree = pn.generateTree();
        if (!(this.tree instanceof Node)) {
            throw new Error(tree);
        }
    } catch(e){
        this.throwError(e.message, e.lineNumber, e.fileName);
    }
};

Emmet.prototype.throwError = function (message, line_number, file_name) {
    console.log('Emmet Error: ' + message + ' File: ' + file_name + ' Line Number: ' + line_number + '.');
    this.error = true;
};
Emmet.prototype.getCheckTheDocumentation = function(position){
    position -= 6;
    return  'Check the documentation for the right syntax to use near "' + this.getEmmet().substr(position) + '".';

};
