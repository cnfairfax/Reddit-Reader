var templates = _.mapObject({
	nav:    `<option value="{{ reddit }}">
			    {{ name }}
		    </option>`,
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
    postCard: ` <div target="_blank" href="{{ url }}" class="post-card">
                    <div class="info">
                        <h2>{{ title }}</h2>
                        <div class="post-data">
                            <p>
                                <a target="_blank" href="https://www.reddit.com{{ commentsLink }}">{{ commentsNumber }} Comments</a>
                            </p>
                            <p>
                                Posted By: <a target="_blank" href="https://www.reddit.com/u/{{ author }}">{{ author }}</a> On <a target="_blank" href="https://www.reddit.com/r/{{ sub }}">{{ prefixedSub }}</a>
                            </p>
                            <p class="score">
                                {{ score }}
                            </p>
                        </div>
                    </div>
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
                </div>`,
    loader: `   <div class="loader">
                    <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                    <span class="sr-only">Loading...</span>
                </div>`,
    commentHide: `<i class="fa fa-level-up comment-hide"></i>`
}, function(template) {
	return nunjucks.compile(template);
});