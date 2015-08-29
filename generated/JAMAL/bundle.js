/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _ASTNodeJs = __webpack_require__(1);
	
	var _ASTNodeJs2 = _interopRequireDefault(_ASTNodeJs);
	
	var rootNode = new _ASTNodeJs2['default']({ type: 'list' });
	rootNode.addFirstChild(new _ASTNodeJs2['default']({ type: 'symbol', value: '+' }));
	rootNode.addLastChild(new _ASTNodeJs2['default']({ type: 'integer', value: 10 }));
	rootNode.addLastChild(new _ASTNodeJs2['default']({ type: 'integer', value: 11 }));
	rootNode.addLastChild(new _ASTNodeJs2['default']({ type: 'integer', value: 12 }));
	
	var vis = d3.select("#graph").append("svg");
	
	var w = 900,
	    h = 400;
	
	vis.attr("width", w).attr("height", h).text("AST Graph").select("#graph");
	
	console.log(rootNode);
	
	/*
	while(rootNode.data !== null){
	//    console.log(rootNode.data.value);
	    rootNode.data = null;
	}*/
	
	var nodes = [{ x: 10, y: 290, radius: 10, color: "green", label: "+" }, { x: 110, y: 80, radius: 10, color: "purple", label: "list" }, { x: 210, y: 290, radius: 10, color: "steelblue", label: "1" }];
	
	var links = [{ source: nodes[0], target: nodes[1] }, { source: nodes[2], target: nodes[1] }, { source: nodes[0], target: nodes[2] }];
	
	vis.selectAll("circle.nodes").data(nodes).enter().append("svg:circle").attr("cx", function (d) {
	    return d.x;
	}).attr("cy", function (d) {
	    return d.y;
	}).attr("r", function (d) {
	    return d.radius;
	}).style("fill", function (d) {
	    return d.color;
	});
	
	var text = vis.selectAll("text").data(nodes).enter().append("text");
	
	var textLabels = text.attr("x", function (d) {
	    return d.x;
	}).attr("y", function (d) {
	    return d.y;
	}).text(function (d) {
	    return d.label;
	}).attr("font-family", "sans-serif").attr("font-size", "20px").attr("fill", "red");
	
	vis.selectAll(".line").data(links).enter().append("line").attr("x1", function (d) {
	    return d.source.x;
	}).attr("y1", function (d) {
	    return d.source.y;
	}).attr("x2", function (d) {
	    return d.target.x;
	}).attr("y2", function (d) {
	    return d.target.y;
	}).style("stroke", "rgb(6,120,155)");

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function ASTNode(data) {
	    this.data = data, this.next = null, this.previous = null, this.parent = null, this.first_child = null, this.last_child = null;
	}
	
	/**
	When we add a child node to a parent node without any children, we
	need to assign both the first and last child for the parent node and
	the parent for the child node.
	*/
	ASTNode.prototype.addFirstChild = function (ast_node) {
	    this.first_child = ast_node;
	    this.last_child = ast_node;
	    ast_node.parent = this;
	};
	
	/**
	When we add a child node to a parent node with children, we need to
	associate the siblings then assign and last child for the parent node
	and the parent for the child node.
	*/
	ASTNode.prototype.addLastChild = function (ast_node) {
	    ast_node.previous = this.last_child;
	    this.last_child.next = ast_node;
	    this.last_child = ast_node;
	    ast_node.parent = this;
	};
	
	/**
	When we remove the first child node, we need to update our references
	in the parent and next sibling
	*/
	ASTNode.prototype.removeFirstChild = function () {
	    var first_child = this.first_child;
	    first_child.next.previous = first_child.previous;
	    first_child.parent.first_child = first_child.next;
	    first_child.next = null;
	    first_child.previous = null;
	    first_child.parent = null;
	    return first_child;
	};
	
	/**
	When we remove the last child node, we need to update our references
	in the parent and previous sibling
	*/
	ASTNode.prototype.removeLastChild = function () {
	    var last_child = this.last_child;
	    last_child.previous.next = last_child.next;
	    last_child.parent.last_child = last_child.previous;
	    last_child.next = null;
	    last_child.previous = null;
	    last_child.parent = null;
	    return last_child;
	};
	
	ASTNode.prototype.addPreviousSibling = function () {};
	ASTNode.prototype.addNextSibling = function () {};
	ASTNode.prototype.removePreviousSibling = function () {};
	ASTNode.prototype.removeNextSibling = function () {};
	
	exports['default'] = ASTNode;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map