
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, History, Calculator, MoreVertical, Sparkles, LogOut, User, Bookmark, BarChart, Building, Code, MailCheck, Briefcase, FileText, Phone, Wrench, ChevronDown, Rss, Calendar, ImageIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/hooks/use-auth';

export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const isAdminPage = pathname.startsWith('/admin');

  const mainNavLinks = [
    { href: '/', label: 'হোম', icon: GraduationCap },
    { href: '/career', label: 'ক্যারিয়ার হাব', icon: Briefcase },
    { href: '/suggestions', label: 'ভর্তি পরামর্শ', icon: Sparkles },
    { href: '/gpa-calculator', label: 'টুলস', icon: Wrench },
    { href: '/contact-us', label: 'যোগাযোগ', icon: Phone },
  ];
  
  const newsSubMenu = [
      { href: '/education-news', label: 'সকল সংবাদ', icon: Rss },
      { href: '/education-news/board-and-ministry', label: 'বোর্ড ও মন্ত্রণালয়ের নোটিশ', icon: Building },
      { href: '/education-news/exam-and-results', label: 'পরীক্ষা ও ফলাফল সংক্রান্ত নোটিশ', icon: Calendar },
  ];

  const moreNavLinks = [
    { href: '/institute-result', label: 'প্রতিষ্ঠানের ফলাফল', icon: Building },
    { href: '/statistics', label: 'পরিসংখ্যান', icon: BarChart },
    { href: '/history', label: 'ইতিহাস', icon: History },
    { href: '/image-hosting', label: 'ইমেজ হোস্টিং', icon: ImageIcon },
    { href: '/career/post-job', label: 'জব পোস্ট করুন', icon: Briefcase },
    { href: '/developer', label: 'ডেভেলপার', icon: Code },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
    <Button
      variant="ghost"
      asChild
      className={cn(
        'transition-colors hover:text-foreground/80',
        pathname === href ? 'text-foreground' : 'text-foreground/60'
      )}
    >
      <Link href={href} className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );

  if (isAdminPage) {
    return null;
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
           <Image
            src="/logo.png"
            alt="BD Edu Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-bold sm:inline-block">BD Edu</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 text-sm md:flex">
          {mainNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
          
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-foreground/60">
                        <Rss className="h-4 w-4" />
                        শিক্ষা সংবাদ
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {newsSubMenu.map(link => (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href} className="flex items-center gap-2">
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-foreground/60">
                      <MoreVertical className="h-4 w-4" />
                      অন্যান্য
                      <ChevronDown className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  {moreNavLinks.map(link => (
                      <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href} className="flex items-center gap-2">
                              <link.icon className="h-4 w-4" />
                              {link.label}
                          </Link>
                      </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex-1 md:hidden" />
        <div className="flex items-center justify-end">
          <div className="md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                     {mainNavLinks.map(link => (
                          <DropdownMenuItem key={link.href} asChild>
                              <Link href={link.href} className="flex items-center gap-2">
                                <link.icon className="h-4 w-4" />
                                <span>{link.label}</span>
                              </Link>
                          </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                     <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Rss className="mr-2 h-4 w-4" />
                            <span>শিক্ষা সংবাদ</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {newsSubMenu.map(link => (
                                    <DropdownMenuItem key={link.href} asChild>
                                        <Link href={link.href} className="flex items-center gap-2">
                                            <link.icon className="h-4 w-4" />
                                            {link.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    {moreNavLinks.map(link => (
                          <DropdownMenuItem key={link.href} asChild>
                              <Link href={link.href} className="flex items-center gap-2">
                                <link.icon className="h-4 w-4" />
                                <span>{link.label}</span>
                              </Link>
                          </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
           {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost">
                        <User className="mr-2 h-4 w-4" />
                        {user.name}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href="/dashboard">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                ড্যাশবোর্ড
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            লগআউট
                        </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
           ) : (
             <Button asChild size="sm">
                <Link href="/login">
                    লগইন / নিবন্ধন
                </Link>
            </Button>
           )}
        </div>
      </div>
    </header>
  );
}
