$(document).ready(function(){ 
	var body = $('body');
	$.ajax({
		url: 'https://www.reddit.com/r/pics.json',
		success: function(json) {
			if(json.data){
				$.each(json.data.children, function(i, v) {
                    if(v.data.preview) {
					body.append('<a target="_blank" style="background-image: url(' + v.data.preview.images[0].source.url + ');" href="' + v.data.url + '"><h2>' + v.data.title + '</h2></a>');
                    } else {
                        body.append('<a target="_blank" href="' + v.data.url + '"><h2>' + v.data.title + '</h2></a>');
                    }
				});
                console.log(json.data.children);
			}
            
		}
	})
});