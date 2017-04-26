document.addEventListener('scroll', function (e){
	$(e.target).fire('event-scroll');
}, true);

$(document).on('event-scroll', function(e) {
    if($(e.target).hasClass('content')) {
        $(e.target).do(function(){
            if (Math.ceil(this.scrollTop() + this.height()) >= this.get(0).scrollHeight){
                _.request();
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

    const navList = $('nav select');
    
    $.each(subreddits, function(n, p) {
        navList.append(templates.nav.render({
            reddit: p,
            selected: (n == 0 ? 'selected' : ''),
            name: 'r/ ' + p
        }));
    });

    _.request();
    _.requestAbout();

    $('.sidebar-toggle').off('click').on('click', function(e) {
        e.preventDefault;
        $('body').toggleClass('sidebar-no-show');
        $('.sidebar-toggle').toggleClass('fa-chevron-left');
        $('.sidebar-toggle').toggleClass('fa-chevron-right');
    })

    $('nav select').change(function(){
        $('.content').scrollTop(0);
        $(this).data('after', '');
        _.request();
        _.requestAbout();
    });

    $('#register').click( function(e) {
        e.preventDefault;
        _.registerNewUser();
    });

});