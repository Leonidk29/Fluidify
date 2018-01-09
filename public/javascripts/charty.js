trace1 = {
    x: xCord,
    y: yCord,
    text: text,
    type: 'bar',
    marker: {color: 'rgb(26, 118, 255)'}

};
data = [trace1];

layout = {
    title: name,

    yaxis: {
        title: '<b>Liter</b>'

    },
    xaxis: {
        title: xtitle
    },
};
Plotly.plot('plotly-div', {
    data: data,
    layout: layout
});