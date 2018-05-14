function determineTimezone() {
  var timezone = jstz.determine();
  var timezoneName = timezone.name();

  var $timezoneInput = document.getElementById('timezone-name');

  if ($timezoneInput) {
    $timezoneInput.value = timezoneName;
  }
}

ready(function() {
  determineTimezone()
})
