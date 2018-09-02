Pusher.logToConsole = true;

var pusher = new Pusher('61b8c4816cbe5b5435b9', {
  cluster: 'ap1',
  forceTLS: true
});

var channel = pusher.subscribe('poll-channel');
channel.bind('update-poll', function(data) {
  update(data.poll);
});

const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3
  .scaleBand()
  .range([0, width])
  .padding(0.1);

const y = d3.scaleLinear().range([height, 0]);

const container = d3
  .select('body')
  .append('div')
  .attr('class', 'container');

container.append('h1').text('Who will win the 2018/19 Premier League Seasons?');

const svg = container
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const tip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip');

fetch('http://localhost:3000/poll')
  .then(res => res.json())
  .then(poll => {
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    update(poll);
  });

function update(poll) {
  x.domain(poll.map(d => d.name));
  y.domain([0, d3.max(poll, d => d.votes + 200)]);

  svg
    .selectAll('.bar')
    .remove()
    .exit()
    .data(poll)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.name))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d.votes))
    .attr('height', d => height - y(d.votes))
    .on('mousemove', d => {
      tip
        .style('position', 'absolute')
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY + 20}px`)
        .style('display', 'inline-block')
        .style('opacity', '.9')
        .html(
          `<div><strong>${d.name}</strong></div><span>${d.votes} votes</span>`
        );
    })
    .on('mouseout', () => {
      tip.style('display', 'none');
    });

  svg.select('.x-axis').call(d3.axisBottom(x));
  svg.select('.y-axis').call(d3.axisLeft(y));
}
