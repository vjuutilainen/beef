(function ($) {
  var esivis = $('#esi-vis');
  beefApp = {
    formatNr: function (x, addComma) {
      x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
      x = x.replace('.', ',');
      if (addComma === true && x.indexOf(',') === -1) {
        x = x + ',0';
      }
      return (x === '') ? 0 : x;
    },
    roundNr: function (x, d) {
      return parseFloat(x.toFixed(d));
    },
    setPath: function () {
      if (location.href.match('http://yle.fi/plus/yle')) {
        beefApp.path = 'http://yle.fi/plus/yle/2016/' + beefApp.projectName + '/';
      }
      else if (location.href.match('http://yle.fi')) {
        beefApp.path = 'http://yle.fi/plus/2016/' + beefApp.projectName + '/';
      }
      else {
        beefApp.path = '2016/' + beefApp.projectName + '/';
      }
    },
    getScale: function () {
      var width = esivis.width();
      $('iframe').height($(window).height());
      if (width >= 578) {
        esivis.addClass('wide');
        return true;
      }
      if (width < 578) {
        esivis.removeClass('wide');
        return false;
      }
    },
    initMediaUrls: function () {
      $.each($('.handle_img', esivis), function (i, el) {
        $(this).attr('src', beefApp.path + 'img/' + $(this).attr('data-src'));
      });
    },
    initIframe: function () {
      esivis.find('#iframe')[0].onload = function () {
        // Store frame contents.
        var esiframe = esivis.find('iframe').contents();
        // Store article id.
        esiframe.find('body').data('data-articleid');
        // Add custom inline css.
        esiframe.find('head').append('<style type="text/css">p .sentence { background-color: #fff; transition: all 0.5s; } p .sentence:hover {  background-color: #ff0; transition: all 2s; }</style>');
        // Add custom css file.
        // esiframe.find('head').append('<link rel="stylesheet" href="http://yle.fi/plus/yle/alpha/impact.ly/css/styles.css?v=">')
        // Mark sentences.
        var i = 0;
        esiframe.find('.text p').each(function () {
          var sentences = $(this).text().replace(/([^.!?]*[^.!?\s][.!?]['"]?)(\s|$)/g, function (val) {
            i++;
            return '<span class="sentence" data-contents="$1" data-sentence-id="sentence_' + i + '">' + val + '</span>$2'
          });
          $(this).html(sentences);
        });
        // Init vis.
        beefApp.initVis();

        // Init frame events.
        beefApp.initIframeEvents(esiframe);
      };
    },
    initIframeEvents: function (esiframe) {
      esiframe.find('p .sentence').click(function () {
        beefApp.beefWord();
      });
    },
    beefWord: function (data) {
      $.ajax({
        data:data,
        dataType:'json',
        statusCode:{
          200: function (data) {
            alert('added');
          }
        },
        url:'php/post.php',
        type:'GET'
      });
    },
    initEvents: function () {
      $(window).resize(function () {
        beefApp.getScale();
      });
      esivis.on('click', '.turnred', function () {
        esivis.find('iframe').contents().find('p').css('color', 'red');
      });
    },
    init: function () {
      beefApp.projectName = '';
      beefApp.setPath();
      beefApp.getScale();
      beefApp.initMediaUrls();
      beefApp.initEvents();

      beefApp.initIframe();
    }
  };
  $(document).ready(function () {
    beefApp.init();
  });
})(jQuery);
