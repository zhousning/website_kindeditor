KindEditor.plugin('formula', function(K) {
  /*
  var mathjaxConfig = document.createElement("script");
  mathjaxConfig.type = "text/x-mathjax-config"
  mathjaxConfig.innerText = 'MathJax.Hub.Config({ showMathMenu: false, messageStyle: "none" });'
  document.head.appendChild(mathjaxConfig);

  var mathjaxScript = document.createElement("script");
  mathjaxScript.type = "text/javascript";
  mathjaxScript.src = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML";
  document.head.appendChild(mathjaxScript);

  //Todo: 判断MathJax加载完成后再调用
  setTimeout(function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, self.edit.doc.body]);
  }, 1000);
  */

  var mathjaxIframeScript = document.createElement("script");
  mathjaxIframeScript.type = "text/javascript";
  mathjaxIframeScript.src = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML";
  window.frames[0].document.head.appendChild(mathjaxIframeScript);

  var mathjaxIframeConfig = document.createElement("script");
  mathjaxIframeConfig.type = "text/x-mathjax-config";
  mathjaxIframeConfig.innerText = 'MathJax.Hub.Config({ showMathMenu: false, messageStyle: "none" });'
  window.frames[0].document.head.appendChild(mathjaxIframeConfig);

  //插入公式时，MathJax必须在iframe中调用才有效，从父页面调用iframe内部的函数
  var mathjaxIframeFunction = document.createElement("script");
  mathjaxIframeFunction.type = "text/javascript";
  mathjaxIframeFunction.innerText = 'function updateMathJax() { MathJax.Hub.Queue(["Typeset", MathJax.Hub]); }';
  window.frames[0].document.head.appendChild(mathjaxIframeFunction);

	var self = this, name = 'formula';

  //step-3
  self.plugin.formulaDialog = function(options){
    var formula = options.formula;
    var html = [
      '<div style="padding:20px;">',
        '<div class="ke-formula-input">',
          '<h4>粘贴公式代码</h4>',
          '<textarea name = "mathjaxBox" class="ke-formula-textarea" placeholder="公式粘贴到这里，右侧预览结果"></textarea></div>',
        '<div class="ke-formula-line"></div>',
        '<div class="ke-formula-help">',
          '<div class="ke-formula-tutorial"></div>',
        '</div>',
      '</div>'
      ].join("");
		var dialog = self.createDialog({
			name : name,
			width : 540,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
        //step-4
				click : function(e) {
					if (dialog.isLoading) {
						return;
					}
          mathjaxContent = K.trim(mathjaxBox.val());
          if(mathjaxContent == "" || /^<math/.test(mathjaxContent) === false){
            alert("请输入公式");
            return;
          }
          //公式存在
          if (formula) {
            var formulaEntity = '<div data-type="formula_entity">' + mathjaxContent + '</div>';
            formula.after(K(formulaEntity)[0]);
            formula.remove();
				    self.hideDialog();
          }
          else {
            var formulaCtn = '<div data-type="formula" data-meta="mathml" contenteditable="false">' + '<div data-type="formula_entity">' + mathjaxContent + '</div>' + '<p data-type="formula_caption">' +'(公式1-1)'+ '</p></div>';
            var formulaNode = K(formulaCtn);

            self.plugin.addMultimediaOptCtn(formulaNode);
            self.plugin.addClassToMultimedia(formulaNode);
            self.plugin.bindEventToMultiMedia(formulaNode, self.plugin.formula.edit); 
            self.plugin.insertContentInNewLine(formulaNode); 
            self.setMultimediaTitle("formula"); 
				    self.hideDialog();
          }
          window.frames[0].updateMathJax();
          //MathJax.Hub.Queue(["Typeset", MathJax.Hub, self.edit.doc.body]);
        }
      }
    });

    //step-4 数据回显
    var div = dialog.div;
    var mathjaxBox = K('[name="mathjaxBox"]',div);
    var mathShowBox = K('[name="mathShowBox"]',div);
    //var formulaTitleBox = K('[name="formulaTitle"]',div);
    var mathjaxContent = "";
    var thesesId = gon.thesisId;
    if (formula && formula.attr("data-type") == "formula_entity") {
      //formulaTitleBox.html(self.plugin.getMultimediaCpt(formula).html()); 
      var match = formula.html().replace(/\n/g, "").match(/<script .*<\/script>/g);
      if (match)
      {
        mathjaxScript = match[0];
        var match2 = mathjaxScript.match(/<math.*<\/math>/g);
        mathjaxContent = match2[0];
      }
      else
      {
        var match3 = formula.html().replace(/\n/g, "").match(/<math.*<\/math>/g);
        mathjaxContent = match3[0];
      }
      mathjaxBox.val(mathjaxContent);
      mathShowBox.html(mathjaxContent);
      //MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathShowBox[0]]);
    }

    //实时显示修改后公式
    mathjaxBox.change(function(){
      mathjaxContent = K.trim(mathjaxBox.val());
      if(mathjaxContent !== ""){
        mathjaxContent = mathjaxContent.replace(/xmlns:mml/g,"xmlns");
        mathjaxContent = mathjaxContent.replace(/<mml:/g,"<");
        mathjaxContent = mathjaxContent.replace(/<\/mml:/g,"</");
        mathjaxBox.val(mathjaxContent);
        mathShowBox.html(mathjaxContent);
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathShowBox[0]]);
      }
    });
    return dialog;
  }

  self.plugin.formula = {
    //step-2
    edit : function(formulaKnode){
      self.plugin.formulaDialog({
        formula : formulaKnode
      });
    }
  };

  //step-1
	self.clickToolbar(name, self.plugin.formula.edit);
});
