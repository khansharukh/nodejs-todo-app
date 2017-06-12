$(document).ready(function() {
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });

    $('#todoForm').on('submit', function() {

        var item = $('#item').val();
        var sel_date = $('#sel_date').val();
        var list_id = $('#list_id').val();
        var todo = {item: item, sel_date: sel_date, cid: list_id};

        $.ajax({
            type: 'POST',
            url: '/todo',
            data: todo,
            success: function(data) {
                window.location.href = "/todo/";
            }
        });

        return false

    });

    $('li').on('click', function() {
        var item = $(this).text().replace(/ /g, '-');
        $.ajax({
            type: 'delete',
            url: '/todo/' + item,
            success: function(data) {
                location.reload()
            }
        })
    })
    $('#listForm').on('submit', function() {

        var item = $('#task_list').val();
        var todo = {item: item};

        $.ajax({
            type: 'POST',
            url: '/addList',
            data: todo,
            success: function(data) {
                location.reload()
            }
        });
        return false
    });
    $('#change_list').on('change', function (e) {
        var $id = $(this).val();
        if($id == '0') {
            window.location.href = "/todo/";
        } else {
            window.location.href = "/todo/"+$id;
        }
    });
    $('.todo-check').change(function() {
        var $id = $(this).data('id');
        if(this.checked) {
            //alert($id);
            //$('#yep').attr('data-tid', $id);
            /*$('.ui.modal')
                .modal('show')
            ;*/
            var todo = {status: '1', id: $id};
        } else {
            var todo = {status: '0', id: $id};
        }
        $('#load_screen').fadeIn();
        $.ajax({
            type: 'POST',
            url: '/change_status',
            data: todo,
            success: function(data) {
                $('#load_screen').hide();
                //do something with the data via front-end framework
                $('#slide_'+$id).animateCss('slideOutRight');
                $('#slide_'+$id).fadeOut(800);
            }
        });
    });/*
    $('#yep').on('click', function (e) {
        var $id = $(this).data('tid');
        $('#slide_'+$id).animateCss('slideOutRight');
        $('#slide_'+$id).fadeOut(800);
    });*/
    $('#close-nav').on('click', function (e) {
        $('.ui.sidebar')
            .sidebar('toggle')
        ;
    });
});
