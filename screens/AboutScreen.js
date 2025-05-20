import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = ({ closeModal }) => {
    const appVersion = "1.0.0";
    const currentYear = new Date().getFullYear();

    const openLink = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Não foi possível abrir o URL: " + url);
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.appName}>SISCOP</Text>
                <Text style={styles.appSubtitle}>Sistema de Controle Operacional</Text>
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Versão {appVersion}</Text>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                <Text style={styles.sectionText}>
                    O SISCOP (Sistema de Controle Operacional) é uma ferramenta desenvolvida
                    para facilitar o gerenciamento de operações em campo, permitindo o controle
                    de deslocamentos, registro de atividades, monitoramento de intervalos
                    e geração de relatórios detalhados.
                </Text>
                <Text style={styles.sectionText}>
                    Com uma interface intuitiva, o aplicativo auxilia na documentação precisa
                    de todas as etapas do trabalho, desde a mobilização até a desmobilização,
                    incluindo períodos de aguardo e intervalos para refeições.
                </Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Funcionalidades</Text>
                <View style={styles.featureItem}>
                    <Ionicons name="car-outline" size={24} color="#3498db" />
                    <Text style={styles.featureText}>Controle de deslocamentos</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="construct-outline" size={24} color="#3498db" />
                    <Text style={styles.featureText}>Registro de operações técnicas</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="time-outline" size={24} color="#3498db" />
                    <Text style={styles.featureText}>Monitoramento de períodos de aguardo</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="restaurant-outline" size={24} color="#3498db" />
                    <Text style={styles.featureText}>Controle de intervalos de almoço</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="document-text-outline" size={24} color="#3498db" />
                    <Text style={styles.featureText}>Geração de relatórios detalhados</Text>
                </View>
            </View>

            <View style={styles.developerContainer}>
                <Text style={styles.developerTitle}>Desenvolvido por</Text>
                <View style={styles.developerProfile}>
                    <View style={styles.developerAvatar}>
                        <Text style={styles.developerInitial}>IL</Text>
                    </View>
                    <View style={styles.developerInfo}>
                        <Text style={styles.developerName}>Ivonildo Lima</Text>
                        <Text style={styles.developerRole}>Desenvolvedor de Software</Text>
                    </View>
                </View>
                <Text style={styles.contactTitle}>Contato</Text>
                <View style={styles.contactRow}>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => openLink('mailto:contato@ivonildolima.com')}
                    >
                        <Ionicons name="mail-outline" size={20} color="#fff" />
                        <Text style={styles.contactButtonText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => openLink('https://ivonildolima.com')}
                    >
                        <Ionicons name="globe-outline" size={20} color="#fff" />
                        <Text style={styles.contactButtonText}>Website</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.copyrightText}>
                    © {currentYear} SISCOP. Todos os direitos reservados.
                </Text>
            </View>

            {closeModal && (
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                >
                    <Text style={styles.closeButtonText}>Voltar</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#2c3e50',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#ecf0f1',
        marginBottom: 15,
    },
    versionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    versionText: {
        color: '#fff',
        fontSize: 14,
    },
    sectionContainer: {
        backgroundColor: '#fff',
        margin: 15,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        paddingBottom: 10,
    },
    sectionText: {
        fontSize: 14,
        color: '#34495e',
        lineHeight: 22,
        marginBottom: 10,
        textAlign: 'justify',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    featureText: {
        fontSize: 15,
        color: '#2c3e50',
        marginLeft: 15,
    },
    developerContainer: {
        backgroundColor: '#fff',
        margin: 15,
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
    developerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    developerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    developerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    developerInitial: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    developerInfo: {
        flex: 1,
    },
    developerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    developerRole: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactButton: {
        backgroundColor: '#3498db',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    footerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    copyrightText: {
        fontSize: 12,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#34495e',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 15,
        marginBottom: 30,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AboutScreen;