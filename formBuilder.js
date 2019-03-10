/**
 * jQuery Form Builder
 * Description: A drag and drop editor to make building forms fast and easy.
 * Version: 1.0.1
 * Author: Kevin Chappell
 */
(function($) {
  'use strict';
  var FormBuilder = function(element, options) {

    var defaults = {
      disableFields: {
        before: '',
        after: ''
      },
      roles: {
        1: 'Administrator'
      },
      showWarning: false,
      serializePrefix: 'frmb',
      messages: {
        add: 'Add Item',
        allowSelect: 'Allow Select',
        autocomplete: 'Autocomplete',
        cannotBeEmpty: 'This field cannot be empty',
        checkboxGroup: 'Checkbox Group',
        checkbox: 'Checkbox',
        checkboxes: 'Checkboxes',
        clearAllMessage: 'Are you sure you want to remove all items?',
        clearAll: 'Clear All',
        close: 'Close',
        copy: 'Copy To Clipboard',
        dateField: 'Date Field',
        description: 'Help Text',
        descriptionField: 'Description',
        devMode: 'Developer Mode',
        disableFields: 'These fields cannot be moved.',
        editNames: 'Edit Names',
        editorTitle: 'Form Elements',
        editXML: 'Edit XML',
        fieldVars: 'Field Variables',
        fieldRemoveWarning: 'Ideas have already been submitted to this community. If you remove this field you will no longer be able to use it for idea submission. The data will still be available for reporting. Are you sure you want to proceed?',
        hide: 'Edit',
        label: 'Label',
        labelEmpty: 'Field Label cannot be empty',
        limitRole: 'Limit access to one or more of the following roles:',
        mandatory: 'Mandatory',
        maxLength: 'Max Length',
        minOptionMessage: 'This field requires a minimum of 2 options',
        name: 'Name',
        no: 'No',
        off: 'Off',
        on: 'On',
        optional: 'optional',
        optionPlaceholder: 'Value',
        optionEmpty: 'Option value required',
        paragraph: 'Paragraph',
        preview: 'Preview',
        radioGroup: 'Radio Group',
        radio: 'Radio',
        removeMessage: 'Remove Element',
        remove: '&#215;',
        required: 'Required',
        richText: 'Rich Text Editor',
        roles: 'Access',
        save: 'Save Template',
        selectOptions: 'Select Items',
        select: 'Select',
        selectionsMessage: 'Allow Multiple Selections',
        text: 'Text Field',
        warning: 'Warning!',
        viewVars: 'View Field Variables',
        viewXML: 'View XML',
        yes: 'Yes'
      }
    };

    var startIndex, doCancel;

    // object full of useful utilities
    var _helpers = {
      startMoving: function(event, ui) {
        ui.item.addClass('moving');
        startIndex = $('li', this).index(ui.item);
      },
      stopMoving: function(event, ui) {
        ui.item.removeClass('moving');
        if (doCancel) {
          $(ui.sender).sortable('cancel');
          $(this).sortable('cancel');
        }
      },
      safename: function(str) {
        return str.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase();
      },
      isNan: function(str) {
        return str.replace(/[^0-9]/g, '');
      },
      initTooltip: function(tt) {
        var tooltip = tt.find('.tooltip');
        tt.mouseenter(function() {
          if (tooltip.outerWidth() > 200) {
            tooltip.addClass('max-width');
          }
          tooltip.css('left', tt.width() + 14);
          tooltip.stop(true, true).fadeIn('fast');
        }).mouseleave(function() {
          tt.find('.tooltip').stop(true, true).fadeOut('fast');
        });
        tooltip.hide();
      },
      // saves the field data to our canvas (elem)
      save: function() {
        $(ulObj).children('li').not('.disabled').each(function() {
          _helpers.saveOptions($(this));
        });
       // elem.val($(ulObj).toSpigitXML());
      },
      // saveOptions will generate the preview for radio and checkbox groups
      saveOptions: function(field) {
        if (!field.hasClass('10')) {
          return false;
        }
        var preview = '';
        $('.sortable-options li', field).each(function() {
          var option = $('.select-option', $(this))[0].outerHTML;
          var label = $('.option', $(this)).val();
          preview += option + ' ' + label + '<br/>';
        });
        $('.prev-holder', field).html(preview);
      },
      // update preview to label
      updateMultipleSelect: function() {
        $('#' + frmbID).delegate('input[name="multiple"]', 'change', function() {
          var options = $(this).parents('.fields:eq(0)').find('.sortable-options input.select-option');
          if (this.checked) {
            options.each(function() {
              $(this).prop('type', 'checkbox');
            });
          } else {
            options.each(function() {
              $(this).removeAttr('checked').prop('type', 'radio');
            });
          }
        });
      },
      htmlEncode: function(value) {
        return $('<div/>').text(value).html();
      },
      htmlDecode: function(value) {
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

    // create array of field objects to cycle through
    var frmbFields = [{
      type: 11,
      'class': 'text-input',
      label: opts.messages.text
    }];
    // End Fields array obects


    var di = 1;
    // prep disabled fields
    for (var prop in opts.disableFields) {
      if (opts.disableFields.hasOwnProperty(prop)) {
        if (opts.disableFields[prop] !== undefined) {
          opts.disableFields[prop] = '<li class="disabled clearfix disabled_' + di + '">' + opts.disableFields[prop] + '</li>';
        }
      }
    }
    // Create form builder canvas
    var cbUL = $('<ul/>', {
      id: boxID,
      'class': 'frmb-control'
    });

    // Loop through
    for (var i = frmbFields.length - 1; i >= 0; i--) {
      $('<li/>', {
        'class': frmbFields[i].class,
        'type': frmbFields[i].type,
        'name': frmbFields[i].class,
        'multiple': frmbFields[i].multiple,
        'label': frmbFields[i].label
      }).html(frmbFields[i].label).appendTo(cbUL);
    }

    // Build our headers and action links
    var cbHeader = $('<h4/>').html(opts.messages.editorTitle),
      frmbHeader = $('<h4/>').html(opts.messages.preview),
      viewXML = $('<a/>', {
        id: frmbID + '-export-xml',
        text: opts.messages.viewXML,
        href: '#',
        'class': 'view-xml'
      }),
      allowSelect = $('<a/>', {
        id: frmbID + '-allow-select',
        text: opts.messages.allowSelect,
        href: '#',
        'class': 'allow-select'
      }),
      editXML = $('<a/>', {
        id: frmbID + '-edit-xml',
        text: opts.messages.editXML,
        href: '#',
        'class': 'edit-xml'
      }),
      editNames = $('<a/>', {
        id: frmbID + '-edit-names',
        text: opts.messages.editNames,
        href: '#',
        'class': 'edit-names'
      }),
      clearAll = $('<a/>', {
        id: frmbID + '-clear-all',
        text: opts.messages.clearAll,
        href: '#',
        'class': 'clear-all'
      }),
      saveAll = $('<div/>', {
        id: frmbID + '-save',
        href: '#',
        'class': 'button-primary',
        title: opts.messages.save
      }).html('<a class="save speuiButton_v1 corner-all-3 primary"><span>' + opts.messages.save + '</span></a>'),
      viewVars = $('<a/>', {
        id: frmbID + '-view-vars',
        href: '#',
        'class': 'view-vars',
        title: opts.messages.viewVars
      }).html(opts.messages.viewVars),
      actionLinksInner = $('<div/>', {
        id: frmbID + '-action-links-inner',
        'class': 'action-link-inner'
      }).append(editXML, ' | ', viewVars, ' | ', editNames, ' | ', allowSelect, ' | ', clearAll, ' |&nbsp;'),
      devMode = $('<span/>', {
        'class': 'dev-mode-link'
      }).html(opts.messages.devMode + ' ' + opts.messages.off),
      actionLinks = $('<div/>', {
        id: frmbID + '-action-links',
        'class': 'action-links'
      }).append(actionLinksInner, devMode);


    // Sortable fields
    var ulObj = $('<ul/>').attr('id', frmbID).addClass('frmb').sortable({
      cursor: 'move',
      opacity: 0.9,
      beforeStop: function(event, ui) {
        var lastIndex = $('> li', ulObj).length - 1,
            curIndex = ui.placeholder.index();
        doCancel = ((curIndex <= 1) || (curIndex === lastIndex));
      },
      start: _helpers.startMoving,
      stop: _helpers.stopMoving,
      cancel: 'input, .disabled, .sortable-options',
      // items: 'li:not(.no-fields)',
      receive: function(event, ui) {
        // if (doCancel) {
        //   $('li:nth-child(' + curIndex + ')', $(this)).remove();
        // }
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
      change: function(event, ui) {
        if (ui.placeholder.index() === 0 || ui.placeholder.index() === $('> li', ulObj).last().index()) {
          $(ui.placeholder).hide();
        } else {
          $(ui.placeholder).show();
        }
      },
      remove: function(event, ui) {
        if (startIndex === 0) {
          cbUL.prepend(ui.item);
        } else {
          $('li:nth-child(' + startIndex + ')', cbUL).after(ui.item);
        }
      },
      beforeStop: function(event, ui) {
        var lastIndex = $('> li', ulObj).length - 1,
          curIndex = ui.placeholder.index();
        doCancel = ((curIndex <= 1) || (curIndex === lastIndex) ? true : false);
        if (ui.placeholder.parent().hasClass('frmb-control')) {
          doCancel = true;
        }
      },
      update: function(event, ui) {
        // _helpers.stopMoving;
        elem.stopIndex = ($('li', ulObj).index(ui.item) === 0 ? '0' : $('li', ulObj).index(ui.item));
        if ($('li', ulObj).index(ui.item) < 0) {
          $(this).sortable('cancel');
        } else {
          prepFieldVars($(ui.item[0]), true);
        }
      },
      receive: function(event, ui) {
        if (ui.sender.hasClass('frmb') || ui.sender.hasClass('frmb-control')) {
          $(ui.sender).sortable('cancel');
        }
      }
    });

    // Replace the textarea with sortable list.
    elem.before(ulObj).parent().prepend(frmbHeader).addClass('frmb-wrap').append(saveAll, viewXML, actionLinks);

    var cbWrap = $('<div/>', {
      id: frmbID + '-cb-wrap',
      'class': 'cb-wrap'
    }).append(cbHeader, cbUL);

    $('.frmb-wrap').before(cbWrap).append(actionLinks);

    // Not pretty but we need to save a lot so users don't have to keep clicking a save button
    // Parse saved XML template data
    elem.getTemplate = function() {
      var xml = (elem.val() !== '' ? $.parseXML(elem.val()) : ''),
        fields = $(xml).find('field');
      if (fields.length > 0) {
        prepFieldVars(fields);
      } else if (xml === '') {
        // Load default fields if none are set
        var values = {
          label: opts.messages.descriptionField,
          name: 'content',
          required: 'true',
          description: opts.messages.mandatory,
          type: '7'
        };
        appendNewField(values);
        ulObj.prepend(opts.disableFields.before);
        ulObj.append(opts.disableFields.after);
      } else {
        ulObj.prepend(opts.disableFields.before);
        ulObj.append(opts.disableFields.after);
      }
    };

    var nameAttr = function(field) {
      var epoch = new Date().getTime();
      return field.attr('name') + '-' + epoch;
    };

    var prepFieldVars = function(fields, isNew) {
      isNew = isNew || false;
      fields.each(function() {
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
      if ($('li.disabled', ulObj).length < 2) {
        ulObj.prepend(opts.disableFields.before);
        ulObj.append(opts.disableFields.after);
      }
    };


    var appendNewField = function(values) {

      if (values === undefined) {
        values = '';
      }

      // single line input type="text"
      var appendTextInput = function(values) {
        appendFieldLi(opts.messages.text, advFields(values), values);
      };
      // multi-line textarea
      var appendTextarea = function(values) {
        appendFieldLi(opts.messages.richText, advFields(values), values);
      };
      // append checkbox
      // add select dropdown
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

    var advFields = function(values) {

      var advFields = '',
        key,
        roles = values.role !== undefined ? values.role.split(',') : [];
      var fieldLabel = $('<div>', {class:'frm-fld'});
      $('<label/>').html(opts.messages.label+' *').appendTo(fieldLabel);
      $('<input>', {type: 'text', name:'label', value: values.label, class: 'fld-label'}).appendTo(fieldLabel);
      advFields += fieldLabel[0].outerHTML;

      var fieldDesc = $('<div>', {class: 'frm-fld description-wrap'});
      $('<label/>').html(opts.messages.description+' *').appendTo(fieldDesc);
      // $('<input>', )

      advFields += '<div class="frm-fld description-wrap"><label>' + opts.messages.description + '</label>';
      advFields += '<input type="text" name="description" value="' + values.description + '" class="fld-description" id="description-' + lastID + '" /></div>';

      advFields += '<div class="frm-fld name_wrap"><label>' + opts.messages.name + ' <span class="required">*</span></label>';
      advFields += '<input type="text" name="name" value="' + values.name + '" class="fld-name" id="title-' + lastID + '" /></div>';

      advFields += '<div class="frm-fld"><label>' + opts.messages.roles + '</label>';

      advFields += '<input type="checkbox" name="enable_roles" value="" ' + (values.role !== undefined ? 'checked' : '') + ' id="enable_roles-' + lastID + '"/> <label for="enable_roles-' + lastID + '" class="roles_label">' + opts.messages.limitRole + '</label>';
      advFields += '<div class="frm-fld available-roles" ' + (values.role !== undefined ? 'style="display:block"' : '') + '>';

      for (key in opts.roles) {
        if ($.inArray(key, ['3', '4']) === -1) {
          advFields += '<input type="checkbox" name="roles[]" value="' + key + '" id="fld-' + lastID + '-roles-' + key + '" ' + ($.inArray(key, roles) !== -1 ? 'checked' : '') + ' class="roles-field" /><label for="fld-' + lastID + '-roles-' + key + '">' + opts.roles[key] + '</label><br/>';
        }
      }
      advFields += '</div></div>';

      // if field type is not checkbox, checkbox/radio group or select list, add max length
      if ($.inArray(values.type, ['5', '6', '10', '3', '9']) < 0) {
        advFields += '<div class="frm-fld"><label class="max-length-label">' + opts.messages.maxLength + '</label>';
        advFields += '<input type="text" name="max-length" max-length="4" value="' + (values.maxLength !== undefined ? values.maxLength : '') + '" class="fld-max-length" id="max-length-' + lastID + '" /></div>';
      }

      return advFields;
    };

    // Append the new field to the editor
    var appendFieldLi = function(title, field, values) {



      var label = ($(field).find('input[name="label"]').val() !== '' ? $(field).find('input[name="label"]').val() : title);


      var li = '',
        delBtn = '<a id="del_' + lastID + '" class="del-button btn delete-confirm" href="#" title="' + opts.messages.removeMessage + '">' + opts.messages.remove + '</a>',
        toggleBtn = '<a id="frm-' + lastID + '" class="toggle-form btn" href="#">' + opts.messages.hide + '</a> ',
        required = values.required,
        tooltip = values.description !== '' ? '<span class="element-info corner-all-3 tooltip-element">?<span class="tooltip tooltip-left-side corner-all-3" aria-required="true">' + values.description + '<span class="indicator top-side"></span></span></span>' : '';

      li += '<li id="frm-' + lastID + '-item" class="' + values.type + ' form-field">';
      li += '<div class="legend">';
      li += delBtn;
      li += '<span id="txt-title-' + lastID + '" class="field_label">' + label + '</span>' + tooltip + '<span class="required-asterisk" ' + (required === 'true' ? 'style="display:inline"' : '') + '> *</span>' + toggleBtn + '</div>';
      li += '<div class="prev-holder type_' + values.type + '"></div>';
      li += '<div id="frm-' + lastID + '-fld" class="frm-holder">';

      li += '<div class="modal fade" id="myModal" role="dialog"> <div class="modal-dialog">\n' +
          '<div class="modal-content">' +
          '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button>' +
          '<h4 class="modal-title">Modal Header</h4>\n' +
          '        </div>\n' +
          '        <div class="modal-body">\n';

      li += '<input class="required" type="checkbox" value="1" name="required-' + lastID + '" id="required-' + lastID + '"' + (required === 'true' ? ' checked="checked"' : '') + ' /><label class="required_label" for="required-' + lastID + '">' + opts.messages.required + '</label>';
      li += field;
      li += '</div>\n' +
          '        <div class="modal-footer">\n' +
          '            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
          '            </div>\n' +
          '            </div>\n' +
          '            </div>\n' +
          '            </div>';

      console.log(li);

      //
      /*li += '<div class="frm-elements">';
      li += '<div class="frm-fld">';
      li += '<label>&nbsp;</label>';
      li += '<input class="required" type="checkbox" value="1" name="required-' + lastID + '" id="required-' + lastID + '"' + (required === 'true' ? ' checked="checked"' : '') + ' /><label class="required_label" for="required-' + lastID + '">' + opts.messages.required + '</label>';
      li += '</div>';
      li += field;
      li += '</div>';
      li += '</div>';
      li += '</li>';*/

      if (elem.stopIndex) {
        $('li', ulObj).eq(elem.stopIndex).after(li);
      } else {
        $(ulObj).append(li);
        _helpers.initTooltip($('#frm-' + lastID + '-item').find('.tooltip-element'));
      }

     // $('#frm-' + lastID + '-item').hide().slideDown(250);
      $('#frm-' + lastID + '-item').click(function () {
          $('#myModal').modal('show');

      });

      lastID++;
     // _helpers.save();
    };

    // Select field html, since there may be multiple
    var selectFieldHtml = function(values, name, selected, multiple) {
      var selectedType = (multiple ? 'checkbox' : 'radio');
      field = '<li>';
      field += '<input type="' + selectedType + '" ' + selected + ' class="select-option" name="' + name + '" />';
      field += '<input type="text" class="option" placeholder="' + opts.messages.optionPlaceholder + '" value="' + values + '" />';
      field += '<a href="#" class="remove btn" title="' + opts.messages.removeMessage + '">' + opts.messages.remove + '</a>';
      field += '</li>';

      return field;
    };

    // ---------------------- UTILITIES ---------------------- //

    // delete options
    // toggle fields attributes or left side
    $('#' + frmbID).delegate('.toggle-form', 'click', function(e) {
      e.preventDefault();
      var targetID = $(this).attr('id');
      $(this).toggleClass('open').parent().next('.prev-holder').slideToggle(250, _helpers.saveOptions($(this).parents('li:eq(0)')));

      //console.log($('#' + targetID + '-fld')[0]);

      $('#' + targetID + '-fld').slideToggle(250, function() {});
    });


    // Delete field
    $('#' + frmbID).delegate('.delete-confirm', 'click', function(e) {
      e.preventDefault();

      // lets see if the user really wants to remove this field... FOREVER
      var fieldWarnH3 = $('<h3/>').html('<span></span>' + opts.messages.warning),
        deleteID = $(this).attr('id').replace(/del_/, ''),
        delBtn = $(this),
        toolTipPageX = delBtn.offset().left - $(window).scrollLeft(),
        toolTipPageY = delBtn.offset().top - $(window).scrollTop();

      if (opts.showWarning) {
        jQuery('<div />').append(fieldWarnH3, opts.messages.fieldRemoveWarning).dialog({
          modal: true,
          resizable: false,
          width: 300,
          dialogClass: 'ite-warning',
          open: function() {
            $('.ui-widget-overlay').css({
              'opacity': 0.0
            });
          },
          position: [toolTipPageX - 282, toolTipPageY - 178],
          buttons: [{
            text: opts.messages.yes,
            click: function() {
              $('#frm-' + deleteID + '-item').slideUp(250, function() {
                $(this).remove();
                _helpers.save();
              });
              $(this).dialog('close');
            }
          }, {
            text: opts.messages.no,
            'class': 'cancel',
            click: function() {
              $(this).dialog('close');
            }
          }]
        });
      } else {
        $('#frm-' + deleteID + '-item').slideUp(250, function() {
          $(this).remove();
          _helpers.save();
        });
      }
    });

    elem.parent().find('p[id*="ideaTemplate"]').remove();
    elem.wrap('<div class="template-textarea-wrap"/>');
    elem.getTemplate();

  }; // END F


  $.fn.formBuilder = function(options) {
    var form = this;
    return form.each(function() {
      var element = $(this);
      if (element.data('formBuilder')) {
        return;
      }
      var formBuilder = new FormBuilder(this, options);
      element.data('formBuilder', formBuilder);
    });
  };
})(jQuery);
