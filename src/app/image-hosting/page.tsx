
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon, Loader2, Copy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { uploadImage } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  url?: string;
  error?: string;
}

export default function ImageHostingPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setFiles(prev => [...newFiles.filter(nf => !prev.some(pf => pf.file.name === nf.file.name)), ...prev]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/bmp': [],
      'image/webp': [],
    }
  });

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== fileName));
  };
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "সফল!", description: "লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে।" });
  };

  const handleUpload = async () => {
      setIsUploading(true);
      const filesToUpload = files.filter(f => !f.url && !f.error);

      const uploadPromises = filesToUpload.map(async (fileToUpload) => {
          const formData = new FormData();
          formData.append('source', fileToUpload.file);

          try {
              const result = await uploadImage(formData);
              if (result.url) {
                  setFiles(prev => prev.map(f => f.file.name === fileToUpload.file.name ? { ...f, url: result.url, progress: 100 } : f));
              } else {
                  throw new Error(result.error || 'Unknown upload error');
              }
          } catch (e: any) {
              setFiles(prev => prev.map(f => f.file.name === fileToUpload.file.name ? { ...f, error: e.message } : f));
          }
      });
      
      await Promise.all(uploadPromises);
      setIsUploading(false);
  }

  const uploadedFiles = files.filter(f => f.url);
  const filesInProgress = files.filter(f => !f.url && !f.error);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <Image src="https://www.oftern.com/images/logo-light.png" alt="Oftern Image Hosting Logo" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Oftern Image Hosting</h1>
        <p className="mt-2 text-lg text-muted-foreground">আপনার ছবি সহজে আপলোড এবং শেয়ার করার জন্য একটি দ্রুত ও নিরাপদ প্ল্যাটফর্ম।</p>
      </div>

      <Card className="mb-12">
        <CardContent className="p-6">
          <div {...getRootProps()} className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
                <UploadCloud className="h-16 w-16 text-muted-foreground" />
                <p className="text-lg font-medium">এখানে আপনার ছবি ড্র্যাগ ও ড্রপ করুন, অথবা ব্রাউজ করতে ক্লিক করুন</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, GIF, BMP, WEBP ফরম্যাট সাপোর্ট করে।</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {filesInProgress.length > 0 && (
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-bold">আপলোড প্রিভিউ</h2>
            {filesInProgress.map((uploadedFile, index) => (
              <Card key={index} className="flex items-center p-4 gap-4">
                 <Image src={uploadedFile.preview} alt={uploadedFile.file.name} width={80} height={80} className="rounded-md object-cover h-20 w-20" onLoad={() => URL.revokeObjectURL(uploadedFile.preview)} />
                 <div className="flex-1 space-y-2">
                    <p className="font-medium truncate">{uploadedFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadedFile.file.size / 1024).toFixed(2)} KB</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => removeFile(uploadedFile.file.name)}>
                    <X className="h-4 w-4" />
                 </Button>
              </Card>
            ))}
             <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> আপলোড হচ্ছে...</>
                ) : (
                  `এখনই ${filesInProgress.length}টি ছবি আপলোড করুন`
                )}
            </Button>
          </div>
      )}

      {uploadedFiles.length > 0 && (
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-bold">আপলোড সম্পন্ন</h2>
            {uploadedFiles.map((uploadedFile, index) => (
              <Card key={index} className="p-4">
                 <div className="flex items-center gap-4">
                    <Image src={uploadedFile.url!} alt={uploadedFile.file.name} width={80} height={80} className="rounded-md object-cover h-20 w-20" />
                     <div className="flex-1 space-y-2">
                        <div className="relative">
                            <Input readOnly value={uploadedFile.url} className="pr-10" />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard(uploadedFile.url!)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                 </div>
              </Card>
            ))}
          </div>
      )}

    </div>
  );
}
