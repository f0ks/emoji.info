(function () {

    'use strict';

    if (location.protocol !== 'https:' && !window.location.href.match(/localhost/i)) {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    var actual_JSON, concat_JSON = [];
    var searchBox;
    var emojiListContainer;

    function loadJSON(fileName, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', fileName, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }


    function init() {

        new Clipboard('.btn');

        searchBox = document.getElementById('search-box');
        emojiListContainer = document.getElementById('emoji-list');
        searchBox.focus();

        loadJSON('emoji-light.json', function (response) {
            actual_JSON = JSON.parse(response);

            concat_JSON = [].concat.apply([],
                [actual_JSON.people,
                    actual_JSON.flags,
                    actual_JSON.food,
                    actual_JSON.nature,
                    actual_JSON.objects,
                    actual_JSON.symbols,
                    actual_JSON.travel]);

            if (getUrlParam().q) {
                searchEmoji(getUrlParam().q);
                $('#search-box').val(getUrlParam().q);
            } else {
                getRandomEmojies();
                filterBadEmojies();
            }

        });

        searchBox.addEventListener('input', function (event) {
            searchEmoji(this.value);
        });

        $('#get-random a').click(function () {
            getRandomEmojies();
            filterBadEmojies();
            $('#get-random').hide();
        });

    }


    function getRandomEmojies() {
        if (window.history) {
            window.history.replaceState({}, '', '/');
        }
        $('.ad-iframe').show();
        for (var i = 0; i < 48; i++) {
            var randomValue = getRandom(1, concat_JSON.length - 1);
            emojiListContainer.innerHTML += '<div class="btn" data-clipboard-target="#emoji' + randomValue + '">'
                + concat_JSON[randomValue].value
                + '<input id="emoji' + randomValue + '"  value="' + concat_JSON[randomValue].value + '" />'
                + '<span style="display: none">' + concat_JSON[randomValue].key + '</span>'
                + '</div>';
        }
        $('#search-box').val('');

        $('.btn').click(function () {
            $(document.activeElement).filter(':input:focus').blur();
            $('#copied').show().center().fadeOut('slow');
        });
    }

    function searchEmoji(request) {
        var pageUrl = '?q=' + request;

        if (request.length < 3) {
            if (window.history) {
                window.history.replaceState({}, '', '/');
            }
            return;
        }
        if (window.history) {
            window.history.pushState('', '', pageUrl);
        }
        emojiListContainer.innerHTML = '';
        for (var i = 0, len = concat_JSON.length; i < len; i++) {
            var string = concat_JSON[i].key,
                substring = request;
            if (string.toLowerCase().indexOf(substring.toLowerCase()) !== -1) {
                emojiListContainer.innerHTML += '<div class="btn" data-clipboard-target="#emoji' + i + '">'
                    + concat_JSON[i].value
                    + '<input  id="emoji' + i + '"  value="' + concat_JSON[i].value + '" />'
                    + '<span style="display: none">' + concat_JSON[i].key + '</span>'
                    + '</div>';
            }
        }

        $('.btn').click(function () {
            $('#copied').show().center().fadeOut('slow');
            $(document.activeElement).filter(':input:focus').blur();
        });

        if ($('#emoji-list > div').length < 1) {
            $('#get-random').show();
            $('.ad-iframe').hide();
        } else {
            $('#get-random').hide();
            $('.wrapper').removeClass('h200');
            $('.ad-iframe').show();
        }

        filterBadEmojies();
    }

    function filterBadEmojies() {
        $('#emoji-list > div').each(function () {
            if ($(this).innerWidth() > 15) {
                $(this).addClass('e-bg');
            } else {
                $(this).remove();
            }
        });
    }

    function getRandom(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function getUrlParam() {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (typeof query_string[pair[0]] === 'undefined') {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === 'string') {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }

    window.addEventListener('load', function () {
        init();
    });


})();

jQuery.fn.center = function () {
    this.css('position', 'absolute');
    this.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + 'px');
    this.css('left', Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + 'px');
    return this;
};
