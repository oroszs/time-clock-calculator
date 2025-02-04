window.onload = () => {
    initialize();
}

const initialize = () => {
    let obj = getSettings();
    if(obj.daysOff) applySettings('daysOff', obj.daysOff);
    if(obj.pay) applySettings('pay', obj.pay);
    calculate();
    setTriggers();
}

const getSettings = () => {
    let settingsObj = {daysOff : null, pay : null};
    settingsObj.daysOff = localStorage.getItem("daysOff");
    settingsObj.pay = parseFloat(localStorage.getItem('pay'));
    if(!settingsObj.daysOff) {
        showModal('daysOff');
    }
    return settingsObj;
}

const saveSettings = (dataString, data) => {
    localStorage.setItem(dataString, data);
}

const applySettings = (dataString, data) => {
    if(dataString == 'daysOff'){
        let days = document.querySelectorAll('.day-wrapper');
        let str = data;
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
    }
    if(dataString == 'pay') {
        let payHolder = document.querySelector('#pay-data');
        payHolder.value = data;
    }
}

const showModal = (modalString) => {
    window.scrollTo(0,0);
    document.body.style.overflow = "hidden";
    let modalWrapper = document.querySelector('.modal-wrapper');
    modalWrapper.className = 'modal-wrapper';
    if(modalString == 'daysOff') {
        let daysOffModal = document.querySelector('#days-off-modal');
        daysOffModal.className = 'modal';
    } else {
        let payModal = document.querySelector('#pay-modal');
        let payHolder = document.querySelector('#pay-data');
        let payInput = document.querySelector('#pay-input');
        let payRemove = document.querySelector('#pay-remove');
        if(payHolder.value) {
            payInput.value = payHolder.value;
            payRemove.className = 'button modal-button menu-element';
        } else {
            payRemove.className = 'button modal-button menu-element hide-element';
        }
        payModal.className = 'modal';
    }
}

const incrementTime = (timeEl, incString) => {
    let [hours, minutes] = timeEl.value.split(':').map(Number);
    let tempDate = new Date();
    tempDate.setHours(hours, minutes, 0, 0);
    incString == 'plus' ? tempDate.setMinutes(tempDate.getMinutes() + 1) : tempDate.setMinutes(tempDate.getMinutes() - 1);
    const newTimeString = tempDate.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    timeEl.value = newTimeString;
}

const calculate = () => {
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
    let payHolder = document.querySelector('#pay-data');
    let weeklyPayHolder = document.querySelector('#weekly-pay-wrapper');
    let totalPayHolder = document.querySelector('#total-pay');
    let estimateHolder = document.querySelector('#estimated-pay');
    if(payHolder.value) {
        let hourly = payHolder.value;
        let hourlyOT = hourly * 1.5;
        weeklyPayHolder.className = 'menu-element';
        let standardTotal, overTimeTotal;
        standardTotal = hourly * roundedWeekly;
        overTimeTotal = hourlyOT * roundedOt;
        let totalPay = (standardTotal + overTimeTotal).toFixed(2);
        let lowEstimate = (totalPay * .74).toFixed(2);
        let highEstimate = (totalPay * .76).toFixed(2);
        totalPayHolder.textContent = `Total Gross: $${totalPay}`;
        estimateHolder.textContent = `Estimated Net: ~$${lowEstimate} - $${highEstimate}`;
    } else {
        weeklyPayHolder.className = 'menu-element hide-element';
        totalPayHolder.textContent = '';
        estimateHolder.textContent = '';
    }
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
            calculate();
        }
    });
    let minusButtons = document.querySelectorAll('.minus-time');
    let plusButtons = document.querySelectorAll('.plus-time');
    minusButtons.forEach(but => {
        but.addEventListener('click', () => {
            let timeWrap = but.closest('.time-div');
            incrementTime(timeWrap.querySelector('input[type="time"]'), 'minus');
            calculate();
        });
    });
    plusButtons.forEach(but => {
        but.addEventListener('click', () => {
            let timeWrap = but.closest('.time-div');
            incrementTime(timeWrap.querySelector('input[type="time"]'), 'plus');
            calculate();
        });
    });
    let settingsButton = document.querySelector('#settings-button');
    settingsButton.addEventListener('click', () => {
        let mainWrap = document.querySelector('#main-menu-wrapper');
        console.log(settingsButton, mainWrap);
        mainWrap.classList.toggle('hide-element');
    });
    let daysOffButtons = document.querySelectorAll('.days-off-day-button');
    daysOffButtons.forEach(but => {
        but.addEventListener('click', () => {
            but.classList.toggle('off');
        });
    });
    let daysOffConfirm = document.querySelector('#days-off-confirm');
    daysOffConfirm.addEventListener('click', () => {
        let buts = document.querySelectorAll('.days-off-day-button');
        let str = '';
        for(let i = 0; i < buts.length; i++) {
            buts[i].classList.contains('off') ? str += 'x' : str += 'o';
        }
        applySettings('daysOff', str);
        saveSettings('daysOff', str);
        calculate();
        hideModal('daysOff');
    });
    let payConfirm = document.querySelector('#pay-confirm');
    payConfirm.addEventListener('click', () => {
        let payNum = parseFloat(document.querySelector('#pay-input').value);
        if(payNum > 0 && typeof payNum == 'number') {
            applySettings('pay', payNum);
            saveSettings('pay', payNum);
            calculate();
            hideModal('pay');
        }
        else{
            applySettings('pay', null);
            saveSettings('pay', null);
            calculate();
            hideModal('pay');
        }
    });
    let payRemove = document.querySelector('#pay-remove');
    payRemove.addEventListener('click', () => {
        applySettings('pay', null);
        saveSettings('pay', null);
        calculate();
        hideModal('pay');
    });
    let daysOffButton = document.querySelector('#days-off-wrapper');
    daysOffButton.addEventListener('click', () => {
        showModal('daysOff');
    });
    let payButton = document.querySelector('#pay-wrapper');
    payButton.addEventListener('click', () => {
        showModal('pay');
    });
    let photoButton = document.querySelector('#photo-upload-wrapper');
    photoButton.addEventListener('click', () => {
        showModal('photo');
    });

    const hideModal = (modalString) => {
        let wrapper = document.querySelector('.modal-wrapper');
        wrapper.className = 'modal-wrapper hide-element';
        document.body.style.overflow = 'auto';
        if(modalString == 'daysOff') {
            let daysOffModal = document.querySelector('#days-off-modal');
            daysOffModal.className = 'modal hide-element';
        } else {
            let payModal = document.querySelector('#pay-modal');
            payModal.className = 'modal hide-element';
        }
    }
}