import { Shield, LinkIcon as Link, QrCode, ShoppingCart, Lock, Users, Wallet, Cpu, Bell, Code2, Timer, Network } from 'lucide-react'
import { LockAnimation, ScanAnimation, MapAnimation } from '@/components/superpower-animations'

interface PrimitiveDef {
    key: string;
    title: string;
    payoff: string;
    icon: React.ReactNode;
    animation?: React.ReactNode;
}

const primitives: PrimitiveDef[] = [
    { 
        key: 'escrow', 
        title: 'The Trust Shield', 
        payoff: 'Never pay for air again. Money stays locked until you hold the item in your hand.', 
        icon: <Lock className='w-5 h-5' />,
        animation: <LockAnimation />
    },
    { 
        key: 'pos_free', 
        title: 'The Line Skipper', 
        payoff: 'Walk into a store. Scan. Pay. Leave. No queues. No cashiers. Just you and the exit.', 
        icon: <QrCode className='w-5 h-5' />,
        animation: <ScanAnimation />
    },
    { key: 'social_links', title: 'Social Links & QR', payoff: 'Share shoppable links across every social channel.', icon: <Link className='w-5 h-5' /> },
    { 
        key: 'remote_cart', 
        title: 'The Sugar Daddy Link', 
        payoff: 'Shopping for school fees? Scan the items. Send the cart link to Dad. He pays instantly from London.', 
        icon: <ShoppingCart className='w-5 h-5' />,
        animation: <MapAnimation />
    },
    { key: 'restricted_spend', title: 'Restricted Spend', payoff: 'Money that only buys approved categories/items.', icon: <Shield className='w-5 h-5' /> },
    { key: 'fundraising_caps', title: 'Fundraising Caps', payoff: 'Goal-based campaigns auto-close at 100%.', icon: <Users className='w-5 h-5' /> },
    { key: 'payroll_escrow', title: 'Payroll Escrow', payoff: 'Release wages only after presence + time rules.', icon: <Timer className='w-5 h-5' /> },
    { key: 'savings_groups', title: 'Savings Groups', payoff: 'Transparent group saving with rule governance.', icon: <Wallet className='w-5 h-5' /> },
    { key: 'credit_lines', title: 'Credit Lines', payoff: 'Inventory restocked before cash arrives.', icon: <Network className='w-5 h-5' /> },
    { key: 'crm_ai', title: 'The Pocket HQ', payoff: 'Your phone is now your Head Office. AI tracks your leads, sends SMS campaigns, and closes deals while you sleep.', icon: <Cpu className='w-5 h-5' /> },
    { key: 'notifications', title: 'Notifications', payoff: 'Programmable events and trust status updates.', icon: <Bell className='w-5 h-5' /> },
    { key: 'apis', title: 'APIs', payoff: 'Payments + programmable escrow in a few lines.', icon: <Code2 className='w-5 h-5' /> },
        { key: 'tax_compliance', title: 'Automated Tax Compliance', payoff: 'Integrated URA eFRIS invoicing. Stay compliant, automatically.', icon: <Shield className='w-5 h-5' /> },
]

export function PrimitivesGrid() {
    return (
        <section className='container mx-auto px-4 py-10'>
            <div className='glass-card-primary rounded-2xl p-6 md:p-10 animate-glass-appear'>
                <h2 className='text-3xl font-bold mb-6 text-primary-foreground'>Your Superpowers</h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {primitives.map(p => (
                        <div key={p.key} className='glass-card group p-4 rounded-xl flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-300'>
                            <div className='flex items-center gap-2'>
                                <div className='glass-icon-button overflow-hidden relative'>
                                    {p.animation || p.icon}
                                </div>
                                <h3 className='font-semibold text-sm tracking-wide'>{p.title}</h3>
                            </div>
                            <p className='text-xs text-muted-foreground leading-relaxed'>{p.payoff}</p>
                            <button className='mt-auto self-start text-[11px] px-2 py-1 rounded-full glass-button-secondary'>Learn More</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
