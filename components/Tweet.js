import styles from '../styles/Stock.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Tweet(props) {
    const [sentiment, setSentiment] = useState("loading");
    const [subjectivity, setSubjectivity] = useState("loading");

    useEffect(() => {
        fetch(`/api/sentiment?tweet_id=${props.data.id}`).then(res => {
            if(res.status != 200) {
                    setSentiment("error");
                    setSubjectivity("error");
            } else {
                res.json().then(data => {
                    if(data.success) {
                        setSentiment(parseFloat(data.sentiment).toFixed(2));
                        setSubjectivity(parseFloat(data.subjectivity).toFixed(2));
                    } else {
                        setSentiment("error");
                        setSubjectivity("error");
                    }
                })
            }
        })
    }, [])

    return (
        <div className={styles.tweet} key={props.data.id}>
            <div className={styles.tweetUser}>
                <Image src={props.user.profile_image_url} alt="Profile Image" width={50} height={50} priority={true} />
                <div>
                    <h3 className={styles.tweetUserName}>{props.user.name}</h3>
                    <p className={styles.tweetUserHandle}>@{props.user.username}</p>
                </div>
            </div>
            <div className={styles.tweetContent}>
                <p>{props.data.text}</p>
                <p>{new Date(Date.parse(props.data.created_at)).toLocaleDateString('en-US')} at {new Date(Date.parse(props.data.created_at)).toLocaleTimeString('en-US')}</p>
                <p style={{ color: "#888"}}>Sentiment: {sentiment}, Subjectivity: {subjectivity},</p>
            </div>
        </div>
    )
}
