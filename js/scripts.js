let newServiceWorker;
let updateBar = document.getElementById('update');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            //New update update found
            newServiceWorker = reg.installing;
            newServiceWorker.addEventListener('statechange', () => {
                // Has network.state changed?
                switch (newServiceWorker.state) {
                    case 'installed':
                    if (navigator.serviceWorker.controller) {
                        // new update available, show Update Bar
                        updateBar.className = 'on';
                    }
                    // No update available
                    break;
                }
            });
        });
    });

    let refreshing;

    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

// Click ebvent for Update Bar
updateBar.addEventListener('click', function(){
    newServiceWorker.postMessage({ action: 'skipWaiting' });
});

// Prompt installation on IOS
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
}

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if(isIos() && !isInStandaloneMode()){
    alert("To install this Web app, click the [^] icon and select 'Add to homescreen' then 'Add'.");
}
