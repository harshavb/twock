const yahooStockPrices = require('yahopo-stock-prices')
const stocks = require('stock-ticker-symbol')

export default async function handler(req, res) {
    const stock = req.query.stock

    if(stock === undefined || stock === null || stock === '') {
        res.status(400).json({ success: false, error: 'No stock provided' })
        return
    }

    if(stocks.lookup(stock) == null) {
        res.status(400).json({ success: false, error: 'Invalid stock' })
        return
    }

    const data = await yahooStockPrices.getCurrentData(stock)
    
    // return data as result
    res.status(200).json({
        success: true,
        price: data.price
    })
}