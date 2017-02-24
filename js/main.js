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
                    const info = $('.info');
                    const infoCard = cardId + ' ' + info;
                    if(v.data.preview) {
                        /*if(v.data.spoiler){
                            content.append('<a target="_blank" href="" class="post-card" id="card' + i + '"><div class="info"><h2>SPOILER</h2><div>');
                            $(cardId).addClass('background' + t);
                            $(cardId).click(function() {
                                $('.info').append('<h2>' + v.data.title + '</h2>');
                                $('.post-card').attr('href', v.data.url);
                                $('.post-card').attr('style', 'background: url(' + v.data.preview.images[0].source.url + ');');
                            });
                        }*/
					   content.append('<a target="_blank" style="background-image: url(' + v.data.preview.images[0].source.url + ');" href="' + v.data.url + '" class="post-card" id="card' + i + '"><div class="info"><h2>' + v.data.title + '</h2><div>');
                    } else {
                        content.append('<a target="_blank" href="' + v.data.url + '" class="post-card" id="' + card + '"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                        $(cardId).addClass('background' + t);
                    }
                    
                    $(cardId + ' .info').append('<div class="post-data"><p><a target="_blank" href="https://www.reddit.com' + v.data.permalink + '">' + v.data.num_comments + ' Comments</a></p><p>Posted By: <a target="_blank" href="https://www.reddit.com/u/' + v.data.author + '">' + v.data.author + '</a></p><p class="score">' + v.data.score + '</p></div>');
                    
				});
                console.log(json.data.children);
			}
            
		}
	})
});