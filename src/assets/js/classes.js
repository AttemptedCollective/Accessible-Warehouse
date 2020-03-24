const templateData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [{
        data: [10,10,10],
        backgroundColor: ['#ff5959', '#578efa', '#faea57']
    }]
}

const cardTemplateData = {
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            position: 'top'
        }
    }
}

const elementFactory = (type, attributes, children, parent) => {
    const ele = document.createElement(type);

    for (key in attributes) {
        ele.setAttribute(key, attributes[key])
    }

    children.forEach(child => {
        if (typeof child === 'string') {
            ele.appendChild(document.createTextNode(child))
        } else {
            ele.appendChild(child)
        }
    })

    if (parent != null) {
        parent.appendChild(ele)
    }

    return ele;
}

class Widgit {
    constructor(parent, templates, listOfStockTypes, listOfAreas, listOfStores, earliestDate, latestDate) {
        this.listOfStockTypes = listOfStockTypes;
        this.listOfAreas = listOfAreas;
        this.listOfStores = listOfStores;
        this.earliestDate = earliestDate;
        this.latestDate = latestDate;
        this.templates = templates;
        this.tabulatorTable = null;

        this.chosenStock = listOfStockTypes;
        this.firstClick = true;
        //Create the Widgit Element and append to given element
        this.widgit = elementFactory('div', {class: 'widgitArea'}, [], parent);

        //Create the Select Element for changing Widgit Type
        this.topOptionsContainer = elementFactory('div', {class: 'topOptionsContainer'}, [], this.widgit);
        this.select = elementFactory('select', {class: 'ui dropdown reportSelect'}, [], this.topOptionsContainer);

        this.templates.forEach(template => {
            let opt = elementFactory('option', {value: template.name}, [], this.select);
            opt.innerHTML = template.name;
        });
        this.select.addEventListener('change', async(event) => {
            this.destroyOptionsArea();
            this.updateTypeAndOptions();
        });
        $('.ui.dropdown.reportSelect').dropdown();
        this.storeAreaButton = elementFactory('button', {value: 'area', class: 'ui basic button'}, [], this.topOptionsContainer);
        this.storeAreaButton.innerText = "Filter By Areas";

        //Area Selection
        this.areaSelect = elementFactory('select', {class: 'ui dropdown areaSelect'}, [], this.topOptionsContainer);
        let areaOpt = elementFactory('option', {value: 'all'}, [], this.areaSelect);
        areaOpt.innerHTML = "All Areas";
        this.listOfAreas.forEach(area => {
            let opt = elementFactory('option', {value: area}, [], this.areaSelect);
            opt.innerHTML = area;
        });
        $('.ui.dropdown.areaSelect').dropdown();

        //Store Selection
        this.storeSelect = elementFactory('select', {class: "ui dropdown storeSelect hidden"}, [], this.topOptionsContainer);
        let storeOpt = elementFactory('option', {value: 'all'}, [], this.storeSelect);
        storeOpt.innerHTML = "All Stores";
        this.listOfStores.forEach(store => {
            let opt = elementFactory('option', {value: store}, [], this.storeSelect);
            opt.innerHTML = store;
        });
        $('.ui.dropdown.storeSelect').dropdown();


        //Create Canvas Area
        this.canvasContainer = elementFactory('div', {class: "canvasContainer"}, [], this.widgit);
        this.canvas = elementFactory('canvas', {}, [], this.canvasContainer);
        this.context = this.canvas.getContext("2d");

        //Create Table Area
        this.tableContainer = elementFactory('div', {class: "tableContainer hidden"}, [], this.widgit);
        this.table = elementFactory('div', {class: "table"}, [], this.tableContainer);

        //Create Options Area
        this.optionsContainer = elementFactory('div', {class: "optionsContainer"}, [], this.widgit);

        //Set chartType and create Options Area
        this.templates.forEach(template => {
            if (template.name == this.select.value){
                this.chartType = template.chartType;
                this.dataType = template.dataType
                this.chartOptions = template.options;
                this.tableMode = template.tableMode;
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });

        //Create the Graph on Canvas
        this.options = {
            responsive: "true"
        }
        if (!this.tableMode) {this.createGraph(this.chartData);
        }else this.createTable();
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
        let range = this.convertDate();
        switch(this.dataType){
            case 1:
                [formattedData, this.options] = await clientGetStockTotals(formattedData, this.chosenStock, range);
                return formattedData;
            case 2:
                let fetchOptions = {
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
            case 3:
                return await clientListOfOutgoingDeliveries(false);
            case 4:
                return await clientListOfOutgoingDeliveries(true);
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

    async createTable() {
        let [tableColumns, tableData] = await this.getFormattedData();

        if (this.tabulatorTable != null) {
            this.tabulatorTable.setColumns(tableColumns);
            this.tabulatorTable.setData(tableData);
        } else {
            this.tabulatorTable = new Tabulator(this.table, {
                height:"100%",
                width:"95%",
                layout:"fitColumns",
                responsiveLayout:"hide",
                addRowPos:"bottom",
                pagination:"local",
                paginationSize:10,
                columns:tableColumns,
                data:tableData
          });
        }
    }

    updateTypeAndOptions() {
        this.templates.forEach(template => {
            if (template.name == this.select.value){
                this.setType(template.chartType);
                this.setDataType(template.dataType);
                this.tableMode = template.tableMode;
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });
        if (!this.tableMode) {this.createGraph();
        }else {
            console.log('Creating Table');
            
            this.createTable()
        };
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
                    let dateElement = elementFactory('select', {class: 'ui dropdown dateOption'}, [], this.optionsContainer);
                    let dateOptions = ["Year", "Month", "Week", "Day"];
                    dateOptions.forEach(date => {
                        let opt = elementFactory('option', {value: date}, [], dateElement);
                        opt.innerHTML = date;
                    });
                    $('.ui.dropdown.dateOption').dropdown();
                    break;
                case "specificDate":
                    let specificDateElement = elementFactory('input', {type: "date", value: today.slice(0,10)}, [], this.optionsContainer);
                    specificDateElement.addEventListener('change', async() =>{
                        this.chosenOptions = this.updateChosenOptions();
                        this.setChartData(await this.getFormattedData());
                        this.updateChart();
                    });
                    break
                case "stock":
                    let stockElement = elementFactory('select', {class: "ui selection dropdown stockSelect", multiple: "", name:"stocks"}, [], this.optionsContainer);
                    let initialOpt = elementFactory('option', {value: ""}, [], stockElement);
                    initialOpt.innerHTML = "All Stocks";
                    this.listOfStockTypes.forEach(stock => {
                        let opt = elementFactory('option', {value: stock}, [], stockElement);
                        opt.innerHTML = stock;
                    });
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
        if (this.tableMode) {
            this.canvasContainer.classList.add("hidden");
            this.tableContainer.classList.remove("hidden");
            this.optionsContainer.classList.add("hidden");
        } else if (this.optionsContainer.classList.contains("hidden")) {
          this.canvasContainer.classList.remove("hidden");
          this.tableContainer.classList.add("hidden");
          this.optionsContainer.classList.remove("hidden");
        }
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

class Card {
    constructor(title, chartType, dataType, cardArea) {
        this.today = new Date().toJSON().slice(0, 10);
        this.cardArea = cardArea

        this.card = elementFactory('div', {class: 'card'}, [], this.cardArea);

        this.title = elementFactory('div', {class: 'cardTitle'}, [], this.card);
        this.title.innerHTML = title;

        this.canvasContainer = elementFactory('div', {class: 'canvasContainer'}, [], this.card);
        this.canvas = elementFactory('canvas', {}, [], this.canvasContainer);
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
            this.options.legend.position = 'left'
            return formattedData;
  
        case 2:
            [formattedData, this.options] = await clientGetStockTotals(formattedData, [], [this.today, this.today]);
            formattedData.datasets[0].label = '# of Stock';
            this.options = cardTemplateData.options;
            this.options.legend.position = 'top'
            return formattedData;

        case 3:
            [formattedData, this.options] = await clientGetStockTotals(formattedData, [], [this.today.slice(0, -2)+'01', this.today.slice(0, -2)+'31']);
            this.options.legend.position = 'left'
            return formattedData;
        default:
            console.log("No Data Type")
            break
      }
    }
  }
  