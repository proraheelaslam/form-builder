 // JavaScript Document 
 
 


 
$(document).ready(function() { 


 
$("body").on("click",".dropdownArrow",function(e){
	e.stopPropagation();
	$("body").addClass("mobile_pointer");
	if($(this).parent("li").hasClass("has_dropdown") === true){
		if($(this).parent("li").hasClass("active") === true){
			  $(this).parent("li").removeClass("active");
			  $(this).parent("li").find("ul").hide();
		}else{
			// $(this).closest("ul").find(".has_dropdown").find("ul").stop().hide();
			// $(this).closest("ul").find(".has_dropdown").removeClass("active");
			  $(this).parent("li").addClass("active");
			  $(this).parent("li").find("ul").show();
		}
	}
	 
});


$("body").on("click",".leftBar_menu",function(e){
	e.stopPropagation();
});

$("body").on("click",function(e){
	//$(".dropdownArrow").closest("ul").find(".has_dropdown").find("ul").stop().hide();
	//$(".dropdownArrow").closest("ul").find(".has_dropdown").removeClass("active");
	$("body").removeClass("open_mobile_menu");
	$(".header_right").removeClass("show");
	$("body").removeClass("mobile_pointer");
	
	$(".user_profile, .alert_notification").removeClass("header_dropdown_show");
	
});

$(".menu_toggle, .mob_menuIcon").click(function(e){ 
     e.stopPropagation();
	 $(".wrapper").toggleClass("open_left_menu");
	 $("body").toggleClass("open_mobile_menu");
	 $("body").toggleClass("mobile_pointer");
	 $(".dropdownArrow").closest("ul").find(".has_dropdown").find("ul").stop().hide();
	$(".dropdownArrow").closest("ul").find(".has_dropdown").removeClass("active");
	$(".user_profile, .alert_notification").removeClass("header_dropdown_show");
});

/*selectbox dropdown js start here*/
	$("body").click(function(e){
		if($(e.target).hasClass("selectbox_span"))
			{
				if($(e.target).parent().find('.selectbox_dropdown').css("display") === "none")
				{
					$('.selectbox').removeClass("focus");
					$('.selectbox_dropdown').hide();
					$("body").addClass("mobile_pointer");
					$(e.target).parent().addClass("focus");
					$(e.target).parent().find('.selectbox_dropdown').show();
				}else{
					$('.selectbox').removeClass("focus");
					$('.selectbox_dropdown').hide();
				}
				e.stopPropagation();
			}
		
	});
$(document).on('click', function() {
	$('.selectbox').removeClass("focus");
    $('.selectbox_dropdown').hide();
});

$("body").on("click",".selectbox_dropdown li",function(){
	if($(this).hasClass("not_click"))
	{
		return false;
	}
	var optionHtml = $(this).html();
	 
	$(this).closest(".selectbox").find(".active").removeClass("active");
	$(this).addClass("active");
	$(this).closest(".selectbox").find("span").html(optionHtml);
});

 	
/*selectbox dropdown js end here*/	
$(".taskHeader_tab ul li a").click(function() {
	var id = $(this).attr("href");
	$(".taskHeader_tab ul li a").removeClass("active");
	$(this).addClass("active");
	$(".taskTab_show").hide();
	$(id).show();
	
	// audit_box_height_calc();

	 $(this).closest(".task_main").addClass("active");
	 $(this).closest(".task_main").find(".task_detail").stop().slideDown('fast', function() {
       audit_box_height_calc();
    });
	return false;
});
audit_box_height_calc();



 
$("body").on("click",".taskHeader_arrow, .taskHeader_text",function(){
	 audit_box_height_calc();
	 $(this).closest(".task_main").toggleClass("active");
	 $(this).closest(".task_main").find(".task_detail").stop().slideToggle('fast', function() {
       audit_box_height_calc();
    });
});

$("body").on("click",".identification_icon",function(e){
	$("body").addClass("mobile_pointer");
	$(".header_right").toggleClass("show");
	e.stopPropagation();
});

$("body").on("click",".header_right, .notification_popup",function(e){
	e.stopPropagation();
});


$("body").on("click",".alert_notification",function(e){
	
 	
	$(".user_profile").removeClass("header_dropdown_show");
	$(this).toggleClass("header_dropdown_show");
   $("body").toggleClass("mobile_pointer"); 
	
	
	// $(".task_main").removeClass("active");
	// $(".task_main").find(".task_detail").stop().slideUp('fast', function() {
    //  audit_box_height_calc();
    //});
	// notification_height_calc();
		 setTimeout(function(){
		   //audit_box_height_calc();
		   notification_height_calc();
	  }, 250);
	e.stopPropagation();
});

$("body").on("click",".user_profile",function(e){
	$(".alert_notification").removeClass("header_dropdown_show");
	$(this).toggleClass("header_dropdown_show");
	$("body").toggleClass("mobile_pointer"); 
	
	e.stopPropagation();
});


$("body").on("click",".notification_close",function(e){
	$(this).closest(".header_dropdown_show").removeClass("header_dropdown_show");
	$("body").removeClass("mobile_pointer"); 
	e.stopPropagation();
});

 //header_dropdown_show
 
	$(".process_nav ul li").each(function(index, element, raingStarsDiv) {
		var liIndex = $(this).index();
		$(this).addClass(+liIndex);
		$(this).attr("class", liIndex);
	});	
 
	
	$(".process_nav ul li").click(function(e) {
		 if($(this).parents(".rating").find(".rating_stars ul").hasClass("lock_rating")){
			 return false;
		 }
		var total_num = $(this).attr("class"); 
		var prevNumber = $(this).attr("class"); 
		
		//alert(prevNumber)
		
		$(this).parent().find("li").each(function(index, element) {
			if(index <= parseInt(total_num)){
				$(this).find("a").addClass("active");
			}else{
				$(this).find("a").removeClass("active");
			}
			if(index < parseInt(prevNumber)){
				$(this).find("a").addClass("process_done");
			}else{
				$(this).find("a").removeClass("process_done");
			}
		});
		return false ;
	}); 
		
		
	$(".numbersOnly").keypress(function(e) {
		var charCode = (e.which) ? e.which : e.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
			e.preventDefault();
		}
	});
	$("body").on("click",".dueDay_select ul li",function(e){
	   var thisText = $(this).html();
	   if(thisText === "Fixed Date"){
		   $(this).closest(".formRow").find(".startDate_field_show").hide();
		   $(this).closest(".formRow").find(".fixedDate_field_show").show();
		    $(this).closest(".formRow").find(".startDate_field_show input").val("");
		}
		 if(thisText === "Start Date Plus"){
		   $(this).closest(".formRow").find(".fixedDate_field_show").hide();
		   $(this).closest(".formRow").find(".startDate_field_show").show();
		   $(this).closest(".formRow").find(".fixedDate_field_show input").val("");
		}
	});
	 notification_height_calc();
	 
	 
$(".popup_tabsTitle ul li a").click(function() {
	var id = $(this).attr("href");
	$(".popup_tabsTitle ul li a").removeClass("active");
	$(this).addClass("active");
	$(".popupTabs_show").hide();
	$(id).show();
	return false;
});

$(".popup_close").click(function() {
	$("body").removeClass("hidden");
	$(".all_popup").hide();
});


$('.upload_picture input[type="file"]').change(function() {
  $(this).parent().find(".upload_picture_inner").show();
  $(this).parent().find("span").hide();
});



$(".add_element_list ul li").hover(function() {
	$(".add_element_tip em").text("");
    var thisOffset = $(this).offset().top; 
	var rbTipHeight = $(".add_element_tip").height();
	var tipCalc = thisOffset - rbTipHeight;
	var text = $(this).find("span").text();
	$(".add_element_tip em").text(text);
	$(".add_element_tip").css("top", tipCalc);
	$(".add_element_tip").addClass("active");
});

$(".add_element_tip").hover(function() {
	$(".add_element_tip").addClass("active");
});

$(".add_element_list ul li, .add_element_tip").mouseleave(function() {
	$(".add_element_tip").removeClass("active");
});




   /* $("body").on("click",".formSmallBox_edit",function(e){
		$(".formEdit_main_popup").show();
		$("body").addClass("hidden");
		$("[href='#popupTab_1']").click();
	   
	});*/


//end ready
});


