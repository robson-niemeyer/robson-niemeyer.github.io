// Duration of each activity block (in minutes) per phase.
// Each inner array represents one phase composed of time blocks.
const phaseBlocks = [
  [15, 45, 30, 45],
  [15, 90, 15, 90, 15, 45],
  [15, 90, 15, 45],
  [15, 30, 30, 90, 30, 30, 45],
  [15, 90]
];

const MINUTES_IN_DAY = 1440;
const INITIAL_TIME = '07:00';

// Defines the initial offset based on the first two blocks of the first phase
const initialOffset = phaseBlocks[0][0] + phaseBlocks[0][1];

const startTimeInput = document.querySelector('#start-time');
const nowBtn = document.querySelector('#now-btn');
const phaseDurationElements = document.querySelectorAll('.phase-duration');
const blockTimeRanges = document.querySelectorAll('.block-time-range');

/**
 * Formats minutes to the "XhYY" format.
 * @param {number} minutes - Total minutes.
 * @returns {string} - Formatted string as "XhYY".
 */
const formatMinutesAsOffset = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${String(mins).padStart(2, '0')}`;
};

/**
 * Calculates the start offset of each phase in minutes from T0.
 * @param {string} startTimeStr - String representing the start time (HH:MM).
 * @returns {number[]} - Array with the start offsets of each phase.
 */
const getPhaseStartOffsets = (startTimeStr) => {
  const startTime = parseTimeString(startTimeStr) - initialOffset;
  let currentTime = startTime < 0 ? startTime + MINUTES_IN_DAY : startTime;
  const phaseOffsets = [];
  let durationAcc = -initialOffset;

  for (const blocks of phaseBlocks) {
    phaseOffsets.push(durationAcc);
    durationAcc += blocks.reduce((sum, minute) => sum + minute, 0);
  }

  return phaseOffsets;
};

/**
 * Updates the HTML elements with the start and end times of each phase.
 * @param {string} startTimeStr - String representing the start time (HH:MM).
 */
const updatePhaseStartTimes = (startTimeStr) => {
  if (!startTimeStr) return;

  const phaseOffsets = getPhaseStartOffsets(startTimeStr);

  phaseDurationElements.forEach((element, index) => {
    const startOffsetMinutes = phaseOffsets[index];
    const startTimeFormatted = startOffsetMinutes >= 0 ? `T<sub>0</sub>+${formatMinutesAsOffset(startOffsetMinutes)}` : `T<sub>0</sub>-${formatMinutesAsOffset(Math.abs(startOffsetMinutes))}`;

    let endTimeFormatted;
    if (index === phaseDurationElements.length - 1) {
      endTimeFormatted = `T<sub>0</sub>+${formatMinutesAsOffset(MINUTES_IN_DAY)}`;
    } else {
      const phaseDurationMinutes = phaseBlocks[index].reduce((sum, minute) => sum + minute, 0);
      const endOffsetMinutes = startOffsetMinutes + phaseDurationMinutes;
      endTimeFormatted = endOffsetMinutes >= 0 ? `T<sub>0</sub>+${formatMinutesAsOffset(endOffsetMinutes)}` : `T<sub>0</sub>-${formatMinutesAsOffset(Math.abs(endOffsetMinutes))}`;
    }

    element.innerHTML = `${startTimeFormatted} até ${endTimeFormatted}`;
  });
};

/**
 * Formats minutes to the "HH:MM" format.
 * @param {number} minutes - Total minutes.
 * @returns {string} - Formatted string as "HH:MM".
 */
const formatMinutesAsTime = (minutes) => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Converts an "HH:MM" string to total minutes since midnight.
 * @param {string} timeStr - String representing the time (HH:MM).
 * @returns {number} - Total minutes since midnight.
 */
const parseTimeString = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) throw new Error(`Invalid time: "${timeStr}"`);
  return hours * 60 + minutes;
};

/**
 * Updates the HTML elements with the time ranges of each block.
 * @param {string} startTimeStr - String representing the start time (HH:MM).
 */
const updateBlockTimeRanges = (startTimeStr) => {
  if (!startTimeStr) return;

  const scheduleStart = parseTimeString(startTimeStr) - initialOffset;
  let currentTime = scheduleStart < 0 ? scheduleStart + MINUTES_IN_DAY : scheduleStart;
  let blockIndex = 0;

  for (const blocks of phaseBlocks) {
    for (const duration of blocks) {
      const startTime = currentTime;
      currentTime = (currentTime + duration) % MINUTES_IN_DAY;
      if (blockTimeRanges[blockIndex]) {
        blockTimeRanges[blockIndex].textContent = `${formatMinutesAsTime(startTime)} às ${formatMinutesAsTime(currentTime)}`;
      }
      blockIndex++;
    }
  }
};

/**
 * Sets the current time in the time input and updates the times on the page.
 */
const setNow = () => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nowStr = formatMinutesAsTime(currentMinutes);
  startTimeInput.value = nowStr;
  updatePhaseStartTimes(nowStr);
  updateBlockTimeRanges(nowStr);
};

// Adds event listeners
startTimeInput.addEventListener('change', () => {
  updatePhaseStartTimes(startTimeInput.value);
  updateBlockTimeRanges(startTimeInput.value);
});
nowBtn.addEventListener('click', setNow);

// Initializes the times with the default initial time
startTimeInput.value = INITIAL_TIME;
updatePhaseStartTimes(INITIAL_TIME);
updateBlockTimeRanges(INITIAL_TIME);
