
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'education';
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'News API key is not configured.' }, { status: 500 });
    }
    
    // More specific queries based on category
    let query;
    switch(category) {
        case 'ssc':
            query = '"SSC" OR "Dakhil" AND "Bangladesh"';
            break;
        case 'hsc':
            query = '"HSC" OR "Alim" AND "Bangladesh"';
            break;
        case 'admission':
            query = '"University Admission" OR "College Admission" AND "Bangladesh"';
            break;
        case 'jobs':
            query = '"Job circular" OR "Recruitment" AND "Bangladesh"';
            break;
        case 'all':
        default:
            query = '"Education" AND "Bangladesh"';
            break;
    }


    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=6&apiKey=${apiKey}`;

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
