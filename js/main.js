$(document).ready(function(){ 
	var body = $('body');
	$.ajax({
		url: 'https://www.reddit.com/r/pics.json',
		success: function(json) {
			if(json.data){
				$.each(json.data.children, function(i, v) {
					body.append('<a target="_blank" href="' + v.data.url + '">' + v.data.title + '</a><br>');
				});
			}
		}
	})
});