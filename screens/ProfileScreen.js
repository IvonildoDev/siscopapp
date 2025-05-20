import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import globalStyles from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ closeModal }) => {
    const { userData, updateUserData, logout } = useContext(AuthContext);

    const [name, setName] = useState(userData.name || '');
    const [registration, setRegistration] = useState(userData.registration || '');
    const [position, setPosition] = useState('Operador'); // Cargo fixo como "Operador"
    const [auxiliarName, setAuxiliarName] = useState(userData.auxiliarName || ''); // Alterado de "team" para "auxiliarName"
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Restaurar valores originais
        setName(userData.name || '');
        setRegistration(userData.registration || '');
        setPosition('Operador'); // Sempre "Operador"
        setAuxiliarName(userData.auxiliarName || '');
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!name || !registration) {
            Alert.alert('Erro', 'O nome e a matrícula são obrigatórios');
            return;
        }

        setIsLoading(true);

        try {
            const success = await updateUserData({
                name,
                registration,
                position: 'Operador', // Sempre salva como "Operador"
                auxiliarName // Novo campo para nome do auxiliar
            });

            if (success) {
                Alert.alert('Sucesso', 'Dados atualizados com sucesso');
                setIsEditing(false);
            } else {
                Alert.alert('Erro', 'Falha ao atualizar dados');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar os dados');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para fazer logout e fechar o modal
    const handleLogout = () => {
        if (closeModal) closeModal();
        logout();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name ? name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Operador*</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Digite o nome do operador"
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Matrícula*</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={registration}
                            onChangeText={setRegistration}
                            placeholder="Digite sua matrícula"
                            keyboardType="numeric"
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Cargo</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value="Operador"
                            editable={false} // Sempre desabilitado
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Auxiliar</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={auxiliarName}
                            onChangeText={setAuxiliarName}
                            placeholder="Digite o nome do auxiliar"
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={handleCancel}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
                                    onPress={handleSave}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Salvando...' : 'Salvar'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.editButton]}
                                onPress={handleEdit}
                            >
                                <Text style={styles.buttonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {closeModal && (
                        <TouchableOpacity
                            style={[styles.button, styles.closeButton]}
                            onPress={closeModal}
                        >
                            <Text style={styles.buttonText}>Voltar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        margin: 15,
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
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    formContainer: {

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
    disabledInput: {
        backgroundColor: '#f8f8f8',
        color: '#7f8c8d',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 5,
        flex: 1,
    },
    editButton: {
        backgroundColor: '#3498db',
    },
    cancelButton: {
        backgroundColor: '#7f8c8d',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
    },
    closeButton: {
        backgroundColor: '#34495e',
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

export default ProfileScreen;