import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const UserHeader = () => {
    const { userData, logout } = useContext(AuthContext);

    // Função para realizar logout
    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.header}>
            <View style={styles.userInfoContainer}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData?.name || 'Operador'}</Text>

                    <View style={styles.detailsRow}>
                        <Ionicons name="card-outline" size={14} color="#e0e0e0" />
                        <Text style={styles.userDetails}>
                            {userData?.registration || 'Sem matrícula'}
                        </Text>
                    </View>

                    {userData?.auxiliarName ? (
                        <View style={styles.detailsRow}>
                            <Ionicons name="people-outline" size={14} color="#e0e0e0" />
                            <Text style={styles.userDetails}>
                                Auxiliar: {userData.auxiliarName}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="white" />
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2c3e50',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40, // Espaço para barra de status
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
    }
});

export default UserHeader;