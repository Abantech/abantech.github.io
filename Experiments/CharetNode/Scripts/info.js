var showHelp = false;

$(function ()
{
	 $("#infoBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.5)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#infoButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "top":"4px", "left":"4px"
	}) // adds CSS
    .append("<img width='32' height='32' src='Images/icon-info.png'/>")
    .button()
	.click( 
		function() 
		{ 
		    $("#infoBox").html("Find out more about us at <a href=\"http://www.abantech.net/\" target=\"_blank\">http://www.abantech.net/</a>");
		    $("#infoBox").dialog("open");

		    setTimeout(function ()
		    {
		        $("#infoBox").dialog("close");
		    }, 3000);
		});
});