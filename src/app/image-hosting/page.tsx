'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon, X, ShieldCheck, Server, Key, Code, Link as LinkIcon, FileText, Languages, UserCircle, EyeOff, Clock, Trash2, Palette, Users, Settings, AlertTriangle, Database, BarChart, FileCog, Bot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  url?: string;
  error?: string;
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function ImageHostingPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
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


  const uploadedFiles = files.filter(f => f.url);
  const filesInProgress = files.filter(f => !f.url && !f.error);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <Image src="https://img.bdedu.me/images/logo-light.png" alt="Image Hosting Logo" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">BD Edu Image Hosting</h1>
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
                 <Button variant="outline" className="mt-4" onClick={(e) => e.stopPropagation()}>ফাইল নির্বাচন করুন</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {files.length > 0 && (
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-bold">আপলোড প্রিভিউ</h2>
            {files.map((uploadedFile, index) => (
              <Card key={index} className="flex items-center p-4 gap-4">
                 <Image src={uploadedFile.preview} alt={uploadedFile.file.name} width={80} height={80} className="rounded-md object-cover h-20 w-20" onLoad={() => URL.revokeObjectURL(uploadedFile.preview)} />
                 <div className="flex-1 space-y-2">
                    <p className="font-medium truncate">{uploadedFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadedFile.file.size / 1024).toFixed(2)} KB</p>
                    {uploadedFile.progress > 0 && !uploadedFile.url && <Progress value={uploadedFile.progress} />}
                    {uploadedFile.url && <p className="text-sm text-green-600">আপলোড সম্পন্ন!</p>}
                    {uploadedFile.error && <p className="text-sm text-destructive">{uploadedFile.error}</p>}
                 </div>
                 {!uploadedFile.url && (
                    <Button variant="ghost" size="icon" onClick={() => removeFile(uploadedFile.file.name)}>
                        <X className="h-4 w-4" />
                    </Button>
                 )}
              </Card>
            ))}
             <Button className="w-full" disabled={filesInProgress.length === 0}>
                {`এখনই ${filesInProgress.length}টি ছবি আপলোড করুন`}
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
                        <Input readOnly value={uploadedFile.url} />
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">লিঙ্ক কপি</Button>
                        </div>
                    </div>
                 </div>
              </Card>
            ))}
          </div>
      )}


      <Tabs defaultValue="user-features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-features">ব্যবহারকারী ফিচার</TabsTrigger>
          <TabsTrigger value="admin-features">অ্যাডমিন ফিচার</TabsTrigger>
          <TabsTrigger value="api-features">API ও ডেভেলপার</TabsTrigger>
        </TabsList>
        <TabsContent value="user-features">
          <Card>
            <CardHeader>
              <CardTitle>ব্যবহারকারী ফিচার</CardTitle>
              <CardDescription>ছবি আপলোড এবং শেয়ার করার জন্য সহজ ও শক্তিশালী টুলস।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FeatureCard icon={UploadCloud} title="ইমেজ আপলোড সিস্টেম" description="ড্র্যাগ অ্যান্ড ড্রপ বা ক্লিক করে সহজেই JPG, PNG, GIF, WEBP ইত্যাদি ফরম্যাটের ছবি আপলোড করুন।" />
                <FeatureCard icon={LinkIcon} title="পাবলিক শেয়ার লিঙ্ক" description="প্রতিটি ছবির জন্য একটি স্বয়ংক্রিয়ভাবে তৈরি শর্ট লিঙ্ক পান (उदा: https://img.bdedu.me/i/abc123)।" />
                <FeatureCard icon={FileText} title="বিভিন্ন ফরম্যাটের লিঙ্ক" description="সরাসরি URL, BBCode এবং Markdown লিঙ্ক কপি করার সুবিধা।" />
                <FeatureCard icon={ImageIcon} title="একাধিক ছবি আপলোড" description="একসাথে একাধিক ছবি আপলোড করে আপনার সময় বাঁচান।" />
                <FeatureCard icon={Languages} title="ভাষা পরিবর্তন" description="আপনার পছন্দের ভাষায় (English/Bangla) প্ল্যাটফর্ম ব্যবহার করুন।" />
                <FeatureCard icon={Clock} title="আপলোড প্রোগ্রেস বার" description="ছবি আপলোডের সময় রিয়েল-টাইম প্রোগ্রেস এবং প্রিভিউ দেখুন।" />
                <FeatureCard icon={EyeOff} title="প্রাইভেট ও পাবলিক আপলোড" description="আপনার ছবি প্রাইভেট রাখুন অথবা সবার সাথে শেয়ার করুন।" />
                 <FeatureCard icon={UserCircle} title="ব্যবহারকারী অ্যাকাউন্ট" description="নিবন্ধন করে আপনার আপলোড করা সকল ছবির হিস্ট্রি দেখুন (ঐচ্ছিক)।" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin-features">
          <Card>
            <CardHeader>
              <CardTitle>অ্যাডমিন ফিচার</CardTitle>
              <CardDescription>প্ল্যাটফর্ম পরিচালনার জন্য শক্তিশালী অ্যাডমিন কন্ট্রোল প্যানেল।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FeatureCard icon={Settings} title="অ্যাডমিন লগইন প্যানেল" description="নিরাপদ অ্যাডমিন প্যানেলে লগইন করে সম্পূর্ণ কন্ট্রোল নিন।" />
                <FeatureCard icon={ImageIcon} title="ইমেজ ম্যানেজমেন্ট" description="আপলোড করা ছবি তালিকাভুক্ত করুন, ডিলিট, ব্যান অথবা রিপোর্ট পরিচালনা করুন।" />
                 <FeatureCard icon={ShieldCheck} title="স্টোরেজ ও ফাইল টাইপ নিয়ন্ত্রণ" description="স্টোরেজ লিমিট এবং অনুমোদিত ফাইল টাইপ নির্ধারণ করুন।" />
                 <FeatureCard icon={BarChart} title="আপলোড অ্যানালিটিক্স" description="দৈনিক ও মাসিক আপলোড সংখ্যা, ব্যবহৃত ব্যান্ডউইথ ইত্যাদি ট্র্যাক করুন।" />
                 <FeatureCard icon={AlertTriangle} title="রিপোর্ট সিস্টেম" description="ব্যবহারকারীদের রিপোর্ট করা অনুপযুক্ত ছবি পরিচালনা করুন।" />
                 <FeatureCard icon={Trash2} title="ব্যাকআপ ও ক্লিনআপ টুল" description="পুরাতন বা অব্যবহৃত ছবি স্বয়ংক্রিয়ভাবে মুছে ফেলার ব্যবস্থা।" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api-features">
          <Card>
            <CardHeader>
                <CardTitle>API ও ডেভেলপার ফিচার</CardTitle>
                <CardDescription>আপনার ওয়েবসাইট বা অ্যাপ্লিকেশনে আমাদের ইমেজ হোস্টিং সার্ভিসকে সহজে ইন্টিগ্রেট করুন।</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FeatureCard icon={Server} title="API আপলোড এন্ডপয়েন্ট" description="POST অনুরোধের মাধ্যমে /api/upload এন্ডপয়েন্টে ছবি আপলোড করুন।" />
                <FeatureCard icon={Key} title="API কী অথেন্টিকেশন" description="নিরাপদ API কী ব্যবহার করে আপনার অনুরোধগুলো প্রমাণীকরণ করুন।" />
                <FeatureCard icon={Code} title="JSON রেসপন্স ফরম্যাট" description="সহজ ইন্টিগ্রেশনের জন্য JSON ফরম্যাটে ছবির URL পান।" />
                <FeatureCard icon={LinkIcon} title="CORS এনাবলড" description="যেকোনো বহিরাগত ওয়েবসাইট থেকে আমাদের API ব্যবহার করার সুবিধা।" />
                <FeatureCard icon={Bot} title="রেট লিমিট সুরক্ষা" description="অতিরিক্ত অনুরোধ থেকে সার্ভারকে সুরক্ষিত রাখতে রেট লিমিটিং ব্যবস্থা।" />
                <FeatureCard icon={FileCog} title="PHP লাইব্রেরি" description="অন্যান্য প্রজেক্টে সহজে ইন্টিগ্রেট করার জন্য PHP লাইব্রেরি (/lib/api_helper.php)।" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
