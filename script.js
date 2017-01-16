(function () {

    'use strict';

    var actual_JSON, concat_JSON = [];
    var searchBox;
    var emojiListContainer;


    function loadJSON(fileName, callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', fileName, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
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
        //fixHeight();


        loadJSON('emoji-light.json', function (response) {
            // Parse JSON string into object
            actual_JSON = JSON.parse(response);
            /*            actual_JSON.forEach(function (entry) {
             //console.log(entry.emoji);
             emojiListContainer.innerHTML += entry.emoji;
             });*/


            concat_JSON = [].concat.apply([], [
                actual_JSON.people
                //, actual_JSON.flags
                , actual_JSON.food
                , actual_JSON.nature
                , actual_JSON.objects
                , actual_JSON.symbols
                , actual_JSON.travel]);

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

        $(window).resize(function () {
            //fixHeight();
        });

        $('#get-random a').click(function () {
            getRandomEmojies();
            filterBadEmojies();
            $('#get-random').hide();
        });


    }


    function fixHeight() {
        var factor = 110;
        if ($(window).width() < 800) factor = 70;
        $('.wrapper').css('height', $(window).height() - factor - 300);
        $('#get-random').css('top', $('.wrapper').height() / 2);
        $('#emoji-list').css('height', $(window).height() - factor - 30 - 300);
        if ($('#emoji-list').height() < 100) {
            $('#emoji-list').height(100);
        }
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
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
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
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");
    return this;
};