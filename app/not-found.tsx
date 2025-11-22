import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="text-center p-8 max-w-md mx-4 glass-card animate-glass-appear relative z-10">
        <div className="mb-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            404
          </h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
