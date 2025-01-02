import Styles from './page.module.css';

export default function Home() {
    return (
        <div className={Styles.background}>
            <div className={Styles.leftPanel}>
                <div className={Styles.prizePool}>PRIZE POOL</div>
            </div>
            <div className={Styles.bottomPanel}>
                <div className={Styles.section}>
                    <div className={Styles.label}>NEXT BREAK</div>
                </div>
                <div className={`${Styles.section} ${Styles.withDivider}`}>
                    <div className={Styles.label}>AVG STACK</div>
                </div>
                <div className={`${Styles.section} ${Styles.withDivider}`}>
                    <div className={Styles.label}>PLAYERS</div>
                </div>
            </div>
            <div className={Styles.rightPanel}>
                <div className={Styles.blinds}>BLINDS</div>
                <div className={Styles.ante}>ANTE</div>
                <div className={Styles.nextLevel}>NEXT LEVEL</div>
            </div>
        </div>
    );
}

