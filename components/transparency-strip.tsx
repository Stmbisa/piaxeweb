"use client"

import { useEffect, useMemo, useState } from 'react'
import { Eye, Clock, Shield, ListChecks } from 'lucide-react'

type TrustLedger = {
    active_escrows: number
    total_protected_amount: string | number
    average_release_minutes: number
    top_conditions: string[]
}

const formatUGX = (value: string | number) => {
    if (typeof value === 'number') return `UGX ${value.toLocaleString()}`
    // If already prefixed, return as-is
    if (/^\s*UGX/i.test(value)) return value
    const num = Number(value.replace(/[^0-9.-]/g, ''))
    return isNaN(num) ? value : `UGX ${num.toLocaleString()}`
}

export function TransparencyStrip() {
    const [data, setData] = useState<TrustLedger | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchData = async () => {
            try {
                setError(null)
                const controller = new AbortController()
                const id = setTimeout(() => controller.abort(), 8000)
                const res = await fetch('/api/proxy/wallet/escrows/trust-ledger', {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                    cache: 'no-store',
                    signal: controller.signal,
                })
                clearTimeout(id)
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const json = (await res.json()) as Partial<TrustLedger>
                if (!mounted) return
                // Defensive shaping
                setData({
                    active_escrows: typeof json.active_escrows === 'number' ? json.active_escrows : 0,
                    total_protected_amount: json.total_protected_amount ?? 0,
                    average_release_minutes: typeof json.average_release_minutes === 'number' ? json.average_release_minutes : 0,
                    top_conditions: Array.isArray(json.top_conditions) ? (json.top_conditions as string[]) : [],
                })
            } catch (e: any) {
                if (!mounted) return
                setError(e?.message || 'Failed to load metrics')
            }
        }

        fetchData()
        const int = setInterval(fetchData, 60_000) // refresh every minute
        return () => {
            mounted = false
            clearInterval(int)
        }
    }, [])

    const metrics = useMemo(() => {
        return {
            escrows_active: data?.active_escrows ?? 0,
            fraud_protected_label: data ? formatUGX(data.total_protected_amount) : 'UGX 0',
            avg_release_minutes: data?.average_release_minutes ?? 0,
            top_conditions: data?.top_conditions ?? [],
        }
    }, [data])

    return (
        <section className='container mx-auto px-4 py-8'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Our Live Trust Ledger</h2>
            <div className='glass-card flex flex-wrap items-center justify-center gap-8 p-6 rounded-2xl animate-glass-appear'>
                <div className='flex flex-col items-center text-center'>
                    <Shield className='w-5 h-5 mb-1 text-primary' />
                    <span className='text-sm font-semibold'>
                        {metrics.escrows_active.toLocaleString()} active escrows
                    </span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <Eye className='w-5 h-5 mb-1 text-secondary' />
                    <span className='text-sm font-semibold'>
                        {metrics.fraud_protected_label} protected
                    </span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <Clock className='w-5 h-5 mb-1 text-accent-foreground' />
                    <span className='text-sm font-semibold'>
                        {metrics.avg_release_minutes} min avg release
                    </span>
                </div>
                <div className='flex flex-col items-center text-center'>
                    <ListChecks className='w-5 h-5 mb-1 text-green-400' />
                    <span className='text-xs'>
                        Top conditions: {metrics.top_conditions.length ? metrics.top_conditions.join(', ') : '—'}
                    </span>
                </div>
            </div>
            {error && (
                <p className='text-center text-xs text-red-500 mt-2' aria-live='polite'>
                    Metrics temporarily unavailable; showing latest cached values.
                </p>
            )}
        </section>
    )
}
