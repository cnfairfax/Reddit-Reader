_.mixin({
	findPrimeFactor: function(n) {
		var i=2;
		while (i<=n){
			if (n%i == 0){
				n/=i;    
			}else{
				i++;
			}
		}
		return i;
	},
	requestSubList: function() {
		const navList = $('nav select');

		return $.ajax({
			async: false,
			url: '/api/sublists/default',
			data: {where: 'popular'},
			success: function(subs) {
				subs = JSON.parse(subs);
				navList.append(templates.nav.render({
					reddit: 'all',
					selected: 'selected',
					name: 'r/ All'
				}));
				$.each(subs.data.children, function(i, sub) {
					navList.append(templates.nav.render({
						reddit: sub.data.display_name,
						selected: /*(i == 0 ? 'selected' : */'',//),
						name: 'r/ ' + sub.data.display_name
					}));
				});
			}
		})
	},
	request: function() {

		const header = $('header');
		const content = $('body .content');
		const nav = $('nav select');
		const after = nav.data('after');

		var more = after ? after : null;

		$.ajax({
			url: '/api/posts/index',
			data: {sub: nav.val(), after: more},
			beforeSend: function() {
				if(!after) {
					content.empty();
					content.append(templates.loader.render());
				}
			},
			success: function(json) {
				json = JSON.parse(json);
				if(json.data){
					if(!after){
						content.empty();
					}
					nav.data('after', json.data.after);
					$.each(json.data.children, function(i, v) {
						content.renderPostCard(v, json, i);
					})
				}
			}
		})
	},
	requestAbout: function(){
		const nav = $('nav select');
		const subBar = $('.about-sub');
		if(nav.val() != 'all') {
			$.ajax({
				url: '/api/subreddit/about',
				data: {sub: nav.val()},
				beforeSend: function() {
					subBar.empty();
					subBar.append(templates.loader.render());
				},
				success: function(json) {
					json = JSON.parse(json);
					const subRedditDescription = $('<div></div>').html(json.data.public_description_html).text();
					subBar.empty();
					subBar.append(templates.sideBar.render({
						sideBarTitle: json.data.title,
						sideBarDescription: subRedditDescription
					}));
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
	},
	// determine media type to properly display gifs inline
	findBackgroundImg: function(datum) {
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
	},
	registerNewUser: function() {
		$.ajax({
			url: 'api/register/registration',
			type: 'POST',
			data: { email: $('#email').val(), password: $('#password').val()},
			success: function(json) {
				console.log(json);
			}
		})
	}
});

$.extend({
	// Move things in here 
});

$.fn.extend({    //create default methods that you want to define
    do: function(callback){
		return (this.length ? callback : $.noop).call(this, this) || this;
	},
    fire: function(event){
		return this.trigger(event);
	},
	// render subreddit posts
	renderPostCard: function(datum, dataSet, count) {
		var target = this;
		return this.each(function(){
			var t = (Math.random() * 10) + 1;
			t = Math.floor(t);
			const length = dataSet.data.children.length;
			const nthChild = _.findPrimeFactor(length);
			
			// render basic card
			target.append(templates.postCard.render({
					title: datum.data.title,
					url: datum.data.url,
					commentsLink: datum.data.permalink,
					commentsNumber: datum.data.num_comments,
					author: datum.data.author,
					sub: datum.data.subreddit,
					prefixedSub: datum.data.subreddit_name_prefixed,
					score: datum.data.score
				}));

			// cache rendered card for each loop - more efficient than repeated $('')
			var card = $('.post-card').last();
			
			//set default background using generated random number between 1 & 10
			card.last().addClass('background' + t);

			//check for preview image       
			if(datum.data.preview) {
				var bgUrl = _.findBackgroundImg(datum);
				//define background image inline
				card.last().attr('style',  'background: url(' + bgUrl + '); background-repeat: no-repeat; background-size: cover; background-position: center;')
			}

			// render detailed card info                
			/*card.find('.info').append(templates.cardInfo.render({
				commentsLink: datum.data.permalink,
				commentsNumber: datum.data.num_comments,
				author: datum.data.author,
				sub: datum.data.subreddit,
				prefixedSub: datum.data.subreddit_name_prefixed,
				score: datum.data.score
			}));*/

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
					target.renderFullPost(datum);
				}
			})
		});
	},
	renderFullPost: function(datum) {
		var target = this;
		return this.each(function(){
			$.ajax ({
				url: '/api/posts/get',
				data: {link: datum.data.permalink},
				success: function(post) {
					post = JSON.parse(post);
					var postedContent = post[0].data.children[0];
					var postComments = post[1];
					var postTextHtml = (function() {
							return $('<div></div>').html(postedContent.data.selftext_html).text();
						})();
					target.append(templates.fullPost.render({
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
							picture: _.findBackgroundImg(postedContent)
						})/*'<div class="post-picture"><img src=' + image + '></div>'*/);
					}

					fullPostContent.getComments(postComments.data.children);
					
					var fullPost = $('.full-post');
					
					fullPost.find('.close-post').off('click').on('click', function(evt) {
						fullPost.remove();
					});
					
				}
			})
		});
	},
	// Recursively handle comments
	// Pass in 'options' object w/ all required arguments. Document what goes in options object.
	getComments: function(comments) {
		var target = this;
		return this.each(function(){
			if($.isArray(comments)) {
				$.each(comments, function(index, comment){
					if(comment.data.body_html){
						target.append(templates.comment.render({
							commentHtml: $('<div></div>').html(comment.data.body_html).text(),
							author: comment.data.author,
							score: comment.data.score,
							timeSince: comment.data.created
						}));
						if(comment.data.replies) {
							if(comment.data.replies.data.children[0].data.body_html){
							target.find('.comment').last().getComments(comment.data.replies.data.children);
							}
						}
					}
				});
			}
			else {
				target.append(templates.comment.render({
					commentHtml: $('<div></div>').html(comments.data.body_html).text(),
					author: comments.data.author,
					score: comments.data.score,
					timeSince: comments.data.created
				}));
			}
		});
	}
});