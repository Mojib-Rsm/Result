
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        adsbygoogle: { [key: string]: unknown }[];
    }
}

const Adsense = () => {
    const pathname = usePathname();

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, [pathname]);

    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
        return null;
    }

    return (
        <ins
            key={pathname}
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
