window.onload = () => {
    initialize();
}

const initialize = () => {
    calculateTime();
    setTriggers();
}

const calculateTime = () => {
    let days = document.querySelectorAll('.day-wrapper');
    days.forEach(day => {
        if(!day.classList.contains('weekend')) {
            let shiftStart = day.querySelector('.shift-start');
            let mealStart = day.querySelector('.meal-start');
            let mealEnd = day.querySelector('.meal-end');
            let shiftEnd = day.querySelector('.shift-end');
            let hours, milliseconds;
            let today = new Date();
            if(mealStart && mealEnd) {
                let shiftStartDate = new Date(today.toDateString() + ' ' + shiftStart.value);
                let mealStartDate = new Date(today.toDateString() + ' ' + mealStart.value);
                let mealEndDate = new Date(today.toDateString() + ' ' + mealEnd.value);
                let shiftEndDate = new Date(today.toDateString() + ' ' + shiftEnd.value);
                milliseconds = (mealStartDate - shiftStartDate) + (shiftEndDate - mealEndDate);
            } else {
                let shiftStartDate = new Date(today.toDateString() + ' ' + shiftStart.value);
                let shiftEndDate = new Date(today.toDateString() + ' ' + shiftEnd.value);
                milliseconds = shiftEndDate - shiftStartDate;
            }
            hours = Math.round(milliseconds / 10 / 60 / 60) / 100;
            let hoursElement = day.querySelector('.hours');
            hoursElement.textContent = `${hours} Hours`;
        } else {
            day.querySelector('.hours').textContent = 'Day Off';
        }
    });
    let dailyHours = document.querySelectorAll('.hours');
    let totalHours = 0;
    dailyHours.forEach(hourDay => {
        let hourString = hourDay.textContent;
        let splitString = hourString.split(' ');
        let dayHours = 0;
        if(splitString[0] !== 'Day') dayHours = splitString[0];
        totalHours += parseFloat(dayHours);
    });
    let weeklyHours = 0;
    let otHours = 0;
    if(totalHours > 40) {
        otHours = totalHours - 40;
        weeklyHours = 40;
    } else {
        weeklyHours = totalHours;
    }
    let roundedWeekly = Math.round(weeklyHours * 100) / 100;
    let roundedOt = Math.round(otHours * 100) / 100;
    let weeklyHourEl = document.querySelector('#weekly-hours');
    let otHoursEl = document.querySelector('#overtime-hours');
    weeklyHourEl.textContent = `Standard Hours: ${roundedWeekly}`;
    otHours > 0 ? otHoursEl.textContent = `Overtime Hours: ${roundedOt}` : otHoursEl.textContent = `Overtime Hours: 0`;
}

const setTriggers = () => {
    let inputs = document.querySelectorAll('input[type="time"]');
    inputs.forEach(input => {
        input.onchange = () => {
            calculateTime();
        }
    });
}