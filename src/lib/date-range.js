module.exports = DateRange

/**
 * 
 * @param {Date} start 
 * @param {Date} end 
 */
function DateRange(start, end) {
  if (!(this instanceof DateRange)) {
    return new DateRange(start, end)
  }

  if (start && start.start && start.end) {
    this.start = _parseDateTime(start.start);
    this.end = _parseDateTime(start.end); 
  }
  else if (Array.isArray(start)) {
    this.start = _parseDateTime(start[0]);
    this.end = _parseDateTime(start[1]); 
  }
  else {
    this.start = _parseDateTime(start);
    this.end = _parseDateTime(end);
  }
}

DateRange.prototype.isOverlap = function(dateRange) {
  if (this.start <= dateRange.start && dateRange.start < this.end) {
    return true
  }
  
  if (this.start < dateRange.end && dateRange.end <= this.end) {
    return true
  }

  if (dateRange.start <= this.start && this.end <= dateRange.end) {
    return true
  }

  return false;
}


DateRange.prototype.clone = function() {
  return new DateRange(this.start.getTime(), this.end.getTime())
}

DateRange.prototype.exclude = function(dateRange) {
  if (Array.isArray(dateRange)) {
    let result = [this.clone()]

    dateRange.forEach(v => {
      let tmp = [];

      result.forEach(r => {
        tmp = tmp.concat(r.exclude(v))
      })

      result = tmp;
    })

    return result;
  }

  if (!this.isOverlap(dateRange)) {
    return [this.clone()]
  }

  if (this.start < dateRange.start && dateRange.end < this.end) {
    return [
      new DateRange(this.start, dateRange.start),
      new DateRange(dateRange.end, this.end)
    ]
  }

  if (dateRange.start <= this.start && this.end <= dateRange.end) {
    return []
  }

  if (dateRange.start <= this.start && dateRange.end < this.end) {
    return [
      new DateRange(dateRange.end, this.end)
    ]
  }

  if (this.start < dateRange.start && this.end <= dateRange.end) {
    return [
      new DateRange(this.start, dateRange.start)
    ]
  }

  return []
}


/**
 * 
 * @param {number} period In Milliseconds
 */
DateRange.prototype.split = function(period, options) {
  const periods = []
  const round = options != null && options.round
  let current = new Date(this.start.getTime());

  while(round ? current <= this.end : current < this.end) {
    periods.push(current)
    current = new Date(current.getTime())
    current.setMilliseconds(period)
  }

  if (!round && current !== this.end) {
    periods.push(new Date(this.end.getTime()))
  }

  return periods;
}



function _parseDateTime(dateTime) {
  if (dateTime instanceof Date) {
    return dateTime
  }

  if (typeof dateTime === 'string' || typeof dateTime === 'number') {
    return new Date(dateTime)
  }
  
  return null;
}
