'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, Clipboard, ClipboardCheck } from 'lucide-react';
import { extractTextFromImage } from '@/ai/flows/image-to-text-flow';

export default function ImageToTextPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('ফাইলের আকার অবশ্যই 4MB এর কম হতে হবে।');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageDataUri(result);
        setExtractedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!imageDataUri) {
      setError('অনুগ্রহ করে প্রথমে একটি ছবি আপলোড করুন।');
      return;
    }
    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const result = await extractTextFromImage({ photoDataUri: imageDataUri });
      setExtractedText(result.text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'টেক্সট শনাক্ত করতে একটি ত্রুটি ঘটেছে।';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          ছবি থেকে লেখা শনাক্ত করুন
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          যেকোনো ছবি আপলোড করুন এবং সেকেন্ডের মধ্যে লেখা পান।
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>ছবি আপলোড করুন</CardTitle>
          <CardDescription>একটি ছবি ফাইল (JPG, PNG) নির্বাচন করুন। ফাইলের আকার 4MB এর কম হতে হবে।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>ত্রুটি</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <Input
                id="picture"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={isLoading}
              />
              {imagePreview && (
                <div className="relative border-2 border-dashed rounded-lg p-2">
                  <Image
                    src={imagePreview}
                    alt="Uploaded preview"
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-md object-contain max-h-64"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Button onClick={handleExtractText} disabled={!imageDataUri || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    শনাক্ত করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    লেখা শনাক্ত করুন
                  </>
                )}
              </Button>
               {extractedText && (
                <div className="relative">
                  <Textarea
                    readOnly
                    value={extractedText}
                    className="w-full min-h-[16rem] bg-muted/50 text-base"
                    placeholder="শনাক্ত করা লেখা এখানে দেখা যাবে..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyToClipboard}
                    className="absolute top-2 right-2 h-8 w-8"
                  >
                    {isCopied ? (
                        <ClipboardCheck className="h-5 w-5 text-green-600" />
                    ) : (
                        <Clipboard className="h-5 w-5" />
                    )}
                    <span className="sr-only">কপি করুন</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
