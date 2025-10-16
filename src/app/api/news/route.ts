
import { NextResponse } from 'next/server';
import xml2js from 'xml2js';

// Helper function to extract image URL from HTML content
function extractImageUrl(description: string): string | null {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = description.match(imgRegex);
    return match ? match[1] : null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'education';
    
    // We will use the provided RSS feed for all categories for now.
    // The category parameter can be used in the future to switch between different feeds.
    const url = 'https://gnewsbd24.com/category/%E0%A6%B6%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6-B7%E0%A6%BE/feed/';

    try {
        const rssResponse = await fetch(url, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!rssResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch RSS feed.' }, { status: 500 });
        }

        const xmlData = await rssResponse.text();
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);

        const items = result.rss.channel.item;
        if (!items) {
            return NextResponse.json([]);
        }

        const articles = (Array.isArray(items) ? items : [items]).map((item: any) => {
            const description = item.description || '';
            const imageUrl = extractImageUrl(description);
            // Clean up description by removing HTML tags for a plain text version
            const plainDescription = description.replace(/<[^>]*>?/gm, '');

            return {
                title: item.title,
                url: item.link,
                description: plainDescription,
                urlToImage: imageUrl,
                publishedAt: item.pubDate,
                source: { name: 'gnewsbd24.com' },
            };
        });

        return NextResponse.json(articles);

    } catch (error) {
        console.error('RSS Feed processing error:', error);
        return NextResponse.json({ error: 'Failed to process RSS feed.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
