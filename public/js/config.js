var MediLab = MediLab || {};

MediLab.config = {
    apiBaseUrl: location.origin + '/api'
};

// https://stackoverflow.com/questions/17215981/always-call-json-stringify-on-post-data-for-jquery-ajax
$.ajaxPrefilter('json', function(options, originalOptions) {
    options = options || {};
    options.data = JSON.stringify(originalOptions.data || null);
    options.contentType = 'application/json';
});