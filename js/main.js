$(document).ready(function(){ 
    /*$.ajax ({
        url: 'https://www.reddit.com/user/pmmeyourtomatoes.json',
        success: function(json) {
            $.each(json.data.children, function(i, v) {
                console.table(v);
            });
        }
    })*/
    
    const subreddits = [
        'all',
        'pics',
        'aww',
        'gifs',
        'blackpeopletwitter'
    ];

    const navList = $('nav ul');
    
    $.each(subreddits, function(n, p) {
        navList.append('<li data-reddit="' + p + '" class="navigation">' + render(p).name + '</li>');
    });

    $('.navigation').click(function(){
        request($(this).data('reddit'));
    });
    
	request(subreddits[0]);
});

var render = function(sub) {
    return {
        name: '/r ' + sub,
        url: 'https://www.reddit.com/r/' + sub + '.json'
    };
}

var request = function(sub) {

    const header = $('header');
    const content = $('body .content');

    $.ajax({
		url: render(sub).url,
		success: function(json) {
			if(json.data){
                content.empty();
				$.each(json.data.children, function(i, v) {
                    var t = (Math.random() * 10) + 1;
                    t = Math.floor(t);
                    const card = "card" + i;
                    const cardId = '#' + card;
                    const cardQuery = $(cardId);
                    const info = $('.info');
                    const infoCard = cardId + ' ' + info;
                    const length = json.data.children.length;
                    const nthChild = (function() {
                        if (length%11 == 0) {
                            return 11;
                        }
                        else if (length%7 == 0) {
                            return 7;
                        }
                        else if (length%5 == 0) {
                            return 5;
                        }
                        else if (length%3 == 0) {
                            return 3;
                        }
                        else if (length%2 == 0){
                            return 2;
                        }
                        else {
                            return 1;
                        }
                    })();
                    
                    if(v.data.preview) {
					   content.append('<a target="_blank" style="background-image: url(' + v.data.preview.images[0].source.url + ');" href="' + v.data.url + '" class="post-card" id="card' + i + '"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                    } else {
                        content.append('<a target="_blank" href="' + v.data.url + '" class="post-card" id="' + card + '"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                        $(cardId).addClass('background' + t);
                    }
                    
                    $(cardId + ' .info').append('<div class="post-data"><p><a target="_blank" href="https://www.reddit.com' + v.data.permalink + '">' + v.data.num_comments + ' Comments</a></p><p>Posted By: <a target="_blank" href="https://www.reddit.com/u/' + v.data.author + '">' + v.data.author + '</a></p><p class="score">' + v.data.score + '</p></div>');
                    
                    if(nthChild == 2) {
                        $(cardId).addClass('half-width');
                    } 
                    else if(nthChild == 1) {
                        $(cardId).addClass('full-width');
                    } 
                    else if(i%nthChild == 0) {
                        $(cardId).addClass('full-width');
                    } 
                    else {
                        $(cardId).addClass('half-width');
                    }
                    
                    if(v.data.spoiler || v.data.nsfw) {
                        $(cardId).addClass('spoiler-nsfw');
                        if(v.data.spoiler) {
                            $(cardId).append('<a href="" class="card-cover spoiler"><p>SPOILER!</p></a>');
                        } else {
                            $(cardId).append('<a href="" class="card-cover nsfw"><p>NSGW!</p></a>');
                        }
                        $('a.card-cover').click(function(e) {
                             e.preventDefault(); 
                            /*$(this).hasClass('hidden').removeClass('hidden');*/
                            $(this).addClass('hidden');
                         });
                    }
				});
                console.log(json.data);
			}
            
		}
	})
}