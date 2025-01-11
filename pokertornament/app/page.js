"use client";

import React, { useState, useEffect } from 'react';
import Styles from './page.module.css';

export default function Home() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [playerAddCount, setPlayerAddCount] = useState(0);
    const [playerOutCount, setPlayerOutCount] = useState(0);
    const [buyIn, setBuyIn] = useState(0);
    const [startStack, setStartStack] = useState(0);
    const [inputBuyIn, setInputBuyIn] = useState(0);
    const [inputStartStack, setInputStartStack] = useState(0);
    const [history, setHistory] = useState([]);

    const timeIntervals = [50, 50, 40, 40, 30, 30, 20, 20, 10, 10, 10, 10];
    const blindsLevels = ["5/10", "10/20", "15/30", "20/40", "30/60", "40/80", "50/100", "100/200", "200/400", "300/600", "500/1000", "1000/2000"];
    const anteLevels = [10, 20, 30, 40, 60, 80, 100, 200, 400, 600, 1000, 2000];
    const nextLevelInfo = ["10/20", "15/30", "20/40", "30/60", "40/80", "50/100", "100/200", "200/400", "300/600", "500/1000", "1000/2000", "FINAL LEVEL"];
    const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(timeIntervals[0] * 60);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [hasPlayedChime, setHasPlayedChime] = useState(false);

    const chimeAudio = new Audio("/Time_Signal-Beep01-2(Mid).mp3");

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsPopupVisible(!isPopupVisible);
                setIsTimerPaused(!isTimerPaused);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPopupVisible, isTimerPaused]);

    useEffect(() => {
        if (remainingTime > 0 && !isTimerPaused) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            if (remainingTime <= 2 && !hasPlayedChime) {
                chimeAudio.play();
                setHasPlayedChime(true);
            }

            return () => clearInterval(timer);
        } else if (remainingTime === 0 && currentIntervalIndex < timeIntervals.length - 1) {
            setCurrentIntervalIndex((prevIndex) => prevIndex + 1);
            setRemainingTime(timeIntervals[currentIntervalIndex + 1] * 60);
            setHasPlayedChime(false);
        }
    }, [remainingTime, currentIntervalIndex, isTimerPaused, hasPlayedChime]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const getPlayerRatio = () => {
        if (playerAddCount === 0) return "0 / 0";
        const ratio = (playerAddCount - playerOutCount) / playerAddCount;
        return `${playerAddCount - playerOutCount} / ${playerAddCount}`;
    };

    const getAvgStack = () => {
        if (playerAddCount === playerOutCount || playerAddCount === 0) return "N/A";
        const avgStack = Math.floor((startStack * playerAddCount) / (playerAddCount - playerOutCount));
        return `${avgStack}`;
    };

    const getPrizePool = () => buyIn * playerAddCount + 1500;

    const getPrizeDistribution = () => {
        const prizePool = getPrizePool();
        return {
            first: Math.floor(prizePool * 0.5),
            second: Math.floor(prizePool * 0.25),
            third: Math.floor(prizePool * 0.15),
            fourth: Math.floor(prizePool * 0.1),
        };
    };

    const handleConfirm = () => {
        setBuyIn(inputBuyIn);
        setStartStack(inputStartStack);
        setIsPopupVisible(false);
    };

    const handlePlayerAdd = () => {
        setPlayerAddCount(playerAddCount + 1);
        setHistory([...history, { type: "add" }]);
    };

    const handlePlayerOut = () => {
        if (playerAddCount > playerOutCount) {
            setPlayerOutCount(playerOutCount + 1);
            setHistory([...history, { type: "out" }]);
        }
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastAction = history[history.length - 1];
        setHistory(history.slice(0, -1));

        if (lastAction.type === "add") {
            setPlayerAddCount(playerAddCount - 1);
        } else if (lastAction.type === "out") {
            setPlayerOutCount(playerOutCount - 1);
        }
    };

    const prizeDistribution = getPrizeDistribution();

    return (
        <div className={Styles.background}>
            <div className={Styles.leftPanel}>
                <div className={Styles.prizeDistribution}>
                    <div>1ST: ￥{prizeDistribution.first}</div>
                    <div>2ND: ￥{prizeDistribution.second}</div>
                    <div>3RD: ￥{prizeDistribution.third}</div>
                    <div>4TH: ￥{prizeDistribution.fourth}</div>
                </div>
                <div className={Styles.prizePool}>PRIZE POOL</div>
                <div className={Styles.prizeValue}>￥{getPrizePool()}</div>
            </div>
            <div className={Styles.bottomPanel}>
                <div className={Styles.section}>
                    <div className={Styles.label}>NEXT BREAK</div>
                </div>
                <div className={`${Styles.section} ${Styles.withDivider}`}>
                    <div className={Styles.label}>AVG STACK</div>
                    <div className={Styles.ratio}>{getAvgStack()}</div>
                </div>
                <div className={`${Styles.section} ${Styles.withDivider}`}>
                    <div className={Styles.label}>PLAYERS</div>
                    <div className={Styles.ratio}>{getPlayerRatio()}</div>
                </div>
            </div>
            <div className={Styles.rightPanel}>
                <div className={Styles.level}>LEVEL {currentIntervalIndex + 1}</div>
                <div className={Styles.rightlabel}>BLINDS</div>
                <div className={Styles.rightdist}>{blindsLevels[currentIntervalIndex]}</div>
                <div className={Styles.rightlabel}>ANTE</div>
                <div className={Styles.rightdist}>{anteLevels[currentIntervalIndex]}</div>
                <div className={Styles.rightlabel}>NEXT LEVEL</div>
                <div className={Styles.rightdist}>{nextLevelInfo[currentIntervalIndex]}</div>
            </div>

            <div className={Styles.tournamentTitle}>Tekito Series of Poker #1 Deepstack</div>
            <div className={Styles.timerDisplay}>{formatTime(remainingTime)}</div>

            {isPopupVisible && (
                <div className={Styles.popupMenu}>
                    <div>
                        <label>
                            バイイン:
                            <input
                                type="number"
                                value={inputBuyIn}
                                onChange={(e) => setInputBuyIn(Number(e.target.value))}
                                placeholder="バイイン"
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            スタートスタック:
                            <input
                                type="number"
                                value={inputStartStack}
                                onChange={(e) => setInputStartStack(Number(e.target.value))}
                                placeholder="スタートスタック"
                            />
                        </label>
                    </div>
                    <button onClick={handlePlayerAdd}>プレイヤー追加</button>
                    <button onClick={handlePlayerOut}>プレイヤーアウト</button>
                    <button className={Styles.confirmButton} onClick={handleConfirm}>
                        決定
                    </button>
                    <button className={Styles.undoButton} onClick={handleUndo}>
                        Undo
                    </button>
                </div>
            )}
        </div>
    );
}
