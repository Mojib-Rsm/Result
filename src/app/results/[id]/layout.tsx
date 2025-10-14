
// This layout ensures that the printable result page is clean
// and doesn't have the main app's header and footer.
export default function PrintableResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main>{children}</main>
      </body>
    </html>
  );
}
