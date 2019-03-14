(function ($) {
    'use strict';
    var FormBuilder = function (element, options) {
        var defaults = {
            disableFields: {
                before: '',
                after: ''
            },
            roles: {
                1: 'Administrator'
            },
            showWarning: false,
            messages: {
                disableFields: 'These fields cannot be moved.',
                editorTitle: 'Form Elements',
                fieldVars: 'Field Variables',
                hide: 'Edit',
                label: 'Field Name',
                mandatory: 'Mandatory',
                maxLength: 'Max Length',
                name: 'Name',
                preview: 'Preview',
                removeMessage: 'Remove Element',
                remove: '&#215;',
                required: 'Required',
                richText: 'Rich Text Editor',
                roles: 'Access',
                save: 'Save Template',
                text: 'Text Field',
                warning: 'Warning!',
                viewXML: 'View XML',
                yes: 'Yes'
            }
        };
        var startIndex, doCancel;
        // object full of useful utilities
        var _helpers = {
            startMoving: function (event, ui) {
                ui.item.addClass('moving');
                startIndex = $('li', this).index(ui.item);
            },
            stopMoving: function (event, ui) {
                ui.item.removeClass('moving');
                if (doCancel) {
                    $(ui.sender).sortable('cancel');
                    $(this).sortable('cancel');
                }
            },
            isNan: function (str) {
                return str.replace(/[^0-9]/g, '');
            },
            initTooltip: function (tt) {
                var tooltip = tt.find('.tooltip');
                tt.mouseenter(function () {
                    if (tooltip.outerWidth() > 200) {
                        tooltip.addClass('max-width');
                    }
                    tooltip.css('left', tt.width() + 14);
                    tooltip.stop(true, true).fadeIn('fast');
                }).mouseleave(function () {
                    tt.find('.tooltip').stop(true, true).fadeOut('fast');
                });
                tooltip.hide();
            },
            // saves the field data to our canvas (elem)
            save: function () {
                $(ulObj).children('li').not('.disabled').each(function () {
                    _helpers.saveOptions($(this));
                });
                // elem.val($(ulObj).toSpigitXML());
            },
            // saveOptions will generate the preview for radio and checkbox groups
            saveOptions: function (field) {
                if (!field.hasClass('10')) {
                    return false;
                }
                var preview = '';
                $('.sortable-options li', field).each(function () {
                    var option = $('.select-option', $(this))[0].outerHTML;
                    var label = $('.option', $(this)).val();
                    preview += option + ' ' + label + '<br/>';
                });
                $('.prev-holder', field).html(preview);
            },
            // update preview to label
            htmlEncode: function (value) {
                return $('<div/>').text(value).html();
            },
            htmlDecode: function (value) {
                return $('<div/>').html(value).text();
            },

        };
        // End helpers/ Utilities
        var opts = $.extend(defaults, options),
            elem = $(element),
            frmbID = 'frmb-' + $('ul[id^=frmb-]').length++;

        var field = '',
            lastID = 1,
            boxID = frmbID + '-control-box';

        // create array of field objects and create right sidebar menus
        var frmbFields = [{
            type: 11,
            'class': 'text-input',
            label: opts.messages.text
        }];
        // End Fields array obects
        var di = 1;
        // Create form builder canvas
        var cbUL = $('<ul/>', {
            id: boxID,
            'class': 'frmb-control'
        });
        /*******************Loop through create right sidebar menu list *****************/
        for (var i = frmbFields.length - 1; i >= 0; i--) {
            $('<li/>', {
                'class': frmbFields[i].class,
                'type': frmbFields[i].type,
                'name': frmbFields[i].class,
                'multiple': frmbFields[i].multiple,
                'label': frmbFields[i].label
            }).html(frmbFields[i].label).appendTo(cbUL);
        }
        /*******************END  create right sidebar menu list *****************/
        // Build our headers and action links
        var cbHeader = $('<h4/>').html(opts.messages.editorTitle),
            frmbHeader = $('<h4/>').html(opts.messages.preview);
        // Sortable fields
        var ulObj = $('<ul/>').attr('id', frmbID).addClass('frmb').sortable({
            cursor: 'move',
            opacity: 0.9,
            beforeStop: function (event, ui) {
                var lastIndex = $('> li', ulObj).length - 1,
                    curIndex = ui.placeholder.index();
                doCancel = ((curIndex <= 1) || (curIndex === lastIndex));
            },
            start: _helpers.startMoving,
            stop: _helpers.stopMoving,
            cancel: 'input, .disabled, .sortable-options',
            // items: 'li:not(.no-fields)',
            receive: function (event, ui) {

            },
            placeholder: 'frmb-placeholder'
        });
        // END Sortable Field
        // ControlBox with different fields
        cbUL.sortable({
            helper: 'clone',
            opacity: 0.9,
            connectWith: ulObj,
            cursor: 'move',
            placeholder: 'ui-state-highlight',
            start: _helpers.startMoving,
            stop: _helpers.stopMoving,
            revert: 150,
            change: function (event, ui) {
                if (ui.placeholder.index() === 0 || ui.placeholder.index() === $('> li', ulObj).last().index()) {
                    $(ui.placeholder).hide();
                } else {
                    $(ui.placeholder).show();
                }
            },
            remove: function (event, ui) {
                if (startIndex === 0) {
                    cbUL.prepend(ui.item);
                } else {
                    $('li:nth-child(' + startIndex + ')', cbUL).after(ui.item);
                }
            },
            beforeStop: function (event, ui) {
                var lastIndex = $('> li', ulObj).length - 1,
                    curIndex = ui.placeholder.index();
                doCancel = ((curIndex <= 1) || (curIndex === lastIndex) ? true : false);
                if (ui.placeholder.parent().hasClass('frmb-control')) {
                    doCancel = true;
                }
            },
            update: function (event, ui) {
                // _helpers.stopMoving;
                elem.stopIndex = ($('li', ulObj).index(ui.item) === 0 ? '0' : $('li', ulObj).index(ui.item));
                if ($('li', ulObj).index(ui.item) < 0) {
                    $(this).sortable('cancel');
                } else {
                    prepFieldVars($(ui.item[0]), true);
                }
            },
            receive: function (event, ui) {
                if (ui.sender.hasClass('frmb') || ui.sender.hasClass('frmb-control')) {
                    $(ui.sender).sortable('cancel');
                }
            }
        });
        // Replace the textarea with sortable controle**************************.
        elem.before(ulObj).parent().prepend(frmbHeader).addClass('frmb-wrap');
        var cbWrap = $('<div/>', { id: frmbID + '-cb-wrap', 'class': 'cb-wrap' }).append(cbHeader, cbUL);
        // Display the right sidebar control menus
        $('.frmb-wrap').before(cbWrap);
        // Parse saved XML template data
        elem.getTemplate = function () {
            var xml = (elem.val() !== '' ? $.parseXML(elem.val()) : ''),
                fields = $(xml).find('field');
            if (fields.length > 0) {
                prepFieldVars(fields);
            } else {
                //ulObj.prepend(opts.disableFields.before);
                //ulObj.append(opts.disableFields.after);
            }
        };

        var nameAttr = function (field) {
            var epoch = new Date().getTime();
            return field.attr('name') + '-' + epoch;
        };

        var prepFieldVars = function (fields, isNew) {
            isNew = isNew || false;
            fields.each(function () {
                var fType = $(this).attr('type'),
                    values = [];
                values.label = _helpers.htmlEncode($(this).attr('label'));
                values.name = isNew ? nameAttr($(this)) : $(this).attr('name');
                values.required = $(this).attr('required');
                values.maxLength = $(this).attr('max-length');
                values.type = fType;
                values.description = ($(this).attr('description') !== undefined ? _helpers.htmlEncode($(this).attr('description')) : '');
                appendNewField(values);
            });
        };

        /**
         * Append the new fields
         * @param values
         */
        var appendNewField = function (values) {

            if (values === undefined) {
                values = '';
            }
            // single line input type="text"
            var appendTextInput = function (values) {
                if (values.type == 11) {
                    var textInput = `<input type = "text"  name="text" id="text-field-${lastID}" class="obj-attr" / >`;
                }
                appendFieldLi(opts.messages.text, advFields(values), values, textInput);
            };
            // multi-line textarea
            var appendTextarea = function (values) {
                appendFieldLi(opts.messages.richText, advFields(values), values);
            };
            // TODO: refactor to move functions into this object
            var appendFieldType = {
                '2': appendTextInput,
                '3': appendTextInput,
                '9': appendTextInput,
                // '6': appendSelectList,
                '7': appendTextarea,
                '11': appendTextInput
            };

            appendFieldType[values.type](values);
        };
        // function is render when control drop
        var advFields = function (values) {
            // make popup form fields
            var advFields = '';
            advFields += `<div id="form-${lastID} ">
                  <div class="frm-fld name_wrap">
                      <label>Field Name <span class="required">*</span></label>
                      <input type="text" name="label" data-type="label" value="${values.label}" class="fld-label obj-attribute field_name" id="title-${lastID}">
                  </div>
                  <div class="frm-fld name_wrap"><label>Field Id <span class="required">*</span></label>
                      <input type="text"  name="name" data-type="attribute" value="${values.name}" class="fld-name obj-attribute field_id"  id="title-${lastID}">
                  </div>
                  <div class="frm-fld name_wrap">
                      <label>Default Value <span class="required">*</span></label>
                      <input type="text" name="name" data-type="attribute" value="" class="fld-name obj-attribute default_value" id="title-${lastID}">
                  </div>
                  <div class="frm-fld"><label></label>
                      <div class="frm-fld available-roles"></div>
                  </div>
                  </div>`;

            return advFields;
        };

        // Append the new field to the editor
        var appendFieldLi = function (title, field, values, textInput) {
            var label = ($(field).find('input[name="label"]').val() !== '' ? $(field).find('input[name="label"]').val() : title);

            var li = '',
                delBtn = '<a id="del_' + lastID + '" class="del-button btn delete-confirm" href="#" title="' + opts.messages.removeMessage + '">' + opts.messages.remove + '</a>',
                copyBtn = '<a id="copy_' + lastID + '" class="copy-buttton btn copy-confirm" href="javascript:void(0)" title="Copy" style="float: right">copy</a>',
                toggleBtn = '<a id="frm-' + lastID + '" class="toggle-form btn" href="#">' + opts.messages.hide + '</a> ',
                required = values.required,
                tooltip = values.description !== '' ? '<span class="element-info corner-all-3 tooltip-element">?<span class="tooltip tooltip-left-side corner-all-3" aria-required="true">' + values.description + '<span class="indicator top-side"></span></span></span>' : '';

            li += '<li id="frm-' + lastID + '-item" class="' + values.type + ' form-field " data="text">';
            li += '<div class="legend">';
            li += delBtn;
            li += copyBtn;
            li += '<span id="txt-title-' + lastID + '" class="field_label">' + label + '</span>' + tooltip + '<span class="required-asterisk" ' + (required === 'true' ? 'style="display:inline"' : '') + '> *</span>' + toggleBtn + '</div>';
            li += '<div class="prev-holder type_' + values.type + '">' + textInput + '</div>';
            li += '<div id="frm-' + lastID + '-fld" class="frm-holder">';

            li += ` <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">${opts.messages.text}</h4>
                        </div>
                        <div class="modal-body  obj-type" data-control="text-input">
                 
                            <input class="required" type="checkbox" value="1"    />
                            <label class="required_label" for="required-${lastID}">${opts.messages.required }</label>
                            ${field}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default close-modal" >Close</button>
                            <button type="button" class="btn btn-primary save-modal" >Save</button>
                        </div>
                    </div>
                </div>
            </div> `;

            if (elem.stopIndex) {
                $('li', ulObj).eq(elem.stopIndex).after(li);
            } else {
                $(ulObj).append(li);
                _helpers.initTooltip($('#frm-' + lastID + '-item').find('.tooltip-element'));
            }
            // $('#frm-' + lastID + '-item').hide().slideDown(250);
            $('#frm-' + lastID + '-item').click(function () {
                //$('#myModal').modal('show');

            });
            lastID++;
            _helpers.save();


        };
        // ---------------------- UTILITIES ---------------------- //

        $('#' + frmbID).delegate('.save-modal', 'click', function (e) {
            e.preventDefault();
            var parentModal = $(this).parent().parent();
            var controlType = parentModal.find('.obj-type').attr('data-control');
            if (controlType == 'text-input') {

                textFieldAppendValues();
            }
        });

        $('#' + frmbID).delegate('.close-modal', 'click', function (e) {
            $(this).modal('hide');
        });

        function textFieldAppendValues() {
            lastID--;
            var frmId = 'frm-' + lastID + '-item';
            var $field = $("#frmb-0").find("#" + frmId);
            var fieldName = $field.find('.field_name').val();
            var fieldId = $field.find('.field_id').val();
            var defaultValue = $field.find('.default_value').val();
            $field.find('#txt-title-' + lastID).text(fieldName);
            $field.find('#text-field-' + lastID).val(defaultValue);
        }

        $('#frm-' + lastID + '-item').click(function () {
            $("#myModal").modal('hide');

        });
        // toggle fields attributes or left side
        $('#' + frmbID).delegate('.toggle-form', 'click', function (e) {
            console.log("toggle form");
            e.preventDefault();
            var targetID = $(this).attr('id');
            $('#myModal').modal('show');
            // $(this).toggleClass('open').parent().next('.prev-holder').slideToggle(250, _helpers.saveOptions($(this).parents('li:eq(0)')));
            $('#' + targetID + '-fld').slideToggle(250, function () {
            });
        });

        /**
         * Make the form JSON from fields
         */
        $("#get-json").click(function () {
           var fieldJson = [];
           var formName = $("#form_name").val();
           var jsonOb = [];
           $(".form-field").each(function (index,item) {
               var type = $(item).attr('data');
               var fieldObj = {};
               if (type == 'text')  {
                   var attrValue = $(item).find('.obj-attr').val();
                   var label =   $(item).find('.field_label').text();
                   var fieldId =   $(item).find('.field_id').val();
                   fieldObj.type = type;
                   fieldObj.label = label;
                   fieldObj.value = attrValue;
                   fieldObj.fieldId = fieldId;
                   fieldObj.className = type;
                   //jsonOb.push(fieldObj);
                   fieldJson.push(fieldObj);
               }
           });
            var formJson = {
                "formName":formName,
                "fields":fieldJson
            };
            $("#formJson").text(JSON.stringify(formJson));
        });

        // Delete field
        $('#' + frmbID).delegate('.delete-confirm', 'click', function (e) {
            e.preventDefault();
            let liId = $(this).closest('li').attr('id');
            $('#' + liId).slideUp(250, function () {
                $(this).remove();
                _helpers.save();
            });
            return false;
        });

        // copy field
        $('#' + frmbID).delegate('.copy-confirm', 'click', function (e) {

            var d = $(this).parent().parent().clone();
            $(this).parent().parent().attr('id', 'frm-' + lastID + '-item');
            $(this).parent().parent().parent().append(d);
            console.log($(this).parent().children('.toggle-form'));
            $(this).parent().children('.toggle-form').attr('id', 'frm-' + lastID);
            lastID++;
            $(".modal-backdrop").hide();

        });

        elem.parent().find('p[id*="ideaTemplate"]').remove();
        elem.wrap('<div class="template-textarea-wrap"/>');
        elem.getTemplate();

    }; // END F


    $.fn.formBuilder = function (options) {
        var form = this;
        return form.each(function () {
            var element = $(this);
            if (element.data('formBuilder')) {
                return;
            }
            var formBuilder = new FormBuilder(this, options);
            element.data('formBuilder', formBuilder);
        });
    };
})(jQuery);
