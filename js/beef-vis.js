$.extend(beefApp, {

  initVis: function (data, maxcount) {
    
    var esivis = $('#esi-vis');
    var esiframe = esivis.find('iframe').contents();

    if(!location.href.match('http://beef.dev')) {
      var maxcount = 16;
      var data = [
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
        },
        {
          sentence_id: 12,
          count: 15,
          sentence: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
          sentence_id: 13,
          count: 20,
          sentence: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          sentence_id: 16,
          count: 12,
          sentence: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        }
      ];
    }
   

    var beefVis = $('<div class="beef-vis"></div>');
    esiframe.find('ul.some').before(beefVis);

    var svg = d3.select(beefVis[0]).append('svg');
    var info = d3.select(beefVis[0]).append('div').attr('class', 'info');

    var width = svg.node().parentNode.offsetWidth;
    var height = 100;

    var padding = 20;

    var line = null;
    var circles = null;

    var resize = function() {
      width = svg.node().parentNode.offsetWidth;
      svg.attr('height', height + 'px');
      svg.attr('width', width + 'px');

      line.attr({
        x1: 0,
        y1: height / 2,
        x2: width,
        y2: height / 2,
        'stroke': 'black',
        'stroke-dasharray': '1, 3',
        'stroke-width': '1px'
      });

      circles.attr({
        cx: function(d, i) { return padding + (d.sentence_id * (width - (padding * 2)) / maxcount); },
        cy: height / 2,
        r: function(d, i) { return d.count; }
      });

    };

    var initShapes = function() {
      line = svg.append('line');
      circles = svg.selectAll('circle')
                   .data(data)
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

      circles.on('click', function(d) {

      });

      circles.on('mouseover', function(d) {
        d3.select(this).attr('fill', 'magenta');
      });

      circles.on('mouseout', function(d) {
        d3.select(this).attr('fill', 'yellow');
      });

    };

    window.addEventListener('resize', function() {
      resize();
    });

    initShapes();
    resize();

    
    



  }
});