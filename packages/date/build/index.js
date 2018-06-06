'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.moment = undefined;
exports.setSettings = setSettings;
exports.getSettings = getSettings;
exports.format = format;
exports.date = date;
exports.gmdate = gmdate;
exports.dateI18n = dateI18n;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-timezone');

require('moment-timezone/moment-timezone-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = {
	l10n: {
		locale: 'en_US',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		meridiem: { am: 'am', pm: 'pm', AM: 'AM', PM: 'PM' },
		relative: { future: ' % s from now', past: '% s ago' }
	},
	formats: {
		time: 'g: i a',
		date: 'F j, Y',
		datetime: 'F j, Y g: i a'
	},
	timezone: { offset: '0', string: '' }
};

/**
 * Adds a locale to moment, using the format supplied by `wp_localize_script()`.
 *
 * @param {Object} dateSettings Settings, including locale data.
 */
/**
 * External dependencies
 */
function setSettings(dateSettings) {
	settings = dateSettings;

	// Backup and restore current locale.
	var currentLocale = _moment2.default.locale();
	_moment2.default.updateLocale(dateSettings.l10n.locale, {
		// Inherit anything missing from the default locale.
		parentLocale: currentLocale,
		months: dateSettings.l10n.months,
		monthsShort: dateSettings.l10n.monthsShort,
		weekdays: dateSettings.l10n.weekdays,
		weekdaysShort: dateSettings.l10n.weekdaysShort,
		meridiem: function meridiem(hour, minute, isLowercase) {
			if (hour < 12) {
				return isLowercase ? dateSettings.l10n.meridiem.am : dateSettings.l10n.meridiem.AM;
			}
			return isLowercase ? dateSettings.l10n.meridiem.pm : dateSettings.l10n.meridiem.PM;
		},

		longDateFormat: {
			LT: dateSettings.formats.time,
			LTS: null,
			L: null,
			LL: dateSettings.formats.date,
			LLL: dateSettings.formats.datetime,
			LLLL: null
		},
		// From human_time_diff?
		// Set to `(number, withoutSuffix, key, isFuture) => {}` instead.
		relativeTime: {
			future: dateSettings.l10n.relative.future,
			past: dateSettings.l10n.relative.past,
			s: 'seconds',
			m: 'a minute',
			mm: '%d minutes',
			h: 'an hour',
			hh: '%d hours',
			d: 'a day',
			dd: '%d days',
			M: 'a month',
			MM: '%d months',
			y: 'a year',
			yy: '%d years'
		}
	});
	_moment2.default.locale(currentLocale);

	setupWPTimezone();
}

/**
 * Returns the currently defined date settings.
 *
 * @return {Object} Settings, including locale data.
 */
function getSettings() {
	return settings;
}

function setupWPTimezone() {
	// Create WP timezone based off dateSettings.
	_moment2.default.tz.add(_moment2.default.tz.pack({
		name: 'WP',
		abbrs: ['WP'],
		untils: [null],
		offsets: [-settings.timezone.offset * 60 || 0]
	}));
}

// Create a new moment object which mirrors moment but includes
// the attached timezone, instead of setting a default timezone on
// the global moment object.
var moment = exports.moment = function moment() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return _moment2.default.tz.apply(_moment2.default, args.concat(['WP']));
};

// Date constants.
/**
 * Number of seconds in one minute.
 *
 * @type {Number}
 */
var MINUTE_IN_SECONDS = 60;
/**
 * Number of minutes in one hour.
 *
 * @type {Number}
 */
var HOUR_IN_MINUTES = 60;
/**
 * Number of seconds in one hour.
 *
 * @type {Number}
 */
var HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;

/**
 * Map of PHP formats to Moment.js formats.
 *
 * These are used internally by {@link wp.date.format}, and are either
 * a string representing the corresponding Moment.js format code, or a
 * function which returns the formatted string.
 *
 * This should only be used through {@link wp.date.format}, not
 * directly.
 *
 * @type {Object}
 */
