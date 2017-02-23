$(document).ready(function(){ 
    const header = $('header');
    const navList = $('nav ul');
	const content = $('body .content');
    var subreddits = {
        pics: {
            name: 'pics'
        },
        aww: {
            name: 'aww'
        },
        gifs: {
            name: 'gifs'
        }
    };
    
    $.each(subreddits, function(n, p) {
        navList.append('<li>' + p.name + '</li>')
    });
    
	$.ajax({
		url: 'https://www.reddit.com/r/' + subreddits.pics.name + '.json',
		success: function(json) {
			if(json.data){
				$.each(json.data.children, function(i, v) {
                    var t = (Math.random() * 10) + 1;
                    t = Math.floor(t);
                    const card = "card" + i;
                    const cardId = '#' + card;                      
                    if(v.data.preview) {
					   content.append('<a target="_blank" style="background-image: url(' + v.data.preview.images[0].source.url + ');" href="' + v.data.url + '" class="post-card" id="card' + i + '"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                    } else {
                        content.append('<a target="_blank" href="' + v.data.url + '" class="post-card" id="' + card + '"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                        $(cardId).addClass('background' + t);
                    }
            
                    if(v.data.over_18 || v.data.spoiler) {
                        $(cardId).addClass('blur');
                    }
				});
                console.log(json.data.children);
			}
            
		}
	})
});