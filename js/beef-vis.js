$.extend(beefApp, {

  burgerPath: '<path d="M20.4,180v11.8c0,38.2,31.1,38.2,31.1,38.2h182.1c0,0,31.1-0.3,31.1-38.2V180H20.4z"/><path d="M112.2,0C20.4,0,20.4,70.3,20.4,70.3V100h244.3V70.3c0,0,0-70.3-91.8-70.3H112.2z"/><line style="fill:none;stroke:#000000;stroke-width:40;stroke-linecap:round;" x1="20" y1="140" x2="265" y2="140"/>',
  visWidth: 150,
  visHeight: 40,
  vertVisWidth: 40,
  vertVisHeight: 150,
  visSvg: null,
  visLine: null,
  visCircles: null,
  visData: null,
  visSentenceCount: 0,
  visPadding: 15,
  maxBeefValue: 0,
  circleMaxRadius: 15,
  circleMaxVertRadius: 10,

  vertVisGroups: null,

  updateVis: function(data, maxcount) {
    
    this.visData = (location.href.match('http://beef.dev') || location.href.match('http://yle.fi')) ? data : this.createMockData();
    this.visSentenceCount = maxcount ? parseInt(maxcount) : 16;

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
          fill: function(d, i) { return parseInt(d.count) === _this.maxBeefValue ? 'rgba(225,0,90,0.3)' : 'rgba(255,255,0,0.7)'; }
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
      esivis.find('iframe')[0].contentWindow.setTimeout('this.scrollTo(0, ' + (y - 50) + ');', 1);
    });

    if(data.length > 0) {
     var sorted = this.visData.sort(function(a, b) { return parseInt(a.count) > parseInt(b.count) ? -1 : parseInt(a.count) < parseInt(b.count) ? 1 : 0; });
     this.visInfo.html('<p><span class="infotitle">Missä on asian pihvi?</span><br> ' + sorted[0].sentence + ' <span class="infocount">(' + sorted[0].count + ')</span></p>');
    }

    this.initVisEvents();
    this.resizeVis();
   
  },

  initVisEvents: function() {

    var _this = this;

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
      }, 2000);
    });

    this.visCircles.on('mouseover', function(d) {
      d3.select(this).attr('fill', function(d, i) {
        return parseInt(d.count) === _this.maxBeefValue ? 'rgba(225,0,90,0.5)' : 'rgba(255,255,0,1)';
      });
    });

    this.visCircles.on('mouseout', function(d) {
      d3.select(this).attr('fill', function(d, i) {
        return parseInt(d.count) === _this.maxBeefValue ? 'rgba(225,0,90,0.3)' : 'rgba(255,255,0,0.7)';
      });
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

    this.vertVisHeight = window.innerHeight;

    this.vertVisLine.attr({
      x1: this.vertVisWidth / 2,
      y1: 0,
      x2: this.vertVisWidth / 2,
      y2: '10000', // !!!
      'stroke': 'black',
      'stroke-dasharray': '1, 3',
      'stroke-width': '1px'
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

  initVerticalVis: function(data, maxcount) {

    this.visData = (location.href.match('http://beef.dev') || location.href.match('http://yle.fi')) ? data : this.createMockData();

    this.visSentenceCount = maxcount ? parseInt(maxcount) : 16;

    var beefVert = $('<div></div>').css('position', 'relative');

    var container = this.frame.find('article.content .text p').first().before(beefVert);

    this.vertVisSvg = d3.select(beefVert[0])
                        .append('svg')
                        .attr('height', window.innerHeight) // !!!
                        .attr('width', '40px')
                        .style({
                          position: 'absolute',
                          top: '0px',
                          right: '-20px',
                          'z-index': '500'
                        });

    this.vertVisLine = this.vertVisSvg.append('line');

  },

  updateVerticalVis(data, maxcount) {

    this.visData = (location.href.match('http://beef.dev') || location.href.match('http://yle.fi')) ? data : this.createMockData();
    this.visSentenceCount = maxcount ? parseInt(maxcount) : 16;

    var sentences = this.frame.find('.side_viz');
    var _this = this;
    sentences.each(function(i, e) {

      var matches = _this.visData.filter(function(vd) {
        return parseInt(vd.sentence_id) === parseInt($(e).data('sentence-id')); 
      });

      var radius = matches.length > 0 ? parseInt(matches[0].count) / _this.maxBeefValue * _this.circleMaxVertRadius : 0;

      $(e)
        .css('right', '-10px')
        .css('width', '20px')
        .css('height', '20px');
      
      

      if(d3.select(e).select('svg')[0][0] === null) {
        var svg = d3.select(e)
                     .append('svg')
                     .attr('width', '20px')
                     .attr('height', '20px');

        svg.append('circle')
            .attr({
              r: radius,
              fill: function() { return matches[0] && parseInt(matches[0].count) === _this.maxBeefValue ? 'rgba(225,0,90,0.3)' : 'rgba(255,255,0,0.7)'; },
              cx: (20 / 2),
              cy: (20 / 2)
            });
      }
      else {
        d3.select(e)
          .select('svg')
          .select('circle')
          .attr({
              r: radius,
              fill: function() { return matches[0] && parseInt(matches[0].count) === _this.maxBeefValue ? 'rgba(225,0,90,0.3)' : 'rgba(255,255,0,0.7)'; },
              cx: (20 / 2),
              cy: (20 / 2)
          });
      }


     

     


    });

    this.resizeVis();
    
  },



  initVis: function (data, maxcount) {

    var _this = this;
    
    this.visData = (location.href.match('http://beef.dev') || location.href.match('http://yle.fi')) ? data : this.createMockData();
    this.visSentenceCount = maxcount ? parseInt(maxcount) : 16;



    var beefVis = $('<div class="beef-vis"></div>');
    this.frame.find('article.content .hgroup h2').after(beefVis);

    this.visSvg = d3.select(beefVis[0]).append('svg');
    this.visInfo = d3.select(beefVis[0]).append('div').attr('class', 'info');

    this.maxBeefValue = d3.max(this.visData, function(d) { return parseInt(d.count); });

    this.visLine = this.visSvg.append('line');

    // this.visSvg
    //     .append('g')
    //     .attr('transform', 'scale(0.1)')
    //     .html(this.burgerPath);

    this.visCircles = this.visSvg.selectAll('circle')
                                 .data(this.visData)
                                 .enter()
                                 .append('circle')
                                 .style({
                                   'cursor': 'pointer'
                                 });
                                

    if(data.length > 0) {
      var sorted = this.visData.sort(function(a, b) { return parseInt(a.count) > parseInt(b.count) ? -1 : parseInt(a.count) < parseInt(b.count) ? 1 : 0; });
      this.visInfo.html('<p><span class="infotitle">Missä on asian pihvi?</span><br> ' + sorted[0].sentence + ' <span class="infocount">(' + sorted[0].count + ')</span></p>');
    }

    this.initVisEvents();
    
  }
});