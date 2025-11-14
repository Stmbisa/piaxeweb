interface PersonaRowProps {
    persona: string;
    headline: string;
    microcopy: string;
    cta: string;
    link: string;
}

const personas: PersonaRowProps[] = [
    { persona: 'Consumer', headline: 'Protect every purchase', microcopy: 'If it isn’t delivered or verified, it isn’t paid.', cta: 'Start a Protected Payment', link: '/auth/register' },
    { persona: 'Merchant', headline: 'Unified selling', microcopy: 'One setup. All channels. Trust in every sale.', cta: 'Create Shop', link: '/business/onboard' },
    { persona: 'Developer', headline: 'Ship trust, not risk', microcopy: 'POST /escrows in 5 lines. Latency you can trust.', cta: 'Generate API Key', link: '/auth/developer-register' },
    { persona: 'Employer', headline: 'Automated payroll escrow', microcopy: 'Release funds by presence + time worked rules.', cta: 'Set Payroll Escrow', link: '/business/onboard' },
    { persona: 'Fundraising', headline: 'Goal-based transparency', microcopy: 'Hit 100%, auto-close. Or open pledges with caps.', cta: 'Launch Campaign', link: '/payment-links' },
]

export function PersonaUseCases() {
    return (
        <section className='container mx-auto px-4 py-10'>
            <div className='glass-card-secondary rounded-2xl p-6 md:p-10 animate-glass-appear'>
                <h2 className='text-3xl font-bold mb-6 text-secondary-foreground'>Use Cases</h2>
                <div className='space-y-4'>
                    {personas.map(p => (
                        <div key={p.persona} className='glass-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl'>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-sm mb-1'>{p.persona}: {p.headline}</h3>
                                <p className='text-xs text-muted-foreground'>{p.microcopy}</p>
                            </div>
                            <a href={p.link} className='glass-button-primary text-[11px] px-3 py-2 rounded-full'>{p.cta}</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
