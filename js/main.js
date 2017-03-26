$(document).ready(function() {
    $.ajax({
        url: '/api/posts/subreddit',
        data: {sub: 'all', stuff: 'things'},
        success: function(json) {
            console.log(json);
        }
    });
});