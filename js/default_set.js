//geo_config
var headlinesBorderColor = '#f60';
var researchBorderColor = '#0f0';
var softwareBorderColor = '#0ad';

var geo_config_default_set = {

    dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
    hideAntarctica: false,
    borderWidth: 1,
    borderOpacity: 1,
    borderColor: '#333',
    wrapAround:true,
    popupTemplate: function(geography, data) { //this function should just return a string
      return '<div class="hoverinfo">' + geography.properties.name + '</div>';
    },
    popupOnHover: true, //disable the popup while hovering
    highlightOnHover: true,
    highlightFillColor: 'url(#horizontal-stripe)',
    highlightBorderColor: 'rgba(250, 0, 0, 0.2)',
    highlightBorderWidth: 2,
    highlightBorderOpacity: 1
};

//fills
var fills_default_set = {
        RED:'rgba(255,0,0,0.2)',
        BLK:'rgba(0,0,0,0.2)',
        GRN:'rgba(0,255,0,0.2)',
        horizontalStripe: 'url(#horizontal-stripe)',
        verticalStripe: 'url(#vertical-stripe)',
        seeThrough: 'rgba(24,182,222,0.5)',
        defaultFill: '#222'
};
