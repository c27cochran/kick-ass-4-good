cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-facebookads/www/FacebookAds.js",
        "id": "cordova-plugin-facebookads.FacebookAds",
        "pluginId": "cordova-plugin-facebookads",
        "clobbers": [
            "window.FacebookAds"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-extension": "1.5.1",
    "cordova-facebook-audnet-sdk": "4.7.0",
    "cordova-plugin-facebookads": "4.7.4",
    "cordova-plugin-whitelist": "1.2.2"
}
// BOTTOM OF METADATA
});