(function ($) {
    'use strict';

    var FormBuilder = function (element, options) {

        let defaults = {
            messages: {
                name: 'Name',
                removeMessage: 'Remove Element',
                required: 'Required',
                text: 'Text Field',
                textarea: 'Text Area',
                number: 'Number',
            },
            images: {
                text: 'images/rightbar_icon11.png',
                textarea: 'images/rightbar_icon9.png',
                number: 'images/rightbar_icon2.png'
            }
        };
        /* object full of useful utilities */
        let opts = $.extend(defaults, options), elem = $(element), frmbID = 'formb-' + $('ul[id^=frmb-]').length++;
        let field = '',
            lastID = 1,
            boxID = frmbID + '-control-box';

        // create array of field objects and create right sidebar menus
        let frmbFields = [
            {
                type: 1,
                'class': 'text-input',
                label: opts.messages.text,
                image: opts.images.text
            },
            {
                type: 2,
                'class': 'textarea-input',
                label: opts.messages.textarea,
                image: opts.images.textarea
            }

        ];
        // Create form builder canvas

        var $fieldsList = $('.formDesign_p1').find('.add_element_list').find('ul');

        /*******************Loop through create right sidebar menu list *****************/
        for (var i = 0; i < frmbFields.length; i++) {
            let $anchor = `<a href="javascript:void(0);"><i><img src="${frmbFields[i].image}" alt="#"></i><span>${frmbFields[i].label}</span></a>`;
            let fieldList = $("<li/>", {
                'class': frmbFields[i].class,
                'type': frmbFields[i].type,
                'name': frmbFields[i].class,
            }).append($anchor);
            $fieldsList.append(fieldList)
        }
        /*******************END  create right sidebar menu list *****************/

        var setElemenType;

        var section_id = 1000;
        var fieldID = 1;
        var sectionID;


       /* var ulObj = $('#dropForm').sortable({

            drop: function(event, ui) {
                console.log('Drppped Element');
            },

        });*/


        var ulObj = $('#dropForm').sortable({
            cursor: 'move',
            opacity: 0.9,
            handle: ".sort_section",//".sort_handle",
            receive: function (event, ui) {
                console.log('receive element');
            },
            update: function (event, ui) {

            },
            stop: function (event, ui) {

                console.log("event", event);
                console.log("ui", ui.item);
                console.log('sortable called');

                if (ui.item.attr("name")) {
                    // save default object in localstorage
                    var fieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
                    var fieldSchemaLength = Object.keys(fieldSchema).length;
                    var field_section_id;
                    var field_id;
                    if (fieldSchemaLength == 0) {
                        fieldSchemaLength++;
                        field_section_id = section_id + fieldSchemaLength;
                        field_id = field_section_id + '_' + fieldSchemaLength;
                    } else {

                        field_section_id = section_id + fieldSchemaLength;
                        fieldSchemaLength++;
                        for (var sectionkey in fieldSchema) {
                            var sectionData = fieldSchema[sectionkey];
                            if (typeof sectionData[field_section_id] !== 'undefined') {
                                if (sectionData[field_section_id].section_id == field_section_id) {
                                    var sectionFields = sectionData[field_section_id].fields;
                                    field_section_id = section_id + fieldSchemaLength;
                                    field_id = field_section_id + '_' + sectionFields.length;
                                    field_section_id = section_id + fieldSchemaLength;
                                }
                            }
                        }
                    }

                    saveDefaultFieldsObject(ui.item, field_section_id, field_id);
                    setElemenType = ui.item;
                    // setHTML on basis of type
                    console.log("attribute name: ", ui.item.attr("name"));
                    var fieldHtml = setFieldHtml(ui.item, field_section_id, field_id);
                    ui.item.before(fieldHtml);
                    ui.item.remove();

                    // end dyanmic field generate

                    // ====================== APPLY RESIZEABLE =============================

                    let tempLastId = field_id;
                    let elemId = ".formRow-" + (tempLastId) + " " + ".left-resizeable-" + tempLastId;

                    $(elemId).resizable({
                        alsoResizeReverse: ".right-resizeable-" + tempLastId,
                        handles: {
                            e: "#handle",
                        },
                        resize: function (event, ui) {
                            console.log("resizing...");
                        },
                        stop: function (event, ui) {
                        }
                    });

                    // ====================== APPLY RESIZEABLE =============================
                }
            }
        });
        // ControlBox with different fields
        $(".add_element_list li").draggable({
            cancel: ".stopDraggable",
            cursorAt: {left: 125, top: 15},
            connectToSortable:"#dropForm",
            helper: 'clone',
            revert: false,
            start: function (event, ui) {
            },
            drag: function (event, ui) {
            },
            stop: function (event, ui) {
            },

        });
        /**
         * Extract Id with format field_12313
         * @param str
         * @returns {string}
         */
        var extractId = function (str) {
            let params = str.split('_');
            let id = params[params.length - 1];
            return parseInt(id);
        };

        var nameAttr = function (field) {
            var epoch = new Date().getTime();
            return field.attr('name') + '-' + epoch;
        };
        /**
         * save default object of every field in local storage
         * @param obj
         */
        var saveDefaultFieldsObject = function (obj, sectionID, fieldID) {
            let type = $(obj).attr("name");
            let fieldObj = {};

            switch (type) {
                case 'text-input':
                    fieldObj = {
                        "type": type,
                        "field_id": fieldID,
                        "basic_properties": {
                            "field_name": '',
                            "field_id": '',
                            "default_value": '',
                            "placeholder": '',
                            "required": false,
                            "hide_label": false,
                            "add_picture": false,
                            "field_under_label": false,
                            "is_preloaded_paragraph": false,
                            "view_only": false,
                            "hide_field_label": false,
                            "add_notes": false,
                            "exclude_from_pdf_report": false,

                        },
                        "validate_properties": {
                            "select_validate_condition": '',
                            "regular_expression": '',
                            "error_message": '',
                        },
                        "format_properties": {
                            "label_name_format": '',
                            "field_name_format": '',
                        },
                        "setting_properties": {
                            "value_setting_option": '',
                            "value_setting_text": ''
                        },
                        "report_properties": {
                            "is_process_field_reporting": false,
                            "select_process_category_variable": '',
                        },
                        "help_properties": {
                            "help_message": '',

                        }
                    };
                    break;
            }

            var defaultSectionObj = {
                [sectionID]: {
                    "name": "section_name",
                    "setting": "ON",
                    "section_id": sectionID,
                    "fields": [fieldObj]
                }
            };

            /* var defaultObj = {
                 "section":defaultSectionObj
             };*/

            var fieldSchema = JSON.parse(localStorage.getItem("schema")) || [];
            fieldSchema.push(defaultSectionObj);
            window.localStorage.setItem('schema', JSON.stringify(fieldSchema));

        };

        // Display the right sidebar control menus
        var setFieldHtml = function (obj, sectionID, fieldID) {
            let type = $(obj).attr("name");
            let fieldHtml = '';

            switch (type) {
                case 'text-input':
                    fieldHtml += `<div class="form_rowHover group_container " id="section_${sectionID}" >
                                  <div class="formRow clearfix element_main_row_container formRow-${fieldID} innerBox" >
                                      <div class="element_main_cell">
                                          <div class="element_inline_cell">
                                              <div class="formCell left-resizeable left-resizeable-${fieldID}">
                                                  <div class="form_heading"><span><br></span></div>
                                                  <a id="handle" class="ui-resizable-handle ui-resizable-e resizeHandler_cstm"></a>
                                              </div>
                                              <div id="innerElement_${fieldID}" class="formCell  col12 right-resizeable right-resizeable-${fieldID}" style="padding: 0px">
                                                  <div class="form_editRow">
                                                      <div class="form_heading form_heading_dev" >
                                                      <span class="field_label" id="fieldLabel_${fieldID}" >${defaults.messages.text}</span></div>
                                                      <div class="form_editRow_inner">
                                                          <div class="controle_row_main"></div>
                                                          <div class="form_field">
                                                              <input type="text" placeholder="" value="" class="filed_name" id="fieldName_${fieldID}"> </div>
                                                          <div class="dotted_icon">
                                                              <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a>
                                                              <ul>
                                                                  <li>
                                                                      <a href="javascript:void(0);" id="left-cell-insertion" data-section-id="${sectionID}"  data-field-id="${fieldID}" type="${type}"><img src="images/dottedpopup_icon1.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a href="javascript:void(0);" id="right-cell-insertion" type="${type}" data-section-id="${sectionID}"  data-field-id="${fieldID}"><img src="images/dottedpopup_icon2.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="copy-row-in-section" data-section-id ="${sectionID}" data-field-id="${fieldID}" class=""  href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="delete-row-from-section" data-section-id="${sectionID}"  data-field-id="${fieldID}" class="deleteFieldBox"  href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="editPopup_${fieldID}" data-section-id ="${sectionID}"  data-field-id="${fieldID}" class="formSmallBox_edit " type="${type}" id="editPopup_${fieldID}" class="formSmallBox_edit " type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a href="javascript:void(0);" class="sort_handle"><img src="images/dottedpopup_icon6.png" alt="#"></a>
                                                                  </li>
                                                              </ul>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div id="formBuilder"></div>
                                  <div class="form_rowHover_popup ">
                                      <ul>
                                          <li class="sort_section">
                                              <a href="javascript:void(0);"><img src="images/blue4_dottes.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a id="copySection_${sectionID}" data-section-id ="${sectionID}" data-field-id="${fieldID}" class="copySectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a id="deleteSection_${sectionID}" data-section-id="${sectionID}"  data-field-id="${fieldID}" class="deleteSectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a class="formSmallBox_edit " href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a>
                                          </li>
                                      </ul>
                                  </div>
                              </div>`;
                    break;
                default:
                    fieldHtml += `<div class="form_rowHover">
                                   <div class="formRow clearfix">
                                      <div class="formCell col12">
                                         <div class="form_editRow field-${fieldID}">
                                            <div class="form_heading"><span>Number Field</span></div>
                                            <div class="form_editRow_inner">
                                               <div class="controle_row_main">
                                                  <a href="javascript:void(0);"></a> 
                                                  <div class="controle_row_popup"><span>X pos: <b>550</b></span> </div>
                                               </div>
                                               <div class="form_field"> <input type="text" placeholder=""> </div>
                                               <div class="dotted_icon">
                                                  <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a> 
                                                  <ul>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon1.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon2.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                                     <li><a id=" editPopup_${fieldID}" class="formSmallBox_edit" type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);" class="sort_handle"><img src="images/dottedpopup_icon6.png" alt="#"></a></li>
                                                  </ul>
                                               </div>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                   <div id="formBuilder"></div>
                                   <div class="form_rowHover_popup">
                                      <ul>
                                         <li><a href="javascript:void(0);"><img src="images/blue4_dottes.png" alt="#"></a></li>
                                         <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                         <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                         <li><a class="formSmallBox_edit" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
                                      </ul>
                                   </div>
                                </div>`;
                    break;
            }

            return fieldHtml;


        };


        // Display the right sidebar control menus
        var copyRowInSection = function (type, sectionId, fieldId) {

            let fieldHtml = '';

            switch (type) {
                case 'text-input':
                    fieldHtml += `<div class="formRow clearfix element_main_row_container formRow-${fieldId} innerBox" >
                                      <div class="element_main_cell">
                                          <div class="element_inline_cell">
                                              <div class="formCell left-resizeable left-resizeable-${fieldId}">
                                                  <div class="form_heading"><span><br></span></div>
                                                  <a id="handle" class="ui-resizable-handle ui-resizable-e resizeHandler_cstm"></a>
                                              </div>
                                              <div id="innerElement_${fieldId}" class="formCell  col12 right-resizeable right-resizeable-${fieldId}" style="padding: 0px">
                                                  <div class="form_editRow">
                                                      <div class="form_heading form_heading_dev" >
                                                      <span class="field_label" id="fieldLabel_${fieldId}" >${defaults.messages.text}</span></div>
                                                      <div class="form_editRow_inner">
                                                          <div class="controle_row_main"></div>
                                                          <div class="form_field">
                                                              <input type="text" placeholder="" value="" class="filed_name" id="fieldName_${fieldId}"> </div>
                                                          <div class="dotted_icon">
                                                              <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a>
                                                              <ul>
                                                                  <li>
                                                                      <a href="javascript:void(0);" id="left-cell-insertion" data-section-id="${sectionId}"  data-field-id="${fieldId}" type="${type}"><img src="images/dottedpopup_icon1.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a href="javascript:void(0);" id="right-cell-insertion" type="${type}" data-section-id="${sectionId}"  data-field-id="${fieldId}"><img src="images/dottedpopup_icon2.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="copy-row-in-section" data-section-id ="${sectionId}" data-field-id="${fieldId}" href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="delete-row-from-section" data-section-id="${sectionId}"  data-field-id="${fieldId}" class="deleteFieldBox"  href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="editPopup_${fieldId}" data-section-id ="${sectionId}"  data-field-id="${fieldId}" class="formSmallBox_edit " type="${type}" id="editPopup_${fieldId}" class="formSmallBox_edit " type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a href="javascript:void(0);" class="sort_handle"><img src="images/dottedpopup_icon6.png" alt="#"></a>
                                                                  </li>
                                                              </ul>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`;
                    break;
            }

            return fieldHtml;
        };

        renderSavedFields();

        /**
         * @render default fields
         */
        function renderSavedFields() {

            let savedFieldData = JSON.parse(localStorage.getItem("schema")) || {};


            var fieldHtml;
            for (var key in savedFieldData) {
                if (savedFieldData.hasOwnProperty(key)) {
                    var sectionData = savedFieldData[key];
                    for (var sectionKey in sectionData) {
                        var fieldsData = sectionData[sectionKey].fields;
                        var section_id = sectionData[sectionKey].section_id;
                        for (var fieldKey in fieldsData) {

                            let fieldType = fieldsData[fieldKey].type;
                            let fieldObj = fieldsData[fieldKey];
                            console.log(fieldObj.basic_properties.field_name);
                            let field_id = fieldsData[fieldKey].field_id;
                            if (fieldType == 'text-input') {

                                fieldHtml = `<div class="form_rowHover " id="section_${section_id}">
                                   <div class="formRow clearfix innerBox" >
                                      <div class="formCell col12"  id="innerElement_${field_id}">
                                         <div class="form_editRow field-${field_id}">
                                            <div class="form_heading ">
                                            <span class="field_label " id="fieldLabel_${field_id}" >${fieldObj.basic_properties.field_name || defaults.messages.text}</span>

                                            <div class="form_editRow_inner">
                                               <div class="controle_row_main">
                                                  <a href="javascript:void(0);"></a> 
                                                  <div class="controle_row_popup"><span>X pos: <b>550</b></span> </div>
                                               </div>
                                               <div class="form_field">
                                                <input type="text" placeholder="${fieldObj.basic_properties.placeholder}" value="${fieldObj.basic_properties.default_value}" class="field_name" id="fieldName_${field_id}"> 
                                                
                                                </div>
                                               <div class="dotted_icon">
                                                  <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a> 
                                                  <ul>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon1.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon2.png" alt="#"></a></li>
                                                     <li><a id="copy-row-in-section" data-section-id ="${section_id}"  data-field-id="${field_id}" class="" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                                     <li><a id="delete-row-from-section"  data-section-id="${section_id}"  data-field-id="${field_id}" class="deleteFieldBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                                     <li><a id="editPopup_${field_id}" data-section-id ="${section_id}"  data-field-id="${field_id}" class="formSmallBox_edit " type="${fieldType}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);" class="sort_handle"><img src="images/dottedpopup_icon6.png" alt="#"></a></li>
                                                  </ul>
                                               </div>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                   <div id="formBuilder"></div>
                                   <div class="form_rowHover_popup">
                                      <ul>
                                         <li class="sort_section"><a href="javascript:void(0);"><img src="images/blue4_dottes.png" alt="#"></a></li>
                                         <li><a id="copySection_${section_id}" data-section-id ="${section_id}"  data-field-id="${field_id}" class="copySectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                         <li><a id="deleteSection_${section_id}" data-section-id="${section_id}"  data-field-id="${field_id}" class="deleteSectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                         <li><a class="formSmallBox_edit " href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
                                      </ul>
                                   </div>
                                </div>`;

                                $("#dropForm").append(fieldHtml);

                            }
                        }
                    }
                }
            }

        }

        var setFieldSchema = function (fieldId, currentFieldSchema) {
            var fieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            fieldSchema[fieldId] = currentFieldSchema;
            window.localStorage.setItem('schema', JSON.stringify(fieldSchema));
        };

        /**
         * remove single field Eelement
         * @param deletedFieldId
         */
        var removeField = function (deletedFieldId) {

            var currentfieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            delete currentfieldSchema[deletedFieldId];
            window.localStorage.setItem('schema', JSON.stringify(currentfieldSchema));
        };


        /**
         * Remove the section
         * @param deletedSectionId
         */
        var removeSection = function (deletedSectionId) {
            var currentSectionSchema = JSON.parse(localStorage.getItem("schema")) || {};
            let section = currentSectionSchema.find(value => {
                if (value.hasOwnProperty(deletedSectionId)) {
                    return true;
                }
            });
            let sectionIndex = currentSectionSchema.indexOf(section);
            currentSectionSchema.splice(sectionIndex, 1);
            window.localStorage.setItem('schema', JSON.stringify(currentSectionSchema));
        };
        // remove field
        $(document).on('click', '.deleteFieldBox', function (e) {
            var deletedFieldId = extractId($(this).attr('id'));
            $('#innerElement_' + deletedFieldId).remove();
            removeField(deletedFieldId);
        });

        // remove  section/ group
        $(document).on('click', '.deleteSectionBox', function (e) {
            var deletedSectionId = parseInt($(this).attr('data-section-id'));
            $(this).closest("#dropForm").find("#section_" + deletedSectionId).remove();
            removeSection(deletedSectionId);
        });

        // copy section

        $(document).on('click', '.copySectionBox', function () {

            var currentSectionId = parseInt($(this).attr('data-section-id'));
            //  let cloneSection = $('#section_' + currentSectionId).clone();
            let cloneSection = $(this).closest("#dropForm").find(('#section_' + currentSectionId)).clone(true);
            cloneSection.appendTo("#dropForm");
            var fieldsArr = JSON.parse(localStorage.getItem("schema")) || [];
            var newSectionID = section_id + fieldsArr.length + 1;

            var sectionArray = [];
            var copySectionArr = [];

            for (var sectionkey in fieldsArr) {

                var sectionData = fieldsArr[sectionkey];
                if (typeof sectionData[currentSectionId] !== 'undefined') {

                    let oldSection = sectionData[currentSectionId];
                    let oldSectionId = oldSection.section_id;

                    if (oldSectionId == currentSectionId) {

                        sectionData[currentSectionId].section_id = newSectionID;

                        var sectionFields = sectionData[currentSectionId].fields;
                        var field_key = 0;
                        var fieldsSize = sectionData[currentSectionId].fields.length;
                        for (var singleField in sectionFields) {
                            var single_field = sectionFields[singleField];
                            let fieldType = sectionFields[singleField].type;
                            let fieldId = sectionFields[singleField].field_id;

                            single_field.field_id = newSectionID + '_' + extractId(fieldId);
                            let field_id = newSectionID + '_' + extractId(fieldId);
                            if (fieldType == 'text-input') {
                                sectionFields[field_key] = single_field;


                                /***********Set Attributes according to field********************/
                                cloneSection.find("#fieldName_" + fieldId).prop('id', 'fieldName_' + field_id);
                                cloneSection.find("#fieldLabel_" + fieldId).prop('id', 'fieldLabel_' + field_id);

                                /**********update edit popup ids*******/
                                cloneSection.find("#editPopup_" + fieldId).attr('data-section-id', newSectionID);
                                cloneSection.find("#editPopup_" + fieldId).attr('data-field-id', field_id);
                                cloneSection.find("#editPopup_" + fieldId).prop('id', 'editPopup_' + field_id);


                                /**********update delete fields ids*******/
                                cloneSection.find("#deleteField_" + fieldId).attr('data-section-id', newSectionID);
                                cloneSection.find("#deleteField_" + fieldId).attr('data-field-id', field_id);
                                cloneSection.find("#deleteField_" + fieldId).prop('id', 'editPopup_' + field_id);

                                /**********update copy fields ids*******/
                                cloneSection.find("#copyField_" + fieldId).attr('data-section-id', newSectionID);
                                cloneSection.find("#copyField_" + fieldId).attr('data-field-id', field_id);
                                cloneSection.find("#copyField_" + fieldId).prop('id', 'editPopup_' + field_id);


                                /**********update copys section ids*******/
                                cloneSection.find("#copySection_" + currentSectionId).attr('data-section-id', newSectionID);
                                cloneSection.find("#copySection_" + currentSectionId).attr('data-field-id', field_id);
                                cloneSection.find("#copySection_" + currentSectionId).prop('id', 'copySection_' + newSectionID);
                                /**********update Delete section ids*/
                                cloneSection.find("#deleteSection_" + currentSectionId).attr('data-section-id', newSectionID);
                                cloneSection.find("#deleteSection_" + currentSectionId).attr('data-field-id', field_id);
                                cloneSection.find("#deleteSection_" + currentSectionId).prop('id', 'deleteSection_' + newSectionID);

                                cloneSection.attr('id', 'section_' + newSectionID)


                            }
                            field_key = field_key + 1;
                        }
                        sectionArray = sectionData[currentSectionId];
                        break;
                    }


                }

            }
            copySectionArr[newSectionID] = sectionArray;
            var sectionFieldsArr = JSON.parse(localStorage.getItem("schema")) || [];
            var sectionObj = Object.assign({}, copySectionArr);
            sectionFieldsArr.push(sectionObj);
            window.localStorage.setItem('schema', JSON.stringify(sectionFieldsArr));
        });

        // copy fields
        $("body").on('click', '.copyFieldBox', function (e) {


            var currentfieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            var currentId = Object.keys(currentfieldSchema).length;
            let current_id = extractId($(this).attr('id'));
            let cloneElement = $('#innerElement_' + current_id).clone();
            var $editPopup = cloneElement.find("#editPopup_" + currentId);

            $editPopup.attr("id", "editPopup_" + currentId);
            cloneElement.find('.field_label').prop('id', 'fieldLabel_' + currentId);
            cloneElement.find('.field_name').prop('id', 'fieldName_' + currentId);

            //cloneElement.prop('class', 'textField_' + currentId);

            cloneElement.attr('id', 'innerElement_' + currentId);

            let fieldId = current_id;

            //cloneElement.appendTo(".innerBox");
            var groupElement = cloneElement.parent().find('.innerBox');

            var groupId = extractId($('#innerElement_' + fieldId).parent().attr('id'));
            console.log($('#innerElement_' + fieldId).parent().attr('id'));
            console.log('grooup id--------');
            console.log(groupId);
            console.log(cloneElement.parents);
            cloneElement.appendTo("#section_" + groupId);
            // set id to current copy field
            var currentElement = cloneElement.find("#copyField_" + fieldId);
            currentElement.prop('id', "copyField_" + currentId);

            //cloneElement.prop('class', 'textLabel_' + fieldId);

            // set local storage
            var currentFieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            setFieldSchema(currentId, currentFieldSchema[fieldId])

        });
        /**
         * @edit field with Popup
         */
        $("body").on("click", ".formSmallBox_edit", function (e) {


            showPopup($(this));
            $(".formEdit_main_popup").show();
            $("body").addClass("hidden");
            $("[href='#popupTab_1']").click();


        });

        var showPopup = function (obj) {

            let fieldId = (obj.attr('data-field-id'));
            let sectionId = obj.attr('data-section-id');

            let type = obj.attr('type');
            console.log(fieldId);
            console.log(sectionId);
            var fieldsData = getFieldSchema(fieldId, type);

            let fieldHeadingHtml = fieldHeading(type);
            let basicFieldHtml = basicTab(obj, type, fieldsData);
            var validateFieldHtml = validateMessageTab(type, fieldsData);
            var formatFieldHtml = formatTab(type, fieldsData);
            var valueSettingFieldHtml = valueSettingTab(type, fieldsData);
            var reportSettingFieldHtml = reportSettingTab(type, fieldsData);
            var helpMessageFieldHtml = helpMessageTab(type, fieldsData);

            let popupHtml = `<div class="all_popup formEdit_main_popup fieldPopup_${fieldId}" >
                                    <input type="hidden" value="${fieldId}" class="field_id" name="field_id" id="hidden_field_${fieldId}" />
                                    <input type="hidden" value="${sectionId}" class="section_id" name="section_id" id="hidden_section_${sectionId}" />
                                    <div class="all_popup_inner">
                                        <div class="popup_table">
                                            <div class="popup_tableCell">
                                                <div class="popup_auto">
                                                    <div class="popup_detail">
                                                        <div class="all_popup_header clearfix">
                                                            <div class="popup_header_left">
                                                                <!--FielSetting()-->
                                                                ${fieldHeadingHtml}
                                                            </div>
                                                            <div class="popup_close"></div>
                                                        </div>
                                                        <div class="popup_content">
                                                            <div class="popup_tabs_main">
                                                                <div class="popup_tabsTitle">
                                                                    <ul>
                                                                        <li><a class="active" href="#popupTab_1">Basic Property</a></li>
                                                                   
                                                                        <li><a href="#popupTab_2">Validate and Message</a></li>
                                                                        <li><a href="#popupTab_3">Format</a></li>
                                                                        <li><a href="#popupTab_4">Value Setting</a></li>
                                                                        <li><a href="#popupTab_5">Report Setting</a></li>
                                                                        <li><a href="#popupTab_6">Help Message</a></li>
                                                                    </ul>
                                                                </div>
                                                                <div class="popupTabs_detail">
                                                                    <div class="popupTabs_show" id="popupTab_1" style="display:block;">
                                                                        <!-- basicTab() -->    
                                                                        ${basicFieldHtml}
                                                                    </div>
                                                                    <div class="popupTabs_show" id="popupTab_2">
                                                                         <!--validateTab()-->
                                                                         ${validateFieldHtml}
                                                                        
                                                                    </div>
                                                                    <div class="popupTabs_show" id="popupTab_3">
                                                                          <!--formatTab()-->
                                                                          ${formatFieldHtml}
                                                                       
                                                                    </div>
                                                                    <div class="popupTabs_show" id="popupTab_4">
                                                                            <!--SettingTab()-->
                                                                            ${valueSettingFieldHtml}
                                                                      
                                                                    </div>
                                                                    <div class="popupTabs_show" id="popupTab_5">
                                                                            <!--reportSettingtab()-->
                                                                            ${reportSettingFieldHtml}
                                                                       
                                                                    </div>
                                                                    <div class="popupTabs_show" id="popupTab_6">
                                                                         <!--helpMessage()-->
                                                                         ${helpMessageFieldHtml}
                                                                 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            $(".field-popup").html(popupHtml);

            showTinymceEditor();
        };

        var getSectionSchema = function (popupId) {
            var data = JSON.parse(localStorage.getItem("schema")) || {};
            if (typeof data[popupId] === 'undefined') {
                return data = {};
            }
            return data[popupId].fields;
        };

        var getFieldSchema = function (fielId, type = '') {
            var data = JSON.parse(localStorage.getItem("schema")) || {};

            for (var sectionkey in data) {
                var sectionData = data[sectionkey];
                for (var fieldKey in sectionData) {
                    var fieldData = sectionData[fieldKey];
                    for (var key in fieldData) {
                        var fields = fieldData[key];
                        for (var k in fields) {
                            let field_key = fields[k].field_id;
                            if (field_key === fielId) {
                                return fields[k];
                            }
                        }
                    }
                }
            }
            var fieldObj = {
                "type": type,
                "field_id": fieldID,
                "basic_properties": {
                    "field_name": '',
                    "field_id": '',
                    "default_value": '',
                    "placeholder": '',
                    "required": false,
                    "hide_label": false,
                    "add_picture": false,
                    "field_under_label": false,
                    "is_preloaded_paragraph": false,
                    "view_only": false,
                    "hide_field_label": false,
                    "add_notes": false,
                    "exclude_from_pdf_report": false,

                },
                "validate_properties": {
                    "select_validate_condition": '',
                    "regular_expression": '',
                    "error_message": '',
                },
                "format_properties": {
                    "label_name_format": '',
                    "field_name_format": '',
                },
                "setting_properties": {
                    "value_setting_option": '',
                    "value_setting_text": ''
                },
                "report_properties": {
                    "is_process_field_reporting": false,
                    "select_process_category_variable": '',
                },
                "help_properties": {
                    "help_message": '',

                }
            };

            return fieldObj;
        };


        var fieldHeading = function (type) {
            let fieldHeadingHtml = '';
            switch (type) {
                case 'text-input':
                    fieldHeadingHtml += `<ul>
                                            <li><strong>Field Setting: </strong></li>
                                            <li><strong>Field Type: <span>Text Field</span></strong></li>
                                            <li><strong>Field Name: <span>Text</span></strong></li>
                                        </ul>`;
            }
            return fieldHeadingHtml;
        };
        var basicTab = function (obj, type, fieldsData) {

            console.log(fieldsData);
            var basicFieldHtml = '';
            switch (type) {
                case 'text-input':
                    basicFieldHtml += `<div class="property_main">
                                        <div class="formParent">
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Field Name</strong></div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <input type="text" placeholder="" value="${(typeof fieldsData.basic_properties != 'undefined') ? fieldsData.basic_properties.field_name : ''}" name="field_name" id="field_name">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong class="feild_id">Field Id

                                                        <em class="popupTooltip_icon">
                                                            <em class="popupTooltip">Lorem Ipsum dummy site amet
                                                                tooltip Lorem Ipsum dummy site amet tooltip</em>
                                                        </em>

                                                    </strong></div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <input type="text" placeholder="" value="${fieldsData.basic_properties.field_id}" name="field_id" id="field_id">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Default Value</strong>
                                                    </div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <input type="text" placeholder="" value="${fieldsData.basic_properties.default_value}" name="default_value" id="default_value">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Place Hold</strong></div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <input type="text" placeholder="" name="placeholder" value="${fieldsData.basic_properties.placeholder}" id="placeholder">
                                                    </div>
                                                </div>
                                            </div>
                                            <!--checkboxes-->
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"></div>
                                                </div>
                                                <div class="formCell col9 pull_right">
                                                    <div class="property_checkMain">
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Required
                                                                        <input type="checkbox" name="required" value="" ${(fieldsData.basic_properties.required) ? 'checked' : ''}  >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        View Only
                                                                        <input type="checkbox" name="view_only" value="" ${(fieldsData.basic_properties.view_only) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Hide Label
                                                                        <input type="checkbox" name="hide_label" value="" ${(fieldsData.basic_properties.hide_label) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"  ></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Hide Field
                                                                        <input type="checkbox" name="hide_field_label" value="" ${(fieldsData.basic_properties.hide_field_label) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Add Picture
                                                                        <input type="checkbox"  name="add_picture" value="" ${(fieldsData.basic_properties.add_picture) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Add Notes
                                                                        <input type="checkbox" name="add_notes" value="add_notes" ${(fieldsData.basic_properties.add_notes) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Field Under Lable
                                                                        <input type="checkbox" name="field_under_label" value=""  ${(fieldsData.basic_properties.field_under_label) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Exclude From PDF Report
                                                                        <input type="checkbox"  name="exclude_from_pdf_report" value=""  ${(fieldsData.basic_properties.exclude_from_pdf_report) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col6">
                                                                <div class="form_checkbox">
                                                                    <label>
                                                                        Is Preloaded Paragraph?
                                                                        <input type="checkbox"  name="is_preloaded_paragraph" value="" ${(fieldsData.basic_properties.is_preloaded_paragraph) ? 'checked' : ''} >
                                                                        <span class="checkbox_checked"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col6">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--checkboxes-->
                                            <div class="formRow clearfix">
                                                <div class="formCell col12">
                                                    <div class="form_saveBtn">
                                                        <input class="all_buttons" current-field="${obj}"  tab-name="basic_tab" field-type="${type}" type="submit" value="Save">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                    break;

            }
            return basicFieldHtml;
        };
        var validateMessageTab = function (type, fieldsData) {
            var validateFieldHtml = '';
            switch (type) {
                case 'text-input':
                    validateFieldHtml += `<div class="validate_main">
                                        <!--10._Form_Validate-Text-->
                                        <div class="validate_text">
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Select Condition</strong>
                                                    </div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <div class="selectbox"><span
                                                                class="selectbox_span">${(fieldsData.validate_properties.select_validate_condition == 'N/A') ? 'N/A' : 'Match Regular Expression'}</span>
                                                            <ul class="selectbox_dropdown dropdown_scroll select_regex_condition"
                                                                style="display: none;" name="default_regex">
                                                                <li class="active "  regex-data="match_regular_expression">Match Regular Expression</li>
                                                                <li class=""  regex-data="N/A"  >N/A</li>
                                                              
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Regular
                                                        Expression</strong></div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <input type="text" placeholder="" value="${fieldsData.validate_properties.regular_expression}" name="reg_expression">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Error Massage</strong>
                                                    </div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="form_field">
                                                        <textarea placeholder="" id="error_message"   >${fieldsData.validate_properties.error_message}</textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="formRow clearfix">
                                                <div class="formCell col3 allField_titleCol">
                                                    <div class="form_heading"><strong>Note</strong></div>
                                                </div>
                                                <div class="formCell col9">
                                                    <div class="validate_note">
                                                        <p>Regular expression allows you to limit what can be
                                                            inputed, for example if only email format is
                                                            allowed, put the following in Regular Expression
                                                            field above.</p>
                                                        <p>
                                                            /^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)
                                                            +[a-zA-Z]{2,}))$/ </p>
                                                        <p>Other examples may be :</p>
                                                        <ul>
                                                            <li>Capital letters only [A-Z\\s]+</li>
                                                            <li>lowercase only [a-z\\s]+</li>
                                                            <li></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <!--10._Form_Validate-Text-->

                                        <div class="formRow clearfix">
                                            <div class="formCell col12">
                                                <div class="form_saveBtn">
                                                    <input class="all_buttons " tab-name="validate_tab" field-type="${type}"  type="submit" value="Save">
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                    break;
            }
            return validateFieldHtml;
        };
        var formatTab = function (type, fieldsData) {
            var formatFieldHtml = '';

            switch (type) {
                case 'text-input':
                    formatFieldHtml += `<div class="format_main">
                                            <div class="formParent">                                                                             
                                                <div class="formRow clearfix">
                                                    <div class="formCell col3 allField_titleCol">
                                                        <div class="form_heading"><strong>Label Name Format</strong>
                                                        </div>
                                                    </div>
                                                    <div class="formCell col9">
                                                        <div class="container pb-5">
                                                            <form method="post">
                                                                <textarea class="mytextarea"
                                                                          placeholder="Label Name" name="label_name_format"></textarea>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="formRow clearfix">
                                                    <div class="formCell col3 allField_titleCol">
                                                        <div class="form_heading"><strong>Input Field Name</strong>
                                                        </div>
                                                    </div>
                                                    <div class="formCell col9">
                                                        <div class="container pb-5">
                                                            <form method="post">
                                                                <textarea class="mytextarea"
                                                                          placeholder="Input Field Name" name="field_name_format"></textarea>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="formRow clearfix">
                                                    <div class="formCell col12">
                                                        <div class="form_saveBtn">
                                                            <input class="all_buttons" tab-name="format_tab" field-type="${type}" type="submit" value="Save">
                                                        </div>
                                                    </div>
                                                </div>
                                                
    
                                            </div>
                                        </div>`;
            }
            return formatFieldHtml;
        };
        var valueSettingTab = function (type, fieldsData) {
            var valueSettingFieldHtml = '';
            switch (type) {
                case 'text-input':
                    valueSettingFieldHtml += `<div class="value_setting_main">
                                                    <div class="value_note">
                                                        <p><b>Note: </b>The field value can be preset in the following ways if needed</p>
                                                    </div>
                                                    <!--19.Form_Field_Value_Setting6-->
                                                    <div class="value_setting_two">
                                                        <div class="formParent">
                                                            <div class="formRow clearfix">
                                                                <div class="formCell col3 allField_titleCol">
                                                                    <div class="form_heading"><strong>Value Setting
                                                                                                                    Options</strong></div>
                                                                </div>
                                                                <div class="formCell col6">
                                                                    <div class="form_field">
                                                                        <div class="selectbox">
                                                                            <span class="selectbox_span">
                                                                                                                        ${fieldsData.setting_properties.value_setting_text}
                                                                                                                     </span>
                                                                            <ul class="selectbox_dropdown dropdown_scroll value_setting_dropdwn" style="display: none;" name="value_setting_option ">
                                                                                <li class="valueSettingOptDropDown" data-value="calculatedValue">This field Value Has a Calculated Value</li>
                                                                                <li class="valueSettingOptDropDown" data-value="userEntitydValue"> This field is pre-populated with a user or entity data</li>
                                                                                <li class="valueSettingOptDropDown" data-value="preSystemVariableValue"> This field is pre-populated with a system variable</li>
                                                                                <li class="valueSettingOptDropDown" data-value="processFormVariable"> This field is pre-populated with the process forms variable</li>
                                                                                <li class="valueSettingOptDropDown" data-value="useSystemVariable"> This field use a dropdown from a system variable</li>
                                                
                                                                            </ul>
                                                                        </div>
                                                                        <div id="mCSB_21_scrollbar_vertical" class="mCSB_scrollTools mCSB_21_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                            <div class="mCSB_draggerContainer">
                                                                                <div id="mCSB_21_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                    <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                </div>
                                                                                <div class="mCSB_draggerRail"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                
                                                    <!--calculated section-->
                                                    <div class="calculatedSection" style="display: ${fieldsData.setting_properties.value_setting_option == 'calculatedValue' ? 'block' : 'none'}">
                                                        <div class="formRow clearfix ">
                                                            <div class="formCell col3"></div>
                                                            <div class="formCell col9 pull_right">
                                                                <div class="formRow clearfix">
                                                                    <div class="formCell col5">
                                                                        <div class="form_field">
                                                                            <div class="selectbox"><span class="selectbox_span">This Field Value Has a Calculated Value
                                                                                                                                    </span>
                                                                                <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_22 mCS_no_scrollbar" style="display: none;">
                                                                                    <div id="mCSB_22" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                        <div id="mCSB_22_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                            <li class="active">This Field Value Has a Calculated Value
                                                                                            </li>
                                                                                            <li class="">N/A</li>
                                                                                        </div>
                                                                                        <div id="mCSB_22_scrollbar_vertical" class="mCSB_scrollTools mCSB_22_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                            <div class="mCSB_draggerContainer">
                                                                                                <div id="mCSB_22_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                                    <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                                </div>
                                                                                                <div class="mCSB_draggerRail"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div class="value_search_main">
                                                                            <div class="value_search">
                                                                                <input class="searchtags ui-autocomplete-input" type="text" placeholder="Search Variables for Calcuation." autocomplete="off">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="formCell col7">
                                                                        <div class="formula_main">
                                                                            <div class="formula_box">
                                                                                <div class="formula_heading">
                                                                                    <h5>Calculation Formular</h5>
                                                                                </div>
                                                                                <div class="formula_content">
                                                                                    <div class="formula_listing">
                                                                                        <ul>
                                                                                            <li>
                                                                                                <div class="formula_detail">
                                                                                                    <label>$Form.Quality Rating
                                                                                                    </label>
                                                                                                </div>
                                                                                            </li>
                                                                                            <li>
                                                                                                <div class="formula_detail">
                                                                                                    <strong>+</strong>
                                                                                                </div>
                                                                                            </li>
                                                                                            <li>
                                                                                                <div class="formula_detail">
                                                                                                    <label>$Form.Quality Rating
                                                                                                    </label>
                                                                                                </div>
                                                                                            </li>
                                                                                            <li>
                                                                                                <div class="formula_detail">
                                                                                                    <span>x5</span>
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="formula_footer">
                                                                                    <ul>
                                                                                        <li>
                                                                                            <a class="formula_icon1" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a class="formula_icon2" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a class="formula_icon3" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a class="formula_icon4" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a class="formula_icon5" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                        <li>
                                                                                            <a class="formula_icon6" href="javascript:void(0);"></a>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                            <a class="formula_delete" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--End calculated section-->
                                                
                                                    <!--Entity section-->
                                                    <div class="entitySection" style="display: ${fieldsData.setting_properties.value_setting_option == 'userEntitydValue' ? 'block' : 'none'}">
                                                
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select User or Entity</strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll" style="display: none;" name="value_setting_option">
                                                                            <li class="">Entity</li>
                                                                            <li class="">NA</li>
                                                
                                                                        </ul>
                                                                    </div>
                                                                    <div id="mCSB_21_scrollbar_vertical" class="mCSB_scrollTools mCSB_21_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                        <div class="mCSB_draggerContainer">
                                                                            <div id="mCSB_21_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                            </div>
                                                                            <div class="mCSB_draggerRail"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                               
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col4"></div>
                                                            <div class="formCell col5 pull_right">
                                                                <div class="value_search_main">
                                                                    <div class="value_search">
                                                                        <input class="searchtags ui-autocomplete-input" type="text" placeholder="Search Variables for Calcuation." autocomplete="off">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col7">
                                                                <div class="entity_data_main">
                                                                    <div class="entity_data_heading">
                                                                        <h5>Selected Entity Data Feild</h5>
                                                                    </div>
                                                                    <div class="formula_main">
                                                                        <div class="form_field">
                                                                            <textarea></textarea>
                                                                        </div>
                                                                        <a class="formula_delete" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                                                    </div>
                                                                    <div class="entity_data_heading">
                                                                        <h5>$Entity.NAME</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                
                                                    <!--End Entity section-->
                                                
                                                    <!--Pre-populated with system variable-->
                                                    <div class="preSystemVariableSection" style="display: ${fieldsData.setting_properties.value_setting_option == 'preSystemVariableValue' ? 'block' : 'none'}">
                                                        <div class="formRow clearfix ">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select System
                                                                                                                    Database</strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_16 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_16" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_16_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="">Search System&nbsp;Variable Data Table
                                                                                    </li>
                                                                                    <li class="">N/A</li>
                                                                                </div>
                                                                                <div id="mCSB_16_scrollbar_vertical" class="mCSB_scrollTools mCSB_16_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_16_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select Field In
                                                                                                                    Database Table</strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_17 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_17" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_17_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="">Search Field From System Data Table
                                                                                    </li>
                                                                                    <li class="">N/A</li>
                                                                                </div>
                                                                                <div id="mCSB_17_scrollbar_vertical" class="mCSB_scrollTools mCSB_17_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_17_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong class="feild_id">Select
                                                                                                                    Matching Key Field<em class="popupTooltip_icon">
                                                                                                                        <em class="popupTooltip">Lorem Ipsum dummy site
                                                                                                                            amet tooltip Lorem Ipsum dummy site amet
                                                                                                                            tooltip</em>
                                                                                                                    </em></strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_18 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_18" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_18_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="">Select Field As Matching Key In Process
                                                                                    </li>
                                                                                    <li class="">N/A</li>
                                                                                </div>
                                                                                <div id="mCSB_18_scrollbar_vertical" class="mCSB_scrollTools mCSB_18_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_18_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                
                                                            </div>
                                                            <div class="formCell col9 pull_right">
                                                                <div class="value_note">
                                                                    <p><b>Note: </b>final value of this field is the database value of the selected system data table that has the matching key as the ID in the data table</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--End Pre-populated with system variable-->
                                                
                                                    <!--process form variable-->
                                                    <div class="processFormVariableSection" style="display: ${fieldsData.setting_properties.value_setting_option == 'processFormVariable' ? 'block' : 'none'}">
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select Variable from
                                                                                                                    this Process</strong></div>
                                                            </div>
                                                            <div class="formCell col6 popupRow_hasTipIcon">
                                                                <div class="form_field feild_id">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_20 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_20" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_20_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="">Select Field As Matching Key In Process
                                                                                    </li>
                                                                                    <li class="">N/A</li>
                                                                                </div>
                                                                                <div id="mCSB_20_scrollbar_vertical" class="mCSB_scrollTools mCSB_20_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_20_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                    <em class="popupTooltip_icon">
                                                                                                                        <em class="popupTooltip">Lorem Ipsum dummy site
                                                                                                                            amet tooltip Lorem Ipsum dummy site amet
                                                                                                                            tooltip</em>
                                                                    </em>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="value_note text_center">
                                                                <p><b>Note: </b>This field uses the value of the selected field already in the form or previous task form
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--End prcoess form variable-->
                                                
                                                    <!--Field use dropdown list-->
                                                    <div class="fieldUseSystemVariable" style="display: ${fieldsData.setting_properties.value_setting_option == 'useSystemVariable' ? 'block' : 'none'}">
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select System Database
                                                                                                                    Table</strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span">Search System &nbsp;Variable
                                                                                                                                Database Table
                                                                                                                            </span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_12 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_12" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_12_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="active">Search System &nbsp;Variable Database Table
                                                                                    </li>
                                                                                    <li class="">Default Setting</li>
                                                                                </div>
                                                                                <div id="mCSB_12_scrollbar_vertical" class="mCSB_scrollTools mCSB_12_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_12_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px; height: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Select Column In The
                                                                                                                    Database</strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll mCustomScrollbar _mCS_13 mCS_no_scrollbar" style="display: none;">
                                                                            <div id="mCSB_13" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: 150px;">
                                                                                <div id="mCSB_13_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">
                                                                                    <li class="">Search Field From System Database
                                                                                    </li>
                                                                                    <li class="">Default Setting</li>
                                                                                </div>
                                                                                <div id="mCSB_13_scrollbar_vertical" class="mCSB_scrollTools mCSB_13_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;">
                                                                                    <div class="mCSB_draggerContainer">
                                                                                        <div id="mCSB_13_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 30px; top: 0px;" oncontextmenu="return false;">
                                                                                            <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                                                                                        </div>
                                                                                        <div class="mCSB_draggerRail"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="value_note text_center">
                                                                <p><b>Note: </b>final value is an array list derived from the selected column in selected database table
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--End Field use dropdown list-->
                                                </div>
                                                <div class="formRow clearfix">
                                                    <div class="formCell col12">
                                                        <div class="form_saveBtn">
                                                            <input class="all_buttons " tab-name="setting_tab" field-type="${type}" type="submit" value="Save">
                                                        </div>
                                                    </div>
                                                </div>
                                                `;
            }
            return valueSettingFieldHtml;
        };
        var reportSettingTab = function (type, fieldsData) {
            var reportSettingFieldHtml = '';

            switch (type) {
                case 'text-input':
                    reportSettingFieldHtml += `<div class="report_main">
                                                <div class="formParent">
                                                    <div class="formRow clearfix">
                                                        <div class="formCell col12">
                                                            <div class="form_checkbox ">
                                                                <label>
                                                                    Is This Field Process Gategory Level Reporting
                                                                    <input class="check_process_field_reporting" type="checkbox" name="is_process_field_reporting" ${(fieldsData.report_properties.is_process_field_reporting) ? 'checked' : ''}>
                                                                    <span class="checkbox_checked"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="formRow clearfix">
                                                        <div class="formCell col12 allField_titleCol">
                                                            <div class="form_heading"><span>This  Field Use  the following Process Gategory Variable</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                    <div class="formRow clearfix process_gategory_list" style="display: ${fieldsData.report_properties.is_process_field_reporting ? 'block' : 'none'}">
                                                        <div class="formCell col3 allField_titleCol">
                                                            <div class="form_heading"><strong>Select Process Gategory
                                                                Variable </strong></div>
                                                        </div>
                                                        <div class="formCell col6 ">
                                                            <div class="form_field">
                                                                <div class="selectbox"><span
                                                                        class="selectbox_span">
                                                                            ${fieldsData.report_properties.select_process_category_variable == 'report_start_date' ? 'Start Date Plus' : 'This Variable Option Were Set When Gategory Created'} 
                                                                       </span>
                                                                    <ul class="selectbox_dropdown dropdown_scroll report_category_dropdown"
                                                                        style="display: none;">
                                                                        <li class="active" report-data="report_category_created"> This Variable Option Were Set When
                                                                            Gategory Created
                                                                        </li>
                                                                        <li class="" report-data="report_start_date">Start Date Plus</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div class="formRow clearfix">
                                                        <div class="formCell col12">
                                                            <div class="form_saveBtn">
                                                                <input class="all_buttons "tab-name="report_tab" field-type="${type}" type="submit" value="Save">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
            }
            return reportSettingFieldHtml;

        };
        var helpMessageTab = function (type, fieldsData) {
            var helpMessageFieldHtml = '';

            switch (type) {
                case 'text-input':
                    helpMessageFieldHtml += `<div class="help_message_main">                    
                                                    <div class="formParent">
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Help Message</strong>
                                                                </div>
                                                            </div>
                                                            <div class="formCell col9">
                                                                <div class="form_field">
                                                                    <textarea placeholder="" class="help_message" name="help_message">${fieldsData.help_properties.help_message}</textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col12">
                                                                <div class="form_saveBtn">
                                                                    <input class="all_buttons " tab-name="help_tab" field-type="${type}" type="submit" value="Save">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
            }
            return helpMessageFieldHtml;


        };

        /**
         * @save field attributes
         */
        $(document).on('click', '.all_buttons', function (e) {

            let fieldType = $(this).attr('field-type');
            let fieldId = $(".field_id").val();
            let sectionId = parseInt($(".section_id").val());

            let tabName = $(this).attr('tab-name');
            let fieldsArr = JSON.parse(localStorage.getItem("schema")) || {};

            for (var sectionkey in fieldsArr) {

                var sectionData = fieldsArr[sectionkey];
                if (typeof sectionData[sectionId] !== 'undefined') {
                    if (sectionData[sectionId].section_id == sectionId) {
                        var sectionFields = sectionData[sectionId].fields;
                        var field_key = 0;
                        for (var singleField in sectionFields) {
                            var single_field = sectionFields[singleField];

                            if (sectionFields[singleField].field_id == fieldId) {
                                let fieldType = sectionFields[singleField].type;
                                if (fieldType == 'text-input') {

                                    if (tabName == 'basic_tab') {

                                        var fieldName = $("input[name='field_name']").val();
                                        let basicFieldId = $("input[name='field_id']").val();
                                        let defaultValue = $("input[name='default_value']").val();
                                        let placeHolder = $("input[name='placeholder']").val();
                                        // checkboxes

                                        let required = $("input[name='required']").is(":checked");
                                        let add_picture = $("input[name='add_picture']").is(":checked");
                                        let field_under_label = $("input[name='field_under_label']").is(":checked");
                                        let is_preloaded_paragraph = $("input[name='is_preloaded_paragraph']").is(":checked");
                                        let view_only = $("input[name='view_only']").is(":checked");
                                        let hide_field_label = $("input[name='hide_field_label']").is(":checked");
                                        let hide_label = $("input[name='hide_label']").is(":checked");
                                        let add_notes = $("input[name='add_notes']").is(":checked");
                                        let exclude_from_pdf_report = $("input[name='exclude_from_pdf_report']").is(":checked");


                                        let basicObj = {};

                                        basicObj.field_name = fieldName;
                                        basicObj.field_id = basicFieldId;
                                        basicObj.default_value = defaultValue;
                                        basicObj.placeholder = placeHolder;
                                        basicObj.required = required;
                                        basicObj.add_picture = add_picture;
                                        basicObj.field_under_label = field_under_label;
                                        basicObj.is_preloaded_paragraph = is_preloaded_paragraph;
                                        basicObj.view_only = view_only;
                                        basicObj.hide_field_label = hide_field_label;
                                        basicObj.hide_label = hide_label;
                                        basicObj.add_notes = add_notes;
                                        basicObj.exclude_from_pdf_report = exclude_from_pdf_report;
                                        single_field.basic_properties = basicObj;
                                        $("#fieldLabel_" + fieldId).html(fieldName);
                                        $("#fieldName_" + fieldId).attr('placeholder', placeHolder);
                                        $("#fieldName_" + fieldId).val(defaultValue);


                                    } else if (tabName == 'validate_tab') {

                                        let errorMessage = $.trim($("#error_message").val());
                                        let regExpression = $("input[name='reg_expression']").val();
                                        let defualtRegex = $("input[name='default_regex']").val();
                                        let validateObj = {};

                                        let selectRegexCondition = 'N/A';
                                        $(".select_regex_condition li").each(function (index, item) {
                                            if ($(this).hasClass('active')) {
                                                selectRegexCondition = $(this).attr('regex-data');
                                            }
                                        });
                                        validateObj.select_validate_condition = selectRegexCondition;
                                        validateObj.regular_expression = regExpression;
                                        validateObj.error_message = errorMessage;

                                        single_field.validate_properties = validateObj;


                                    } else if (tabName == 'format_tab') {


                                        let labelNameFormat = $("input[name='label_name_format']").val();
                                        let fieldNameFormat = $("input[name='field_name_format']").val();

                                        let formatObj = {};
                                        formatObj.label_name_format = labelNameFormat;
                                        formatObj.field_name_format = fieldNameFormat;
                                        single_field.format_properties = formatObj;

                                    } else if (tabName == 'setting_tab') {
                                        // value_setting_option
                                        let selectValueSetting = 'N/A';
                                        let selectSettingText = '';
                                        $(".value_setting_dropdwn li").each(function (index, item) {
                                            if ($(this).hasClass('active')) {
                                                selectValueSetting = $(this).attr('data-value');
                                                selectSettingText = $(this).text();
                                            }
                                        });
                                        let settingObj = {};

                                        settingObj.value_setting_option = selectValueSetting;
                                        settingObj.value_setting_text = selectSettingText;
                                        single_field.setting_properties = settingObj;


                                    } else if (tabName == 'report_tab') {

                                        let is_process_field_reporting = $("input[name='is_process_field_reporting']").is(":checked");
                                        //Start Date Plus
                                        let select_process_category_variable = 'N/A';
                                        $(".report_category_dropdown li").each(function (index, item) {
                                            if ($(this).hasClass('active')) {
                                                select_process_category_variable = $(this).attr('report-data');
                                            }
                                        });

                                        let reportObj = {};
                                        reportObj.is_process_field_reporting = is_process_field_reporting;
                                        reportObj.select_process_category_variable = select_process_category_variable;
                                        single_field.report_properties = reportObj;


                                    } else if (tabName == 'help_tab') {

                                        let helpMessage = $(".help_message").val();
                                        let helpObj = {};
                                        helpObj.help_message = helpMessage;
                                        single_field.help_properties = helpObj;

                                    }

                                    sectionFields[field_key] = single_field;
                                    fieldsArr[sectionkey] = sectionData;

                                }
                                // update data in localStorage on id base
                                window.localStorage.setItem('schema', JSON.stringify(fieldsArr));
                                break;
                            }
                            field_key = field_key + 1;

                        }
                    }
                    break;
                }

            }

            $("body").removeClass("hidden");
            $(".all_popup").hide();
            $(".popupTabs_show").html('');
            $(".all_popup").html('');
            $(".field-popup").html('');


        });


        $(document).on('click', '.check_process_field_reporting', function (e) {
            if ($(this).is(":checked")) {
                $(".process_gategory_list").show();
            } else {
                $(".process_gategory_list").hide();
            }
        });


        $(document).on('click', '.valueSettingOptDropDown', function (e) {

            if ($(this).data('value') == "calculatedValue") {
                $(".calculatedSection").show();
                $(".entitySection, .preSystemVariableSection, .processFormVariableSection, .fieldUseSystemVariable").hide();

            } else if ($(this).data('value') == "userEntitydValue") {
                $(".entitySection").show();
                $(".calculatedSection, .preSystemVariableSection, .processFormVariableSection, .fieldUseSystemVariable").hide();

            } else if ($(this).data('value') == "preSystemVariableValue") {
                $(".preSystemVariableSection").show();
                $(".entitySection, .calculatedSection, .processFormVariableSection, .fieldUseSystemVariable").hide();

            } else if ($(this).data('value') == "processFormVariable") {
                $(".processFormVariableSection").show();
                $(".entitySection, .preSystemVariableSection, .calculatedSection, .fieldUseSystemVariable").hide();

            } else if ($(this).data('value') == "useSystemVariable") {
                $(".fieldUseSystemVariable").show();
                $(".entitySection, .preSystemVariableSection, .processFormVariableSection, .calculatedSection").hide();

            }
        });
        // switch the tabs in popup
        $(document).on('click', '.popup_tabsTitle ul li a', function (e) {
            var id = $(this).attr("href");
            $(".popup_tabsTitle ul li a").removeClass("active");
            $(this).addClass("active");
            $(".popupTabs_show").hide();
            $(id).show();
            return false;
        });
        // close the field popup
        $(document).on('click', '.popup_close', function (e) {
            $("body").removeClass("hidden");
            $(".all_popup").hide();
            $(".popupTabs_show").html('');
            $(".all_popup").html('');
            $(".field-popup").html('');
        });

        // ======================= FUNCTION BY ZESHAN =========================
        var getFieldObject = function (type, fieldID) {
            let fieldObj = {};

            switch (type.toLowerCase()) {
                case 'text-input':
                    fieldObj = {
                        "type": type,
                        "field_id": fieldID,
                        "basic_properties": {
                            "field_name": '',
                            "field_id": '',
                            "default_value": '',
                            "placeholder": '',
                            "required": false,
                            "hide_label": false,
                            "add_picture": false,
                            "field_under_label": false,
                            "is_preloaded_paragraph": false,
                            "view_only": false,
                            "hide_field_label": false,
                            "add_notes": false,
                            "exclude_from_pdf_report": false,

                        },
                        "validate_properties": {
                            "select_validate_condition": '',
                            "regular_expression": '',
                            "error_message": '',
                        },
                        "format_properties": {
                            "label_name_format": '',
                            "field_name_format": '',
                        },
                        "setting_properties": {
                            "value_setting_option": '',
                        },
                        "report_properties": {
                            "is_process_field_reporting": false,
                            "select_process_category_variable": '',
                        },
                        "help_properties": {
                            "help_message": '',

                        }
                    };
                    break;
            }
            return fieldObj;
        };
        // ======================= FUNCTION BY ZESHAN =========================
        /********************* BY ZESHAN **************************/

        var controlPartialTemplates = function (type, sectionId, fieldID) {
            let partialHtml = '';
            switch (type.toLowerCase()) {
                case 'text-input':
                    partialHtml += `
                              <div class="element_main_cell">
                                <div class="element_inline_cell">
                                    <div class="formCell left-resizeable left-resizeable-${fieldID}">
                                        <div class="form_heading"><span><br></span></div>
                                        <a id="handle" class="ui-resizable-handle ui-resizable-e resizeHandler_cstm"></a>
                                    </div>
                                    <div class="formCell col12 right-resizeable-${fieldID}" style="padding: 0px">
                                        <div class="form_editRow">
                                            <div class="form_heading form_heading_dev"><span>Text Field</span></div>
                                            <div class="form_editRow_inner">
                                                <div class="controle_row_main">
                                                </div>
                                                <div class="form_field">
                                                    <input type="text" placeholder=""> </div>
                                                <div class="dotted_icon">
                                                    <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a>
                                                    <ul>
                                                        <li>
                                                            <a href="javascript:void(0);" id="left-cell-insertion" type="${type}" data-section-id="${sectionId}"><img src="images/dottedpopup_icon1.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" id="right-cell-insertion" type="${type}" data-section-id="${sectionId}"><img src="images/dottedpopup_icon2.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a id="copy-row-in-section" type="${type}" data-section-id="${sectionId}" data-field-id="${fieldID}" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a id="delete-row-from-section" type="${type}" data-section-id="${sectionId}" data-field-id="${fieldID}" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a id="editPopup_${fieldID}" class="formSmallBox_edit" type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" class="sort_handle"><img src="images/dottedpopup_icon6.png" alt="#"></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                    break;
            }


            return partialHtml;
        };

        // ======== return new section's field id ==========

        var getNextFieldId = function (sectionId) {
            // console.log(sectionId);
            let schema = JSON.parse(localStorage.getItem("schema"));

            //find section id by arrow function
            let sectionSchema = schema.find((value, index, schema) => {
                if (value.hasOwnProperty(sectionId)) {
                    return true;
                }
            });
            //get last field from fields array
            let fieldsLength = sectionSchema[sectionId]["fields"].length;
            console.log("fieldsLength", fieldsLength);
            let lastField = sectionSchema[sectionId]["fields"][(fieldsLength - 1)];
            lastField = lastField.field_id;

            //formation of new field id for the given section
            let sectionFieldId = lastField.split("_");
            let getSectionId = parseInt(sectionFieldId[0]);
            let getFieldId = parseInt(sectionFieldId[1]);
            let nextFieldId = (getSectionId + '_' + (++getFieldId));

            return nextFieldId;
        };

        // ======== set new field object in given section id inside local storage ==========

        var setLocalStorageObject = function (type, sectionId, fieldId) {

            let fieldObject = getFieldObject(type, fieldId);
            let schema = JSON.parse(localStorage.getItem("schema"));


            $.each(schema, function (index, value) {
                if (value.hasOwnProperty(sectionId)) {
                    schema[index][sectionId]["fields"].push(fieldObject);
                    return;
                }
            });
            window.localStorage.setItem('schema', JSON.stringify(schema));
        };

        // ======== delete some object from local storage ==========

        var deleteObjectLocalStorage = function (sectionId, fieldId) {
            // console.log(sectionId, fieldId);

            let schema = JSON.parse(localStorage.getItem("schema"));
            var updateLocalStorage = false;
            var schemaIndex = false;


            $.each(schema, function (index, value) {

                if (value.hasOwnProperty(sectionId)) {

                    let sectionFields = schema[index][sectionId]["fields"];
                    let field = sectionFields.find(value => value.field_id == fieldId);
                    let fieldIndex = sectionFields.indexOf(field);

                    if (fieldIndex > -1) {
                        let fields = schema[index][sectionId]["fields"];
                        fields.splice(fieldIndex, 1);
                        updateLocalStorage = true;

                        // get schema index if fields are empty
                        if (fields.length < 1) {
                            schemaIndex = schema.indexOf(value);
                        }
                    }
                    return;
                }
            });

            // deleting schema object if fields are empty
            if (schemaIndex || schemaIndex === 0) {
                schema.splice(schemaIndex, 1);
            }


            if (updateLocalStorage) {
                window.localStorage.setItem('schema', JSON.stringify(schema));
            }

        };


        // =============================== left cell insertion inside a row ==============================
        $(document).on("click", "#left-cell-insertion", function () {

            let type = $(this).attr("type");
            let sectionId = $(this).data('section-id');
            let nextFieldId = getNextFieldId(sectionId);

            let parentDiv = $(this).closest('.group_container > .element_main_row_container');
            let partialHtml = controlPartialTemplates(type, sectionId, nextFieldId);// + '-inline-cell'

            $(parentDiv).children().each(function (index, value) {
                let uiElements = $(this).find(".element_inline_cell").children(); //will give you all childrens

                // remove resizeable style from elements
                $(uiElements).each(function (index, value) {
                    $(this).removeAttr("style")
                });

            });

            parentDiv.prepend(partialHtml);
            applyResizeable(nextFieldId);
            //push in local storage
            setLocalStorageObject(type, sectionId, nextFieldId);
        });

        // =============================== right cell insertion inside a row ==============================
        $(document).on("click", "#right-cell-insertion", function () {

            let type = $(this).attr('type');
            let sectionId = $(this).data('section-id');
            let nextFieldId = getNextFieldId(sectionId);
            console.log("nextFieldId ", nextFieldId);


            let parentDiv = $(this).closest('.group_container > .element_main_row_container');
            let partialHtml = controlPartialTemplates(type, sectionId, nextFieldId);// + '-inline-cell'

            $(parentDiv).children().each(function (index, value) {

                let uiElements = $(this).find(".element_inline_cell").children(); //will give you all childrens

                // remove resizeable style from elements
                $(uiElements).each(function (index, value) {
                    $(this).removeAttr("style")
                });

            });

            parentDiv.append(partialHtml);
            applyResizeable(nextFieldId);

            //push in local storage
            setLocalStorageObject(type, sectionId, nextFieldId);
        });

        // =============================== copy new row inside a section ==============================
        $(document).on("click", "#copy-row-in-section", function () {
            let sectionId = $(this).data("section-id");
            let type = $(this).attr("type");
            let nextFieldId = getNextFieldId(sectionId);

            let fieldHtml = copyRowInSection(type, sectionId, nextFieldId);
            $(this).closest("div.group_container").append(fieldHtml);

            setLocalStorageObject(type, sectionId, nextFieldId);
            applyResizeable(nextFieldId);
        });

        // =============================== delete row from a section ==============================
        $(document).on("click", "#delete-row-from-section", function () {
            let sectionId = $(this).data("section-id");
            let fieldId = $(this).data("field-id");
            let parentDiv = $(this).closest('.group_container > .element_main_row_container');
            let childRows = parentDiv.children().length;
            let section = $(this).closest(".group_container");

            if (childRows > 1) {
                $(this).closest(".element_main_cell").remove();
            } else {
                $(this).closest('.element_main_row_container').remove();

                // removing section if it has no rows
                if (section.children().length === 2) {
                    section.remove();
                }
            }

            // remove whole section group if empty
            /*if (parentDiv.length < 1) {
              $(this).closest('.group_container').remove();
            }*/

            //update localstorage accordingly when you delete some item from section
            deleteObjectLocalStorage(sectionId, fieldId);
        });


        /**
         * Apply resize on control
         * @param lastIdCounter
         */
        var applyResizeable = function (nextFieldId) {

            let tempLastId = nextFieldId || fieldID;
            let elemId = ".left-resizeable-" + tempLastId;//".formRow-" + (tempLastId) +" "+ ".left-resizeable-" + tempLastId

            // console.log("elemId", elemId);

            $(elemId).resizable({
                alsoResizeReverse: ".right-resizeable-" + tempLastId,
                handles: {
                    e: "#handle",
                },
                resize: function (event, ui) {
                    console.log("resizing...");
                },
                stop: function (event, ui) {
                }
            });
        };


        var showTinymceEditor = function () {

            tinymce.init({
                selector: '.mytextarea',
                branding: false,
                theme: 'modern',
                plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed tinycomments mentions linkchecker',
                toolbar: 'fontselect | fontsizeselect color | bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify bullist numlist | link unlink image  | forecolor backcolor emoticons ',

            });
        }


    };


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


