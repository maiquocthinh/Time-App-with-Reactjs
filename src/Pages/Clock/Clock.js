import clsx from 'clsx';
import { useEffect, useState, memo } from 'react';
import style from './Clock.module.css';


const DaysComponent = memo(({ day }) => {
    const currentDayIndex = day;
    const arrDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return (
        <div className={clsx(style.Days)}>
            {arrDays.map((day, index) => (
                <div key={index} className={clsx(style.Digital, style.Day, {
                    [style.DayActive]: index === currentDayIndex,
                })}>
                    <span>{day}</span>
                </div>
            ))}
        </div>
    )
})
const ClockComponent = memo(({ hour, minute, second, session }) => {
    return (
        <div className={clsx(style.Clock)}>
            <div className={clsx(style.Time)}>
                <div className={clsx(style.Digital, style.TimeItem)}>{hour}</div>
                <div className={clsx(style.Digital, style.TimeItem)}>{minute}</div>
                <div className={clsx(style.Digital, style.TimeItem)}>{second}</div>
            </div>
            <div className={clsx(style.AmPm)}>
                <span className={clsx(style.Digital, style.AmPmItem, { 'd-none': session !== 'AM' })} >AM</span>
                <span className={clsx(style.Digital, style.AmPmItem, { 'd-none': session !== 'PM' })} >PM</span>
            </div>
        </div>
    )
})
const CalenderComponent = memo(({ date, month, year }) => {
    return (
        <div className={clsx(style.Calender)}>
            <div className={clsx(style.CalenderItem)}>
                <span className={clsx(style.CalenderHeader)}>DATE</span>
                <span className={clsx(style.CalenderBody, style.Digital)}>{date}</span>
            </div>
            <div className={clsx(style.CalenderItem)}>
                <span className={clsx(style.CalenderHeader)}>MONTH</span>
                <span className={clsx(style.CalenderBody, style.Digital)}>{month}</span>
            </div>
            <div className={clsx(style.CalenderItem)}>
                <span className={clsx(style.CalenderHeader)}>YEAR</span>
                <span className={clsx(style.CalenderBody, style.Digital)}>{year}</span>
            </div>
        </div>
    )
})

function Clock() {

    const getCurrentTime = () => {
        const dateOject = new Date();
        const day = dateOject.getDay(); // 0 - 6 (0: SUN, 1-6:MON-SAT )
        let date = dateOject.getDate(); // 1 - 31
        let month = dateOject.getMonth(); // 0 - 11
        const year = dateOject.getFullYear() // yyyy
        let hour = dateOject.getHours(); // 0 - 23
        let minute = dateOject.getMinutes(); // 0 - 59
        let second = dateOject.getSeconds(); // 0 - 59
        let session = "AM";

        if (hour == 0) {
            hour = 12;
        }
        if (hour > 12) {
            hour = hour - 12;
            session = "PM";
        }

        date = (date < 10) ? "0" + date : date;
        month = (month < 10) ? "0" + (month + 1) : (month + 1);
        hour = (hour < 10) ? "0" + hour : hour;
        minute = (minute < 10) ? "0" + minute : minute;
        second = (second < 10) ? "0" + second : second;

        return { day, date, month, year, hour, minute, second, session }
    };

    let { day, date, month, year, hour, minute, second, session } = getCurrentTime();

    const [reset, setReset] = useState();

    useEffect(() => {
        const interval = setInterval(() => {
            setReset(Math.random);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className={clsx(style.MyClock)}>
            <div className={clsx(style.MyClockWrap)}>
                <DaysComponent day={day} />
                <ClockComponent hour={hour} minute={minute} second={second} session={session} />
                <CalenderComponent date={date} month={month} year={year} />
            </div>
        </div>
    );
}

export default Clock;