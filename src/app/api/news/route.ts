
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'education';
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'News API key is not configured.' }, { status: 500 });
    }
    
    // More specific queries based on category for Bengali news
    let query;
    switch(category) {
        case 'ssc':
            query = 'এসএসসি OR দাখিল';
            break;
        case 'hsc':
            query = 'এইচএসসি OR আলিম';
            break;
        case 'admission':
            query = 'বিশ্ববিদ্যালয় ভর্তি OR কলেজ ভর্তি';
            break;
        case 'jobs':
            query = 'চাকরির খবর OR নিয়োগ বিজ্ঞপ্তি';
            break;
        case 'exam':
            query = 'পরীক্ষা OR পরীক্ষার রুটিন';
            break;
        case 'all':
        default:
            query = 'শিক্ষা';
            break;
    }

    const domains = [
        'bdnews24.com',
        'prothomalo.com',
        'banglatribune.com',
        'jugantor.com',
        'kalerkantho.com',
        'somoynews.tv',
        'ittefaq.com.bd',
        'tbsnews.net',
        'dhakatribune.com',
        'thedailystar.net'
    ].join(',');

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&sortBy=publishedAt&language=bn&pageSize=6&apiKey=${apiKey}`;

    try {
        const newsResponse = await fetch(url, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        const newsData = await newsResponse.json();

        if (newsData.status !== 'ok') {
            return NextResponse.json({ error: newsData.message || 'Failed to fetch news.' }, { status: 500 });
        }

        return NextResponse.json(newsData.articles);
    } catch (error) {
        console.error('News API fetch error:', error);
        return NextResponse.json({ error: 'Failed to connect to news source.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';

    