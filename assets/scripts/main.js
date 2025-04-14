// Duration of each activity in minutes per phase of the schedule.
// Each inner array represents one schedule block (rendered to a .schedule-time element).
const schedule = [
  [40, 20, 20],
  [10, 10, 20, 80, 20, 80, 20, 40],
  [10, 20, 80, 20, 80, 20, 10],
  [10, 10, 20, 80, 20, 40],
  [10, 80, 570]
];

const OFFSET_MINUTES = 40;
const MINUTES_IN_DAY = 1440;

const startTimeInput = document.querySelector('#start-time');
const nowBtn = document.querySelector('#now-btn');
const scheduleTimes = document.querySelectorAll('.schedule-time');

/**
 * Pads a number to two digits.
 */
const pad = n => String(n).padStart(2, '0');

/**
 * Converts total minutes to HH:MM format.
 */
const formatMinutesAsTime = minutes => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${pad(h)}:${pad(m)}`;
};

/**
 * Parses a "HH:MM" string into total minutes from midnight.
 */
const parseTimeString = timeStr => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) throw new Error(`Invalid time: "${timeStr}"`);
  return hours * 60 + minutes;
};

/**
 * Returns start times (in minutes) for each schedule block.
 */
function getSchedule(startTimeStr) {
  let time = parseTimeString(startTimeStr) - OFFSET_MINUTES;
  if (time < 0) time += MINUTES_IN_DAY;

  return schedule.map(block => {
    const start = time;
    const total = block.reduce((sum, minutes) => sum + minutes, 0);
    time = (time + total) % MINUTES_IN_DAY;
    return start;
  });
}

/**
 * Renders schedule times into the corresponding DOM elements.
 */
function renderSchedule(startTimeStr) {
  if (!startTimeStr) return;

  const times = getSchedule(startTimeStr);
  times.forEach((minutes, i) => {
    const span = scheduleTimes[i];
    if (span) span.textContent = formatMinutesAsTime(minutes);
  });
}

/**
 * Sets current time in input and updates schedule.
 */
function setNow() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nowStr = formatMinutesAsTime(currentMinutes);
  startTimeInput.value = nowStr;
  renderSchedule(nowStr);
}

// Event listeners
startTimeInput.addEventListener('change', () => renderSchedule(startTimeInput.value));
nowBtn.addEventListener('click', setNow);

// Initial render
startTimeInput.value = '07:20';
renderSchedule('07:20');
