//Other testing

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
    if($(e.target).hasClass('content')) {
        $(e.target).do(function(){
            if (Math.ceil(this.scrollTop() + this.height()) >= this.get(0).scrollHeight){
                request();
            }
        });
    }
});

$(document).ready(function(){

    const subreddits = [
        'all',
        'pics',
        'aww',
        'gifs',
        'blackpeopletwitter',
        'reformed',
        'iama',
        'baking',
        'tifu',
        'girls'
    ];

    const navList = $('nav ul');
    
    $.each(subreddits, function(n, p) {
        navList.append('<li data-reddit="' + p + '" class="navigation' + (n == 0 ? ' selected' : '') + '">' + render(p).name + '</li>');
    });

    $('.navigation').click(function(){
        $('.navigation').removeClass('selected');
        $(this).addClass('selected').data('after', '');
        $('.content').scrollTop(0);
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

var request = function() {

    const header = $('header');
    const content = $('body .content');
    const nav = $('.navigation.selected');
    const after = nav.data('after');

    var more = after ? '?after=' + after : '';

    $.ajax({
		url: render(nav.data('reddit')).url + more,
		success: function(json) {
			if(json.data){
                if(!after){
                    content.empty();
                }
                nav.data('after', json.data.after);
				$.each(json.data.children, function(i, v) {
                    const info = $('.info');
                    
                    renderPostCard(content, v, json, i);    
                })  
		    }
	    }
    })
}

var findPrimeFactor = function(n) {
    var i=2;
    while (i<=n){
        if (n%i == 0){
            n/=i;    
        }else{
            i++;
        }
    }
    return i;
}

var renderFullPost = function(domTarget, datum) {
    $.ajax ({
        url: 'https://www.reddit.com' + datum.data.permalink + '.json',
        success: function(post) {
            var postedContent = post[0].data.children[0];
            var postComments = post[1];
            var postTextHtml = (function() {
                    return $('<div></div>').html(postedContent.data.selftext_html).text();
                })();
                
            domTarget.append('<div class="full-post"><i class="close-post fa fa-times" title="Close post"></i><div class="full-post-content"><h2>' + postedContent.data.title + '</h2><div class="self-text">' + postTextHtml + '</div></div></div>');
            
            var fullPostContent = $('.full-post-content');
            
            if(postedContent.data.preview) {
                var image = postedContent.data.preview;
                fullPostContent.find('.self-text').append('<div class="post-picture"><img src=' + image.images[0].source.url + '></div>');
            }
            
            $.each(postComments.data.children, function(count, comment) {
                var commentTextHtml = (function() {
                return $('<div></div>').html(comment.data.body_html).text();
                })();
                
                fullPostContent.append(commentTextHtml);
            });
            
            var fullPost = $('.full-post');
            
            fullPost.find('.close-post').off('click').on('click', function(evt) {
                fullPost.remove();
            });
            
            console.log(postedContent);
            console.log(postComments.data.children);
            }
        })
}

var renderPostCard = function(domTarget, datum, dataSet, count) {
    var t = (Math.random() * 10) + 1;
    t = Math.floor(t);
    const length = dataSet.data.children.length;
    const nthChild = findPrimeFactor(length);
    
    domTarget.append('<a target="_blank" href="' + datum.data.url + '" class="post-card"><div class="info"><h2>' + datum.data.title + '</h2></div></a>');
    $('.post-card').last().addClass('background' + t);
                    
    if(datum.data.preview) {
        $('.post-card').last().attr('style',  'background: url(' + datum.data.preview.images[0].source.url + '); background-repeat: no-repeat; background-size: cover; background-position: center;')
    }
    
    var card = $('.post-card').last();
                    
    card.find('.info').append('<div class="post-data"><p><a target="_blank" href="https://www.reddit.com' + datum.data.permalink + '">' + datum.data.num_comments + ' Comments</a></p><p>Posted By: <a target="_blank" href="https://www.reddit.com/u/' + datum.data.author + '">' + datum.data.author + '</a> On <a target="_blank" href="https://www.reddit.com/r/' + datum.data.subreddit + '">' + datum.data.subreddit_name_prefixed +'</a></p><p class="score">' + datum.data.score + '</p></div>');

    if(nthChild == 2) {
        card.addClass('half-width');
    } 
    else if(count%nthChild == 0) {
        card.addClass('full-width');
    } 
    else {
        card.addClass('half-width');
    }
                    
    if(datum.data.over_18 || datum.data.spoiler) {
        card.addClass('spoiler-nsfw');
        if(datum.data.spoiler) {
            card.append('<a href="" class="card-cover spoiler"><p class="warning-type">SPOILER!</p><p class="subreddit">' + datum.data.subreddit_name_prefixed + '</p></a>');
        } 
        else if(datum.data.over_18) {
            card.append('<a href="" class="card-cover nsfw"><p class="warning-type">NSFW!</p><p class="subreddit">' + datum.data.subreddit_name_prefixed + '</p></a>');
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
        if(datum.data.domain.indexOf('self') || datum.data.domain.indexOf('redd')) {
            e.preventDefault();
            renderFullPost(domTarget, datum);
        }
    })
}