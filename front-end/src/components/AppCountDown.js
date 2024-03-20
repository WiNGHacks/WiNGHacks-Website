import React, { useState, useEffect } from 'react';

const AppCountDown = () => {

    const calculateTimeLeft = () => {
        const deadlineDate = new Date("April 5, 2024 17:00:00").getTime();
        const now = new Date().getTime();
        const distance = deadlineDate - now;

        if (distance <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="countdown-container">
            <div className="countdown-row">
                <div className="countdown-text">
                    Hackathon starts in:
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.days}</span>
                    <div className="countdown-label">Days</div>
                </div>
                <span className="colon">:</span>
                <div className="countdown-item">
                    <span>{timeLeft.hours}</span>
                    <div className="countdown-label">Hours</div>
                </div>
                <span className="colon">:</span>
                <div className="countdown-item">
                    <span>{timeLeft.minutes}</span>
                    <div className="countdown-label">Mins</div>
                </div>
                <span className="colon">:</span>
                <div className="countdown-item">
                    <span>{timeLeft.seconds}</span>
                    <div className="countdown-label">Secs</div>
                </div>
            </div>
        </div>
    // <div>
    //     Applications close in:&nbsp;
    //     {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s


    // </div>
    )
}

export default AppCountDown