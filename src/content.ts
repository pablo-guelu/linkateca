
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getFavicon === "favicon") {
        let faviconUrl = '';

        const icon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
        console.log(icon);
        if (icon instanceof HTMLLinkElement) {
            faviconUrl = new URL(icon.href, window.location as any).toString();
            console.log(faviconUrl);
        } else {
            faviconUrl = `${window.location.origin}/favicon.ico`;
            console.log(faviconUrl);
        }

        fetchFaviconAndConvertToBase64(faviconUrl).then(base64String => {
            const base64 = 'data:image/png;base64,' + base64String;
            sendResponse({ favicon64: base64 });
        }).catch(error => {
            console.error(error);
            sendResponse({ favicon: faviconUrl }); // Handle the error case and send an appropriate response
        });

        // Return true to indicate that the sendResponse function will be called asynchronously
        return true;
    }

});

    

async function fetchFaviconAndConvertToBase64(faviconUrl: string): Promise<string> {
    try {
        const response = await fetch(faviconUrl);
        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString()?.split(',')[1] || ''; // Extract the base64 string from the data URL
                resolve(base64String);
            };
            reader.onerror = () => {
                reject(new Error('Error while reading the image.'));
            };
            reader.readAsDataURL(blob);
        });
    } catch (error: any) {
        throw new Error('Error fetching or converting the favicon: ' + error.message);
    }
}



