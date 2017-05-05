var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { 
    admobid = { // for Android
        banner: 'ca-app-pub-8584512937602694/9388629169',
        interstitial: 'ca-app-pub-6869992474017983/1657046752'
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: 'ca-app-pub-8584512937602694/9388629169',
        native: 'ca-app-pub-8584512937602694/4369673569',
        interstitial: 'ca-app-pub-6869992474017983/7563979554'
    };
} else {
    admobid = { // for Windows Phone
        banner: 'ca-app-pub-8584512937602694/9388629169',
        interstitial: 'ca-app-pub-6869992474017983/1355127956'
    };
}

if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
    document.addEventListener('deviceready', initApp, false);
} else {
    initApp();
}

function initApp() {
    if (! AdMob ) { alert( 'admob plugin not ready' ); return; }

    // AdMob.createBanner( {
    //     adId: admobid.banner, 
    //     isTesting: false,
    //     overlap: false, 
    //     offsetTopBar: false, 
    //     position: AdMob.AD_POSITION.BOTTOM_CENTER,
    // } );
    
    // AdMob.prepareInterstitial({
    //     adId: admobid.interstitial,
    //     autoShow: true
    // });
}
