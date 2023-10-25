(function () {
    'use strict';

    const adKeywords = [
        'ad',
        'adsby',
        'google_ads',
        'doubleclick',
        'ad-banner',
        'ad-container',
        'ad-slot',
        'ad-wrapper',
        'textads',
        'banner-ads',
        'banner_ads',
        'ad-unit',
        'afs_ads',
        'ad-zone',
        'ad-space',
        'adsbox'
    ];

    function removeAds() {
        const elements = document.getElementsByTagName('*');

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            for (const keyword of adKeywords) {
                if (
                    element.id &&
                    element.id.toLowerCase().includes(keyword) ||
                    element.className &&
                    element.className.toLowerCase().includes(keyword)
                ) {
                    console.log('Ad detected and removed:', element);
                    // Remove the detected ad element
                    element.parentNode.removeChild(element);
                }
            }
        }
    }

    window.addEventListener('load', removeAds);
})();