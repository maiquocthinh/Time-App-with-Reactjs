import { useState, useRef, createContext, useContext, memo, useEffect } from 'react';
import clsx from 'clsx';
import style from './StopWatch.module.css';

// Context of Component StopWatch
const Context = createContext();

const Clock = memo(() => {
    const { time } = useContext(Context);

    return (
        <div className={clsx(style.Clock)}>
            <div className={clsx(style.Time)}>
                <div className={clsx(style.Digital, style.TimeItem)}>{time.minutes.toString().padStart(2, '0')}</div>
                <div className={clsx(style.Digital, style.TimeItem)}>{time.seconds.toString().padStart(2, '0')}</div>
                <div className={clsx(style.Digital, style.TimeItem)}><span>.{(time.microseconds / 10).toString().padStart(2, '0')}</span></div>
            </div>
        </div>
    )
});

const Control = memo(() => {
    const { setTime, setIsSplit, setListSplitTime } = useContext(Context);

    const [isRuning, setIsRuning] = useState(false);

    const IntervalId = useRef();

    useEffect(() => {
        if (isRuning) {
            IntervalId.current = setInterval(() => {
                setTime(time => {
                    let timeByMS = time.microseconds + time.seconds * 1000 + time.minutes * 60 * 1000;
                    timeByMS += 10;
                    return {
                        minutes: Math.floor(timeByMS / (60 * 1000)),
                        seconds: Math.floor(timeByMS % (60 * 1000) / 1000),
                        microseconds: timeByMS % (60 * 1000) % 1000
                    };
                });
            }, 10);
        }
        return () => clearInterval(IntervalId.current);
    }, [isRuning]);

    const handleResetClick = () => {
        clearInterval(IntervalId.current);
        setTime({ minutes: 0, seconds: 0, microseconds: 0 });
        setListSplitTime([]);
        setIsRuning(false);
    };

    return (
        <div className={clsx(style.Control)}>
            <h2>Control Timer</h2>
            <div className={clsx(style.WrapBtn)}>
                <button
                    className={clsx(style.BtnToggle, {
                        [style.BtnToggleActive]: isRuning,
                    })}
                    onClick={() => setIsRuning(!isRuning)}
                >
                    {isRuning ? 'Stop' : 'Start'}
                </button>
                <button
                    className={clsx(style.BtnSplit)}
                    onClick={() => setIsSplit(Math.random())}
                >Split</button>
                <button
                    className={clsx(style.BtnReset)}
                    onClick={handleResetClick}
                >Reset</button>
            </div>
        </div>
    );
});

const Results = memo(() => {
    const { time, isSplit, listSplitTime, setListSplitTime } = useContext(Context);

    const formatTime = (timeByMS) => {
        const time = {
            minutes: Math.floor(timeByMS / (60 * 1000)),
            seconds: Math.floor(timeByMS % (60 * 1000) / 1000),
            microseconds: timeByMS % (60 * 1000) % 1000
        }
        return time.minutes.toString().padStart(2, '0') + ':'
            + time.seconds.toString().padStart(2, '0') + '.'
            + (time.microseconds / 10).toString().padStart(2, '0');
    };

    useEffect(() => {
        const timeByMS = time.microseconds + time.seconds * 1000 + time.minutes * 60 * 1000;
        if (timeByMS !== 0) {
            setListSplitTime(splitTimeArr => ([
                ...splitTimeArr,
                timeByMS
            ]));
        }

    }, [isSplit]);

    return (
        <div className={clsx(style.Results)}>
            <ul className={clsx(style.ResultsList)}>
                {listSplitTime.map((splitTime, index, splitTimeArray) => (
                    <li key={index} className={clsx(style.ResultsItem, {
                        [style.ResultsItemHighlight]: index % 2 === 0, //index is ends
                    })}>
                        <span className={clsx(style.Ordinal)}>{index + 1}</span>
                        <span className={clsx(style.SlipTotal)}>{formatTime(splitTime)}</span>
                        <span className={clsx(style.SlipTime)}>+{formatTime(
                            splitTime - (splitTimeArray[index - 1] ? splitTimeArray[index - 1] : 0)
                        )}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
});

const Box = memo(() => {
    return (
        <div className={clsx(style.Box)}>
            <Control />
            <Results />
        </div>
    )
});

function StopWatch() {
    const [time, setTime] = useState({ minutes: 0, seconds: 0, microseconds: 0 });
    const [isSplit, setIsSplit] = useState(false);
    const [listSplitTime, setListSplitTime] = useState([]);

    return (
        <Context.Provider value={{ time, setTime, isSplit, setIsSplit, listSplitTime, setListSplitTime }}>
            <div className={clsx(style.StopWatch)}>
                <Clock />
                <Box />
            </div>
        </Context.Provider>
    );
}

export default StopWatch;