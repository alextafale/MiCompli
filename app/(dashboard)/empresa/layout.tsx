import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import EmpresaNavClient from './EmpresaNavClient'

export default async function EmpresaDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    // Solo empresas pueden entrar aquí
    if (!profile || profile.role !== 'empresa') {
        if (profile?.role === 'complice' || profile?.role === 'admin') {
            redirect('/dashboard')
        }
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            {/* Navbar empresarial */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/[0.05] h-[72px] flex items-center justify-between px-8">
                <Link href="/dashboard/empresa" className="flex items-center gap-3">
                    <div className="relative h-10 w-36">
                        <Image
                            src="/images/micompliLOGO.jpeg"
                            alt="MiCompli"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-[10px] uppercase tracking-[2px] text-ink/30 font-bold hidden md:block">
                        Empresas
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/empresa"
                        className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/50 hover:text-rose transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/empresa/nuevo-envio"
                        className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/50 hover:text-rose transition-colors"
                    >
                        Nuevo envío
                    </Link>
                    <Link
                        href="/explorar?audiencia=b2b"
                        className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ink/50 hover:text-rose transition-colors"
                    >
                        Catálogo
                    </Link>

                    <EmpresaNavClient nombre={profile.full_name ?? 'Empresa'} />
                </div>
            </nav>

            <main className="pt-[72px]">
                {children}
            </main>
        </div>
    )
}