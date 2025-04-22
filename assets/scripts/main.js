// Constants
const PHASE_BLOCKS = [
  [15, 45, 30, 45],
  [15, 90, 15, 90, 15, 45],
  [15, 90, 15, 45],
  [15, 30, 30, 90, 30, 30, 45],
  [15, 90]
];
const MINUTES_IN_DAY = 1440;
const INITIAL_TIME = '07:00';
const INITIAL_OFFSET_MINUTES = PHASE_BLOCKS[0][0] + PHASE_BLOCKS[0][1];

// DOM Elements
const startTimeInput = document.querySelector('#start-time');
const nowButton = document.querySelector('#now-btn');
const blockTimeRanges = document.querySelectorAll('.block-time-range');

// Helper Functions

/**
 * Formats total minutes as "HH:MM".
 * @param {number} totalMinutes - Total minutes.
 * @returns {string} - Formatted time string.
 */
const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Parses an "HH:MM" string into total minutes since midnight.
 * @param {string} timeString - Time string in "HH:MM" format.
 * @returns {number} - Total minutes since midnight.
 */
const parseTimeStringToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) throw new Error(`Invalid time: "${timeString}"`);
  return hours * 60 + minutes;
};

// Main Functionality

/**
 * Updates the time ranges for each block in the schedule.
 * @param {string} startTimeString - The start time of the solar exposure (HH:MM).
 */
const updateBlockTimings = (startTimeString) => {
  if (!startTimeString) return;

  const scheduleStartMinutes = parseTimeStringToMinutes(startTimeString) - INITIAL_OFFSET_MINUTES;
  let currentMinutes = scheduleStartMinutes < 0 ? scheduleStartMinutes + MINUTES_IN_DAY : scheduleStartMinutes;
  let blockIndex = 0;
  const allBlocks = PHASE_BLOCKS.flat(); // Combine all blocks into a single array

  // Calculate the total duration of the blocks provided in the array
  const providedDuration = allBlocks.reduce((sum, duration) => sum + duration, 0);

  // Calculate the duration of the last implicit block to fill the 24 hours
  const lastBlockDuration = MINUTES_IN_DAY - providedDuration;

  const updatedBlocks = [...allBlocks, lastBlockDuration]; // Add the implicit last block

  for (const duration of updatedBlocks) {
    const startTime = currentMinutes;
    currentMinutes = (currentMinutes + duration) % MINUTES_IN_DAY;
    if (blockTimeRanges[blockIndex]) {
      blockTimeRanges[blockIndex].textContent = `${formatTime(startTime)} às ${formatTime(currentMinutes)}`;
    }
    blockIndex++;
  }
};

/**
 * Sets the time input to the current time and updates the schedule.
 */
const setNow = () => {
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  startTimeInput.value = formatTime(currentTotalMinutes);
  updateBlockTimings(startTimeInput.value);
};

// Event Listeners
startTimeInput.addEventListener('change', () => updateBlockTimings(startTimeInput.value));
nowButton.addEventListener('click', setNow);

// Initialization
startTimeInput.value = INITIAL_TIME;
updateBlockTimings(INITIAL_TIME);
