d3.json('data.json').then((data) => {
    let chart = d3.select('#chart')
    let chartWidth = chart.style('width').replace('px', '')
    let chartHeight = chart.style('height').replace('px', '')
    let gapUnder = 26
    let axisBottomHeight = 24
    let gapOnTop = -42

    // create horizontal scale
    let xScale = d3.scaleBand()
        .padding(.27)
        .domain(data.map((d) => d.day))
        .range([0, chartWidth])
    let axisBottom = d3.axisBottom()
        .scale(xScale)

    // add horizontal scale to chart
    chart.append('g')
        .attr('transform', 'translate(0,' + (chartHeight - axisBottomHeight) + ')')
        .call(axisBottom)
        .selectAll('.domain, .tick line')
        .remove()

    // create vertical scale
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.amount)])
        .range([0, chartHeight - gapUnder + gapOnTop])

    /**
     * create <g> element
     * Add event listeners to show info on hovering the bars
     * Add individual bars to <g> elements
     * dynamically add active class to bar depending on day
    */
    chart.append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bar-item')
        .on('mouseover', function (d, i) {
            d3.select(this).select('.bar').transition().style('opacity', '.7')
            d3.select(this).select('.d3-tooltip').transition().style('opacity', '1')
        })
        .on('mouseout', function (d, i) {
            d3.select(this).select('.bar').transition().style('opacity', '1')
            d3.select(this).select('.d3-tooltip').transition().style('opacity', '0')
        })
        .append('rect')
        .attr('class', (d, i) => {
            var days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
            var date = new Date();
            if (d.day == days[date.getDay()]) return 'bar active'
            return 'bar';
        })
        .attr('x', (data) => xScale(data.day))
        .attr('y', (data) => (chartHeight - yScale(data.amount)) - gapUnder)
        .attr('height', (data) => yScale(data.amount))
        .attr('width', () => xScale.bandwidth())
        .attr('rx', 4)


    // create an <svg> element (tooltip container) add text and a rectangle background to it
    d3.selectAll('.bar-item')
        .data(data)
        .append('svg')
        .attr('class', 'd3-tooltip')
        .attr('x', (data) => xScale(data.day) - 10) // 8 to center svg element
        .attr('y', (data) => (chartHeight - yScale(data.amount)) - gapUnder + gapOnTop)
        .append('rect')
        .attr('rx', '4')

    d3.selectAll('.bar-item')
        .data(data)
        .selectAll('svg')
        .append('text')
        .attr('y', 23) // to center text element vertically
        .attr('x', xScale.bandwidth() - 12) // to center text horizontally
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text((data) => `$${data.amount}`)

})
