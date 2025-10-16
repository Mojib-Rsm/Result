'use client';

// This component is being deprecated in favor of /admin/career/add
// It is kept for routing compatibility but will not be actively used.
// All "post job" links should point to /admin/career/add

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function DeprecatedPostJobPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/career/add');
    }, [router]);

    return <Loading />
}
