$(function () {
    var $button = $('.button');
    $button.on('click', onSubmit);
}());

function checked() {
    return true;
}

function onSubmit() {
    if (checked()) {
        window.location.href = '/login';
    }
}