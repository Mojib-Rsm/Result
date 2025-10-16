
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Facebook } from 'lucide-react';

const contactInfo = {
    email: 'info@bdedu.me',
    phone: '+8801601519007',
    facebook: 'https://www.facebook.com/Oftern/'
};

export default function ContactUsPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
            <div className="mb-8">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        হোমে ফিরে যান
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="text-center p-6 bg-muted/30">
                    <Mail className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-4xl mt-4">যোগাযোগ করুন</CardTitle>
                    <CardDescription className="text-lg">আমরা আপনার মতামত শুনতে আগ্রহী</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <p className="text-center text-muted-foreground mb-8">
                        যেকোনো প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করতে পারেন। আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করার চেষ্টা করব।
                    </p>
                    
                    <div className="space-y-6">
                        <a 
                            href={`mailto:${contactInfo.email}`} 
                            className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Mail className="h-6 w-6 mr-4 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold">ইমেইল</p>
                                <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                            </div>
                        </a>
                        <a 
                            href={`tel:${contactInfo.phone}`}
                            className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Phone className="h-6 w-6 mr-4 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold">ফোন</p>
                                <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                            </div>
                        </a>
                        <a 
                            href={contactInfo.facebook}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Facebook className="h-6 w-6 mr-4 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold">ফেসবুক</p>
                                <p className="text-sm text-muted-foreground">Oftern</p>
                            </div>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
