const { Client } = require('pg')
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

    const client = new Client()

    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
            res.status(500).json({ success: false, error: 'Database connection error' })
            return
        }
    })

    const data = await client.query('SELECT * FROM sentiment WHERE se_symbol = $1', [stock])
    client.end()

    if(data.rows.length == 0) {
        res.status(400).json({ success: false, error: 'No sentiment data found' })
        return
    }

    let positiveSentiment = 0
    let negativeSentiment = 0
    let neutralSentiment = 0
    let lessSubjective = 0
    let middleSubjective = 0
    let moreSubjective = 0

    for(let i = 0; i < data.rows.length; i++) {
        if(data.rows[i].se_sentiment > 0.33) {
            positiveSentiment++
        } else if(data.rows[i].se_sentiment < -0.33) {
            negativeSentiment++
        } else {
            neutralSentiment++
        }

        if(data.rows[i].se_subjectivity < 0.33) {
            lessSubjective++
        } else if(data.rows[i].se_subjectivity < 0.66) {
            middleSubjective++
        } else {
            moreSubjective++
        }
    }

    res.status(200).json({
        success: true,
        positiveSentiment: positiveSentiment,
        negativeSentiment: negativeSentiment,
        neutralSentiment: neutralSentiment,
        lessSubjective: lessSubjective,
        middleSubjective: middleSubjective,
        moreSubjective: moreSubjective
    })
}