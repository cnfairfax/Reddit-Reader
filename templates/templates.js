var templates = _.mapObject({
	nav: `
		<li data-reddit="{{ reddit }}" class="navigation {{ selected }}">
			{{ name }}
		</li>
	`,
	fullPost: '',
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
                </div>`
}, function(template) {
	return nunjucks.compile(template);
});