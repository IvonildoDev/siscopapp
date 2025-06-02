import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState(''); // Novo campo unidade
    const [vehiclePlate, setVehiclePlate] = useState(''); // Novo campo placa do veículo
    const [auxiliarName, setAuxiliarName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!name.trim() || !auxiliarName.trim()) {
            Alert.alert('Erro', 'Nome do Operador e Nome do Auxiliar são obrigatórios');
            return;
        }

        setIsLoading(true);

        try {
            // Cargo fixo como "Operador"
            const position = "Operador";

            // Adapte o login conforme necessário para os novos campos
            const result = await login(name, position, unit, vehiclePlate, auxiliarName);

            if (!result.success) {
                Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adicionado offset
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled" // Garante que o teclado não feche ao tocar nos campos
            >
                <View style={styles.formContainer}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>SISCOP</Text>
                        <Text style={styles.logoSubtext}>Sistema de Controle Operacional</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Operador*</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Digite seu nome completo"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome da Unidade</Text>
                        <TextInput
                            style={styles.input}
                            value={unit}
                            onChangeText={setUnit}
                            placeholder="Ex: UCAQ"
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Placa do Veículo</Text>
                        <TextInput
                            style={styles.input}
                            value={vehiclePlate}
                            onChangeText={setVehiclePlate}
                            placeholder="Digite a placa do veículo"
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Auxiliar*</Text>
                        <TextInput
                            style={styles.input}
                            value={auxiliarName}
                            onChangeText={setAuxiliarName}
                            placeholder="Digite o nome do auxiliar"
                            autoCapitalize="words"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    logoSubtext: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;