var formatMap = {
	// Day
	d: 'DD',
	D: 'ddd',
	j: 'D',
	l: 'dddd',
	N: 'E',

	/**
  * Gets the ordinal suffix.
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	S: function S(momentDate) {
		// Do - D
		var num = momentDate.format('D');
		var withOrdinal = momentDate.format('Do');
		return withOrdinal.replace(num, '');
	},


	w: 'd',
	/**
  * Gets the day of the year (zero-indexed).
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	z: function z(momentDate) {
		// DDD - 1
		return '' + parseInt(momentDate.format('DDD'), 10) - 1;
	},


	// Week
	W: 'W',

	// Month
	F: 'MMMM',
	m: 'MM',
	M: 'MMM',
	n: 'M',
	/**
  * Gets the days in the month.
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	t: function t(momentDate) {
		return momentDate.daysInMonth();
	},


	// Year
	/**
  * Gets whether the current year is a leap year.
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	L: function L(momentDate) {
		return momentDate.isLeapYear() ? '1' : '0';
	},

	o: 'GGGG',
	Y: 'YYYY',
	y: 'YY',

	// Time
	a: 'a',
	A: 'A',
	/**
  * Gets the current time in Swatch Internet Time (.beats).
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	B: function B(momentDate) {
		var timezoned = (0, _moment2.default)(momentDate).utcOffset(60);
		var seconds = parseInt(timezoned.format('s'), 10),
		    minutes = parseInt(timezoned.format('m'), 10),
		    hours = parseInt(timezoned.format('H'), 10);
		return parseInt((seconds + minutes * MINUTE_IN_SECONDS + hours * HOUR_IN_SECONDS) / 86.4, 10);
	},

	g: 'h',
	G: 'H',
	h: 'hh',
	H: 'HH',
	i: 'mm',
	s: 'ss',
	u: 'SSSSSS',
	v: 'SSS',
	// Timezone
	e: 'zz',
	/**
  * Gets whether the timezone is in DST currently.
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	I: function I(momentDate) {
		return momentDate.isDST() ? '1' : '0';
	},

	O: 'ZZ',
	P: 'Z',
	T: 'z',
	/**
  * Gets the timezone offset in seconds.
  *
  * @param {moment} momentDate Moment instance.
  *
  * @return {string} Formatted date.
  */
	Z: function Z(momentDate) {
		// Timezone offset in seconds.
		var offset = momentDate.format('Z');
		var sign = offset[0] === '-' ? -1 : 1;
		var parts = offset.substring(1).split(':');
		return sign * (parts[0] * HOUR_IN_MINUTES + parts[1]) * MINUTE_IN_SECONDS;
	},

	// Full date/time
	c: 'YYYY-MM-DDTHH:mm:ssZ', // .toISOString
	r: 'ddd, D MMM YYYY HH:mm:ss ZZ',
	U: 'X'
};

/**
 * Formats a date. Does not alter the date's timezone.
 *
 * @param {string}                    dateFormat PHP-style formatting string.
 *                                               See php.net/date.
 * @param {(Date|string|moment|null)} dateValue  Date object or string,
 *                                               parsable by moment.js.
 *
 * @return {string} Formatted date.
 */
function format(dateFormat) {
	var dateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

	var i = void 0,
	    char = void 0;
	var newFormat = [];
	var momentDate = (0, _moment2.default)(dateValue);
	for (i = 0; i < dateFormat.length; i++) {
		char = dateFormat[i];
		// Is this an escape?
		if ('\\' === char) {
			// Add next character, then move on.
			i++;
			newFormat.push('[' + dateFormat[i] + ']');
			continue;
		}
		if (char in formatMap) {
			if (typeof formatMap[char] !== 'string') {
				// If the format is a function, call it.
				newFormat.push('[' + formatMap[char](momentDate) + ']');
			} else {
				// Otherwise, add as a formatting string.
				newFormat.push(formatMap[char]);
			}
		} else {
			newFormat.push('[' + char + ']');
		}
	}
	// Join with [] between to separate characters, and replace
	// unneeded separators with static text.
	newFormat = newFormat.join('[]');
	return momentDate.format(newFormat);
}

/**
 * Formats a date (like `date()` in PHP), in the site's timezone.
 *
 * @param {string}                    dateFormat PHP-style formatting string.
 *                                               See php.net/date.
 * @param {(Date|string|moment|null)} dateValue  Date object or string,
 *                                               parsable by moment.js.
 *
 * @return {string} Formatted date.
 */
function date(dateFormat) {
	var dateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

	var offset = settings.timezone.offset * HOUR_IN_MINUTES;
	var dateMoment = (0, _moment2.default)(dateValue).utcOffset(offset, true);
	return format(dateFormat, dateMoment);
}

/**
 * Formats a date (like `date()` in PHP), in the UTC timezone.
 *
 * @param {string}                    dateFormat PHP-style formatting string.
 *                                               See php.net/date.
 * @param {(Date|string|moment|null)} dateValue  Date object or string,
 *                                               parsable by moment.js.
 *
 * @return {string} Formatted date.
 */
function gmdate(dateFormat) {
	var dateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

	var dateMoment = (0, _moment2.default)(dateValue).utc();
	return format(dateFormat, dateMoment);
}

/**
 * Formats a date (like `dateI18n()` in PHP).
 *
 * @param {string}                    dateFormat PHP-style formatting string.
 *                                               See php.net/date.
 * @param {(Date|string|moment|null)} dateValue  Date object or string,
 *                                               parsable by moment.js.
 * @param {boolean}                   gmt        True for GMT/UTC, false for
 *                                               site's timezone.
 *
 * @return {string} Formatted date.
 */
function dateI18n(dateFormat) {
	var dateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
	var gmt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	// Defaults.
	var offset = gmt ? 0 : settings.timezone.offset * HOUR_IN_MINUTES;
	// Convert to moment object.
	var dateMoment = (0, _moment2.default)(dateValue).utcOffset(offset, true);

	// Set the locale.
	dateMoment.locale(settings.l10n.locale);
	// Format and return.
	return format(dateFormat, dateMoment);
}

setupWPTimezone();