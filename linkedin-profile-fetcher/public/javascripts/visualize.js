/**
 * Created by phodgkinson on 3/6/2014.
 */

(function(window, docment, $) {
    var linkedInDateToJSDate = function(linkedInDate, endDate) {
        if(typeof endDate === 'undefined') {
            endDate = false;
        }

        return new Date(linkedInDate.year, linkedInDate.month - (endDate ? 0 : 1), endDate ? 1 : 0);
    }

    $.getJSON('api/full').done(function(data) {
        console.log(data);

        //var data = [{"date":"2012-03-20","total":3},{"date":"2012-03-21","total":8},{"date":"2012-03-22","total":2},{"date":"2012-03-23","total":10},{"date":"2012-03-24","total":3},{"date":"2012-03-25","total":20},{"date":"2012-03-26","total":12}];

        var margin = {top: 40, right: 40, bottom: 40, left:40},
            width = 2800,
            height = 500,
            rx = 10,
            ry = 10,
            xRange = width - margin.left - margin.right;

        //figure appropriate years in range
        var yearsInRange = 12;
        var graphStartDate = new Date(2000, 0); //TODO: Calculate this dynamically
        var optimalStartDate = new Date();
        optimalStartDate.setFullYear(optimalStartDate.getFullYear() - yearsInRange);
        var positionStartDate = new Date(d3.min(data.positions.values, function(d) { return linkedInDateToJSDate(d.startDate).getTime()}));
        var xStartDate = new Date(d3.max([graphStartDate.getTime(), optimalStartDate.getTime()]));


        var x = d3.time.scale()
            .domain([xStartDate, new Date()])
            .rangeRound([0, xRange]);

        /*
        var x = d3.time.scale()
            .domain([new Date(d3.min(data.positions.values, function(d) { return linkedInDateToJSDate(d.startDate).getTime()})),
                new Date()])
            .rangeRound([0, xRange]);
*/
        /*
        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total; })])
            .range([height - margin.top - margin.bottom, 0]);
        */

        var y = d3.scale.linear()
            .domain([0, 100])
            .range([height - margin.top - margin.bottom, 0]);

        /*
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(d3.time.days, 1)
            .tickFormat(d3.time.format('%a %d'))
            .tickSize(0)
            .tickPadding(8);
            */
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(d3.time.years, 1)
            .tickFormat(d3.time.format('%Y'))
            .tickSize(6)
            .tickPadding(8);


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickPadding(8);

        var svg = d3.select('body').append('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        /*
        svg.selectAll('.chart')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(new Date(d.date)); })
            .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
            .attr('width', 10)
            .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) });
*/
        var calcWidth = function(d) {
            var endDate = new Date();
            if(typeof d.endDate !== "undefined") {
                endDate = linkedInDateToJSDate(d.endDate, true);
            }
            var startDate = linkedInDateToJSDate(d.startDate);

            return x(endDate) - x(startDate);
        };

        //color array
        var color = d3.scale.category20();


        var createPositionBG = function(selection) {
            selection.append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) { return x(linkedInDateToJSDate(d.startDate)); })
                .attr('y', y(50))
                .attr('rx', rx)
                .attr('ry', ry)
                .attr('width', calcWidth)
                .attr('height', y(0) - y(50))
                .attr('fill', function(d, i) { return color(i)});
        };

        var createCompanyInfo = function(selection) {
            selection.append('g')
                .attr('class', 'company').each(function(d) {
                    d3.select(this)
                        .append('image')
                        .attr('xlink:href', d.company.squareLogoUrl)
                        .attr('x', function(d) { return x(linkedInDateToJSDate(d.startDate)); })
                        .attr('y', y(50))
                        .attr('width', 50)
                        .attr('height', 30)
                });

        }

        var createPosition = function(selection) {
            selection.append('g')
                .attr('class', 'position')
                .call(createPositionBG)
                .call(createCompanyInfo);
        };

        var d3Data = svg.selectAll('.chart')
            .data(data.positions.values)
            .enter()
            .call(createPosition);
        /*
        d3Data.append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(linkedInDateToJSDate(d.startDate)); })
            .attr('y', y(50))
            .attr('rx', rx)
            .attr('ry', ry)
            .attr('width', calcWidth)
            .attr('height', y(0) - y(50))
            .attr('fill', function(d, i) { return color(i)})
            */
        d3Data.append('text')
            .text(function(d) { return d.company.name; })
            .attr('x', function(d) { return x(linkedInDateToJSDate(d.startDate)); })
            .attr('y', y(50));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
            .call(xAxis);
/*
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
            */
    });
}(this, document, jQuery));