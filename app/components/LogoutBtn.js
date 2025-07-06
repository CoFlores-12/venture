'use client';
import { signOut } from "next-auth/react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter(); // Usa el router

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOut({ redirect: false }); // Desactiva redirección automática
            router.push('/register'); // Redirige manualmente
        } catch (error) {
            setError("Error al cerrar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
         <button onClick={handleSignOut} disabled={loading} className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
            <svg className="w-5 h-5 mr-3 text-red-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
            </svg>
            {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
            {error && <p className="text-red-500">{error}</p>}
        </button>
    );
}