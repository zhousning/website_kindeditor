/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/
KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowImageRemote = K.undef(self.allowImageRemote, true),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		imageTabIndex = K.undef(self.imageTabIndex, 0),
		imgPath = self.pluginsPath + 'image/images/',
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		fillDescAfterUploadImage = K.undef(self.fillDescAfterUploadImage, false),
		lang = self.lang(name + '.');

  //step-3
	self.plugin.imageDialog = function(options) {
		var img = options.image,
      imageUrl = options.imageUrl,
			imageWidth = K.undef(options.imageWidth, ''),
			imageHeight = K.undef(options.imageHeight, ''),
			imageTitle = K.undef(options.imageTitle, ''),
			imageAlign = K.undef(options.imageAlign, ''),
			//showRemote = K.undef(options.showRemote, true),
			showRemote = false,
			showLocal = K.undef(options.showLocal, true),
			tabIndex = K.undef(options.tabIndex, 0),
			clickFn = options.clickFn;
		var target = 'kindeditor_upload_iframe_' + new Date().getTime();
		var hiddenElements = [];
		for(var k in extraParams){
			hiddenElements.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
		}
    var element = document.getElementById("thesis-data");
    var thesisId = element.getAttribute("data");
		var html = [
			'<div style="padding:20px;">',
			//tabs
			'<div class="tabs"></div>',
			//remote image - start
			'<div class="tab1" style="display:none;">',
			//url
			'<div class="ke-dialog-row">',
			'<label for="remoteUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
			'<input type="text" id="remoteUrl" class="ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			//size
			'<div class="ke-dialog-row">',
			'<label for="remoteWidth" style="width:60px;">' + lang.size + '</label>',
			lang.width + ' <input type="text" id="remoteWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> ',
			lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> ',
			'<img class="ke-refresh-btn" src="' + imgPath + 'refresh.png" width="16" height="16" alt="" style="cursor:pointer;" title="' + lang.resetSize + '" />',
			'</div>',
			//align
			'<div class="ke-dialog-row">',
			'<label style="width:60px;">' + lang.align + '</label>',
			'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
			'</div>',
			//title
			'<div class="ke-dialog-row">',
			'<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
			'<input type="text" id="remoteTitle" class="ke-input-text" name="title" value="" style="width:200px;" />',
			'</div>',
			'</div>',
			//remote image - end
			//local upload - start
			'<div class="tab2" style="display:none;">',
			'<iframe name="' + target + '" style="display:none;"></iframe>',
			'<form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + K.addParam(uploadJson, 'dir=image&thesis=' + thesisId) + '">',
			//file
			'<div class="ke-dialog-row">',
			hiddenElements.join(''),
			//'<label style="width:60px;">' + lang.localUrl + '</label>',
      '<h4>' + lang.localUrl + '</h4>',
			'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:320px;" readonly="true" /> &nbsp;',
			'<input type="button" class="ke-upload-button" value="' + lang.upload + '" />',
			'</div>',
			//title
			'<div class="ke-dialog-row">',
			//'<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
      '<h4>' + lang.imgTitle + '</h4>',
      '<label name="serialNumber" class="kemd-serial-number"></label>',
      //'<div class="img-flag-container">',
			//'<div class="whitespace"> </div>',
			//'<div class="img-flag-content">格式：[图章节号-第几张图片 图片说明] </div>',
      //'</div>',
			'<input type="text" id="remoteTitle" class="ke-input-text" name="title" value="" style="width:335px;" />',
			'</div>',
			//size
			/*'<div class="ke-dialog-row">',
      '<h4>' + lang.size + '</h4>',  
      lang.width + '&nbsp;&nbsp; <input type="text" id="remoteWidth" class="ke-input-text ke-input-number" name="width" value="50" maxlength="4"/> '+'&nbsp;%&nbsp;&nbsp;',
			' <input type="text" class="ke-input-text ke-input-number" style="display:none;" name="height" value="" maxlength="4" required/> ',
			//'<img class="ke-refresh-btn" src="' + imgPath + 'refresh.png" width="16" height="16" alt="" style="cursor:pointer;" title="' + lang.resetSize + '" />',
			'</div>',
      */
			'</form>',
			'</div>',
			//local upload - end
			'</div>'
		].join('');
		var dialogWidth = showLocal || allowFileManager ? 450 : 400,
			dialogHeight = showLocal && showRemote ? 200 : 400;
		var dialog = self.createDialog({
			name : name,
			width : dialogWidth,
			height : dialogHeight,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
        //step-5
				click : function(e) {
					// Bugfix: http://code.google.com/p/kindeditor/issues/detail?id=319
					if (dialog.isLoading) {
						return;
					}
					var url = K.trim(urlBox.val()),
						width = widthBox.val(),
						height = heightBox.val(),
						title = serialNumberBox.html() + " " + titleBox.val(),
						align = '';
					if (showLocal && showRemote && tabs && tabs.selectedIndex === 1 || !showRemote) {
            //图片不存在或更改图片
            if (!img || url !== imageUrl) {
					  	if (uploadbutton.fileBox.val() == '') {
					  		alert(self.lang('pleaseSelectFile'));
					  		return;
					  	}
              if(title == null || K.trim(title) == ""){
                alert("请输入图片说明");
                return;
              }
					  	dialog.showLoading(self.lang('uploadLoading'));
              //step-6
					  	uploadbutton.submit();
					  	localUrlBox.val('');
					  	return;
            }
            //只更新标题
            if (title.trim() == "") {
              alert("请输入图片说明");
              return;
            }
					  img.attr('title', title);
            var ptitle = self.plugin.getMultimediaCpt(img);
            ptitle.html(title);
				    self.hideDialog();
            return;
					}
					// insert remote image
					alignBox.each(function() {
						if (this.checked) {
							align = this.value;
							return false;
						}
					});
					if (url == 'http://' || K.invalidUrl(url)) {
						alert(self.lang('invalidUrl'));
						urlBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(width)) {
						alert(self.lang('invalidWidth'));
						widthBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(height)) {
						alert(self.lang('invalidHeight'));
						heightBox[0].focus();
						return;
					}
					clickFn.call(self, url, title, width, height, 0, align);
				}
			},
			beforeRemove : function() {
				viewServerBtn.unbind();
				widthBox.unbind();
				heightBox.unbind();
				refreshBtn.unbind();
			}
		}),
		div = dialog.div;

		var urlBox = K('[name="localUrl"]', div),
			localUrlBox = K('[name="localUrl"]', div),
			serialNumberBox = K('[name="serialNumber"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('.tab2 [name="width"]', div),
			heightBox = K('.tab2 [name="height"]', div),
      labelBox = K('.tab2 [name="serialNumber"]', div),
			refreshBtn = K('.ke-refresh-btn', div),
			titleBox = K('.tab2 [name="title"]', div),
			alignBox = K('.tab1 [name="align"]', div);

		var tabs;
		if (showRemote && showLocal) {
			tabs = K.tabs({
				src : K('.tabs', div),
				afterSelect : function(i) {}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			tabs.add({
				title : lang.localImage,
				panel : K('.tab2', div)
			});
			tabs.select(tabIndex);
		} else if (showRemote) {
			K('.tab1', div).show();
		} else if (showLocal) {
			K('.tab2', div).show();
		}

		var uploadbutton = K.uploadbutton({
			button : K('.ke-upload-button', div)[0], 
			fieldName : filePostName,
			form : K('.ke-form', div),
			target : target,
			width: 60,
      //图片上传之后执行
			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var url = data.url;
					if (formatUploadUrl) {
						url = K.formatUrl(url, 'absolute');
					}
					if (self.afterUpload) {
						self.afterUpload.call(self, url, data, name);
					}
					if (!fillDescAfterUploadImage) {
						var width =  "60%",
						height = "auto",
						title = K.trim(serialNumberBox.html() + titleBox.val());
            //step-7
						clickFn.call(self, url, title, width, height, data.border, data.align);
					} else {
						K(".ke-dialog-row #remoteUrl", div).val(url);
						K(".ke-tabs-li", div)[0].click();
						K(".ke-refresh-btn", div).click();
					}
				} else {
					alert(data.message);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			localUrlBox.val(uploadbutton.fileBox.val());
		});
    
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'VIEW',
						dirName : 'image',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								if (self.afterSelectFile) {
									self.afterSelectFile.call(self, url);
								}
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		var originalWidth = 0, originalHeight = 0;
		function setSize(width, height) {
      if(/%$/.test(width)){
			  widthBox.val(RegExp.leftContext);
      }
			heightBox.val(height);
			originalWidth = width;
			originalHeight = height;
		}
		refreshBtn.click(function(e) {
			var tempImg = K('<img src="' + urlBox.val() + '" />', document).css({
				position : 'absolute',
				visibility : 'hidden',
				top : 0,
				left : '-1000px'
			});
			tempImg.bind('load', function() {
				setSize(tempImg.width(), tempImg.height());
				tempImg.remove();
			});
			K(document.body).append(tempImg);
		});

    if (!/default_image.jpg/.test(imageUrl)) {
		  localUrlBox.val(imageUrl);
    }
    //step-4, 数据回显
    if (img) {
      var titleHtml = self.plugin.getMultimediaCpt(img).html(); 
      var title = self.plugin.splitMultimediaCpt(titleHtml, "image");
      serialNumberBox[0].innerHTML = title[0] ? title[0] : '';
      titleBox[0].value = title[1] ? title[1] : ''; 
    }
    //uploadbutton.fileBox.val(localUrlBox.val());
		//setSize(options.imageWidth, options.imageHeight);
    /*
		alignBox.each(function() {
			if (this.value === options.imageAlign) {
				this.checked = true;
				return false;
			}
		});
    */
		if (showRemote && tabIndex === 0) {
			//urlBox[0].focus();
			//urlBox[0].select();
      if(imageUrl!='http://'){
        urlBox[0].focus();
        urlBox[0].select();
      }else{
        tabs.select(1);
        localUrlBox[0].focus();
        localUrlBox[0].select();
      }
		}
		return dialog;
	};
	self.plugin.image = {
    //step-2
		edit : function(imageKnode) {
			var img = null;
      //编辑按钮触发
      if (imageKnode && imageKnode.name === 'img') {
        img = imageKnode;
      } else {
        //光标选中之后触发
        img = self.plugin.getSelectedImage()
      }
			self.plugin.imageDialog({
        image : img,
				imageUrl : img ? img.attr('src') : '',
				//imageWidth : img ? img.width() : '',
				//imageHeight : img ? img.height() : '',
				imageWidth : img ? img.attr('width') : '',
				imageHeight : img ? img.height('height') : '',
				imageTitle : img ? img.attr('title') : '',
				imageAlign : img ? img.attr('align') : '',
				showRemote : allowImageRemote,
				showLocal : allowImageUpload,
				tabIndex: img ? 0 : imageTabIndex,
        //step-8 图片上传完之后
				clickFn : function(url, title, width, height, border, align) {
          if (!img) {
            var range = self.edit.cmd.range;
            var ec = range.endContainer;
            var parents = K(ec).parent();
            var outParent = null;
            var imageHtml = '<div data-type="image" data-meta="image_com" contenteditable="false"><img data-type="image_entity" src="'+ K.escape(url) +'" data-src="'+ K.escape(url) +'"data-ke-src="'+K.escape(url)+'" title="' + title +'" width="'+ width +'"/><p data-type="image_caption">'+"图1-1 " +title+'</p></div>';

            if(K(ec).name === 'body'){
              self.exec('inserthtml',imageHtml);
            }else{
              if(parents.name == "body"){
                outParent = ec;
              }else{
                outParent = $(ec).parentsUntil("body")[$(ec).parentsUntil("body").length-1];
              }
              range.setStartAfter(outParent);
              range.setEndAfter(outParent);
              var imageNode = K(imageHtml);
              self.plugin.addMultimediaOptCtn(imageNode);
              self.plugin.addClassToMultimedia(imageNode);
              self.plugin.bindEventToMultiMedia(imageNode, self.plugin.image.edit); 
              range.insertNode(K("<p><br/></p>")[0]); //多媒体以后插入一个空白行
              range.insertNode(imageNode[0]);
            }
          } else {
            img.attr("src", K.escape(url));
            img.attr("data-src", K.escape(url));
            img.removeAttr("data-size");
            img.attr("data-ke-src", K.escape(url));
          }
					// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
					setTimeout(function() {
						self.hideDialog().focus();
					}, 0);
          if (!img) {
            self.setMultimediaTitle("image"); 
          }
				}
			});
		},
		'delete' : function() {
			var target = self.plugin.getSelectedImage();
			if (target.parent().name == 'a') {
				target = target.parent();
			  target.remove();
			}else{
        target.parent().remove();
      }
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		}
	};
  //step-1
	self.clickToolbar(name, self.plugin.image.edit);
});
