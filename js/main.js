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
        'reformed',
        'iama',
        'thebachelor'
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
        requestAbout();
    });   

	request();
    requestAbout();

    $('.sidebar-toggle').off('click').on('click', function(e) {
        e.preventDefault;
        $('body').toggleClass('sidebar-no-show');
        $('.sidebar-toggle').toggleClass('fa-chevron-left');
        $('.sidebar-toggle').toggleClass('fa-chevron-right');
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
                    renderPostCard(content, v, json, i);
                })
		    }
	    }
    })
    
    
}

var requestAbout = function(){
    const nav = $('.navigation.selected');
    const subBar = $('.about-sub');
    if(nav.data('reddit') != 'all') {
        $.ajax({
            url: _.nav(nav.data('reddit')).aboutUrl,
            success: function(json) {
                const subRedditDescription = $('<div></div>').html(json.data.public_description_html).text();
                subBar.empty();
                subBar.append(templates.sideBar.render({
                    sideBarTitle: json.data.title,
                    sideBarDescription: subRedditDescription
                }));
                console.log(json);
            }
        })
    }
    else {
        subBar.empty();
        subBar.append(templates.sideBar.render({
            sideBarTitle: 'Write r/all sidebar copy',
            sideBarDescription: 'I need to flesh this out a bit...'
        }));
    }
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

            console.log(postComments);
            console.log(postedContent);
                
            domTarget.append(templates.fullPost.render({
                postTitle: postedContent.data.title,
                postText: postTextHtml,
                author: postedContent.data.author,
                score: postedContent.data.score
            }));
            
            var fullPostContent = $('.full-post-content');
            
            // Doe this post have an image that can be displayed?
            if(postedContent.data.preview) {
                //rendering image to post with nunjucks template
                fullPostContent.find('.self-text').append(templates.image.render({
                    picture: findBackgroundImg(postedContent)
                })/*'<div class="post-picture"><img src=' + image + '></div>'*/);
            }

            getComments(postComments.data.children, fullPostContent);
            
            var fullPost = $('.full-post');
            
            fullPost.find('.close-post').off('click').on('click', function(evt) {
                fullPost.remove();
            });
            
        }
    })
}

// Recursive method to handle comments
var getComments = function(comments, parent) {
    if($.isArray(comments)) {
        $.each(comments, function(index, comment){
            if(comment.data.body_html){
                parent.append(templates.comment.render({
                    commentHtml: $('<div></div>').html(comment.data.body_html).text(),
                    author: comment.data.author,
                    score: comment.data.score,
                    timeSince: comment.data.created
                }));
                if(comment.data.replies) {
                    if(comment.data.replies.data.children[0].data.body_html){
                    getComments(comment.data.replies.data.children, parent.find('.comment').last());
                    }
                }
            }
        });
    }
    else {
        parent.append(templates.comment.render({
            commentHtml: $('<div></div>').html(comments.data.body_html).text(),
            author: comments.data.author,
            score: comments.data.score,
            timeSince: comments.data.created
        }));
    }
};

// render subreddit posts
var renderPostCard = function(domTarget, datum, dataSet, count) {
    var t = (Math.random() * 10) + 1;
    t = Math.floor(t);
    const length = dataSet.data.children.length;
    const nthChild = _.findPrimeFactor(length);
    
    // render basic card
    domTarget.append(templates.postCard.render({
            title: datum.data.title,
            url: datum.data.url,
        }));

    // cache rendered card for each loop - more efficient than repeated $('')
    var card = $('.post-card').last();
    
    //set default background using generated random number between 1 & 10
    card.last().addClass('background' + t);

    //check for preview image       
    if(datum.data.preview) {
        var bgUrl = findBackgroundImg(datum);
        //define background image inline
        card.last().attr('style',  'background: url(' + bgUrl + '); background-repeat: no-repeat; background-size: cover; background-position: center;')
    }

    // render detailed card info                
    card.find('.info').append(templates.cardInfo.render({
        commentsLink: datum.data.permalink,
        commentsNumber: datum.data.num_comments,
        author: datum.data.author,
        sub: datum.data.subreddit,
        prefixedSub: datum.data.subreddit_name_prefixed,
        score: datum.data.score
    }));

    // assign width-defining class based on prime factor (nthChild) of length of dataset.data.children 
    if(nthChild == 2) {
        card.addClass('half-width');
    } 
    else if(count%nthChild == 0) {
        card.addClass('full-width');
    } 
    else {
        card.addClass('half-width');
    }

    //check nsfw or spoiler bools           
    if(datum.data.over_18 || datum.data.spoiler) {
        card.addClass('spoiler-nsfw');
        var warningType = '';
        //if statement discerns between nsfw & spoiler
        if(datum.data.spoiler) {
            warningType = 'spoiler';
        } 
        else if(datum.data.over_18) {
            warningType = 'nsfw';
        }

        //use template to cover post
        card.append(templates.warningCard.render({
            warning: warningType,
            warningCaps: warningType.toUpperCase(),
            subreddit: datum.data.subreddit_name_prefixed
        }));

        //click to hide/show card cover                             
        $('a.card-cover').off('click').on('click', function(e) { 
            e.preventDefault();
            //keep higher-level click events from firing
            e.stopPropagation();
            //hide/unhide card cover
            $(this).toggleClass('hidden');
        })
    }

    //render full post over .content on click
    card.off('click').on('click', function(e) {
        //only render if domain contains self or redd
        if(datum.data.domain.indexOf('self') || datum.data.domain.indexOf('redd')) {
            e.preventDefault();
            renderFullPost(domTarget, datum);
        }
    })
}

// determine media type to properly display gifs inline
var findBackgroundImg = function(datum) {
        // is image an imgur or reddit hosted gif?
       if((~datum.data.url.indexOf('imgur') && (~datum.data.url.indexOf('gif'))) || (~datum.data.url.indexOf('redd') && ~datum.data.url.indexOf('.gif'))) {
           //replace gifv with gif at the end of source url only if need be
           if(~datum.data.url.indexOf('gifv')){
            var background = datum.data.url.replace('gifv', 'gif');
           }
           else {
            var background = datum.data.url;
           }
        }
        // is image a gfycat or giphy gif?
        else if(~datum.data.url.indexOf('gfycat') || ~datum.data.url.indexOf('giphy')) {
            var background = datum.data.preview.images[0].variants.gif.source.url;
        }
        // otherwise, default to still image
        else 
        {
            var background = datum.data.preview.images[0].source.url;
        }
    return background;
}