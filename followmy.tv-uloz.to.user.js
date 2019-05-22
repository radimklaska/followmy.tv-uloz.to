// ==UserScript==
// @name         Followmy.tv & Uloz.to
// @namespace    http://klaska.net
// @version      1.0
// @description  Adds Uloz.to search links to Followmy.tv.
// @author       Radim Klaška
// @match        https://followmy.tv/show_list
// @downloadURL  https://raw.githubusercontent.com/radimklaska/followmy.tv-uloz.to/master/followmy.tv-uloz.to.user.js
// @updateURL    https://raw.githubusercontent.com/radimklaska/followmy.tv-uloz.to/master/followmy.tv-uloz.to.user.js
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

var s       = document.createElement('script');
s.type      = 'text/javascript';
s.textContent = '(' + function() {

    // Episodes load using AJAX, wait for them.
    // See: https://gist.github.com/chrisjhoughton/7890303
    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    waitForEl('#episodes .row-inner', function() {
        var shows = $('#episodes .row-inner');
        shows.each(function(index) {
            var S = $(this).find('.episode-nr').text();
            // Current episode.
            var E=parseInt(S.split('x')[1]);
            // Current series
            S = parseInt(S.split('x')[0]);
            // Number of available episodes.
            var unwatched = parseInt($(this).find('.unwatched-count').text());
            // Name
            var name = $(this).find('.show-name a').text();

            // Airdate text
            var airdate=$(this).find('.airdate')
            $(airdate).append(" |");

            var ep;
            for (ep = E; ((ep < E+unwatched) && (ep < E+20)); ep++) {
                var searchquery = name + " S" + zeroPad(S, 2) + "E" + zeroPad(ep, 2);
                searchquery = searchquery.replace(/ /g, "+");
                searchquery = "https://uloz.to/hledej?type=videos&q=" + searchquery
                $(airdate).append(' <a href="' + searchquery + '">E' + ep + '</a>');
            }

            // Keep links visible and easy to use with https://chrome.google.com/webstore/detail/linkclump/lfpjkncokllnfokkgpkobnkbkmelfefj
            $(this).find('.airdate').css( "float", "right" );
            $(this).find('.airdate a').css( "float", "right" );
            $(this).find('.airdate a').css( "padding-left", "3px" );
        });

        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }
    });

 } + ')();';

// Inject Script. Can't use jQuery yet, because the page is not
// accessible from Tampermonkey
document.getElementsByTagName("head")[0].appendChild(s);
