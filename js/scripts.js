const app = {
        init() {
            "serviceWorker" in navigator && window.addEventListener("load", function() {
                navigator.serviceWorker.register("sw.js").then(function(e) {
                    //
                }, function(e) {
                    //
                })
            }), this.checkIOS()
        },
        checkIOS() {
            const isIos = () => {
                const userAgent = window.navigator.userAgent.toLowerCase();
                return /iphone|ipad|ipod/.test( userAgent );
            }

            // Detects if device is in standalone mode
            const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

            // Checks if should display install popup notification:
            if (isIos() && !isInStandaloneMode()) {
                alert("To install this Web app, click the [^] icon and select 'Add to homescreen' then 'Add'.");
            }
        },
    };

app.init();
