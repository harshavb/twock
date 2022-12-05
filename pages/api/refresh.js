import { getTweets } from "../../lib/refresh";

export default async function handler(req, res) {
    if(req.query.stock === undefined || req.query.stock === null || req.query.stock === '') {
        res.status(400).json({ success: false, error: 'No stock symbol provided' })
    }
    res.status(200).json(await getTweets(req.query.stock, true));
}
