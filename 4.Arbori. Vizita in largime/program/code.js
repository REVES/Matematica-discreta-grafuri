$(function(){

var elems = JSON.parse(localStorage.getItem('grafStorage'));

var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)'
      })
    .selector('edge')
      .css({
        'width': 4,
        'line-color': '#ddd',
      })
    .selector('.highlighted')
      .css({
        'background-color': '#455A64',
        'line-color': '#455A64',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.1s'
      }),
  
  elements: elems,
  
  layout: {
    name: 'breadthfirst',
    fit: true,
    directed: false,
    roots: '#X10',
    padding: 30
  }
});
  
var bfs = cy.elements().bfs('#a', function(){}, true);

var i = 0;
var highlightNextEle = function(){
  if( i < bfs.path.length ){
    bfs.path[i].addClass('highlighted');
  
    i++;
    setTimeout(highlightNextEle, 1000);
  }
};

highlightNextEle();

});