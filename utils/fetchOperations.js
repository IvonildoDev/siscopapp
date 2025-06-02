import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const fetchOperationsFromFirebase = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'operacoes'));
        const operations = [];
        querySnapshot.forEach((doc) => {
            operations.push({ id: doc.id, ...doc.data() });
        });
        return operations;
    } catch (error) {
        console.log('Erro ao buscar operações do Firebase:', error);
        return [];
    }
};