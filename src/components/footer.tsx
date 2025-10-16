
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="no-print py-8 md:px-8 bg-background/95 border-t">
      <div className="container flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
            <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer">
                 <Image 
                    src="/logo.png"
                    alt="BD Edu Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                />
            </Link>
             <Link href="https://www.bdedu.me" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                BD Edu
            </Link>
        </div>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Developed & Maintained by <Link href="/developer" className="font-medium text-foreground hover:underline">Mojib Rsm</Link>
            </p>
            <p className="text-xs text-muted-foreground mt-1">All rights reserved.</p>
        </div>
         <Button asChild variant="outline" size="sm">
            <Link href="/developer">
              <Code className="mr-2 h-4 w-4" />
              About Developer
            </Link>
          </Button>
      </div>
    </footer>
  )
}

    