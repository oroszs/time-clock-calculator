window.onload = () => {
    initialize();
}

const initialize = () => {
    let str = getSettings();
    if(str) applySettings(str);
    calculateTime();
    setTriggers();
}

const getSettings = () => {
    let str = localStorage.getItem("daysOffStr");
    if(!str) {
        daysOffModal();
    }
    return str;
}

const daysOffModal = () => {
    window.scrollTo(0,0);
    document.body.style.overflow = "hidden";
    let modalWrapper = document.querySelector('.modal-wrapper');
    modalWrapper.className = 'modal-wrapper';
}

const saveSettings = (str) => {
    localStorage.setItem("daysOffStr", str);
}

const applySettings = (str) => {
    let days = document.querySelectorAll('.day-wrapper');
    for (let i = 0; i < days.length; i++) {
        if(str[i] === 'x') {
            days[i].className = "day-wrapper weekend";
        } else {
            days[i].className = 'day-wrapper';
        }
    }
    let buts = document.querySelectorAll('.days-off-day-button');
    for(let i = 0; i < buts.length; i++) {
        str[i] === 'x' ? buts[i].className = 'days-off-day-button button off' : buts[i].className = 'days-off-day-button button';
    }
    calculateTime();
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
    let wfhHoursInput = document.querySelector('#wfhHours');
    let wfhHours = parseInt(wfhHoursInput.value);
    let wfhMinutesInput = document.querySelector('#wfhMinutes');
    let wfhMinutes = parseFloat(wfhMinutesInput.value);
    wfhHours += (wfhMinutes / 60);
    totalHours += wfhHours;
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
    let timeInputs = document.querySelectorAll('input[type="time"]');
    let wfhEl = document.querySelector('#from-home-wrapper');
    let wfhInputs = wfhEl.querySelectorAll('input[type="number"]');
    let inputs = [];
    timeInputs.forEach(tI => inputs.push(tI));
    wfhInputs.forEach(wfhI => inputs.push(wfhI));
    inputs.forEach(input => {
        input.onchange = () => {
            calculateTime();
        }
    });
    let daysOffButtons = document.querySelectorAll('.days-off-day-button');
    daysOffButtons.forEach(but => {
        but.addEventListener('click', () => {
            but.classList.toggle('off');
        });
    });
    let confirm = document.querySelector('.confirm-button');
    confirm.addEventListener('click', () => {
        let buts = document.querySelectorAll('.days-off-day-button');
        let str = '';
        for(let i = 0; i < buts.length; i++) {
            buts[i].classList.contains('off') ? str += 'x' : str += 'o';
        }
        applySettings(str);
        saveSettings(str);
        let wrapper = document.querySelector('.modal-wrapper');
        wrapper.className = 'modal-wrapper hide-element';
        document.body.style.overflow = 'auto';
    });
    let daysOffButton = document.querySelector('#days-off-wrapper');
    daysOffButton.addEventListener('click', () => {
        daysOffModal();
    });
}