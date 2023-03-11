import React,{ useState , useEffect } from "react";
import CreditModelLogo from '../../assets/images/creditModels.png';
import Liquidity from '../../assets/images/liquidity.png';
import TrackRecord from '../../assets/images/trackRecord.png';
import DiverseSetProduct from '../../assets/images/diverseSetProducts.png';
import TextTransition,{ presets } from "react-text-transition";
import * as styles from './Aboutcards.css';
import Text from "../text";

export const Aboutcards = () => {



    const [index ,setIndex] = useState(0);


    const aboutus = [
        {
            image:<img src={CreditModelLogo} className={styles.logoCreditModels} alt='Credit Models' />,
            head:"Credit Models",
            text:<Text size="1.7rem" color="var(--white-color)">We use superior <span className={styles.specialText}>algo-driven</span> credit models to curate invoices - Our credit models are much more superior & sharper than that of any other financial institution in India - And we are open to discussing with you about how they work.</Text>
        },
        {
            image:<img src={Liquidity} className={styles.logoLiquidity} alt='Instant Liquidity' />,
            head:"Instant Liquidity",
            text:<Text size="1.7rem" color="var(--white-color)">Down sell your asset to another investor at a click of a button at <span className={styles.specialText}>ZERO</span> cost. 100% of liquidity requests on TradeCred platform have been honoured till date."</Text>
        },
        {
            image:<img src={TrackRecord} className={styles.logoTrackRecord} alt='Track record' />,
            head:"Track record",
            text:<Text size="1.7rem" color="var(--white-color)">We have <span className={styles.specialText}> zero delinquency </span> till date.</Text>
        },
        {
            image:<img src={DiverseSetProduct} className={styles.logoDiverseProduct} alt='Diverse set of Products' />,
            head:"Diverse set of Products",
            text:<Text size="1.7rem" color="var(--white-color)">Invoice Discounting, Asset Leasing, Corporate Bonds, Sovereign Bonds</Text>
        }                
    ];

    useEffect(()=>{
        const intervalID = setInterval(()=>
        setIndex(index => index + 1 ),
        3000
        );        
        return ()=>clearTimeout(intervalID);   
    },[]);

    const rollingText = aboutus.map((item, i) => (
    <div className={styles.sentenceCard} key={i}>
        <div>{item.image}</div>
        <div><span className={styles.subheading}>{item.head}</span></div>        
        <div>{item.text}</div>
    </div>
    ));
    return (
        <div className={styles.cardWrapper}>
            <TextTransition springConfig={presets.gentle}>                
                <div className={styles.sentences}>            
                        {rollingText[index % rollingText.length]}                
                </div>
            </TextTransition>

        </div>

    )
}