(function ($) {
  var esivis = $('#esi-vis');
  var yleApp = {
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
        yleApp.path = 'http://yle.fi/plus/yle/2016/' + yleApp.projectName + '/';
      }
      else if (location.href.match('http://yle.fi')) {
        yleApp.path = 'http://yle.fi/plus/2016/' + yleApp.projectName + '/';
      }
      else {
        yleApp.path = '2016/' + yleApp.projectName + '/';
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
        $(this).attr('src', yleApp.path + 'img/' + $(this).attr('data-src'));
      });
    },
    initIframeEvents: function () {
      esivis.find('#iframe')[0].onload = function () {
        var esiframe = esivis.find('iframe').contents();
        // esiframe.find('head').append('<link rel="stylesheet" href="http://yle.fi/plus/yle/alpha/impact.ly/css/styles.css?v=">')
        esiframe.find('head').append('<style type="text/css">p .sentence { background-color: #fff; transition: all 0.5s; } p .sentence:hover {  background-color: #ff0; transition: all 2s; }</style>');
        esiframe.find('.text p').each(function () {
          var sentences = $(this).text().replace(/([^.!?]*[^.!?\s][.!?]['"]?)(\s|$)/g, '<span class="sentence">$1</span>$2');
          $(this).html(sentences);
        });
        esiframe.find('p .sentence').click(function () {
          alert("test");
        });
      };
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
      esivis.on('click', '.turnred', function () {
        esivis.find('iframe').contents().find('p').css('color', 'red');
      });
    },
    init: function () {
      yleApp.projectName = '';
      yleApp.setPath();
      yleApp.getScale();
      yleApp.initMediaUrls();
      yleApp.initEvents();


      yleApp.initIframeEvents();
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
