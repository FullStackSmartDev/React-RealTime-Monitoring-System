/**
 * Trailer status update
 */
export const TRAILER_STATE_UPDATE_INTERVAL = 10;
export const TRAILER_EVENTS_UPDATE_INTERVAL = 10;
// This will only update the UI, as it is pure and the network
// status depends on last login vs current time
export const TRAILER_NETWORK_AVIBILITY_UI_UPDATE = 10;

export const TRAILER_SORT_UPDATE_INTERVAL = 60;

/**
 * Trailer warning states
 */
// minimum speed under which we consider the trailer in warning state
export const TRAILER_MINIMUM_SPEED = 5;
// seconds after which we show "GPS position may have changed on Parking"
export const TRAILER_POSITION_WARNING_DELAY = 2000;
// seconds after which we show "No GPS for over 10 min" warning
export const TRAILER_SEEN_WARNING_DELAY = 600;

// Trailer sensor "last seen" refresh
export const TRAILER_SENSOR_REFRESH = 60;

// After how many seconds give up downloading image?
export const IMAGE_DOWNLOAD_TIMEOUT = 45;
export const VIDEO_DOWNLOAD_TIMEOUT = 300;

// What's New current version
export const WHATS_NEW_CURRENT_VERSION = 20200707;
