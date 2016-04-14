 $.extend(beefApp, {
  highLightBeefs: function (data) {
    data = _.sortBy(data, function(o) { return parseInt(o.count); })
    data.reverse();
    beefApp.frame.find('.sentence').removeClass('highlight');
    for (i = 0; i < 3; i++) {
      if (data[i]) {
        if (data[i].count === data[0].count) {
          beefApp.frame.find('.' + data[i].sentence_class).removeClass('rest').addClass('highlight top');
          
        }
        else {
          beefApp.frame.find('.' + data[i].sentence_class).removeClass('top').addClass('highlight rest');
        }
      }
    }
  }
});