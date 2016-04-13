$.extend(beefApp, {

  visWidth: 150,
  visHeight: 40,
  visSvg: null,
  visLine: null,
  visCircles: null,
  visData: null,
  visSentenceCount: 0,
  visPadding: 15,
  maxBeefValue: 0,
  circleMaxRadius: 15,

  updateVis: function(data, maxcount) {
    this.visData = data;
    this.visSentenceCount = parseInt(maxcount);
    this.maxBeefValue = d3.max(this.visData, function(d) { return parseInt(d.count); });

    var join = this.visCircles.data(this.visData);

    join.exit().remove();

    join.enter()
        .append('circle')
        .style({
          'cursor': 'pointer'
        })
        .attr({
           fill: 'yellow',
           stroke: 'black',
           'stroke-width': '4px'
        });

    join.attr({
      cx: function(d, i) { return this.visPadding + (parseInt(d.sentence_id) * (this.visWidth - (this.visPadding * 2)) / this.visSentenceCount); }.bind(this),
      cy: this.visHeight / 2,
      r: function(d, i) { 
        return parseInt(d.count) / this.maxBeefValue * this.circleMaxRadius; 
      }.bind(this)
    });

    this.visCircles = join;

    this.visCircles.on('click', function(d) {
      var esivis = $('#esi-vis');
      var y = (esivis.find('iframe').contents().find('.sentence_' + d.sentence_id).offset().top);
      esivis.find('iframe')[0].contentWindow.setTimeout('this.scrollTo(0, ' + y + ');', 1);
    });

    if(data.length > 0) {
      var sorted = this.visData.sort(function(a, b) { return parseInt(a.count) > parseInt(b.count) ? -1 : parseInt(a.count) < parseInt(b.count) ? 1 : 0; });
      this.visInfo.html('<p style="font-size:12px;font-family:Helvetica"><span style="font-weight:bold">Missä on asian pihvi?</span><br> ' + sorted[0].sentence + ' <span style="font-style:italic">(' + sorted[0].count + ' beefiä)</span></p>');
    }
   
  },

  initVisEvents: function() {

    window.addEventListener('resize', function() {
      this.resizeVis();
    }.bind(this));

    this.visCircles.on('click', function(d) {
      var esivis = $('#esi-vis');
      var element = esivis.find('iframe').contents().find('.sentence_' + d.sentence_id);
      var y = element.offset().top;
      esivis.find('iframe')[0].contentWindow.setTimeout('this.scrollTo(0, ' + y + ');', 1);
      element.addClass('clicked');
      window.setTimeout(function () {
        element.removeClass('clicked');
      }, 1500);
    });

    this.visCircles.on('mouseover', function(d) {
      d3.select(this).attr('fill', 'magenta');
    });

    this.visCircles.on('mouseout', function(d) {
      d3.select(this).attr('fill', 'yellow');
    });
  },

  resizeVis: function() {

    this.visWidth = this.visSvg.node().parentNode.offsetWidth;
    this.visSvg.attr('height', this.visHeight + 'px');
    this.visSvg.attr('width', this.visWidth + 'px');

    this.visLine.attr({
      x1: 0,
      y1: this.visHeight / 2,
      x2: this.visWidth,
      y2: this.visHeight / 2,
      'stroke': 'black',
      'stroke-dasharray': '1, 3',
      'stroke-width': '1px'
    });

    this.visCircles.attr({
      cx: function(d, i) { return this.visPadding + (parseInt(d.sentence_id) * (this.visWidth - (this.visPadding * 2)) / this.visSentenceCount); }.bind(this),
      cy: this.visHeight / 2,
      r: function(d, i) { 
        return parseInt(d.count) / this.maxBeefValue * this.circleMaxRadius; 
      }.bind(this)
    });
  },

  createMockData: function() {
    return [
        {
          sentence_id: 3,
          count: 4,
          sentence: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        {
          sentence_id: 5,
          count: 5,
          sentence: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          sentence_id: 10,
          count: 9,
          sentence: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        }
      ];
  },

  initVis: function (data, maxcount) {
    
    this.visData = (location.href.match('http://beef.dev') || location.href.match('http://yle.fi')) ? data : this.createMockData();
    this.visSentenceCount = maxcount ? parseInt(maxcount) : 16;

    var beefVis = $('<div class="beef-vis"></div>');
    this.frame.find('article.content .hgroup h2').after(beefVis);

    this.visSvg = d3.select(beefVis[0]).append('svg');
    this.visInfo = d3.select(beefVis[0]).append('div').attr('class', 'info');

    this.maxBeefValue = d3.max(this.visData, function(d) { return parseInt(d.count); });

    this.visLine = this.visSvg.append('line');

    this.visCircles = this.visSvg.selectAll('circle')
                                 .data(this.visData)
                                 .enter()
                                 .append('circle')
                                 .style({
                                   'cursor': 'pointer'
                                 })
                                 .attr({
                                    fill: 'yellow',
                                    stroke: 'black',
                                    'stroke-width': '4px'
                                 });

    if(data.length > 0) {
      var sorted = this.visData.sort(function(a, b) { return parseInt(a.count) > parseInt(b.count) ? -1 : parseInt(a.count) < parseInt(b.count) ? 1 : 0; });
      this.visInfo.html('<p><span class="infotitle">Missä on asian pihvi?</span><br> ' + sorted[0].sentence + ' <span class="infocount">(' + sorted[0].count + ' beefiä)</span></p>');
    }

    this.resizeVis();
    this.initVisEvents();
  }
});