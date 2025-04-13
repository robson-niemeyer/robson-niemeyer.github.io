const startTimeInput = document.querySelector('#start-time');
const nowBtn = document.querySelector('#now-btn');
const scheduleTimes = document.querySelectorAll('.schedule-time');

const schedule = [
  [80],
  [280],
  [240],
  [180],
  [660]
];

function setNow() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  startTimeInput.value = defaultTime;
  renderSchedule(defaultTime);
}

function formatTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

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
    result.push([hour, minute]);
    hour += Math.floor(duration / 60);
    minute += duration % 60;

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
  scheduleTimes.textContent = '';

  let i = 0;
  scheduleData.forEach(([hour, minute]) => {
    scheduleTimes[i].textContent = `${formatTime(hour, minute)}`;
    i++;
  });
}

startTimeInput.addEventListener('change', () => {
  renderSchedule(startTimeInput.value);
});

nowBtn.addEventListener('click', setNow);
startTimeInput.value = '07:20';
