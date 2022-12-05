import { getOAuth2Token, searchTweets } from '../lib/twitter'

const stocks = require('stock-ticker-symbol')
const { Client } = require('pg')

let token = ''

async function getTweets(symbol, isStale) {
    if (stocks.lookup(symbol) == null) {
        return {
            props: {
                success: false,
            }
        }
    }

    require('dotenv').config()
    const client = new Client()
     
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
        }
    })

    const res = await client.query(`SELECT * FROM tweet_information WHERE ti_s_symbol = '${symbol}' ORDER BY ti_unix_timestamp DESC LIMIT 50`);
    if(res.rows.length > 0 && !(isStale && (new Date() - new Date(parseInt(res.rows[0].ti_unix_timestamp))) > 120000)) {
        let out = {
            data: [],
            includes: {
                users: [],
            }
        }

        for(let i = 0; i < res.rows.length; i++) {
            const user_res = await client.query(`SELECT * FROM twitter_user WHERE tu_user_id = '${res.rows[i].ti_user_id}'`);
            const user = user_res.rows[0];
            let row = res.rows[i]
            out.data.push({
                id: row.ti_tweet_id,
                text: row.ti_text,
                created_at: new Date(parseInt(row.ti_unix_timestamp)).toISOString(),
                author_id: row.ti_user_id,
            })
            out.includes.users.push({
                id: user.tu_user_id,
                username: user.tu_username,
                name: user.tu_display_name,
                profile_image_url: user.tu_profile_image_url,
            })
        }

        client.end()
        return {
            props: {
                success: true,
                ...out,
            }
        }
    }

    if(token == '') token = await getOAuth2Token()
    let data = await searchTweets(token, symbol);

    if(data.success == false) {
        if(data.error == 401) {
            token = await getOAuth2Token()
            data = await searchTweets(token, symbol);

            if(data.success == false) {
                console.log("Error retrieving tweets and refreshing token")
                return {
                    props: {
                        success: false,
                    }
                }
            }
        } else {
            console.log("Error retrieving tweets: " + data.error)
            return {
                props: {
                    success: false,
                }
            }
        }
    }

    const stock_query = await client.query('SELECT * FROM stock WHERE s_symbol = $1', [symbol])
    if(stock_query.rows.length == 0) {
        await client.query('INSERT INTO stock (s_symbol, s_percent_change, s_price) VALUES ($1, $2, $3) ON CONFLICT (s_symbol) DO NOTHING', [symbol, 0.00, 0.00])
    }

    for(let i = 0; i < Math.min(data.data.length, data.includes.users.length); i++) {
        await client.query('INSERT INTO twitter_user (tu_user_id, tu_username, tu_display_name, tu_profile_image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (tu_user_id) DO NOTHING', [data.includes.users[i].id, data.includes.users[i].username, data.includes.users[i].name, data.includes.users[i].profile_image_url])
        await client.query('INSERT INTO tweet_information (ti_tweet_id, ti_user_id, ti_text, ti_unix_timestamp, ti_s_symbol) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (ti_tweet_id) DO NOTHING', [data.data[i].id, data.includes.users[i].id, data.data[i].text, Date.parse(data.data[i].created_at), symbol])
    }

    client.end()

    return {
        props: data
    }
}

export { getTweets }
