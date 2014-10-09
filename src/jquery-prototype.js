define([
], function () {
	'use strict';
	

		var tokenizeTokens = function(tokens, string){
			var res = [string];
			for (var i = 0; i < tokens.length; i++) {	
				res = tokenizeStrings(tokens[i], res);
			}

			return res;
		};

		var tokenizeStrings = function(token, strings){
			var res = [];

			for (var i = 0; i < strings.length; i++) {
				res = res.concat(tokenizeToken(token, strings[i]));
			}

			return res;
		};

		var tokenizeToken = function(token, string){
			var splitted = string.split(token);
			var res = [];

			for (var i = 0; i < splitted.length; i++) {
				res.push(splitted[i]);
				if (i != splitted.length -1 ) {
					res.push(token);
				}
			}
			return res;
		};

		var valueIsToken = function(value, tokens){
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i] === value) {
					return tokens[i];
				}
			}
			return null;
		}

		var createTextNodes = function(allToken, selectedToken){
			var nodes = [];
			var selectedNodes = [];
			for (var i = 0; i < allToken.length; i++) {
				var node = document.createTextNode(allToken[i]);
				nodes.push(node);
				var isSelectedToken = valueIsToken(allToken[i], selectedToken);
				if (!!isSelectedToken) {
					selectedNodes.push(node);
				}
			}
			
			return {
				nodes:nodes,
				selectedNodes:selectedNodes
			}
		}

		$.fn.extend({
			getAllTexts: function(){
				var res = [];

	  			this.contents()
  				.each(function() {
					if (this.nodeType === 3) {
						res.push(this);
					} else {
						res = res.concat($(this).getAllTexts());
					}
  				});
				return res;				
			},

			tokenizeText: function(textRegex){
				// ___{{XYZ}}___
				// |1||  2  ||3|

				var text = this.text();

				var items = [];

				text.replace(textRegex, function (content) { 
					items.push(content);
				});

				
				var tokens = tokenizeTokens(items, text);
				var res = createTextNodes(tokens, items);

				$().replaceNodeByNodes(this[0], res.nodes);
				return res.selectedNodes;
			},

			replaceNodeByNodes : function(nodeToReplace, replacementNodes){

				var brothers = nodeToReplace.parentNode.childNodes;
				
				var newItems = [];
				for (var i = 0; i < brothers.length; i++) {

					if (brothers[i] == nodeToReplace) {
						replacementNodes.forEach(function(replacementItem){
							newItems.push(replacementItem);
						});
					} else {
						newItems.push(brothers[i]);
					}
				};

				var parentNode = $(nodeToReplace.parentNode);
				parentNode.empty();
				for (var i = 0; i < newItems.length; i++) {
					parentNode.get(0).appendChild(newItems[i])
				};
			}
		});
});