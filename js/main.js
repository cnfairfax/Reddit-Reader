// SATURDAY handle imgur galleries
// SUNDAY handle external links
// FRIDAY style registration & make change for login
// SATURDAY update mobile styles - get sidebar working on mobile
// SUNDAY TIMEBOXED - 4hrs, refactor/make notes on refactoring registration.php - query class, database class


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

    _.requestSubList();
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