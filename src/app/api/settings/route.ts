
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// This is not a secure way to handle file writes in a real production app.
// This is for demonstration purposes in a controlled environment.
// A proper implementation would have robust validation and authentication.

const ALLOWED_FILES = ['ads.txt'];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename || !ALLOWED_FILES.includes(filename)) {
        return NextResponse.json({ error: 'Invalid or missing file parameter.' }, { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'public', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        return NextResponse.json({ content });
    } catch (error: any) {
        // If file doesn't exist, return empty content
        if (error.code === 'ENOENT') {
            return NextResponse.json({ content: '' });
        }
        console.error(`Error reading ${filename}:`, error);
        return NextResponse.json({ error: `Could not read file: ${filename}` }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { file, content } = body;

        if (!file || !ALLOWED_FILES.includes(file)) {
            return NextResponse.json({ error: 'Invalid or missing file parameter.' }, { status: 400 });
        }

        if (typeof content !== 'string') {
            return NextResponse.json({ error: 'Invalid content.' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', file);
        await fs.writeFile(filePath, content, 'utf-8');

        return NextResponse.json({ success: true, message: `${file} has been updated.` });

    } catch (error: any) {
        console.error(`Error writing to settings file:`, error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
