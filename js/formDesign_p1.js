 // JavaScript Document 
 
 


 
$(document).ready(function() { 

var tableName_counter = 0;



$("body").on("click",".tableName_addCol_btn_main",function(e){
	 //tableName_counter++;
	 var html = $(this).closest(".tableName_box").find(".tableName_content").find(".tableName_appendBox:first").html();
	  var newHtml = '<div class="tableName_appendBox">'+html+'</div>'
	  $(this).closest(".tableName_box").find(".tableName_rowInner").append(newHtml);
 });
$("body").on("click",".tableName_box_delete",function(e){
	  var len = $(this).closest(".tableName_box").find(".tableName_content").find(".tableName_appendBox").length;
	   if(len > 1){
		    $(this).closest(".tableName_appendBox").remove();
	   }
 });
 
$("body").on("click",".tableName_add",function(e){
	 tableName_counter++;
	 var fieldHtml = '<li class="tableFeilds_list" data-rel="tableNameAddedField_'+tableName_counter+'"> <div class="tableFeilds"> <input class="tableName_boxField" type="text"></div></li>';
	 var deleteIcon = '<li class="tableFeilds_delete_list" data-rel="tableNameAddedField_'+tableName_counter+'"><a class="tableName_del" title="Delete Text Field" href="javascript:void(0);"><img src="images/tableName_delbtn.png" alt="#"></a></li>';
	 $(this).closest(".tableName_content").find(".tableFeilds_content").find("ul").append(fieldHtml);
	 $(this).closest(".tableName_content").find(".tableName_addBtn").find("ul").append(deleteIcon);
 });
 
 
 $("body").on("click",".tableName_del",function(e){
	  var len = $(this).closest("ul").find(".tableFeilds_delete_list").length;
	  var rel = $(this).closest("li").attr("data-rel");
	  if(len > 1){
		$(this).closest(".tableName_content").find(".tableFeilds_content").find("ul").find("[data-rel="+rel+"]").remove();
		$(this).parent().remove();  
	  }
  });


 $("body").on("click",".checkTable_add_button",function(e){
	 var html = '<li class="checkTable_apendedRow"> <div class="formParent"> <div class="formRow clearfix"> <div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col1"> <div class="form_checkbox"> <label class="checkBox_tableRow_check"> <input type="checkbox"> <span class="checkbox_checked"></span> </label> </div></div><div class="formCell col1 checkTable_moveCol"> <div class="checkbox_action"> <ul> <li><a class="checkTable_delete_button" href="javascript:void(0);"><img src="images/checkbox_action1.png" alt="#"></a></li><li><a class="checkTable_move_button rowDrageAbleIcon" href="javascript:void(0);"><img src="images/checkbox_action2.png" alt="#"></a></li></ul> </div></div><div class="formCell col1"> </div></div></div></li>';
	   var html_obj = $.parseHTML(html);
	  $(this).closest(".checkbox_table").find(".checkbox_listing").find("ul:first").append(html_obj);
  });
  
  
   $("body").on("click",".checkTable_delete_button",function(e){
	  var len = $(this).closest(".checkbox_listing").find(".checkTable_apendedRow").length;
	 
	  if(len > 1){
		$(this).closest(".checkTable_apendedRow").remove();  
	  }
  });
  
   $("body").on("click",".checkBox_tableRow_check input",function(e){
 	  if($(this).prop("checked") === true){
		$(this).closest(".checkTable_apendedRow").addClass("rowChecked");  
	  }else{
	  	$(this).closest(".checkTable_apendedRow").removeClass("rowChecked");  
	  }
  });
  
  
   $("body").on("click",".createNew_checkBox_addButton",function(e){
	 var html = ' <div class="createNew_checkbox_apended"> <div class="checkbox_listing"> <ul> <li> <div class="formParent"> <div class="formRow clearfix"> <div class="formCell col3 allField_titleCol"> <div class="form_heading"> <strong>Checkbox Name</strong> </div></div><div class="formCell col4"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col3 allField_titleCol"> <div class="form_heading"> <strong>Allow Multiple Selections</strong> </div></div><div class="formCell col2"> <div class="form_field"> <div class="selectbox"> <span class="selectbox_span"></span> <ul class="selectbox_dropdown dropdown_scroll" style="display: none;"> <li class="">Yes</li><li class="">No</li></ul> </div></div></div></div></div></li></ul> </div><div class="checkbox_table"> <div class="checkbox_tableTile"> <div class="formParent"> <div class="formRow clearfix"> <div class="formCell col3"> <div class="form_heading"> <strong>Label Name</strong> </div></div><div class="formCell col3"> <div class="form_heading"> <strong>Value</strong> </div></div><div class="formCell col3"> <div class="form_heading"> <strong>Score</strong> </div></div><div class="formCell col1"> <div class="form_heading"> <strong>Default</strong> </div></div><div class="formCell col1"> <div class="form_heading"> <strong>Action</strong> </div></div><div class="formCell col1 clearfix"> <div class="checkbox_addList"> <a class="checkTable_add_button" href="javascript:void(0);"><img src="images/tableName_addbtn.png" alt="#"></a> </div></div></div></div></div><div class="checkbox_listing checkTable_content"> <ul class="ui-sortable sortable_ul"> <li class="checkTable_apendedRow"> <div class="formParent"> <div class="formRow clearfix"> <div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col3"> <div class="form_field"> <input type="text" placeholder=""> </div></div><div class="formCell col1"> <div class="form_checkbox"> <label class="checkBox_tableRow_check"> <input type="checkbox"> <span class="checkbox_checked"></span> </label> </div></div><div class="formCell col1 checkTable_moveCol"> <div class="checkbox_action"> <ul> <li><a class="checkTable_delete_button" href="javascript:void(0);"><img src="images/checkbox_action1.png" alt="#"></a></li><li><a class="checkTable_move_button rowDrageAbleIcon " href="javascript:void(0);"><img class="" src="images/checkbox_action2.png" alt="#"></a></li></ul> </div></div><div class="formCell col1"> </div></div></div></li></ul> </div></div></div>';
	   var html_obj = $.parseHTML(html);
	  $(this).closest(".checkbox_popup_main").find(".createNew_checkbox_main").append(html_obj);
  });
  
  
  
  
  
 

//end ready
});

 
 







 
 