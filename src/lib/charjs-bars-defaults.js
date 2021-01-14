import Chart from 'chart.js';
const dataBarsDefault = dataBars => {
    return {
        type: 'bar',
        data: dataBars.data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltips: {
                mode: 'label',
                enabled: false
            },
            hover: {
                animationDuration: 0
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    const chartInstance = this.chart,
                        ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(
                        11,
                        'bold',
                        Chart.defaults.global.defaultFontFamily
                    );
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#ddd';

                    this.data.datasets.forEach(function (dataset, i) {
                        const meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            const data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false,
                            fontColor: '#DDDDDD',
                            labelString: 'Month'
                        },
                        ticks: { fontColor: '#DDDDDD' }
                    }
                ],
                yAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false,
                            fontColor: '#DDDDDD',
                            labelString: 'Value'
                        },
                        ticks: {
                            display: false,
                            fontColor: '#DDDDDD',
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };
};

export default dataBarsDefault;
