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


        var ulObj = $('#dropForm').sortable({
            cursor: 'move',
            opacity: 0.9,
            handle:  ".sort_handle",
            receive: function (event, ui) {
                console.log('receive element');
            },
            update: function (event, ui) {

                // save default object in localstorage

                var fieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
                var fieldSchemaLength = Object.keys(fieldSchema).length;
                fieldSchemaLength++;
                var field_section_id = section_id + fieldSchemaLength;
                var field_id =  field_section_id +'_'+fieldSchemaLength;
               // return false;
                saveDefaultFieldsObject(ui.item,field_section_id,field_id);

                setElemenType = ui.item;
                // setHTML on basis of type
                var fieldHtml = setFieldHtml(ui.item,field_section_id,field_id);
                ui.item.before(fieldHtml);
                ui.item.remove();


            },
            stop: function (event, ui) {

                var fieldHtml = setFieldHtml(setElemenType);
                let tempLastId = "1001_1";
                console.log("tempLastId", tempLastId);
                let elemId = ".formRow-" + (tempLastId) +" "+ ".left-resizeable-" + tempLastId;

                $(elemId).resizable({
                    alsoResizeReverse: ".right-resizeable-" + tempLastId,
                    handles:{
                        e: "#handle",
                    },
                    resize : function(event, ui) {
                        console.log("resizing...");
                    },
                    stop : function(event, ui) {
                    }
                });
            }
        });

        // ControlBox with different fields
        $(".add_element_list li").draggable({
            cancel: ".stopDraggable",
            cursorAt: {left: 125, top: 15},
            connectToSortable: ulObj,
            helper: 'clone',
            revert: false,
            start: function (event, ui) {
            },
            drag: function (event, ui) {
            },
            stop: function (event, ui) {
            }
        });
        /**
         * Extract Id with format field_12313
         * @param str
         * @returns {string}
         */
        var extractId = function (str) {
            let params = str.split('_');
            let id =  params[params.length - 1];
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
        var saveDefaultFieldsObject = function (obj,sectionID,fieldID) {
            let type = $(obj).attr("name");
            let fieldObj = {};
            //var field_id = sectionID +'_'+fieldID;
          //  return false;

            switch (type) {
                case 'text-input':
                    fieldObj = {
                                "type": type,
                                "field_id":fieldID,
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

            var defaultSectionObj = {
                  [sectionID]: {
                      "name": "section_name",
                      "setting": "ON",
                      "section_id":sectionID,
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
        var setFieldHtml = function (obj,sectionID,fieldID) {
            let type = $(obj).attr("name");
            let fieldHtml = '';

            switch (type) {
                case 'text-input':
                    fieldHtml += `<div class="form_rowHover group_container section_${sectionID}" id="form-row-hover-${fieldID}" >
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
                                                                      <a href="javascript:void(0);" id="left-cell-insertion" type="${type}"><img src="images/dottedpopup_icon1.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a href="javascript:void(0);" id="right-cell-insertion" type="${type}"><img src="images/dottedpopup_icon2.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="copyField_${fieldID}" data-section-id ="${sectionID}" data-field-id="${fieldID}" class="copyFieldBox"  href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                                                  </li>
                                                                  <li>
                                                                      <a id="deleteField_${fieldID}" data-section-id="${sectionID}"  data-field-id="${fieldID}" class="deleteFieldBox"  href="javascript:void(0);" type="${type}"><img src="images/dottedpopup_icon4.png" alt="#"></a>
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
                                  <div class="form_rowHover_popup">
                                      <ul>
                                          <li>
                                              <a href="javascript:void(0);"><img src="images/blue4_dottes.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a id="copySection_${fieldID}" data-section-id ="${sectionID}" data-field-id="${fieldID}" class="copySectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a id="deleteSection_${fieldID}" data-section-id="${sectionID}"  data-field-id="${fieldID}" class="deleteSectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
                                          </li>
                                          <li>
                                              <a class="formSmallBox_edit " href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a>
                                          </li>
                                      </ul>
                                  </div>
                              </div>`;
                    break;
              /*  case 'text-input':
                    fieldHtml += `<div class="form_rowHover parentSection " id="form-row-hover-${sectionID}">
                                   <div class="formRow clearfix innerBox" id="group_${sectionID}">
                                      <div class="formCell col12 " id="innerElement_${fieldID}">
                                         <div class="form_editRow field-${fieldID}">
                                            <div class="form_heading ">
                                            <span class="field_label" id="fieldLabel_${fieldID}">${defaults.messages.text}</span>

                                            <div class="form_editRow_inner">
                                               <div class="controle_row_main">
                                                  <a href="javascript:void(0);"></a> 
                                                  <div class="controle_row_popup"><span>X pos: <b>550</b></span> </div>
                                               </div>
                                               <div class="form_field">
                                                <input type="text" placeholder="" class="textField_${fieldID} filed_name" id="fieldName_${fieldID}"> 
                                                
                                                </div>
                                               <div class="dotted_icon">
                                                  <a class="dotted_btn" href="javascript:void(0);"><img src="images/dotted_img.png" alt="#"></a> 
                                                  <ul>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon1.png" alt="#"></a></li>
                                                     <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon2.png" alt="#"></a></li>
                                                     <li><a id="copyField_${fieldID}" class="copyFieldBox " href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                                     <li><a id="deleteField_${fieldID}" class="deleteFieldBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                                     <li><a id="editPopup_${fieldID}" class="formSmallBox_edit " type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
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
                                         <li><a class="" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                         <li><a href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
                                         <li><a class="formSmallBox_edit " href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
                                      </ul>
                                   </div>
                                </div>`;
                    break;

                case 'textarea-input':

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
                                                     <li><a id="editPopup_${fieldID}" class="formSmallBox_edit " type="${type}" href="javascript:void(0);"><img src="images/dottedpopup_icon5.png" alt="#"></a></li>
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
                    break;*/
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

        renderSavedFields();
        /**
         * @render default fields
         */
        function renderSavedFields() {

            let savedFieldData = JSON.parse(localStorage.getItem("schema")) || {};


            var fieldHtml;
            for (var key in savedFieldData) {
                if (savedFieldData.hasOwnProperty(key)) {
                     var sectionData  = savedFieldData[key];
                    for (var sectionKey in sectionData)  {
                        var fieldsData  = sectionData[sectionKey].fields;
                        var section_id = sectionData[sectionKey].section_id;
                        for (var fieldKey in fieldsData)  {

                            let fieldType = fieldsData[fieldKey].type;
                            let fieldObj = fieldsData[fieldKey]; console.log(fieldObj.basic_properties.field_name);
                            let field_id = fieldsData[fieldKey].field_id;
                            if (fieldType == 'text-input') {

                                fieldHtml = `<div class="form_rowHover section_${section_id}" id="form-row-hover-${section_id}">
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
                                                     <li><a id="copyField_${field_id}" data-section-id ="${section_id}"  data-field-id="${field_id}" class="copyFieldBox" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                                     <li><a id="deleteField_${field_id}" data-section-id="${section_id}"  data-field-id="${field_id}" class="deleteFieldBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
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
                                         <li><a href="javascript:void(0);"><img src="images/blue4_dottes.png" alt="#"></a></li>
                                         <li><a id="copySection_${field_id}" data-section-id ="${section_id}"  data-field-id="${field_id}" class="copySectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a></li>
                                         <li><a id="deleteSection_${field_id}" data-section-id="${section_id}"  data-field-id="${field_id}" class="deleteSectionBox" href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a></li>
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


        var setFieldSchema = function(fieldId,currentFieldSchema) {
            var fieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            fieldSchema[fieldId] = currentFieldSchema;
            window.localStorage.setItem('schema', JSON.stringify(fieldSchema));
        };

        /**
         * remove single field Eelement
         * @param deletedFieldId
         */
        var removeField = function(deletedFieldId) {

            var currentfieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            delete currentfieldSchema[deletedFieldId];
            window.localStorage.setItem('schema', JSON.stringify(currentfieldSchema));
        };


        /**
         * Remove the section
         * @param deletedSectionId
         */
        var removeSection = function(deletedSectionId) {
            var currentSectionSchema = JSON.parse(localStorage.getItem("schema")) || {};
            console.log(deletedSectionId);
            for (var sectionKey in currentSectionSchema) {
                delete currentSectionSchema[sectionKey][deletedSectionId];
            }
            window.localStorage.setItem('schema', JSON.stringify(currentSectionSchema));
        }
        // remove field
        $(document).on('click','.deleteFieldBox',function (e) {
             var deletedFieldId  = extractId($(this).attr('id'));
             $('#innerElement_' + deletedFieldId).remove();
             removeField(deletedFieldId);
        });

        // remove  section/ group
        $(document).on('click','.deleteSectionBox',function (e) {
            var deletedSectionId  = parseInt($(this).attr('data-section-id'));
            console.log(deletedSectionId);
            console.log($('#section_' + deletedSectionId)   );


            $('.section_' + deletedSectionId).remove();
            removeSection(deletedSectionId);
        });



        // copy section

        $(document).on('click','.copySectionBox',function () {
            var currentSectionSchema = JSON.parse(localStorage.getItem("schema")) || {};
            var currentId  = parseInt($(this).attr('data-section-id'));
            let cloneSection = $('.section_'+ currentId).clone();
            console.log(currentId);
            console.log(cloneSection.html());
            cloneSection.insertBefore("#dropForm");
        });


        // copy fields
        $("body").on('click','.copyFieldBox',function (e) {


            var currentfieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            var currentId = Object.keys(currentfieldSchema).length;
            let current_id = extractId($(this).attr('id'));
            let cloneElement = $('#innerElement_' + current_id).clone();
            var $editPopup = cloneElement.find("#editPopup_" + currentId);

            $editPopup.attr("id", "editPopup_" + currentId);
            cloneElement.find('.field_label').prop('id', 'fieldLabel_' +currentId);
            cloneElement.find('.field_name').prop('id', 'fieldName_' +currentId);

            //cloneElement.prop('class', 'textField_' + currentId);

            cloneElement.attr('id','innerElement_' + currentId);

            let fieldId = current_id;

            //cloneElement.appendTo(".innerBox");
            var groupElement = cloneElement.parent().find('.innerBox');

            var groupId = extractId($('#innerElement_' + fieldId).parent().attr('id'));
            console.log($('#innerElement_' + fieldId).parent().attr('id'));
            console.log('grooup id--------');
            console.log(groupId);
            console.log(cloneElement.parents);
            cloneElement.appendTo("#section_"+groupId);
            // set id to current copy field
             var currentElement = cloneElement.find("#copyField_"+fieldId);
            currentElement.prop('id',"copyField_"+currentId);

            //cloneElement.prop('class', 'textLabel_' + fieldId);

            // set local storage
            var currentFieldSchema = JSON.parse(localStorage.getItem("schema")) || {};
            setFieldSchema(currentId,currentFieldSchema[fieldId])

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

            let fieldId =  (obj.attr('data-field-id'));
            let sectionId = obj.attr('data-section-id');

            let type = obj.attr('type');

            var fieldsData = getFieldSchema(fieldId);

            let fieldHeadingHtml = fieldHeading(type);
            let basicFieldHtml = basicTab(obj,type, fieldsData);
            var validateFieldHtml = validateMessageTab(type, fieldsData);
            var formatFieldHtml = formatTab(type, fieldsData);
            var valueSettingFieldHtml = valueSettingTab(type, fieldsData);
            var reportSettingFieldHtml = reportSettingTab(type, fieldsData);
            var helpMessageFieldHtml = helpMessageTab(type, fieldsData);

            let popupHtml = `<div class="all_popup formEdit_main_popup fieldPopup_${fieldId}" >
                                    <input type="hidden" value="${fieldId}" class="field_id" name="field_id">
                                    <input type="hidden" value="${sectionId}" class="section_id" name="section_id">
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

       /* var getFieldSchema = function (popupId) {
            var data = JSON.parse(localStorage.getItem("schema")) || {};
            if (typeof data[popupId] === 'undefined') {
                return data = {};
            }
            return  data[popupId].fields;
        };*/

        var getFieldSchema = function (popupId) {
            var data = JSON.parse(localStorage.getItem("schema")) || {};

            for (var sectionkey in data) {
                var sectionData  = data[sectionkey];
                for (var fieldKey in sectionData) {
                    var fieldData  = sectionData[fieldKey];
                    for (var key in fieldData) {
                        var fields = fieldData[key];
                        for (var k in fields) {
                            let field_key  = fields[k].field_id;
                            if (field_key === popupId) {
                                return fields[k];
                            }
                        }
                    }
                }
            }
            if (typeof data[popupId] === 'undefined') {
                return data = {};
            }
            return  data[popupId].fields;
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
        var basicTab = function (obj,type, fieldsData) {


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
                                                        <input type="text" placeholder="" value="${fieldsData.basic_properties.field_name}" name="field_name" id="field_name">
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
                    valueSettingFieldHtml += ` <div class="value_setting_main">
                                                <div class="value_note">
                                                    <p><b>Note: </b>The field value can be preset in the following ways
                                                        if needed</p>
                                                </div>
                                                <!--19.Form_Field_Value_Setting6-->
                                                <div class="value_setting_six">
                                                    <div class="formParent">
                                                        <div class="formRow clearfix">
                                                            <div class="formCell col3 allField_titleCol">
                                                                <div class="form_heading"><strong>Value Setting
                                                                    Options </strong></div>
                                                            </div>
                                                            <div class="formCell col6">
                                                                <div class="form_field">
                                                                    <div class="selectbox"><span
                                                                            class="selectbox_span"></span>
                                                                        <ul class="selectbox_dropdown dropdown_scroll"
                                                                            style="display: none;" name="value_setting_option">
                                                                            <li class=""> This Field Use a Dropdown List
                                                                                from a System Variable
                                                                            </li>
                                                                            <li class="">Default Setting</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            
        
                                                <div class="formRow clearfix">
                                                    <div class="formCell col12">
                                                        <div class="form_saveBtn">
                                                            <input class="all_buttons " tab-name="setting_tab" field-type="${type}" type="submit" value="Save">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
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
                                                    
                                                    
                                                    <div class="formRow clearfix process_gategory_list" style="display: ${fieldsData.report_properties.is_process_field_reporting ? 'block':'none'}">
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
            let currentFieldAttr = $(this).attr('current-field');

            console.log($(this));

            let tabName = $(this).attr('tab-name');
            let fieldsArr = JSON.parse(localStorage.getItem("schema")) || {};
            console.log(sectionId);
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

                                        console.log(fieldName);
                                        console.log(("#fieldName_" + fieldId));
                                        $("#fieldLabel_" + fieldId).html(fieldName);
                                        $("#fieldName_"+fieldId).attr('placeholder', placeHolder);
                                        $("#fieldName_"+fieldId).val(defaultValue);


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
                                        single_field.fields.format_properties = formatObj;

                                    } else if (tabName == 'setting_tab') {

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


        $(document).on('click','.check_process_field_reporting',function (e) {
            if ( $(this).is(":checked") ) {
                $(".process_gategory_list").show();
            }else {
                $(".process_gategory_list").hide();
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



        /********************* BY ZESHAN **************************/

        var controlPartialTemplates = function(type,fieldID){
            let partialHtml = '';
            switch(type.toLowerCase()){
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
                                                            <a href="javascript:void(0);" id="left-cell-insertion" type="${type}"><img src="images/dottedpopup_icon1.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);" id="right-cell-insertion" type="${type}"><img src="images/dottedpopup_icon2.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);"><img src="images/dottedpopup_icon3.png" alt="#"></a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0);"><img src="images/dottedpopup_icon4.png" alt="#"></a>
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

        // =============================== left cell insertion inside a row ===============================
        $(document).on("click", "#left-cell-insertion", function(){

            let type = $(this).attr("type");
            let parentDiv = $(this).closest('.group_container > .element_main_row_container');
            let partialHtml = controlPartialTemplates(type,fieldID);// + '-inline-cell'

            $(parentDiv).children().each(function(index, value){
                let uiElements = $(this).find(".element_inline_cell").children(); //will give you all childrens

                // remove resizeable style from elements
                $(uiElements).each(function(index, value){
                    $(this).removeAttr("style")
                });

            });

            parentDiv.prepend(partialHtml);
            applyResizeable(fieldID);
            fieldID++;

        });

        // =============================== right cell insertion inside a row ===============================
        $(document).on("click", "#right-cell-insertion", function(){

            let type = $(this).attr("type");
            let parentDiv = $(this).closest('.group_container > .element_main_row_container');
            let partialHtml = controlPartialTemplates(type);// + '-inline-cell'

            /*console.log("partialHtml", type);
            return false;*/

            $(parentDiv).children().each(function(index, value){
                // console.log($(this).find(".element_inline_cell").children());
                let uiElements = $(this).find(".element_inline_cell").children(); //will give you all childrens

                // remove resizeable style from elements
                $(uiElements).each(function(index, value){
                    $(this).removeAttr("style")
                });

            });

            parentDiv.append(partialHtml);
            applyResizeable(fieldID);
            fieldID++;
        });


        /**
         * Apply resize on control
         * @param lastIdCounter
         */
        var applyResizeable = function(lastIdCounter){

            let tempLastId = lastIdCounter || fieldID;
            let elemId = ".left-resizeable-" + tempLastId;//".formRow-" + (tempLastId) +" "+ ".left-resizeable-" + tempLastId

            // console.log("elemId", elemId);

            $(elemId).resizable({
                alsoResizeReverse: ".right-resizeable-" + tempLastId,
                handles:{
                    e: "#handle",
                },
                resize : function(event, ui) {
                    console.log("resizing...");
                },
                stop : function(event, ui) {
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


