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
      if (location.href.match('http://yle.fi/')) {
        beefApp.path = 'http://yle.fi/plus/beef/';
        beefApp.php_path = 'http://alpha.yle.fi/plus/alpha/beef/';
      }
      else {
        beefApp.path = '';
        beefApp.php_path = '';
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
        beefApp.frame = esivis.find('iframe').contents();
        // Store article id.
        beefApp.article_id = beefApp.frame.find('body').data('articleid');
        // Add custom inline css.
        // beefApp.frame.find('head').append('<style type="text/css"></style>');
        // Add custom css file.
        beefApp.frame.find('head').append('<link type="text/css" rel="stylesheet" href="' + beefApp.path + 'css/iframe.css">');
        // Mark sentences.
        var i = 0;
        beefApp.frame.find('.text p').each(function () {
          var sentences = $(this).text().replace(/([^.!?]*[^.!?\s][.!?]['"]?)(\s|$)/g, function (val) {
            i++;
            return '<span class="sentence sentence_' + i + '" data-sentence="' + val.trim() + '" data-sentence-class="sentence_' + i + '" data-sentence-id="' + i + '">' + val + '</span>'
          });
          $(this).html(sentences);
        });
        beefApp.maxSentences = i;

        // Get beefs.
        var data = {
          article_id:beefApp.article_id
        }
        beefApp.getBeefs(data);

        window.setTimeout(function () {
          window.setInterval(function () {
            // beefApp.getBeefs(data, true);
          }, 5000);
        }, 5000);

        // Init frame events.
        beefApp.initIframeEvents(beefApp.frame);

        beefApp.frame.find('.text').after('<div class="beefinfo">Where was the beef? Pleace select a sentence that best sums up the story.</div>')
      };
    },
    initIframeEvents: function () {
      beefApp.frame.find('p .sentence').click(function () {
        $(this).addClass('disabled');
        var msg = $('<div class="msg">Beef\'d</div>').appendTo($(this));
        window.setTimeout(function () {
          msg.fadeOut(500).remove();
        }, 1500);
        var data = {
          'article_id':beefApp.article_id,
          'sentence':$(this).data('sentence'),
          'sentence_class':$(this).data('sentence-class'),
          'sentence_id':$(this).data('sentence-id')
        }
        beefApp.beefWord(data);
      });
    },
    getBeefs: function (data, update) {
      var get_parameter = (update === true) ? Date.now() / 1000 | 0 : '';
      $.ajax({
        data:data,
        dataType:'json',
        statusCode:{
          200: function (data) {
            // Init vis.
            beefApp.highLightBeefs(data);
            if (update === true) {
              beefApp.updateVis(data, beefApp.maxSentences);
            }
            else {
              beefApp.initVis(data, beefApp.maxSentences);
            }
          }
        },
        url:beefApp.php_path + 'php/get.php?v=' + get_parameter,
        type:'GET'
      });
    },
    beefWord: function (data) {
      $.ajax({
        data:data,
        dataType:'json',
        statusCode:{
          200: function (data) {
            beefApp.getBeefs({article_id: beefApp.article_id}, true);
          }
        },
        url:beefApp.php_path + 'php/post.php',
        type:'POST'
      });
    },
    initEvents: function () {
      $(window).resize(function () {
        beefApp.getScale();
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
