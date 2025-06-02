import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        registration: '',
        position: '',
        auxiliarName: ''  // Alterado de "team" para "auxiliarName"
    });

    // Verificar se o usuário está logado ao iniciar o app
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                // Carregar token e dados do usuário do armazenamento
                const token = await AsyncStorage.getItem('userToken');
                const storedUserData = await AsyncStorage.getItem('userData');

                if (token) {
                    setUserToken(token);
                    if (storedUserData) {
                        setUserData(JSON.parse(storedUserData));
                    }
                }
            } catch (e) {
                console.log('Erro ao carregar dados de autenticação:', e);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    // Funções de autenticação
    const login = async (name, position, unit, vehiclePlate, auxiliarName) => {
        try {
            // Em um sistema real, você faria uma requisição para API aqui
            // Simulando um token simples para este exemplo
            const token = `${name}-${Date.now()}`;

            // Dados do usuário para armazenar
            const user = { name, position, unit, vehiclePlate, auxiliarName };

            // Salvar no AsyncStorage
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            // Atualizar estado
            setUserToken(token);
            setUserData(user);

            return { success: true };
        } catch (e) {
            console.log('Erro ao fazer login:', e);
            return { success: false, error: e.message };
        }
    };

    const logout = async () => {
        try {
            // Remover dados do armazenamento
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');

            // Atualizar estado
            setUserToken(null);
            setUserData({
                name: '',
                registration: '',
                position: '',
                auxiliarName: ''  // Alterado de "team" para "auxiliarName"
            });
        } catch (e) {
            console.log('Erro ao fazer logout:', e);
        }
    };

    // Atualizar a função updateUserData para usar auxiliarName em vez de team
    const updateUserData = async (newUserData) => {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify({  // Alterado de '@user_data' para 'userData'
                ...userData,
                name: newUserData.name,
                registration: newUserData.registration,
                position: newUserData.position,
                auxiliarName: newUserData.auxiliarName
            }));

            // Atualizar o estado
            setUserData({
                ...userData,
                name: newUserData.name,
                registration: newUserData.registration,
                position: newUserData.position,
                auxiliarName: newUserData.auxiliarName
            });

            return true;
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                userData,
                login,
                logout,
                updateUserData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};