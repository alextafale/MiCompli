'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    PersonOutlined,
    EmailOutlined,
    LockOutlined,
    FavoriteOutlined,
    ArrowForward,
    CardGiftcardOutlined,
    AutoAwesome,
    Business,
    StorefrontOutlined,
} from '@mui/icons-material'

type Rol = 'cliente' | 'complice' | 'empresa' | 'proveedor'

export default function RegisterClient() {
    const searchParams = useSearchParams()
    const initialRol = (searchParams.get('rol') as Rol) || 'cliente'

    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmar: '',
        rol: initialRol,
        nombre_empresa: '',
        industria: '',
        tamano: '1-10',
    })

    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const rol = searchParams.get('rol') as Rol | null
        if (rol && ['cliente', 'complice', 'empresa', 'proveedor'].includes(rol)) {
            setForm(f => ({ ...f, rol }))
        }
    }, [searchParams])

    const handleRegister = async () => {
        if (!form.nombre || !form.email || !form.password) {
            toast.error('Completa todos los campos')
            return
        }
        if (form.password !== form.confirmar) {
            toast.error('Las contraseñas no coinciden')
            return
        }
        if (form.password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres')
            return
        }
        if (form.rol === 'empresa' && !form.nombre_empresa) {
            toast.error('Ingresa el nombre de tu empresa')
            return
        }

        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        full_name: form.nombre,
                        role: form.rol,
                    },
                },
            })

            if (error) throw error
            if (!data.user) throw new Error('No se pudo crear el usuario')

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: form.email,
                    full_name: form.nombre,
                    role: form.rol,
                })

            if (profileError) throw profileError

            if (form.rol === 'empresa') {
                const { error: empresaError } = await supabase
                    .from('empresas')
                    .insert({
                        perfil_id: data.user.id,
                        nombre_empresa: form.nombre_empresa,
                        industria: form.industria || null,
                        tamano: form.tamano,
                    })

                if (empresaError) throw empresaError
            }

            toast.success('¡Cuenta creada! Revisa tu email para confirmar.')

            if (form.rol === 'empresa') {
                router.push('/dashboard/empresa')
            } else if (form.rol === 'proveedor') {
                router.push('/proveedor/dashboard')
            } else if (form.rol === 'complice') {
                router.push('/dashboard')
            } else {
                router.push('/')
            }

            router.refresh()
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        {
            val: 'cliente',
            icon: <CardGiftcardOutlined sx={{ fontSize: 22 }} />,
            label: 'Quiero sorprender',
            desc: 'Organiza experiencias únicas',
        },
        {
            val: 'empresa',
            icon: <Business sx={{ fontSize: 22 }} />,
            label: 'Soy Empresa',
            desc: 'Gifting para mi equipo',
        },
        {
            val: 'complice',
            icon: <AutoAwesome sx={{ fontSize: 22 }} />,
            label: 'Soy Cómplice',
            desc: 'Haz la magia posible',
        },
        {
            val: 'proveedor',
            icon: <StorefrontOutlined sx={{ fontSize: 22 }} />,
            label: 'Soy Proveedor',
            desc: 'Ofrece productos y servicios',
        },
    ]

    const industriaOpts = [
        'Tecnología',
        'Salud',
        'Retail',
        'Manufactura',
        'Servicios financieros',
        'Educación',
        'Alimentos',
        'Otro',
    ]

    const tamanoOpts = [
        { val: '1-10', label: '1–10 empleados' },
        { val: '11-50', label: '11–50 empleados' },
        { val: '51-200', label: '51–200 empleados' },
        { val: '200+', label: '200+ empleados' },
    ]

    return (
        <div className="min-h-screen flex bg-[#FDF8F5]">
            {/* TODO: aquí va todo tu JSX tal cual lo tenías */}
            {/* (no lo recorto porque ya lo tienes funcionando perfecto) */}

            {/* Solo asegúrate de dejar todo igual */}
            {/* No hay que cambiar nada más */}

            <button onClick={handleRegister}>Crear cuenta</button>
        </div>
    )
}
