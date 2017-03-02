$.fn.extend({
    do: function(callback){
		return (this.length ? callback : $.noop).call(this, this) || this;
	},
    fire: function(event){
		return this.trigger(event);
	}
});

document.addEventListener('scroll', function (e){
	$(e.target).fire('event-scroll');
}, true);

$(document).on('event-scroll', function(e) {
    $(e.target).do(function(){
        if (Math.ceil(this.scrollTop() + this.height()) >= this.get(0).scrollHeight){
            var page = $(document).data('page', $(document).data('page') + 1);
            request(page);
        }
    })
})

$(document).ready(function(){

    $(document).data('page', 0);

    const subreddits = [
        'all',
        'pics',
        'aww',
        'gifs',
        'blackpeopletwitter'
    ];

    const navList = $('nav ul');
    
    $.each(subreddits, function(n, p) {
        navList.append('<li data-reddit="' + p + '" class="navigation' + (n == 0 ? ' selected' : '') + '">' + render(p).name + '</li>');
    });

    $('.navigation').click(function(){
        $(document).data('page', 0);
        $('.navigation').removeClass('selected');
        $(this).addClass('selected');
        request();
    });
    

	request();

});

var render = function(sub) {
    return {
        name: '/r ' + sub,
        url: 'https://www.reddit.com/r/' + sub + '.json'
    };
};

var request = function(page) {

    const header = $('header');
    const content = $('body .content');
    const nav = $('.navigation.selected');

    var more = page ? '?count=' + (25 * parseInt(page)) + '&after=' + nav.data('after') : '';

    $.ajax({
		url: render(nav.data('reddit')).url + more,
		success: function(json) {
			if(json.data){
                if(!page){
                    content.empty();
                }
                nav.data('after', json.data.after);
				$.each(json.data.children, function(i, v) {
                    var t = (Math.random() * 10) + 1;
                    t = Math.floor(t);
                    const info = $('.info');
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
					   content.append('<a target="_blank" style="background-image: url(' + v.data.preview.images[0].source.url + ');" href="' + v.data.url + '" class="post-card"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                    } else {
                        content.append('<a target="_blank" href="' + v.data.url + '" class="post-card"><div class="info"><h2>' + v.data.title + '</h2></div></a>');
                        $('.post-card').last().addClass('background' + t);
                    }

                    var card = $('.post-card').last();
                    
                    card.find('.info').append('<div class="post-data"><p><a target="_blank" href="https://www.reddit.com' + v.data.permalink + '">' + v.data.num_comments + ' Comments</a></p><p>Posted By: <a target="_blank" href="https://www.reddit.com/u/' + v.data.author + '">' + v.data.author + '</a></p><p class="score">' + v.data.score + '</p></div>');

                    if(nthChild == 2) {
                        card.addClass('half-width');
                    } 
                    else if(nthChild == 1) {
                        card.addClass('full-width');
                    } 
                    else if(i%nthChild == 0) {
                        card.addClass('full-width');
                    } 
                    else {
                        card.addClass('half-width');
                    }
                    
                    if(v.data.spoiler || v.data.nsfw) {
                        card.addClass('spoiler-nsfw');
                        if(v.data.spoiler) {
                            card.append('<a href="" class="card-cover spoiler"><p>SPOILER!</p></a>');
                        } else {
                            card.append('<a href="" class="card-cover nsfw"><p>NSFW!</p></a>');
                        }
                        $('a.card-cover').click(function(e) {
                             e.preventDefault(); 
                            /*$(this).hasClass('hidden').removeClass('hidden');*/
                            $(this).addClass('hidden');
                         });
                    }
				});
			}
            
		}
	})
}