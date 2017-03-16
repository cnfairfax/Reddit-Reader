var templates = _.mapObject({
	nav:    `<li data-reddit="{{ reddit }}" class="navigation {{ selected }}">
			    {{ name }}
		    </li>`,
	fullPost: `<div class="full-post">
                    <i class="close-post fa fa-times" title="Close post"></i>
                    <div class="full-post-content">
                        <h2>{{ postTitle }}</h2>
                        <div class="self-text">{{ postText | safe }}</div>
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
                <div class="sub-reddit-description">{{ sideBarDescription | safe }}</div>`
}, function(template) {
	return nunjucks.compile(template);
});