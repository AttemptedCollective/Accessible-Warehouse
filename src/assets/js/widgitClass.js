const templates = [
    {name: "Total Stock Distributed Over Time", chartType:"polarArea", options: ["date", "specificDate", "stock"], dataType:1},
    {name: "Breakdown of Stock Distributed Over Time", chartType:"bar", options: ["date", "specificDate", "stock"], dataType:2},
    {name: "Breakdown of Stock Distributed Over Time (Stacked)", chartType:"bar", options: ["date", "specificDate", "stock"], dataType:2}
];

const templateData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [{
        data: [10,10,10],
        backgroundColor: ['#ff5959', '#578efa', '#faea57']
    }]
}

class Widgit {
      constructor(parent, listOfStockTypes, listOfAreas, listOfStores, earliestDate, latestDate) {
        this.listOfStockTypes = listOfStockTypes;
        this.listOfAreas = listOfAreas;
        this.listOfStores = listOfStores;
        this.earliestDate = earliestDate;
        this.latestDate = latestDate;

        this.chosenStock = listOfStockTypes;
        this.firstClick = true;
        //Create the Widgit Element and append to given element
        this.widgit = document.createElement("div");
        parent.appendChild(this.widgit);
        this.widgit.classList.add('widgitArea');

        //Create the Select Element for changing Widgit Type
        this.topOptionsContainer = document.createElement("div");
        this.topOptionsContainer.classList.add('topOptionsContainer');
        this.widgit.appendChild(this.topOptionsContainer);
        this.select = document.createElement("select");
        this.topOptionsContainer.appendChild(this.select);
        this.select.classList.add("ui", "dropdown", 'reportSelect');
        templates.forEach(template => {
            let opt = document.createElement("option");
            opt.value= template.name
            opt.innerHTML = template.name;
            this.select.appendChild(opt);
        });
        this.select.addEventListener('change', async(event) => {
            this.destroyOptionsArea();
            this.updateTypeAndOptions();
        });
        $('.ui.dropdown.reportSelect').dropdown();
        this.storeAreaButton = document.createElement("button");
        this.storeAreaButton.classList.add("ui", "basic","button");
        this.storeAreaButton.innerText = "Filter By Areas";
        this.storeAreaButton.value = "area";
        this.topOptionsContainer.appendChild(this.storeAreaButton);

        //Area Selection
        this.areaSelect = document.createElement("select");
        this.areaSelect.classList.add("ui", "dropdown", "areaSelect");
        let areaOpt = document.createElement("option");
        areaOpt.value= "all";
        areaOpt.innerHTML = "All Areas";
        this.areaSelect.appendChild(areaOpt);
        this.listOfAreas.forEach(area => {
            let opt = document.createElement("option");
            opt.value= area
            opt.innerHTML = area;
            this.areaSelect.appendChild(opt);
        });
        $('.ui.dropdown.areaSelect').dropdown();
        this.topOptionsContainer.appendChild(this.areaSelect);
        $('.ui.dropdown.areaSelect').dropdown();

        //Store Selection
        this.storeSelect = document.createElement("select");
        this.storeSelect.classList.add("ui", "dropdown", "storeSelect", "hidden");
        let storeOpt = document.createElement("option");
        storeOpt.value= "all";
        storeOpt.innerHTML = "All Stores";
        this.areaSelect.appendChild(areaOpt);
        this.listOfStores.forEach(store => {
            let opt = document.createElement("option");
            opt.value= store
            opt.innerHTML = store;
            this.storeSelect.appendChild(opt);
        });
        $('.ui.dropdown.storeSelect').dropdown();
        this.topOptionsContainer.appendChild(this.storeSelect);
        $('.ui.dropdown.storeSelect').dropdown();


        //Create Canvas Area
        this.canvasContainer = document.createElement("div")
        this.canvasContainer.classList.add("canvasContainer")
        this.canvas = document.createElement("canvas");
        this.canvasContainer.appendChild(this.canvas);
        this.widgit.appendChild(this.canvasContainer);
        this.context = this.canvas.getContext("2d");

        //Create Options Area
        this.optionsContainer = document.createElement("div");
        this.optionsContainer.classList.add("optionsContainer");
        this.widgit.appendChild(this.optionsContainer);

        //Set chartType and create Options Area
        templates.forEach(template => {
            if (template.name == this.select.value){
                this.chartType = template.chartType;
                this.dataType = template.dataType
                this.chartOptions = template.options;
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });

        $('.ui.selection').dropdown();
        //Create the Graph on Canvas
        this.options = {
            responsive: "true"
        }
        this.createGraph(this.chartData);
        $('.ui.selection').dropdown();
    }

    //Basic Set Functions
    setChartData(data) {
        this.chartData = data;
    }

    setDataType(dataType) {
        this.dataType = dataType;
    }

    setType(chartType) {
        this.chartType = chartType;
    }

    setOptions(options) {
        this.options = options;
    }

    //Get Functions
    async getFormattedData() {
        let formattedData = {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
          }]
        };
        let fetchOptions;
        let response;
        let data;
        let range;
        switch(this.dataType){
            case 1:

              fetchOptions = {
                credentials: 'same-origin',
                method: 'GET',
              };
              range = this.convertDate();
              response = await fetch('/api/getStockTotals?dateFrom='+range[0]+'&dateTo='+range[1], fetchOptions);
              if (!response.ok) {
                console.log(response.status);
                return;
              }
              data = await response.json();
              if (data.length == 0) {
                return;
              }

              data.forEach(element => {
                  if (this.chosenStock.includes(element.stockName)) {
                    formattedData.labels.push(element.stockName);
                    formattedData.datasets[0].data.push(element.totalStock);
                    formattedData.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
                  }
              })
              this.options = {
                responsive: "true"
                }

              return formattedData;
            case 2:
                fetchOptions = {
                    credentials: 'same-origin',
                    method: 'GET',
                };
                range = this.convertDate();
                response = await fetch('/api/getBreakdownByStock?dateFrom='+range[0]+'&dateTo='+range[1], fetchOptions);
                if (!response.ok) {
                    console.log(response.status);
                    return;
                }
                data = await response.json();
                if (data.length == 0) {
                    return;
                }

                let labels = [];
                let stockNames = [];
                let stockColours = [];
                let dataSets = [];

                data.forEach((i) => {
                    if (this.chosenStock.includes(i.stockName)) {
                        if (!labels.includes(monthNumToName(i.StockMonth))) { labels.push(monthNumToName(i.StockMonth)) };
                        if (!stockNames.includes(i.stockName)) { stockNames.push(i.stockName) };
                        if (!stockColours.includes(i.stockColour)) { stockColours.push(i.stockColour) };
                    }
                });

                stockNames.forEach((name) => {
                    let set = {
                        label: name,
                        data: [],
                        backgroundColor: []
                    };

                    labels.forEach(() => {
                        set.data.push(0);
                        set.backgroundColor.push(stockColours[stockNames.indexOf(name)])
                    ;})

                    dataSets.push(set);}
                );


                data.forEach((i) => {
                    if (this.chosenStock.includes(i.stockName)) {
                        let setIndex = stockNames.indexOf(i.stockName);
                        let dataIndex = labels.indexOf(monthNumToName(i.StockMonth));
                        dataSets[setIndex].data[dataIndex] = i.TotalBags;
                        dataSets[setIndex].backgroundColor[dataIndex] = i.stockColour.slice(0, -1)+", 0.75)";
                    }
                });

                formattedData = {
                    labels: labels,
                    datasets: dataSets,
                }

                if (this.select.value.slice(-9) == "(Stacked)") {
                    this.options = {
                        responsive: true,
                        title: {
                          display: false,
                        },
                        scales: {
                          xAxes: [{
                            stacked: true
                          }],
                          yAxes: [{
                            stacked: true,
                            ticks: {
                              beginAtZero: true,
                              min: 0
                            }
                          }]
                        }
                      }
                }
                else {this.options = {
                    responsive: "true"
                }}
                return formattedData;
            default:
                return templateData;
        }
    }

    //Other Funcitons

    async createGraph() {
        if (this.chart != null) this.chart.destroy();
        this.setChartData(await this.getFormattedData());
        this.chart = new Chart(this.context, {
            type: this.chartType,
            data: this.chartData,
            options: this.options
        });
    }

    updateTypeAndOptions() {
        templates.forEach(template => {
            if (template.name == this.select.value){
                this.setType(template.chartType);
                this.setDataType(template.dataType);
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });
        this.createGraph();
    }

    async updateChart() {
        this.setChartData(await this.getFormattedData());
        this.chart.data = this.chartData;
        this.chart.update();
    }

    destroyOptionsArea() {
        while (this.optionsContainer.hasChildNodes()) this.optionsContainer.removeChild(this.optionsContainer.firstChild);
    }

    convertDate() {
      let range = [];
      switch(this.chosenOptions[0]){
            case "Year":
                let year = this.chosenOptions[1].slice(0,4);
                range = [year+"-01-01", year+"-12-31"]
                return range;
            case "Month":
                let month = this.chosenOptions[1].slice(0,7);
                range = [month+"-01", month+"-31"]
                return range;
            case "Week":
                let weekYear = parseInt(this.chosenOptions[1].slice(0,4));
                let weekNumber = parseInt( this.chosenOptions[1].slice(6,8));
                let date = new Date(weekYear, 0, 1 + (weekNumber - 1) * 7);
                let dayOfWeek = date.getDay();
                let ISOweekStart = date;
                let ISOweekEnd = new Date(weekYear, 0, 1 + (weekNumber - 1) * 7);
                if (dayOfWeek <= 4) {
                    ISOweekStart.setDate(date.getDate() - date.getDay() + 1);
                }
                else {
                    ISOweekStart.setDate(date.getDate() + 8 - date.getDay());
                }
                ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
                range = [ISOweekStart.toISOString().slice(0,10), ISOweekEnd.toISOString().slice(0,10)]
                return range;
            case "Day":
                range = [this.chosenOptions[1], this.chosenOptions[1]]
                return range;
                break;
            }
    }

    updateChosenOptions() {
        let chosenOptions = [];
        let optionsContainerChildren = this.optionsContainer.childNodes
        optionsContainerChildren.forEach(child => {
            if (typeof child.value === 'string') chosenOptions.push(child.value);
            else chosenOptions.push(child.childNodes[0].value);
        });

        return chosenOptions;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateOptionsArea() {
        this.chartOptions.forEach(option => {
            switch(option){
                case "date":
                    let dateElement = document.createElement("select");
                    dateElement.classList.add("ui", "dropdown", "dateOption");
                    let dateOptions = ["Year", "Month", "Week", "Day"];
                    dateOptions.forEach(date => {
                        let opt = document.createElement("option");
                        opt.value= date
                        opt.innerHTML = date;
                        dateElement.appendChild(opt);
                    });
                    this.optionsContainer.appendChild(dateElement)
                    $('.ui.dropdown.dateOption').dropdown();
                    break;
                case "specificDate":
                    let specificDateElement = document.createElement("input");
                    specificDateElement.setAttribute("type", "date")
                    specificDateElement.value = today.slice(0,10);
                    this.optionsContainer.appendChild(specificDateElement)
                    specificDateElement.addEventListener('change', async() =>{
                        this.chosenOptions = this.updateChosenOptions();
                        this.setChartData(await this.getFormattedData());
                        this.updateChart();
                    });
                    break
                case "stock":
                    let stockElement = document.createElement("select");
                    stockElement.name = "stocks";
                    stockElement.classList.add("ui", "selection", "dropdown", "stockSelect");
                    stockElement.setAttribute("multiple", "")
                    let initialOpt = document.createElement("option");
                    initialOpt.value = "";
                    initialOpt.innerHTML = "All Stocks";
                    stockElement.appendChild(initialOpt);
                    this.listOfStockTypes.forEach(stock => {
                        let opt = document.createElement("option");
                        opt.value = stock;
                        opt.innerHTML = stock;
                        stockElement.appendChild(opt);
                    });
                    $('.ui.selection').dropdown();
                    this.optionsContainer.appendChild(stockElement);
                    $('.ui.selection').dropdown();
                    this.optionsContainer.childNodes[2].addEventListener('click', async()=>{
                        await this.sleep(5)
                        let selectElements = this.optionsContainer.childNodes[2].childNodes;
                        let menu;
                        selectElements.forEach(ele => {
                            if (ele.classList.contains("menu")) {
                                menu = ele.childNodes;
                            }
                        });

                        let isActive = false;
                        let searchedStock = []
                        menu.forEach(stockOption => {
                            if (stockOption.classList == 'item active filtered'){
                                searchedStock.push(stockOption.innerHTML)
                                isActive = true;
                            }
                        });

                        if (!isActive) {
                            this.chosenStock = this.listOfStockTypes;
                            if (!this.firstClick) {
                                this.updateChart();
                                this.firstClick = true;
                            }
                        } else {
                            this.chosenStock = searchedStock;
                            this.updateChart();
                            this.firstClick = false;
                        }
                    });
                    break;
            }
        });
    }

    linkOptions() {
        if (this.chartOptions[0] == "date" && this.chartOptions[1] == "specificDate") {
            let optionElements = this.optionsContainer.childNodes;
            optionElements[0].firstChild.addEventListener('change', () => {
                switch(optionElements[0].firstChild .value){
                    case "Month":
                        optionElements[1].setAttribute("type", "month");
                        break
                    case "Week":
                        optionElements[1].setAttribute("type", "week");
                        break
                    default:
                        optionElements[1].setAttribute("type", "date");
                        break
                }
                this.chosenOptions = this.updateChosenOptions();
            })
        }
    }
}