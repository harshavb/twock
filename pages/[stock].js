import { useRouter } from 'next/router'
import { PieChart } from 'react-minimal-pie-chart';
import { getTweets } from '../lib/refresh'
import styles from '../styles/Stock.module.css'
import { useEffect, useState } from 'react'
import Tweet from '../components/Tweet'

// const yahooStockPrices = require('yahoo-stock-prices')

export async function getServerSideProps(context) {
    return await getTweets(context.params.stock, false)
}

export default function Stock(props) {
    const router = useRouter()
    const { stock } = router.query

    const [data, setData] = useState(props);
    const [positiveSentiment, setPositiveSentiment] = useState(0.0);
    const [negativeSentiment, setNegativeSentiment] = useState(0.0);
    const [neutralSentiment, setNeutralSentiment] = useState(0.0);
    const [lessSubjective, setLessSubjective] = useState(0.0);
    const [middleSubjective, setMiddleSubjective] = useState(0.0);
    const [moreSubjective, setMoreSubjective] = useState(0.0);

    const getSentimentValues = async () => {
        let res = await fetch(`/api/sentiment-summary?stock=${stock}`)

        if(res.status === 200) {
            res.json().then(data => {
                setPositiveSentiment(data.positiveSentiment);
                setNegativeSentiment(data.negativeSentiment);
                setNeutralSentiment(data.neutralSentiment);
                setLessSubjective(data.lessSubjective);
                setMiddleSubjective(data.middleSubjective);
                setMoreSubjective(data.moreSubjective);
            })
        }
    }
    useEffect(() => {
        getSentimentValues();
        setInterval(getSentimentValues, 5000)
    }, []);

    const [numTweets, setNumTweets] = useState(props.success ? Math.min(props.data.length, props.includes.users.length) : 0);

    let tweetIdxArr = [];
    for(let i = 0; i < numTweets; i++) {
        tweetIdxArr.push(i);
    }

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <main className={styles.main}>
                {
                    props.success ? (
                    <button className={styles.refreshButton} onClick={async () => {
                        const res = await fetch(`/api/refresh?stock=${stock}`);

                        if(res.status == 200) {
                            const data = await res.json();

                            setNumTweets(Math.min(data.props.data.length, data.props.includes.users.length))
                            setData(data.props);
                        }
                    }}>Update</button>
                    ) : <></>
                }
                <h1 className={styles.title}>{stock}</h1>
                <hr className={styles.line} />
                <div className={styles.pieChartContainer}>
                    <div style={{display: 'inline-block', textAlign: 'center', paddingTop: '1rem'}}>
                        {positiveSentiment + negativeSentiment + neutralSentiment > 0 ? (
                            <>
                                <PieChart
                                    data={[
                                        { title: 'Negative', value: negativeSentiment, color: '#FF0000' },
                                        { title: 'Neutral', value: neutralSentiment, color: '#888888' },
                                        { title: 'Positive', value: positiveSentiment, color: '#00FF00' },
                                    ]}
                                    label={({ dataEntry }) => dataEntry.title}
                                    labelStyle={{
                                        fontSize: '0.5rem',
                                        fontFamily: 'sans-serif',
                                    }}
                                    totalValue={negativeSentiment + neutralSentiment + positiveSentiment}
                                    style={{ width: '90%'}}
                                />
                                <h2 style={{fontSize: '2.5rem'}}>Sentiment</h2>
                            </>
                        ) : (
                            props.success? (
                                <h2 style={{fontSize: '2.5rem'}}>Loading...</h2>
                            ) : (
                                <h2 style={{fontSize: '2.5rem'}}>No data</h2>
                            )
                        )
                        }
                    </div>
                    <div style={{display: 'inline-block', textAlign: 'center', paddingTop: '1rem'}}>
                    {lessSubjective + middleSubjective + moreSubjective > 0 ? (
                        <>
                            <PieChart
                                data={[
                                    { title: 'Less', value: lessSubjective, color: '#FFCCCC' },
                                    { title: 'Moderate', value: middleSubjective, color: '#FF8888' },
                                    { title: 'Very', value: moreSubjective, color: '#FF4444' },
                                ]}
                                label={({ dataEntry }) => dataEntry.title}
                                labelStyle={{
                                    fontSize: '0.5rem',
                                    fontFamily: 'sans-serif',
                                }}
                                totalValue={lessSubjective + middleSubjective + moreSubjective}
                                style={{ width: '90%'}}
                            />
                            <h2 style={{fontSize: '2.5rem'}}>Subjectivity</h2>
                        </>
                    ) : (
                        <></>
                    )}
                    </div>
                </div>
                <hr className={styles.line} />
                {/*<h1 className={styles.subtitle}>The price is {yahooStockPrices.getCurrentPrice(stock).price}</h1> */}
                <div>
                    <h2 className={styles.subtitle}>Tweets</h2>
                    
                    {
                        data.success ? tweetIdxArr.map((elem) => {
                            return <Tweet key={data.data[elem].id} data={data.data[elem]} user={data.includes.users[elem]} />
                        }) : <div><p>Failed to retrieve tweets</p></div>
                    }
                </div>
            </main>
        </div>
    )
}