$(window).resize(function(e) {
  audit_box_height_calc();
		   notification_height_calc();
	  setTimeout(function(){
		   audit_box_height_calc();
		   notification_height_calc();
	  }, 250);
});




function audit_box_height_calc(){
	var winHeight = $(window).height();
	var headerHeight = $(".header").height();
	var audit_top_height = $(".audit_top").height();
	var task_main_height  = $(".task_main").height();
	var formEle_height  = $(".add_element_heading").height();
	var totalBoxHeight = winHeight - headerHeight - audit_top_height - task_main_height ;
	$(".auditContent_scroll").height(totalBoxHeight);
	$(".wrapper").css("padding-top", headerHeight);
	$(".left_bar").css("top", headerHeight);
	var lbScrolHeight = winHeight - headerHeight;
	$(".leftBar_detail").css("height", lbScrolHeight);
	
	
	var rbScrolHeight = winHeight - headerHeight - formEle_height;
	$(".right_bar").css("padding-top", headerHeight);
	$(".add_element_inner").css("height", rbScrolHeight);
	
	
 	
}


function notification_height_calc(){
	 var windHeight = $(window).height();
	 var headersHeight = $(".headerRight_float").height() + 20;
	 var notificationHeader_height = $(".notification_headerMain").height();
	 var totalHeight = windHeight - headersHeight - 38;
	 $(".notification_scroll").height(totalHeight);
 
}

 
$(window).on("load",function(){
  setTimeout(function(){
	   audit_box_height_calc();
	   notification_height_calc();
  }, 10);
});
 









 
 