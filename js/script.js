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
      if (location.href.match('//yle.fi/')) {
        beefApp.path = '//yle.fi/plus/beef/';
        // TODO. Broken.
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
        var href = document.getElementById("iframe").contentWindow.location.href;
        beefApp.article_id = href.substr(href.lastIndexOf('/') + 1);
        // Add custom inline css.
        // beefApp.frame.find('head').append('<style type="text/css"></style>');
        // Add custom css file.
        beefApp.frame.find('head').append('<link type="text/css" rel="stylesheet" href="' + beefApp.path + 'css/iframe.css">');
        // Mark sentences.
        var i = 0;
        beefApp.frame.find('.yle__article__content .yle__article__paragraph').each(function () {
          var sentences = $(this).text().replace(/([^.!?]*[^.!?\s][.!?]['"]?)(\s|$)/g, function (val) {
            i++;
            return '<div class="side_viz side_vis_sentence_' + i + '" data-sentence-id="' + i + '"></div><span class="sentence sentence_' + i + '" data-sentence="' + val.trim() + '" data-sentence-class="sentence_' + i + '" data-sentence-id="' + i + '">' + val + '</span>';
          });
          $(this).html(sentences);
        });
        $.each(beefApp.frame.find('.sentence'), function (i, el) {
          $(this).attr('data-offset-top', $(this).offset().top);
        });

        // Set max sentences.
        beefApp.maxSentences = i;

        // Get beefs.
        var data = {
          article_id:beefApp.article_id
        }
        beefApp.getBeefs(data);

        // window.setTimeout(function () {
        //   window.setInterval(function () {
        //     beefApp.getBeefs(data, true);
        //   }, 10000);
        // }, 5000);

        // Init frame events.
        beefApp.initIframeEvents(beefApp.frame);

        // Add bottom info.
        beefApp.frame.find('.yle__article__content').after('<div class="beefinfo"><div class="burger"><img src="' + beefApp.path + 'img/burger.png" alt="" /></div> <span class="title">Where was the beef?</span><br />Select a sentence that best sums up the story.</div>');
      };
    },
    initIframeEvents: function () {
      beefApp.frame.find('p .sentence').click(function () {
        if ($(this).hasClass('disabled')) {
          return false;
        }
        beefApp.addBurger($(this));
      });
    },
    addBurger: function (element) {
      beefApp.frame.find('.sentence .burger').remove();
      beefApp.frame.find('.burgered').removeClass('burgered');
      var burger = $('<div class="burger" data-sentence="' + element.data('sentence') + '" data-sentence-class="' + element.data('sentence-class') + '" data-sentence-id="' + element.data('sentence-id') + '"><img src="' + beefApp.path + 'img/burger.png" alt="" /></div>').appendTo(element);
      element.addClass('burgered');
      window.setTimeout(function () {
        burger.fadeOut(500, function () {
          $(this).remove();
        });
        element.removeClass('burgered');
      }, 3000);
      burger.click(function () {
        $(this).find('img').fadeOut(200, function () {
          $(this).remove();
        });
        $('<img src="' + beefApp.path + 'img/check.png" class="check" />').appendTo($(this)).fadeIn(500);
        var sentence = beefApp.frame.find('.' + $(this).data('sentence-class'));
        sentence.addClass('disabled');
        var msg = $('<div class="msg">Beef\'d</div>').appendTo(sentence);
        window.setTimeout(function () {
          msg.fadeOut(500, function () {
            $(this).remove();
          });
        }, 1500);
        var data = {
          'article_id':beefApp.article_id,
          'sentence':$(this).data('sentence'),
          'sentence_class':$(this).data('sentence-class'),
          'sentence_id':$(this).data('sentence-id')
        }
        beefApp.beefWord(data);
        sentence.addClass('beefd');
        window.setTimeout(function () {
          sentence.removeClass('beefd');
        }, 2000);
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
              // beefApp.updateVerticalVis(data, beefApp.maxSentences);
            }
            else {
              beefApp.initVis(data, beefApp.maxSentences);
              // beefApp.initVerticalVis(data, beefApp.maxSentences);
              beefApp.updateVis(data, beefApp.maxSentences);
              // beefApp.updateVerticalVis(data, beefApp.maxSentences);
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
