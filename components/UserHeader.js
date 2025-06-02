import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';

const UserHeader = () => {
    const { userData, logout } = useContext(AuthContext);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    // Funções para o modal de perfil
    const openProfileModal = () => {
        setProfileModalVisible(true);
    };

    const closeProfileModal = () => {
        setProfileModalVisible(false);
    };

    // Funções para o modal Sobre
    const openAboutModal = () => {
        setAboutModalVisible(true);
    };

    const closeAboutModal = () => {
        setAboutModalVisible(false);
    };

    // Função para realizar logout
    const handleLogout = () => {
        if (profileModalVisible) {
            setProfileModalVisible(false);
        }
        logout();
    };

    return (
        <>
            <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={openProfileModal}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData?.name || 'Operador'}</Text>

                        {/* Unidade */}
                        <View style={styles.detailsRow}>
                            <Ionicons name="business-outline" size={14} color="#e0e0e0" />
                            <Text style={styles.userDetails}>
                                Unidade: {userData?.unit || '---'}
                            </Text>
                        </View>

                        {/* Placa do veículo */}
                        <View style={styles.detailsRow}>
                            <Ionicons name="car-outline" size={14} color="#e0e0e0" />
                            <Text style={styles.userDetails}>
                                Placa: {userData?.vehiclePlate || '---'}
                            </Text>
                        </View>

                        {/* Auxiliar */}
                        <View style={styles.detailsRow}>
                            <Ionicons name="people-outline" size={14} color="#e0e0e0" />
                            <Text style={styles.userDetails}>
                                Auxiliar: {userData?.auxiliarName || '---'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.aboutButton}
                        onPress={openAboutModal}
                    >
                        <Ionicons name="information-circle-outline" size={22} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color="white" />
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal para o Perfil */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={profileModalVisible}
                onRequestClose={closeProfileModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeProfileModal}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Perfil do Operador</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ProfileScreen closeModal={closeProfileModal} />
                </View>
            </Modal>

            {/* Modal para o Sobre */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={aboutModalVisible}
                onRequestClose={closeAboutModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeAboutModal}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Sobre o SISCOP</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <AboutScreen closeModal={closeAboutModal} />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2c3e50',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#1a2530',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    userDetails: {
        color: '#e0e0e0',
        fontSize: 12,
        marginLeft: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aboutButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(52, 152, 219, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(231, 76, 60, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalHeader: {
        backgroundColor: '#2c3e50',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeButton: {
        padding: 5,
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 28, // Mesmo tamanho do botão de fechar para manter alinhamento
    },
});

export default UserHeader;