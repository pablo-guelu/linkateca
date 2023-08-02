
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.getFavicon === "favicon") {
        let faviconUrl = '';

        const icon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
        console.log(icon);
        if (icon instanceof HTMLLinkElement) {
            faviconUrl = new URL(icon.href, window.location as any).toString();
            sendResponse({ favicon: faviconUrl });
        } else {
            faviconUrl = `${window.location.origin}/favicon.ico`;
            sendResponse({ favicon: faviconUrl });
        }
        // Return true to indicate that the sendResponse function will be called asynchronously
        return true;
    }

});



