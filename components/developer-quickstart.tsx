import { Code2, Gauge, Zap } from 'lucide-react'

export function DeveloperQuickstart() {
    const snippet = `curl -X POST https://api.gopiaxis.com/escrows \\
  -H 'Authorization: Bearer <API_KEY>' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "amount": 150000,
    "currency": "UGX",
    "conditions": ["delivery", "geo"],
    "beneficiary": "USER_ID"
  }'`

    return (
        <section className='container mx-auto px-4 py-10'>
            <div className='glass-card-primary rounded-2xl p-6 md:p-10 animate-glass-appear'>
                <div className='flex items-center gap-2 mb-4'>
                    <Code2 className='w-5 h-5 text-primary-foreground' />
                    <h2 className='text-2xl md:text-3xl font-bold text-primary-foreground'>Developer Quickstart</h2>
                </div>
                <p className='text-sm text-primary-foreground/80 mb-6 max-w-2xl'>Payments, payouts & programmable escrow in a few lines. Start with a test key, upgrade when ready.</p>
                <div className='grid md:grid-cols-2 gap-6'>
                    <div className='glass-card p-4 rounded-xl flex flex-col gap-3'>
                        <pre className='text-xs whitespace-pre-wrap font-mono leading-relaxed bg-black/30 p-3 rounded-md border border-white/10'>{snippet}</pre>
                        <a href='/auth/developer-register' className='glass-button-primary w-fit px-4 py-2 rounded-full text-[12px]'>Generate API Key</a>
                    </div>
                    <div className='glass-card p-4 rounded-xl flex flex-col gap-4'>
                        <div className='flex items-center gap-2 text-xs'><Gauge className='w-4 h-4 text-green-400' /> <span>Latency: <strong>&lt; 350ms p95</strong> (regional)</span></div>
                        <div className='flex items-center gap-2 text-xs'><Zap className='w-4 h-4 text-yellow-400' /> <span>Uptime: <strong>99.9%</strong> past 30d</span></div>
                        <p className='text-xs text-muted-foreground'>SDKs & webhooks coming soon. Follow the changelog for updates.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
