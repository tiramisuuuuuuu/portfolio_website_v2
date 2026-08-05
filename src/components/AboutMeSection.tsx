import styles from './AboutMeSection.module.css';
import { aboutMe } from "./portfolio-content";

export default function AboutMeSection({ isSmall }: { isSmall: boolean }) {
    return (
        <div className={styles.container}>{
            Object.entries(aboutMe).map(([key, value]) => 
                <div key={key} className={styles.pair}>
                    {isSmall ? <p><span style={{ color: "orange" }}>{key}:</span> {value}</p> :
                        <>
                            <p className={styles.key}>{key}:</p>
                            <p className={styles.value}>{value}</p>
                        </>
                    }
                </div>
            )
        }</div>
    );
}
