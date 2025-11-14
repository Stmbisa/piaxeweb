import { Eye, Clock, Shield, ListChecks } from 'lucide-react'

export function TransparencyStrip() {
    // Placeholder static values; future: fetch('/metrics/public') hourly.
    const metrics = {
        escrows_active: 1287,
        fraud_prevented_ugx: 452000000,
        avg_release_minutes: 180,
        top_conditions: ['delivery', 'geo', 'time_lock']
    }

    return (
        <section className='container mx-auto px-4 py-8'>
            <div className='glass-card flex flex-wrap items-center justify-center gap-8 p-6 rounded-2xl animate-glass-appear'>
                <div className='flex flex-col items-center text-center'>
                    <Shield className='w-5 h-5 mb-1 text-primary' />
                    <span className='text-sm font-semibold'>{metrics.escrows_active.toLocaleString()} active escrows</span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <Eye className='w-5 h-5 mb-1 text-secondary' />
                    <span className='text-sm font-semibold'>UGX {metrics.fraud_prevented_ugx.toLocaleString()} protected</span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <Clock className='w-5 h-5 mb-1 text-accent-foreground' />
                    <span className='text-sm font-semibold'>{metrics.avg_release_minutes} min avg release</span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <ListChecks className='w-5 h-5 mb-1 text-green-400' />
                    <span className='text-xs'>Top conditions: {metrics.top_conditions.join(', ')}</span>
                </div>
            </div>
        </section>
    )
}
