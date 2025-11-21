
'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: { [key: string]: unknown }[];
    }
}

const Adsense = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
        return null;
    }

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-slot="YOUR_AD_SLOT_ID" // Replace with your Ad Slot ID
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
};

export default Adsense;
