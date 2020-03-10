let cardTemplateData = {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};

class Card {
  constructor(title, chartType, dataType, cardArea) {
        this.today = new Date().toJSON().slice(0, 10);
        this.cardArea = cardArea
        this.card = document.createElement("div");
        this.card.classList.add("card");
        this.cardArea.appendChild(this.card);

        this.title = document.createElement("div");
        this.title.classList.add("cardTitle");
        this.title.innerHTML = title;
        this.card.appendChild(this.title);

        this.canvasContainer = document.createElement("div");
        this.canvasContainer.classList.add("canvasContainer");
        this.canvas = document.createElement("canvas");

        this.canvasContainer.appendChild(this.canvas);
        this.card.appendChild(this.canvasContainer);

        this.context = this.canvas.getContext('2d');

        this.chartType = chartType;
        this.dataType = dataType;
        this.chart = this.createChart();
  }

  async createChart() {
    let data = await this.getData()

    let chart = new Chart(this.context, {
      type: this.chartType,
      data: data,
      options: this.options
    });
    return chart;
  }

  async getData() {
    let formattedData = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };

    switch (this.dataType) {
      case 1:
        [formattedData, this.options] = await clientGetStockTotals(formattedData, [], [this.today, this.today]);
        this.options[legend][position] = 'left'
        return formattedData;

      case 2:
        [formattedData, this.options] = await clientGetStockTotals(formattedData, [], [this.today, this.today]);
        formattedData.datasets[0].label = '# of Stock';
        this.options[legend][position] = 'top'
        return formattedData;

      case 3:
        [formattedData, this.options] = await clientGetStockTotals(formattedData, [], [this.today.slice(0, -2)+'01', this.today.slice(0, -2)+'31']);
        this.options[legend][position] = 'left'
        return formattedData;
      default:
        return cardTemplateData;
    }
  }
}
