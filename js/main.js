$(document).ready(function() {
    $.ajax({
        url: '/api/hello',
        success: function(json) {
            console.log(json);
        }
    });
});