if (matchMedia) {
    var mq = window.matchMedia('(min-width: 420px)');
    mq.addListener(WidthChange);
    WidthChange(mq);
}

function WidthChange(mq) {
    //----------Движение кнопки добавления встречи----------
    var tool;
    $('.event__available').mousemove(function(e){
        tool = $(this).find('.tool');
        var parentWidth = $(this).width();
        var toolWidth = tool.width();
        var leftBorder = e.pageX - $(this).offset().left;
        var rightBorder = parentWidth - leftBorder;
        var leftPadding = leftBorder - toolWidth/2;
        var rightPadding = rightBorder - toolWidth/2;

        if( leftBorder < 0 || rightBorder < 0) return;
        // не выходит за границы
        if (leftPadding < 0) leftPadding = 0;
        if (rightPadding < 0) leftPadding = parentWidth-toolWidth;

        tool.css({'display':'block','left': leftPadding + 'px'});
    });

    $('.event__available').mouseout(function(e){
        tool.css('display', 'none');
    });

    //----------События клик----------
    $(document).on('click', function(e) {
        event = e || event;
        var target = event.target || event.srcElement;
        //select
        if ($(target).closest('.select')[0]) {
            $('.select__options').removeClass('show');
            $(target).closest('.select').next().addClass('show');
        } else {
            $('.select__options').removeClass('show');
        }
        // календарь
        if ($(target).hasClass('currentDate__title')) {
            $('.calendar-wrapper').toggleClass('show');
        } else {
            $('.calendar-wrapper').removeClass('show');
        }
        //создание встречи
        if ($(target).parent().hasClass('tool')) {
            window.location = '/create.html';
        }
        //тултип с информацией о встрече
        if ($(target).hasClass('event__busy')) {
            var toolInfo = $('.tooltip')[0];
            $(target).append(toolInfo);
            var toolInfoCoords = $(target).find('.tooltip')[0];
            if (mq.matches) {
                var leftBorder = $(target).parent().offset().left;
                var rightBorder = $(target).parent().offset().left + $(target).parent().width();
                var rightPadding = rightBorder-($(target).offset().left + $(target).outerWidth()/2 + $(toolInfoCoords).outerWidth()/2);
                var leftPadding = $(target).offset().left+$(target).outerWidth()/2 - $(toolInfoCoords).outerWidth()/2 - leftBorder;
                var left = $(toolInfoCoords).outerWidth()/2
                // не выходит за границы
                if (rightPadding < 0) left = left - rightPadding;
                if (leftPadding < 0) left = left + leftPadding;
                $(toolInfoCoords).addClass('active').css({'left' : 'calc(50% - ' + left + 'px' + ')','top':'100%'});
            } else {
                $(toolInfoCoords).addClass('active').css({'top':'50%','left':'0'});
            }
        } else {
            $('.tooltip').removeClass('active');
        }
    });
    //----------Всплытие подсказки(scroll touch)----------
    if (!mq.matches) {
        var roomTooltip = $('.room__tooltip');
        $('.schedule__rooms').scroll(function(){
            if ($('.schedule__rooms').scrollTop() > 0){
                for (var i = 0, element; element = roomTooltip[i]; i++) {
                    $(element).css({'position':'absolute','left': $(window).scrollLeft() - 211 + 'px'})
                }
            }
        });
        $(window).scroll(function(){
            for (var i = 0, element; element = roomTooltip[i]; i++) {
                if ($(window).scrollLeft() > 150){
                    $(element).css({'display':'block','position':'sticky','left': $(window).scrollLeft() + 'px'})
                } else {
                    $(element).css({'display':'none'})
                }
            }
        });
    }
}
