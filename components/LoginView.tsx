import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { LogoIcon, ExecutivesIcon, SecretariesIcon, SettingsIcon, ChevronDownIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { mockAllData } from '../mock/data';

const getRoleIcon = (role: User['role'], className: string = 'w-5 h-5') => {
    switch(role) {
        case 'executive': return <ExecutivesIcon className={className} />;
        case 'secretary': return <SecretariesIcon className={className} />;
        case 'admin':
        case 'master':
            return <SettingsIcon className={className} />;
        default: return <ExecutivesIcon className={className} />;
    }
}

const getRoleDescription = (role: User['role']) => {
    switch(role) {
        case 'executive': return 'Acesso focado nas próprias atividades.';
        case 'secretary': return 'Gerenciamento dos executivos associados.';
        case 'admin': return 'Administração de uma organização.';
        case 'master': return 'Acesso total a todas as funcionalidades.';
        default: return '';
    }
}

const LoginView: React.FC = () => {
    const { login } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            // Simulate fetching users from mock data
            setUsers(mockAllData.users);
        } catch (err) {
            setError('Falha ao carregar usuários do mock.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setIsOpen(false);
    };

    const handleLogin = async () => {
        if (selectedUser) {
            setError('');
            try {
                await login(selectedUser.id);
            } catch (err) {
                setError('Login falhou. Tente novamente.');
                console.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 antialiased">
            <div className="text-center">
                <div className="inline-block bg-slate-800 p-4 rounded-full mb-4">
                    <LogoIcon className="w-24 h-24 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Bem-vindo à Executiva Cloud</h1>
                <p className="text-slate-500 mt-2 text-lg">Selecione seu perfil para acessar o sistema.</p>
            </div>

            <div className="w-full max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
                <div className="space-y-6">
                    <div>
                        <label id="profile-label" className="form-label">Selecione o Perfil</label>
                        <div className="relative mt-1" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                disabled={loading || !!error}
                                className="form-input text-left relative w-full cursor-default"
                                aria-haspopup="listbox"
                                aria-expanded={isOpen}
                                aria-labelledby="profile-label"
                            >
                                <span className="flex items-center">
                                    {selectedUser ? (
                                        <>
                                            {getRoleIcon(selectedUser.role)}
                                            <span className="ml-3 block truncate">{selectedUser.fullName}</span>
                                        </>
                                    ) : (
                                        <span className="block truncate text-slate-500">{loading ? 'Carregando perfis...' : 'Selecione um perfil'}</span>
                                    )}
                                </span>
                                <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                </span>
                            </button>
                            
                            {isOpen && (
                                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                    role="listbox"
                                    aria-labelledby="profile-label"
                                >
                                    {users.map((user) => (
                                        <li
                                            key={user.id}
                                            onClick={() => handleSelectUser(user)}
                                            className="text-slate-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                            role="option"
                                            aria-selected={selectedUser?.id === user.id}
                                        >
                                            <div className="flex items-center">
                                                {getRoleIcon(user.role)}
                                                <div className="ml-3">
                                                    <span className="font-normal block truncate">{user.fullName}</span>
                                                    <span className="text-xs text-slate-500">{getRoleDescription(user.role)}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button
                            onClick={handleLogin}
                            disabled={!selectedUser || loading}
                            className="btn btn-primary w-full"
                        >
                            Entrar no Sistema
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;