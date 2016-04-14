 $.extend(beefApp, {
  highLightBeefs: function (data) {
    data = _.sortBy(data, function(o) { return parseInt(o.count); })
    data.reverse();
    beefApp.frame.find('.sentence').removeClass('highlight');
    for (i = 0; i < 3; i++) {
      if (data[i]) {
        beefApp.frame.find('.' + data[i].sentence_class).addClass('highlight highlight_' + i);
      }
    }
  }
});