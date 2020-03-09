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
  constructor(title, dataType, cardArea) {
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

        this.dataType = dataType;
        this.chart = this.createChart();
  }

  async createChart() {
    let data = await this.getData()

    let chart = new Chart(this.context, data)
    return chart;
  }

  async getData() {
    let formattedData = {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      }
    };
    let fetchOptions = {
      credentials: 'same-origin',
      method: 'GET',
    };
    let response;
    let data;


    switch (this.dataType) {
      case 1:
        response = await fetch('/api/getStockTotals?dateFrom='+this.today+'&dateTo='+this.today, fetchOptions);

        if (!response.ok) {
          console.log(response.status);
          return;
        }
        data = await response.json();
        if (data.length == 0) {
          console.log("Empty");
          return;
        }

        data.forEach(element => {
            formattedData.data.labels.push(element.stockName);
            formattedData.data.datasets[0].data.push(element.totalStock);
            formattedData.data.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
        })
        this.options = {
          responsive: "true"
        }
        return formattedData;

      case 2:
        response = await fetch('/api/getStockTotals?dateFrom='+this.today+'&dateTo='+this.today, fetchOptions);

        if (!response.ok) {
          console.log(response.status);
          return;
        }
        data = await response.json();
        if (data.length == 0) {
          return;
        }

        data.forEach(element => {
            formattedData.data.labels.push(element.stockName);
            formattedData.data.datasets[0].data.push(element.totalStock);
            formattedData.data.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
        })
        this.options = {
          responsive: "true"
        }
        formattedData.type = "bar";
        formattedData.data.datasets[0].label = '# of Stock';
        return formattedData;

      case 3:
        response = await fetch('/api/getStockTotals?dateFrom='+this.today.slice(0, -2)+'01'+'&dateTo='+this.today.slice(0, -2)+'31', fetchOptions);

        if (!response.ok) {
          console.log(response.status);
          return;
        }
        data = await response.json();
        if (data.length == 0) {
          return;
        }

        data.forEach(element => {
            formattedData.data.labels.push(element.stockName);
            formattedData.data.datasets[0].data.push(element.totalStock);
            formattedData.data.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
        })
        this.options = {
          responsive: "true"
        }
        formattedData.type = "polarArea";
        return formattedData;
      default:
        return cardTemplateData;
    }
  }
}
