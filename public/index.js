
const { GME, MSFT, DIS, BNTX } = mockData;
const stocks = {GME, MSFT, DIS, BNTX};

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}
async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const symbols = 'GME,MSFT,DIS,BNTX'; 
    const apiKey = '8f474a5e45a84c49b2f130912990de86'; 
    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${symbols}&interval=1day&apikey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Parsed Data:", data);

        const stocks = Object.values(data);

        // Time Chart
        new Chart(timeChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: stocks[0].values.reverse().map(value => value.datetime),
                datasets: stocks.map(stock => ({
                    label: stock.meta.symbol,
                    backgroundColor: getColor(stock.meta.symbol),
                    borderColor: getColor(stock.meta.symbol),
                    data: stock.values.reverse().map(value => parseFloat(value.high))
                }))
            }
        });

        // High Chart
        new Chart(highestPriceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: stocks.map(stock => stock.meta.symbol),
                datasets: [{
                    label: 'Average',
                    backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                    borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
                    data: stocks.map(stock => findHighest(stock.values))
                }]
            }
        });

        // Average Chart
        new Chart(averagePriceChartCanvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: stocks.map(stock => stock.meta.symbol),
                datasets: [{
                    label: 'Average',
                    backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                    borderColor: stocks.map(stock =>  getColor(stock.meta.symbol)),
                    data: stocks.map(stock => calculateAverage(stock.values))
                }]
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = parseFloat(value.high);
        }
    });
    return highest;
}

function calculateAverage(values) {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high);
    });
    return total / values.length;
}

main();
