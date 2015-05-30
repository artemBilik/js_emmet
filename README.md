# js_emmet
Implementation of Emmet for javascript

# Instalation

download emmet.min.js from existing repository and add it to your web page.

# Quick Usage

```
    var emmet = new Emmet('div+div');
    result = emmet.create({});
    (result === '<div></div><div></div>'); // true
```

# Detail usage

[operation] [ tag [id] [class] [attributes] [element text node] [multiplication] ] | [ html [multiplication] ] | [ text_node [multiplication] ] [operation]

So we have Operations and Tags, Text Nodes and Html elements.

## Overview
Emmet string consists of objects and operations. Objects represent by tag or text node or html.
```
object+object>object(object+object)
```
Tag object starts from a tag name
```
div>div>p+span
```
It can start from any charaсter except '`', '%', '{'.
Tag node can has id, class, attributes, text and multiplication.
```
div#id.class[attr=value]{text}*2+span.class
```
Text node object starts from '{'. And can has multiplication
```
{text}+{another text}*3
```
Text node cann't has any child. So you cann't use '>' operation to the text node object. 

Html object represent by variable or function. It can has a multiplication.
```
`variable`>%function()%
```
It can has a child object.

## Operations
 
( ) ^ > +
 
Use "+" operation to add sibling to previous elements

```
'a+span'  ==== '<a></a><span></span>'
```

Use ">" operation to add child to previous element

```
'a>span' === '<a><span></span></a>'
```

Use "^" operation to climb up on the tree
```
'p>a>img^+span' === '<p><a><img /></a><span></span></p>'
```
Use "( )" operations for groupping elements
Should to know that next after ")" operation will use the first element in the brackets.
Let's see.
```
'(div>p+a)+div' === '<div><p></p><a></a></div>' . '<div></div>'
'(div>p>a>span)>p' === '<div>' . <p><a><span></span></a></p>' . '<p></p>' . '</div>'
'div>(div>p)^+div' === '<div><div><p></p></div></div>' . '<div></div>'
```

## Tags

To create a tag you can use any character.
```
`div+h1` === '<div></div><h1></h1>'
```
You can add an id to your tag with "#"
```
'div#myDiv>span' = '<div id="myDiv"><span></span></div>'
```
You can add a class with "."
Use " " to add more than one class
```
'div.class1+div.class1 class2' === '<div class="class1"></div><div class="class1 class2"></div>'
```
To add any other attribute use "[ ]" 
```
'option[value=12 selected]' === '<option value="12" selected="selected"></option>'
```
To add a text inside your tag use "{ }"
```
'p{some text}' === '<p>some text</p>'
```
If you need more than one elements use multiplication by "*"
```
'p*2' === '<p></p><p></p>'
```

## Text Node

You can create a text node without any tag.
And use it like other element with "+" operation. But you cann't add a child element to text node.
```
'p+{ some text }+a' === '<p></p> some text <a></a>'
'p+{ some text }*2' === '<p></p> some text  some text '
```

