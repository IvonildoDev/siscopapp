import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Função para sincronizar operações locais com o Firestore
export const syncOperationsWithFirebase = async () => {
    try {
        const historyString = await AsyncStorage.getItem('history');
        const history = historyString ? JSON.parse(historyString) : [];

        if (history.length > 0) {
            for (const op of history) {
                await addDoc(collection(db, 'operacoes'), op);
            }
            // Limpa o histórico local após sincronizar
            await AsyncStorage.removeItem('history');
        }
    } catch (error) {
        console.log('Erro ao sincronizar com Firebase:', error);
    }
};

// Monitore a conexão e sincronize automaticamente
NetInfo.addEventListener(state => {
    if (state.isConnected) {
        syncOperationsWithFirebase();
    }
});