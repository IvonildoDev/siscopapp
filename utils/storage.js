import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const saveHistory = async (history) => {
    try {
        await AsyncStorage.setItem('@operations_history', JSON.stringify(history));
        return true;
    } catch (e) {
        Alert.alert('Erro', 'Falha ao salvar o histórico');
        return false;
    }
};

export const loadHistory = async () => {
    try {
        const savedHistory = await AsyncStorage.getItem('@operations_history');
        if (savedHistory !== null) {
            const parsedHistory = JSON.parse(savedHistory);

            // Garantir que cada item tenha as propriedades necessárias
            return parsedHistory.map(item => ({
                ...item,
                // Garantir que estas propriedades existam
                id: item.id || Date.now().toString(),
                mobilizationStartTime: item.mobilizationStartTime || null,
                mobilizationEndTime: item.mobilizationEndTime || null,
                mobilizationDuration: typeof item.mobilizationDuration === 'number' ? item.mobilizationDuration : null,
                demobilizationStartTime: item.demobilizationStartTime || null,
                demobilizationEndTime: item.demobilizationEndTime || null,
                demobilizationDuration: typeof item.demobilizationDuration === 'number' ? item.demobilizationDuration : null
            }));
        }
        return [];
    } catch (e) {
        console.error("Erro ao carregar histórico:", e);
        Alert.alert('Erro', 'Falha ao carregar o histórico');
        return [];
    }
};

export const saveDisplacementInfo = async (displacementInfo) => {
    try {
        await AsyncStorage.setItem('@last_displacement', JSON.stringify(displacementInfo));
        return true;
    } catch (e) {
        Alert.alert('Erro', 'Falha ao salvar informações de deslocamento');
        return false;
    }
};

export const loadDisplacementInfo = async () => {
    try {
        const info = await AsyncStorage.getItem('@last_displacement');
        if (info !== null) {
            return JSON.parse(info);
        }
        return null;
    } catch (e) {
        return null;
    }
};