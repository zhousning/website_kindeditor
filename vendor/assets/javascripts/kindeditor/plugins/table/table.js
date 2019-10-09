/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('table', function(K) {
	var self = this, name = 'table', lang = self.lang(name + '.'), zeroborder = 'ke-zeroborder';
  /*
	// 设置颜色
	function _setColor(box, color) {
		color = color.toUpperCase();
		box.css('background-color', color);
		box.css('color', color === '#000000' ? '#FFFFFF' : '#000000');
		box.html(color);
	}
	// 初始化取色器
	var pickerList = [];
	function _initColorPicker(dialogDiv, colorBox) {
		colorBox.bind('click,mousedown', function(e){
			e.stopPropagation();
		});
		function removePicker() {
			K.each(pickerList, function() {
				this.remove();
			});
			pickerList = [];
			K(document).unbind('click,mousedown', removePicker);
			dialogDiv.unbind('click,mousedown', removePicker);
		}
		colorBox.click(function(e) {
			removePicker();
			var box = K(this),
				pos = box.pos();
			var picker = K.colorpicker({
				x : pos.x,
				y : pos.y + box.height(),
				z : 811214,
				selectedColor : K(this).html(),
				colors : self.colorTable,
				noColor : self.lang('noColor'),
				shadowMode : self.shadowMode,
				click : function(color) {
					_setColor(box, color);
					removePicker();
				}
			});
			pickerList.push(picker);
			K(document).bind('click,mousedown', removePicker);
			dialogDiv.bind('click,mousedown', removePicker);
		});
	}*/
	// 取得下一行cell的index
	function _getCellIndex(table, row, cell) {
		var rowSpanCount = 0;
		for (var i = 0, len = row.cells.length; i < len; i++) {
			if (row.cells[i] == cell) {
				break;
			}
			rowSpanCount += row.cells[i].rowSpan - 1;
		}
		return cell.cellIndex - rowSpanCount;
	}
	self.plugin.table = {
		//step-2 insert or modify table
		prop : function(isInsert, tableKnode) {
			var html = [
				'<div style="padding:20px;">',
        //table_caption
				'<div class="ke-dialog-row">',
        '<h4>' + lang.tablecaption + '</h4>',
        '<label name="serialNumber" class="kemd-serial-number"></label>',
			  '<input type="text" name="tablecaption" class="ke-input-text" style="width:385px;"/> &nbsp;',
				'</div>',
				//rows, cols
				'<div class="ke-dialog-row">',
        '<h4>' + lang.cells + '</h4>',
				lang.rows + '&nbsp;&nbsp; <input type="text" id="keRows" class="ke-input-text ke-input-number" name="rows" value="" maxlength="4" /> &nbsp; ',
				lang.cols + '&nbsp;&nbsp; <input type="text" class="ke-input-text ke-input-number" name="cols" value="" maxlength="4" />',
				'</div>',
				//width, height
        /*
				'<div class="ke-dialog-row">',
        '<h4>' + lang.size + '</h4>',
				lang.width + '&nbsp;&nbsp; <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="3" /> &nbsp;&nbsp;% ',
        */
        /*
				'<select name="widthType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> &nbsp; ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> &nbsp; ',
				'<select name="heightType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select>',*/
				'</div>',
        /*
				//space, padding
				'<div class="ke-dialog-row">',
				'<label for="kePadding" style="width:90px;">' + lang.space + '</label>',
				lang.padding + ' <input type="text" id="kePadding" class="ke-input-text ke-input-number" name="padding" value="" maxlength="4" /> &nbsp; ',
				lang.spacing + ' <input type="text" class="ke-input-text ke-input-number" name="spacing" value="" maxlength="4" />',
				'</div>',
				//align
				'<div class="ke-dialog-row">',
				'<label for="keAlign" style="width:90px;">' + lang.align + '</label>',
				'<select id="keAlign" name="align">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="left">' + lang.alignLeft + '</option>',
				'<option value="center">' + lang.alignCenter + '</option>',
				'<option value="right">' + lang.alignRight + '</option>',
				'</select>',
				'</div>',
				//border
				'<div class="ke-dialog-row">',
				'<label for="keBorder" style="width:90px;">' + lang.border + '</label>',
				lang.borderWidth + ' <input type="text" id="keBorder" class="ke-input-text ke-input-number" name="border" value="" maxlength="4" /> &nbsp; ',
				lang.borderColor + ' <span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				//background color
				'<div class="ke-dialog-row">',
				'<label for="keBgColor" style="width:90px;">' + lang.backgroundColor + '</label>',
				'<span class="ke-inline-block ke-input-color"></span>',
				'</div>',*/
				'</div>'
			].join('');
			var bookmark = self.cmd.range.createBookmark();
      //start init dialog
			var dialog = self.createDialog({
				name : name,
				width : 450,
				title : self.lang(name),
				body : html,
				/*beforeRemove : function() {
					colorBox.unbind();
				},*/
				yesBtn : {
					name : self.lang('yes'),
          //step-4
					click : function(e) {
						var rows = rowsBox.val(),
							cols = colsBox.val(),
							width = "100%",
              tablecaption = serialNumberBox.html() + " " + captionBox.val();
							/*
              height = 'auto',
							widthType = '%',
							heightType = '',
							align = 'center',
							border = '1',
							borderColor = '#000000',
							bgColor = '',
							padding = '4',
							spacing = '';
							height = heightBox.val(),
							widthType = widthTypeBox.val(),
							heightType = heightTypeBox.val(),
							padding = paddingBox.val(),
							spacing = spacingBox.val(),
							align = alignBox.val(),
							border = borderBox.val(),
							borderColor = K(colorBox[0]).html() || '',
							bgColor = K(colorBox[1]).html() || '';
              */
						if (rows == 0 || !/^\d+$/.test(rows)) {
							alert(self.lang('invalidRows'));
							rowsBox[0].focus();
							return;
						}
						if (cols == 0 || !/^\d+$/.test(cols)) {
							alert(self.lang('invalidRows'));
							colsBox[0].focus();
							return;
						}
            /*
						if (!/^\d*$/.test(width) || parseFloat(width)>100) {
							alert(self.lang('invalidScope'));
							widthBox[0].focus();
							return;
						}
            */
            if(K.trim(captionBox.val()) == ""){
							alert(lang.captionInvalid);
              captionBox[0].focus();
              return;
            }
            /*
						if (!/^\d*$/.test(height)) {
							alert(self.lang('invalidHeight'));
							heightBox[0].focus();
							return;
						}
						if (!/^\d*$/.test(padding)) {
							alert(self.lang('invalidPadding'));
							paddingBox[0].focus();
							return;
						}
						if (!/^\d*$/.test(spacing)) {
							alert(self.lang('invalidSpacing'));
							spacingBox[0].focus();
							return;
						}
						if (!/^\d*$/.test(border)) {
							alert(self.lang('invalidBorder'));
							borderBox[0].focus();
							return;
						}*/
						//修改表格
						if (table) {
              
              /*
							if (width !== '') {
								table.attr('width',width + widthType);
							} else {
								table.attr('width','100%');
							}
							if (table[0].width !== undefined) {
								table.removeAttr('width');
							}
							if (height !== '') {
								table.height(height + heightType);
							} else {
								table.css('height', '');
							}
							if (table[0].height !== undefined) {
								table.removeAttr('height');
							}
							table.css('background-color', bgColor);
							if (table[0].bgColor !== undefined) {
								table.removeAttr('bgColor');
							}
							if (padding !== '') {
								table[0].cellPadding = padding;
							} else {
								table.removeAttr('cellPadding');
							}
							if (spacing !== '') {
								table[0].cellSpacing = spacing;
							} else {
								table.removeAttr('cellSpacing');
							}
							if (align !== '') {
								table[0].align = align;
							} else {
								table.removeAttr('align');
							}
							if (border !== '') {
								table.attr('border', border);
							} else {
								table.removeAttr('border');
							}
							if (border === '' || border === '0') {
								table.addClass(zeroborder);
							} else {
								table.removeClass(zeroborder);
							}
							if (borderColor !== '') {
								table.attr('borderColor', borderColor);
							} else {
								table.removeAttr('borderColor');
							}*/
              var tcaption = self.plugin.getMultimediaCpt(table);
              tcaption.html(tablecaption);
				      self.hideDialog();
							self.cmd.range.moveToBookmark(bookmark);
							self.cmd.select();
							self.addBookmark();
							return;
						}
						//插入新表格
            /*
						var style = '';
						if (width !== '') {
							style += 'width:' + width + widthType + ';';
						}else{
							style += 'width:80%;';
            }
						if (height !== '') {
							style += 'height:' + height + heightType + ';';
						}
						if (bgColor !== '') {
							style += 'background-color:' + bgColor + ';';
						}
						if (style !== '') {
							html += ' style="' + style + '"';
						}
						if (padding !== '') {
							html += ' cellpadding="' + padding + '"';
						}
						if (spacing !== '') {
							html += ' cellspacing="' + spacing + '"';
						}
						if (width !== '') {
							html += '  width="' + width + widthType + '"';
						}else{
							html += '  "width=100%"';
            }
						if (align !== '') {
							html += ' align="' + align + '"';
						}
						if (border !== '') {
							html += ' border="' + border + '"';
						}
						if (border === '' || border === '0') {
							html += ' class="' + zeroborder + '"';
						}
						if (borderColor !== '') {
							html += ' bordercolor="' + borderColor + '"';
						}
            */
						var html = '<div data-type="table" data-meta="html" contenteditable="false"><p data-type="table_caption">'+ "表1-1 " + tablecaption + ' </p><table data-type="table_entity" width="100%" contenteditable="true"';
						html += '>';
						for (var i = 0; i < rows; i++) {
							html += '<tr>';
							for (var j = 0; j < cols; j++) {
								html += '<td><p>' + (K.IE ? '&nbsp;' : '<br />') + '</p></td>';
							}
							html += '</tr>';
						}
						html += '</table></div>';
            /*
						if (!K.IE) {
							html += '<br />';
						}*/
            var tableNode = K(html);
            self.plugin.addMultimediaOptCtn(tableNode);
            self.plugin.addClassToMultimedia(tableNode);
            self.plugin.bindEventToMultiMedia(tableNode, self.plugin.table.prop); 
            self.plugin.insertContentInNewLine(tableNode);
				    self.hideDialog();
						self.cmd.range.moveToBookmark(bookmark);
						self.addBookmark();
            self.setMultimediaTitle("table"); 
					}
				}
			}),
      //end init dialog
			div = dialog.div,
			rowsBox = K('[name="rows"]', div).val(3),
			colsBox = K('[name="cols"]', div).val(2),
			widthBox = K('[name="width"]', div).val(100);
      captionBox = K('[name="tablecaption"]', div);
			serialNumberBox = K('[name="serialNumber"]', div),
			//heightBox = K('[name="height"]', div),
			//widthTypeBox = K('[name="widthType"]', div),
			//heightTypeBox = K('[name="heightType"]', div),
			//paddingBox = K('[name="padding"]', div).val(2),
			//spacingBox = K('[name="spacing"]', div).val(0),
			//alignBox = K('[name="align"]', div),
			//borderBox = K('[name="border"]', div).val(1),
			//colorBox = K('.ke-input-color', div);
			//_initColorPicker(div, colorBox.eq(0));
			//_initColorPicker(div, colorBox.eq(1));
			//_setColor(colorBox.eq(0), '#000000');
			//_setColor(colorBox.eq(1), '');
			// foucs and select
			rowsBox[0].focus();
			rowsBox[0].select();
			var table;
			if (isInsert) {
				return;
			}
      //step-3 数据回显
      if (tableKnode && tableKnode.name === 'table') {
        table = tableKnode;
      } else {
			  table = self.plugin.getSelectedTable();
      }
			if (table) {
        var titleHtml = self.plugin.getMultimediaCpt(table).html(); 
        var title = self.plugin.splitMultimediaCpt(titleHtml, "table");
        serialNumberBox[0].innerHTML = title[0] ? title[0] : '';
        captionBox[0].value = title[1] ? title[1] : ''; 
				rowsBox.val(table[0].rows.length);
				colsBox.val(table[0].rows.length > 0 ? table[0].rows[0].cells.length : 0);
				rowsBox.attr('disabled', true);
				colsBox.attr('disabled', true);
        /*
				var match,
				tableWidth = table[0].style.width || table[0].width;
				tableHeight = table[0].style.height || table[0].height;
				if (tableWidth !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableWidth))) {
					widthBox.val(match[1]);
					//widthTypeBox.val(match[2]);
				} else {
					widthBox.val('');
				}
				if (tableHeight !== undefined && (match = /^(\d+)((?:px|%)*)$/.exec(tableHeight))) {
					heightBox.val(match[1]);
					heightTypeBox.val(match[2]);
				}
				paddingBox.val(table[0].cellPadding || '');
				spacingBox.val(table[0].cellSpacing || '');
				alignBox.val(table[0].align || '');
				borderBox.val(table[0].border === undefined ? '' : table[0].border);
				_setColor(colorBox.eq(0), K.toHex(table.attr('borderColor') || ''));
				_setColor(colorBox.eq(1), K.toHex(table[0].style.backgroundColor || table[0].bgColor || ''));
				widthBox[0].focus();
				widthBox[0].select();
        */
			}
		},
		//modify cell
		cellprop : function() {
			var html = [
				'<div style="padding:20px;">',
				//width, height
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:90px;">' + lang.size + '</label>',
				lang.width + ' <input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" /> &nbsp;% ',
        /*
				'<select name="widthType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select> &nbsp; ',
				lang.height + ' <input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" /> &nbsp; ',
				'<select name="heightType">',
				'<option value="%">' + lang.percent + '</option>',
				'<option value="px">' + lang.px + '</option>',
				'</select>',
        */
				'</div>',
				//align
				'<div class="ke-dialog-row">',
				'<label for="keAlign" style="width:90px;">' + lang.align + '</label>',
				lang.textAlign + ' <select id="keAlign" name="textAlign">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="left">' + lang.alignLeft + '</option>',
				'<option value="center">' + lang.alignCenter + '</option>',
				'<option value="right">' + lang.alignRight + '</option>',
				'</select> ',
				lang.verticalAlign + ' <select name="verticalAlign">',
				'<option value="">' + lang.alignDefault + '</option>',
				'<option value="top">' + lang.alignTop + '</option>',
				'<option value="middle">' + lang.alignMiddle + '</option>',
				'<option value="bottom">' + lang.alignBottom + '</option>',
				'<option value="baseline">' + lang.alignBaseline + '</option>',
				'</select>',
				'</div>',
        /*
				//border
				'<div class="ke-dialog-row">',
				'<label for="keBorder" style="width:90px;">' + lang.border + '</label>',
				lang.borderWidth + ' <input type="text" id="keBorder" class="ke-input-text ke-input-number" name="border" value="" maxlength="4" /> &nbsp; ',
				lang.borderColor + ' <span class="ke-inline-block ke-input-color"></span>',
				'</div>',
				//background color
				'<div class="ke-dialog-row">',
				'<label for="keBgColor" style="width:90px;">' + lang.backgroundColor + '</label>',
				'<span class="ke-inline-block ke-input-color"></span>',
				'</div>',*/
				'</div>'
			].join('');
			var bookmark = self.cmd.range.createBookmark();
			var dialog = self.createDialog({
				name : name,
				width : 500,
				title : self.lang('tablecell'),
				body : html,
        /*
				beforeRemove : function() {
					colorBox.unbind();
				},*/
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
            /*
						var width = widthBox.val(),
							height = heightBox.val(),
							widthType = widthTypeBox.val(),
							heightType = heightTypeBox.val(),
							padding = paddingBox.val(),
							spacing = spacingBox.val(),
              */
							height = 'auto',
							widthType = '%',
							heightType = '',
							padding = '4',
							spacing = '0',
							textAlign = textAlignBox.val(),
							verticalAlign = verticalAlignBox.val();
              /*
							border = borderBox.val(),
							borderColor = K(colorBox[0]).html() || '',
							bgColor = K(colorBox[1]).html() || '';
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
						if (!/^\d*$/.test(border)) {
							alert(self.lang('invalidBorder'));
							borderBox[0].focus();
							return;
						}
            */
						cell.css({
							'width' : width !== '' ? (width + widthType) : '',
							'height' : height !== '' ? (height + heightType) : '',
							'text-align' : textAlign,
							'vertical-align' : verticalAlign
              /*
							'background-color' : bgColor,
							'border-width' : border,
							'border-style' : border !== '' ? 'solid' : '',
							'border-color' : borderColor
              */
						});
						self.hideDialog().focus();
						self.cmd.range.moveToBookmark(bookmark);
						self.cmd.select();
						self.addBookmark();
					}
				}
			}),
			div = dialog.div,
			widthBox = K('[name="width"]', div).val(100),
      /*
			heightBox = K('[name="height"]', div),
			widthTypeBox = K('[name="widthType"]', div),
			heightTypeBox = K('[name="heightType"]', div),
			paddingBox = K('[name="padding"]', div).val(2),
			spacingBox = K('[name="spacing"]', div).val(0),
      */
			textAlignBox = K('[name="textAlign"]', div),
			verticalAlignBox = K('[name="verticalAlign"]', div);
      /*
			borderBox = K('[name="border"]', div).val(1),
			colorBox = K('.ke-input-color', div);
			_initColorPicker(div, colorBox.eq(0));
			_initColorPicker(div, colorBox.eq(1));
			_setColor(colorBox.eq(0), '#000000');
			_setColor(colorBox.eq(1), '');
      */
			// foucs and select
			//widthBox[0].focus();
			//widthBox[0].select();
			// get selected cell
      // 单元格数据回显
			var cell = self.plugin.getSelectedCell();
			var match,
				cellWidth = cell[0].style.width || cell[0].width || '';
				//cellHeight = cell[0].style.height || cell[0].height || '';
			if ((match = /^(\d+)((?:px|%)*)$/.exec(cellWidth))) {
				widthBox.val(match[1]);
				//widthTypeBox.val('%');
			} else {
				widthBox.val('');
			}
      /*
			if ((match = /^(\d+)((?:px|%)*)$/.exec(cellHeight))) {
				heightBox.val(match[1]);
				heightTypeBox.val(match[2]);
			}
      */
			textAlignBox.val(cell[0].style.textAlign || '');
			verticalAlignBox.val(cell[0].style.verticalAlign || '');
      /*
			var border = cell[0].style.borderWidth || '';
			if (border) {
				border = parseInt(border);
			}
			borderBox.val(border);
			_setColor(colorBox.eq(0), K.toHex(cell[0].style.borderColor || ''));
			_setColor(colorBox.eq(1), K.toHex(cell[0].style.backgroundColor || ''));
			widthBox[0].focus();
			widthBox[0].select();
      */
		},
		insert : function() {
			this.prop(true);
		},
		'delete' : function() {
			var table = self.plugin.getSelectedTable();
			self.cmd.range.setStartAfter(table.parent()[0]).collapse(true);
			self.cmd.select();
      table.parent().prev().remove();
      table.parent().remove();
			//table.remove();
			self.addBookmark();
		},
		colinsert : function(offset) {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				index = cell.cellIndex + offset;
			// 取得第一行的index
			index += table.rows[0].cells.length - row.cells.length;

			for (var i = 0, len = table.rows.length; i < len; i++) {
				var newRow = table.rows[i],
					newCell = newRow.insertCell(index);
				newCell.innerHTML = K.IE ? '' : '<p><br /></p>';
				// 调整下一行的单元格index
				index = _getCellIndex(table, newRow, newCell);
			}
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colinsertleft : function() {
			this.colinsert(0);
		},
		colinsertright : function() {
			this.colinsert(1);
		},
		rowinsert : function(offset) {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0];
			var rowIndex = row.rowIndex;
			if (offset === 1) {
				rowIndex = row.rowIndex + (cell.rowSpan - 1) + offset;
			}
			var newRow = table.insertRow(rowIndex);

			for (var i = 0, len = row.cells.length; i < len; i++) {
				// 调整cell个数
				if (row.cells[i].rowSpan > 1) {
					len -= row.cells[i].rowSpan - 1;
				}
				var newCell = newRow.insertCell(i);
				// copy colspan
				if (offset === 1 && row.cells[i].colSpan > 1) {
					newCell.colSpan = row.cells[i].colSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<p><br /></p>';
			}
			// 调整rowspan
			for (var j = rowIndex; j >= 0; j--) {
				var cells = table.rows[j].cells;
				if (cells.length > i) {
					for (var k = cell.cellIndex; k >= 0; k--) {
						if (cells[k].rowSpan > 1) {
							cells[k].rowSpan += 1;
						}
					}
					break;
				}
			}
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		rowinsertabove : function() {
			this.rowinsert(0);
		},
		rowinsertbelow : function() {
			this.rowinsert(1);
		},
		rowmerge : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex, // 当前行的index
				nextRowIndex = rowIndex + cell.rowSpan, // 下一行的index
				nextRow = table.rows[nextRowIndex]; // 下一行
			// 最后一行不能合并
			if (table.rows.length <= nextRowIndex) {
				return;
			}
			var cellIndex = cell.cellIndex; // 下一行单元格的index
			if (nextRow.cells.length <= cellIndex) {
				return;
			}
			var nextCell = nextRow.cells[cellIndex]; // 下一行单元格
			// 上下行的colspan不一致时不能合并
			if (cell.colSpan !== nextCell.colSpan) {
				return;
			}
			cell.rowSpan += nextCell.rowSpan;
			nextRow.deleteCell(cellIndex);
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colmerge : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex, // 当前行的index
				cellIndex = cell.cellIndex,
				nextCellIndex = cellIndex + 1;
			// 最后一列不能合并
			if (row.cells.length <= nextCellIndex) {
				return;
			}
			var nextCell = row.cells[nextCellIndex];
			// 左右列的rowspan不一致时不能合并
			if (cell.rowSpan !== nextCell.rowSpan) {
				return;
			}
			cell.colSpan += nextCell.colSpan;
			row.deleteCell(nextCellIndex);
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		rowsplit : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex;
			// 不是可分割单元格
			if (cell.rowSpan === 1) {
				return;
			}
			var cellIndex = _getCellIndex(table, row, cell);
			for (var i = 1, len = cell.rowSpan; i < len; i++) {
				var newRow = table.rows[rowIndex + i],
					newCell = newRow.insertCell(cellIndex);
				if (cell.colSpan > 1) {
					newCell.colSpan = cell.colSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<p><br /></p>';
				// 调整下一行的单元格index
				cellIndex = _getCellIndex(table, newRow, newCell);
			}
			K(cell).removeAttr('rowSpan');
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		colsplit : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				cellIndex = cell.cellIndex;
			// 不是可分割单元格
			if (cell.colSpan === 1) {
				return;
			}
			for (var i = 1, len = cell.colSpan; i < len; i++) {
				var newCell = row.insertCell(cellIndex + i);
				if (cell.rowSpan > 1) {
					newCell.rowSpan = cell.rowSpan;
				}
				newCell.innerHTML = K.IE ? '' : '<p><br /></p>';
			}
			K(cell).removeAttr('colSpan');
			self.cmd.range.selectNodeContents(cell).collapse(true);
			self.cmd.select();
			self.addBookmark();
		},
		coldelete : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				index = cell.cellIndex;
			for (var i = 0, len = table.rows.length; i < len; i++) {
				var newRow = table.rows[i],
					newCell = newRow.cells[index];
				if (newCell.colSpan > 1) {
					newCell.colSpan -= 1;
					if (newCell.colSpan === 1) {
						K(newCell).removeAttr('colSpan');
					}
				} else {
					newRow.deleteCell(index);
				}
				// 跳过不需要删除的行
				if (newCell.rowSpan > 1) {
					i += newCell.rowSpan - 1;
				}
			}
			if (row.cells.length === 0) {
				self.cmd.range.setStartBefore(table).collapse(true);
				self.cmd.select();
				K(table).remove();
			} else {
				self.cmd.selection(true);
			}
			self.addBookmark();
		},
		rowdelete : function() {
			var table = self.plugin.getSelectedTable()[0],
				row = self.plugin.getSelectedRow()[0],
				cell = self.plugin.getSelectedCell()[0],
				rowIndex = row.rowIndex;
			// 从下到上删除
			for (var i = cell.rowSpan - 1; i >= 0; i--) {
				table.deleteRow(rowIndex + i);
			}
			if (table.rows.length === 0) {
				self.cmd.range.setStartBefore(table).collapse(true);
				self.cmd.select();
				K(table).remove();
			} else {
				self.cmd.selection(true);
			}
			self.addBookmark();
		}
	};
  //step-1
	self.clickToolbar(name, self.plugin.table.prop);
});
