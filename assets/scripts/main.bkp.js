// Duration of each activity block (in minutes) per phase.
// Each inner array represents one phase composed of time blocks.
const phaseBlocks = [
  [10, 40, 20, 40],
  [10, 10, 20, 80, 20, 80, 20, 40],
  [10, 20, 80, 20, 80, 20, 20],
  [10, 10, 20, 80, 20, 40],
  [10, 80, 530]
];

const sumPhaseBlocks = phaseBlocks.flat().reduce((sum, n) => sum + n, 0);

if (sumPhaseBlocks != 1440 ) throw new Error('Sum of activities doesn\'t fit');

const OFFSET_MINUTES = phaseBlocks[0][0] + phaseBlocks[0][1];
const MINUTES_IN_DAY = 1440;
const INITIAL_TIME = '07:00';

const startTimeInput = document.querySelector('#start-time');
const nowBtn = document.querySelector('#now-btn');
const phaseStartTimes = document.querySelectorAll('.phase-start-time');
const blockTimeRanges = document.querySelectorAll('.block-time-range');

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
 * Calculates the start times (in minutes) for each phase.
 */
function getPhaseStartTimes(startTimeStr) {
  let time = parseTimeString(startTimeStr) - OFFSET_MINUTES;
  if (time < 0) time += MINUTES_IN_DAY;

  return phaseBlocks.map(blocks => {
    const phaseStart = time;
    const total = blocks.reduce((sum, minutes) => sum + minutes, 0);
    time = (time + total) % MINUTES_IN_DAY;
    return phaseStart;
  });
}

/**
 * Updates both phase and block times in the DOM.
 */
function updateTimings(startTimeStr) {
  if (!startTimeStr) return;

  const phaseStarts = getPhaseStartTimes(startTimeStr);
  let time = phaseStarts[0];
  let blockIndex = 0;

  phaseBlocks.forEach((blocks, phaseIndex) => {
    const phaseTime = formatMinutesAsTime(phaseStarts[phaseIndex]);
    if (phaseStartTimes[phaseIndex]) {
      phaseStartTimes[phaseIndex].textContent = phaseTime;
    }

    blocks.forEach(duration => {
      const start = time;
      const end = (start + duration) % MINUTES_IN_DAY;
      if (blockTimeRanges[blockIndex]) {
        blockTimeRanges[blockIndex].textContent =
          `${formatMinutesAsTime(start)} às ${formatMinutesAsTime(end)}`;
      }
      time = end;
      blockIndex++;
    });
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
  updateTimings(nowStr);
}

// Event listeners
startTimeInput.addEventListener('change', () => updateTimings(startTimeInput.value));
nowBtn.addEventListener('click', setNow);

// Initial render
startTimeInput.value = INITIAL_TIME;
updateTimings(INITIAL_TIME);
