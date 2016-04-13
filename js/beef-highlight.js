 $.extend(beefApp, {
  highLightBeefs: function (data) {
    data = _.sortBy(data, function(o) { return o.count; })
    data.reverse();
    for (i = 0; i < 3; i++) {
      beefApp.frame.find('.sentence').removeClass('highlight');
      beefApp.frame.find('.' + data[i].sentence_class).addClass('highlight');
    }
  }
});