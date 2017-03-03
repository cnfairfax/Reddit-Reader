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
        'blackpeopletwitter',
        'reformed',
        'iama',
        'baking',
        'tifu'
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
                    
                    card.find('.info').append('<div class="post-data"><p><a target="_blank" href="https://www.reddit.com' + v.data.permalink + '">' + v.data.num_comments + ' Comments</a></p><p>Posted By: <a target="_blank" href="https://www.reddit.com/u/' + v.data.author + '">' + v.data.author + '</a> On <a target="_blank" href="https://www.reddit.com/r/' + v.data.subreddit + '">' + v.data.subreddit_name_prefixed +'</a></p><p class="score">' + v.data.score + '</p></div>');

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
                    
                    if(v.data.over_18 || v.data.spoiler) {
                        card.addClass('spoiler-nsfw');
                        if(v.data.spoiler) {
                            card.append('<a href="" class="card-cover spoiler"><p class="warning-type">SPOILER!</p><p class="subreddit">' + v.data.subreddit_name_prefixed + '</p></a>');
                        } else if(v.data.over_18) {
                            card.append('<a href="" class="card-cover nsfw"><p class="warning-type">NSFW!</p><p class="subreddit">' + v.data.subreddit_name_prefixed + '</p></a>');
                        }
                                                
                        $('a.card-cover').off('click').on('click', function(e) { 
                            e.preventDefault(); 
                            if($(this).hasClass('hidden')) {
                                $(this).removeClass('hidden');
                            } 
                            else {
                                $(this).addClass('hidden');
                                
                            }
                         })
				}
                card.off('click').on('click', function(e) {
                      
                    if(~v.data.domain.indexOf('self') || ~v.data.domain.indexOf('redd')) {
                            e.preventDefault();
                            renderFullPost();
                            console.log(v.data.url)
                        }
                    console.log(v);
                    })
                
                function renderFullPost() {
                            $.ajax ({
                                url: 'https://www.reddit.com' + v.data.permalink + '.json',
                                success: function(post) {
                                    var postedContent = post[0].data.children[0];
                                    var postComments = post[1];
                                    var postTextHtml = (function() {
                                        return $('<div></div>').html(postedContent.data.selftext_html).text();
                                    })();
                                    content.append('<div class="full-post"><i class="fa fa-times" title="Close post"></i><div class="full-post-content"><h2>' + postedContent.data.title + '</h2><div class="self-text">' + postTextHtml + '</div></div></div>');
                                    var fullPostContent = $('.full-post-content');
                                    if(postedContent.data.preview) {
                                        var image = postedContent.data.preview;
                                        fullPostContent.find($('.self-text')).append('<img src=' + image.images[0].resolutions[image.images[0].resolutions.length-1].url + '>');
                                    }
                                    $.each(postComments.data.children, function(count, comment) {
                                        var commentTextHtml = (function() {
                                        return $('<div></div>').html(comment.data.body_html).text();
                                    })();
                                        fullPostContent.append(commentTextHtml);
                                    });
                                    $('.full-post i').off('click').on('click', function(evt) {
                                        fullPost.remove();
                                    });
                                    var fullPost = $('.full-post');
                                    console.log(postedContent);
                                    console.log(postComments.data.children);
                                }
                            })
                        }
			})
            
		}
	}
})
}

function renderFullPost() {
                            $.ajax ({
                                url: v.data.url + '.json',
                                success: function(post) {
                                    var postedContent = post[0].data.children[0];
                                    var postComments = post[1];
                                    var postTextHtml = (function() {
                                        return $('<div></div>').html(postedContent.data.selftext_html).text();
                                    })();
                                    content.append('<div class="full-post"><i class="fa fa-times" title="Close post"></i><div class="full-post-content"><h2>' + postedContent.data.title + '</h2><div class="self-text">' + postTextHtml + '</div></div></div>');
                                    var fullPostContent = $('.full-post-content');
                                    if(postedContent.data.preview.enabled) {
                                        var image = postedContent.data.preview;
                                        fullPostContent.find($('.self-text')).append('<img src=' + image.images[images.length-1].resolution[resolution.length-1].url + '>');
                                        console.log(image.images[(images.length)-1].resolution[(resolutions.length)-1].url);
                                    }
                                    $.each(postComments.data.children, function(count, comment) {
                                        var commentTextHtml = (function() {
                                        return $('<div></div>').html(comment.data.body_html).text();
                                    })();
                                        fullPostContent.append(commentTextHtml);
                                    });
                                    $('.full-post i').off('click').on('click', function(evt) {
                                        fullPost.remove();
                                    });
                                    var fullPost = $('.full-post');
                                    console.log(postedContent);
                                    console.log(postComments.data.children);
                                }
                            })
                        }