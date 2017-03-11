var templates = _.mapObject({
	nav: `
		<li data-reddit="{{ reddit }}" class="navigation {{ selected }}">
			{{ name }}
		</li>
	`,
	fullPost: ''
}, function(template) {
	return nunjucks.compile(template);
});

