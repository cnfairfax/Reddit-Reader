// SATURDAY handle imgur galleries
// SUNDAY handle external links
// FRIDAY MORNING collapse comments - class animation transition
// FRIDAY MORNING collect all default subreddits - almost there TOP PRIORITY - FINISH
// - double check $.when - do we want that? try just listing functions in order instead
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

    //_.requestSubList();
    //$.when(_.requestSubList).done(_.request());
    $.when(_.requestSubList(), _.request()).done(_.requestAbout());

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