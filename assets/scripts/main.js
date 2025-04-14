const schedule = [
  [40, 20, 20],
  [10, 10, 20, 80, 20, 80, 20, 40],
  [10, 20, 80, 20, 80, 20, 10],
  [10, 10, 20, 80, 20, 40],
  [10, 80, 570]
];

const startTimeInput = document.querySelector('#start-time');
const nowBtn = document.querySelector('#now-btn');
const schedulePhases = document.querySelectorAll('.schedule-phase');
const scheduleItems = document.querySelectorAll('.schedule-item');

const pad = n => String(n).padStart(2, '0');
const formatTime = (h, m) => `${pad(h)}:${pad(m)}`;

function getSchedule(startTime) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const result = [];
  let hour = startHour;
  let minute = startMinute - 40;

  if (minute < 0) {
    minute = 60 + minute;
    hour--;
  }

  for (const duration of schedule) {
    const sum = duration.reduce((a, b) => a + b, 0); 
    result.push([hour, minute]);
    hour += Math.floor(sum / 60);
    minute += sum % 60;

    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute %= 60;
    }

    while (hour >= 24) hour -= 24;
  }

  return result;
}

function renderSchedule(startTime) {
  if (!startTime) return;

  const scheduleData = getSchedule(startTime);
  schedulePhases.textContent = '';

  let i = 0;
  scheduleData.forEach(([hour, minute]) => {
    schedulePhases[i].textContent = `${formatTime(hour, minute)}`;
    i++;
  });
}

function setNow() {
  const now = new Date();
  const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  startTimeInput.value = nowStr;
  renderSchedule(nowStr);
}

startTimeInput.addEventListener('change', () => renderSchedule(startTimeInput.value));
nowBtn.addEventListener('click', setNow);

startTimeInput.value = '07:20';
renderSchedule('07:20');
