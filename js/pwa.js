var cacheName = 'version-1.03';
let newServiceWorker;
let updateBar = document.getElementById('update');
let otherUpdateBar = document.getElementById('otherUpdate');

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var versionCheck = "";

setInterval(function(){
    readTextFile("version.json?rand=" + (Date.now()), function(text){
        var data = JSON.parse(text);
        versionCheck = data[0].version;

        if(versionCheck !== cacheName){
            console.log(versionCheck + " - Update found");
            otherUpdateBar.className = 'on';
        }
        else{
            console.log(versionCheck + " - No update found");
        }
    });
},1000*60); //Update check every 1 min

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

// Click ebvent for Update Bar
otherUpdateBar.addEventListener('click', function(){
    window.location.reload();
    refreshing = true;
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
