var templates = _.mapObject({
	nav:    `<li data-reddit="{{ reddit }}" class="navigation {{ selected }}">
			    {{ name }}
		    </li>`,
	fullPost: `<div class="full-post">
                    <i class="close-post fa fa-times" title="Close post"></i>
                    <div class="full-post-content">
                        <div class="self-post">
                            <h2>{{ postTitle }}</h2>
                            <div class="self-text">{{ postText | safe }}</div>
                            <div class="post-info">
                                <p class="post-author"><a href="https://www.reddit.com/u/{{ author }}">{{ author }}</a></p>
                                <p class="post-stats">{{ score }} points</p>
                            </div>
                        </div>
                    </div>
                </div>`,
    postCard: ` <a target="_blank" href="{{ url }}" class="post-card">
                    <div class="info">
                        <h2>{{ title }}</h2>
                    </div>
                </a>`,
    cardInfo: ` <div class="post-data">
                    <p>
                        <a target="_blank" href="https://www.reddit.com{{ commentsLink }}">{{ commentsNumber }} Comments</a>
                    </p>
                    <p>
                        Posted By: <a target="_blank" href="https://www.reddit.com/u/{{ author }}">{{ author }}</a> On <a target="_blank" href="https://www.reddit.com/r/{{ sub }}">{{ prefixedSub }}</a>
                    </p>
                    <p class="score">
                        {{ score }}
                    </p>
                </div>`,
    sideBar: `  <h2>{{ sideBarTitle }}</h2>
                <div class="sub-reddit-description">{{ sideBarDescription | safe }}</div>`,
    image: `<div class="post-picture"><img src={{ picture }}></div>`,
    warningCard: `<a href="" class="card-cover {{ warning }}">
                    <p class="warning-type">{{ warningCaps }}!</p>
                    <p class="subreddit">{{ subreddit }}</p>
                </a>`,
    comment: `  <div class="comment">
                    {{ commentHtml | safe }}
                    <div class="comment-info">
                        <p class="comment-author"><a href="https://www.reddit.com/u/{{ author }}" target="_blank">{{ author }}</a></p>
                        <p class="comment-stats">{{ score }} points</p>
                    </div>
                </div>`
}, function(template) {
	return nunjucks.compile(template);
});