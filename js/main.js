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
        'girls',
        'counting'
    ];

    const navList = $('nav ul');
    
    $.each(subreddits, function(n, p) {
        navList.append(templates.nav.render({
            reddit: p,
            selected: (n == 0 ? 'selected' : ''),
            name: _.nav(p).name
        }));
    });

    $('.navigation').click(function(){
        $('.navigation').removeClass('selected');
        $(this).addClass('selected').data('after', '');
        $('.content').scrollTop(0);
        request();
    });   

	request();
    
    $('.menu-toggle').off('click').on('click', function(e) {
        e.preventDefault;
        $('header').toggleClass('no-show');
        $('.menu-toggle').toggleClass('fa-times');
        $('.menu-toggle').toggleClass('fa-bars');
        console.log(e);
    })

});

var request = function() {

    const header = $('header');
    const content = $('body .content');
    const nav = $('.navigation.selected');
    const after = nav.data('after');

    var more = after ? '?after=' + after : '';

    $.ajax({
		url: _.nav(nav.data('reddit')).url + more,
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
                //var image = postedContent.data.preview;
                var image = findBackgroundImg(postedContent);
                fullPostContent.find('.self-text').append('<div class="post-picture"><img src=' + /*image.images[0].source.url*/image + '></div>');
            }

            getComments(postComments.data.children, fullPostContent);
            
            var fullPost = $('.full-post');
            
            fullPost.find('.close-post').off('click').on('click', function(evt) {
                fullPost.remove();
            });
            
            //console.log(postedContent);
            //console.log(postComments.data.children);
        }
    })
}

// Recursive method to handle comments
var getComments = function(comments, parent) {
    if($.isArray(comments)) {
        $.each(comments, function(index, comment){
            parent.append($('<div></div>').html(comment.data.body_html).text());
            if(comment.data.replies) {
                getComments(comment.data.replies.data.children, parent.find('.md').last());
            }
        });
    }
    else {
        parent.append($('<div></div>').html(comments.data.body_html).text());
    }
};

var renderPostCard = function(domTarget, datum, dataSet, count) {
    var t = (Math.random() * 10) + 1;
    t = Math.floor(t);
    const length = dataSet.data.children.length;
    const nthChild = _.findPrimeFactor(length);
    
    //console.log(datum);
    
    domTarget.append(templates.postCard.render({
            title: datum.data.title,
            url: datum.data.url,
        }));
    $('.post-card').last().addClass('background' + t);
                    
    if(datum.data.preview) {
        
        var bgUrl = findBackgroundImg(datum);
        
        $('.post-card').last().attr('style',  'background: url(' + bgUrl + '); background-repeat: no-repeat; background-size: cover; background-position: center;')
    }
    
    var card = $('.post-card').last();
                    
    card.find('.info').append(templates.cardInfo.render({
        commentsLink: datum.data.permalink,
        commentsNumber: datum.data.num_comments,
        author: datum.data.author,
        sub: datum.data.subreddit,
        prefixedSub: datum.data.subreddit_name_prefixed,
        score: datum.data.score
    }));

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
            e.stopPropagation();
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

var findBackgroundImg = function(datum) {
       if((~datum.data.url.indexOf('imgur') && (~datum.data.url.indexOf('gif'))) || (~datum.data.url.indexOf('redd') && ~datum.data.url.indexOf('.gif'))) {
           if(~datum.data.url.indexOf('gifv')){
            var background = datum.data.url.replace('gifv', 'gif');
           }
           else {
            var background = datum.data.url;
           }
        }
        else if(~datum.data.url.indexOf('gfycat') || ~datum.data.url.indexOf('giphy')) {
            var background = datum.data.preview.images[0].variants.gif.source.url;
        }
        else 
        {
            var background = datum.data.preview.images[0].source.url;
        }
    return background;
}