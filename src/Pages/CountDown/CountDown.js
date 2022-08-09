import { useState, useRef, createContext, useContext, memo, useEffect } from 'react';
import clsx from 'clsx';
import style from './CountDown.module.css';


// Context of Component CountDown
const Context = createContext();

const Clock = memo(() => {
    const { time, isTimeout } = useContext(Context);

    return (
        <div className={clsx(style.Clock, { [style.TimeOut]: isTimeout })}>
            <div className={clsx(style.Time)}>
                <div className={clsx(style.Digital, style.TimeItem)}>{time.hours.toString().padStart(2, '0')}</div>
                <div className={clsx(style.Digital, style.TimeItem)}>{time.minutes.toString().padStart(2, '0')}</div>
                <div className={clsx(style.Digital, style.TimeItem)}>{time.seconds.toString().padStart(2, '0')}</div>
            </div>
        </div>
    );
});

const Control = memo(({ setEditMode }) => {
    const { setTime, timeCacheRef, setIsTimeout } = useContext(Context);
    const [isRuning, setIsRuning] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        if (isRuning) {
            intervalRef.current = setInterval(() => {
                console.log('interval');
                setTime(time => {
                    let timeBySeconds = time.seconds + time.minutes * 60 + time.hours * 60 * 60;
                    timeBySeconds--;
                    if (timeBySeconds > 0) {
                        return {
                            hours: Math.floor(timeBySeconds / 3600),
                            minutes: Math.floor(timeBySeconds % 3600 / 60),
                            seconds: timeBySeconds % 3600 % 60,
                        }
                    } else {
                        setIsTimeout(true);
                        clearInterval(intervalRef.current);
                        return { hours: 0, minutes: 0, seconds: 0 };
                    }
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef);
    }, [isRuning]);

    const gotoEditMode = () => {
        if (isRuning) handleToggleClick();
        setIsTimeout(false);
        setTime(timeCacheRef.current);
        setEditMode(true);
    };

    const handleToggleClick = () => {
        if (isRuning) {
            setIsRuning(false);
            clearInterval(intervalRef.current);
        } else {
            setIsRuning(true);
        }
    };

    const handleResetClick = () => {
        if (isRuning) handleToggleClick();
        setIsTimeout(false);
        setTime(timeCacheRef.current);
    }

    return (
        <div className={clsx(style.Control)}>
            <h2>Control Timer</h2>
            <div className={clsx(style.WrapBtn)}>
                <button
                    className={clsx(style.BtnToggle, {
                        [style.BtnToggleActive]: isRuning
                    })}
                    onClick={handleToggleClick}
                >
                    {isRuning ? 'Stop' : 'Play'}
                </button>
                <button
                    className={clsx(style.BtnReset)}
                    onClick={handleResetClick}
                >Reset</button>
                <button
                    className={clsx(style.BtnEdit)}
                    onClick={gotoEditMode}
                >Edit Timer</button>
            </div>
        </div>
    );
});

const Input = memo(({ setEditMode }) => {
    const { time, setTime, timeCacheRef } = useContext(Context);

    const handleSaveEdit = () => {
        timeCacheRef.current = { ...time };
        setEditMode(false);
    };

    const handleChangeInput = (e, type) => {
        const validateTime = (time, type) => {
            switch (type) {
                case 'hours':
                    if (time > 99)
                        return 99;
                    else if (isNaN(time) || (time < 0))
                        return 0;
                    else
                        return time;
                case 'minutes':
                    if (time > 59)
                        return 59;
                    else if (isNaN(time) || (time < 0))
                        return 0;
                    else
                        return time;
                case 'seconds':
                    if (time > 59)
                        return 59;
                    else if (isNaN(time) || (time < 0))
                        return 0;
                    else
                        return time;

            }
        };
        switch (type) {
            case 'hours':
                setTime({
                    ...time,
                    hours: validateTime(parseInt(e.target.value), 'hours')
                })
                break;
            case 'minutes':
                setTime({
                    ...time,
                    minutes: validateTime(parseInt(e.target.value), 'minutes')
                })
                break;
            case 'seconds':
                setTime({
                    ...time,
                    seconds: validateTime(parseInt(e.target.value), 'seconds')
                })
                break;
        }
    }

    return (
        <div className={clsx(style.Input)}>
            <h2>Edit Timer</h2>
            <div className={clsx(style.TimeSet)}>
                <div className={clsx(style.TimeSetItem)}>
                    <input type='number' placeholder='00' onChange={(e) => { handleChangeInput(e, 'hours') }} value={time.hours} />
                    <span>Hours</span>
                </div>
                <div className={clsx(style.TimeSetItem)}>
                    <input type='number' placeholder='00' onChange={(e) => { handleChangeInput(e, 'minutes') }} value={time.minutes} />
                    <span>Minutes</span>
                </div>
                <div className={clsx(style.TimeSetItem)}>
                    <input type='number' placeholder='00' onChange={(e) => { handleChangeInput(e, 'seconds') }} value={time.seconds} />
                    <span>Seconds</span>
                </div>
            </div>
            <button
                className={clsx(style.BtnSet)}
                onClick={handleSaveEdit}
            >Set</button>
        </div>
    );
});

const Box = memo(() => {
    const [editMode, setEditMode] = useState(true);

    return (
        <div className={clsx(style.Box)}>
            {
                editMode ?
                    <Input setEditMode={setEditMode} /> :
                    <Control setEditMode={setEditMode} />
            }
        </div>
    );
});

function CountDown() {

    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const timeCacheRef = useRef();
    const [isTimeout, setIsTimeout] = useState(false);
    return (
        <Context.Provider value={{ time, setTime, timeCacheRef, isTimeout, setIsTimeout }}>
            <div className={style.CountDown}>
                <Clock />
                <Box />
            </div>
        </Context.Provider>

    );
}

export default CountDown;