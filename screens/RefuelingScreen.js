import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';

const RefuelingScreen = ({
    isRefueling, setIsRefueling,
    refuelingStartTime, setRefuelingStartTime,
    refuelingEndTime, setRefuelingEndTime,
    refuelingDuration, setRefuelingDuration,
    refuelingType, setRefuelingType,
    refuelingHistory, setRefuelingHistory,
    history, setHistory, saveHistory
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [elapsedTimeInterval, setElapsedTimeInterval] = useState(null);
    const [currentElapsedTime, setCurrentElapsedTime] = useState(0);

    // Efeito para atualizar o tempo decorrido em tempo real
    useEffect(() => {
        if (isRefueling && refuelingStartTime) {
            // Iniciar o intervalo para atualizar o tempo decorrido
            const interval = setInterval(() => {
                const now = new Date();
                const elapsed = (now - refuelingStartTime) / (1000 * 60); // em minutos
                setCurrentElapsedTime(elapsed);
            }, 1000); // Atualiza a cada segundo

            setElapsedTimeInterval(interval);

            return () => clearInterval(interval);
        } else if (elapsedTimeInterval) {
            clearInterval(elapsedTimeInterval);
            setElapsedTimeInterval(null);
        }
    }, [isRefueling, refuelingStartTime]);

    // Função para iniciar a seleção de tipo de abastecimento
    const startRefuelingSelection = () => {
        if (isRefueling) {
            Alert.alert('Aviso', 'Já existe um abastecimento em andamento.');
            return;
        }
        setModalVisible(true);
    };

    // Função para iniciar o abastecimento com o tipo selecionado
    const startRefueling = (type) => {
        const now = new Date();
        setRefuelingStartTime(now);
        setRefuelingEndTime(null);
        setRefuelingDuration(0);
        setRefuelingType(type);
        setIsRefueling(true);
        setModalVisible(false);

        Alert.alert('Sucesso', `Abastecimento de ${type} iniciado`);
    };

    // Função para finalizar o abastecimento
    const endRefueling = () => {
        if (!isRefueling || !refuelingStartTime) {
            Alert.alert('Erro', 'Inicie um abastecimento primeiro');
            return;
        }

        const now = new Date();
        setRefuelingEndTime(now);

        // Calcular duração em minutos
        const durationMs = now - refuelingStartTime;
        const durationMinutes = durationMs / (1000 * 60);

        setRefuelingDuration(durationMinutes);
        setIsRefueling(false);

        // Criar um novo registro de abastecimento
        const newRefuelingRecord = {
            startTime: refuelingStartTime.toISOString(),
            endTime: now.toISOString(),
            duration: durationMinutes,
            type: refuelingType
        };

        // Atualizar o histórico local
        const updatedRefuelingHistory = [...refuelingHistory, newRefuelingRecord];
        setRefuelingHistory(updatedRefuelingHistory);

        // Atualizar histórico de operações se existir uma operação atual
        if (history && history.length > 0) {
            const lastOperation = { ...history[history.length - 1] };

            // Criar ou atualizar o campo de abastecimentos na operação
            const refuelings = lastOperation.refuelings || [];
            refuelings.push(newRefuelingRecord);

            lastOperation.refuelings = refuelings;
            lastOperation.totalRefuelingTime = (lastOperation.totalRefuelingTime || 0) + durationMinutes;

            const updatedHistory = [...history.slice(0, -1), lastOperation];
            setHistory(updatedHistory);
            saveHistory(updatedHistory);
        }

        Alert.alert(
            'Sucesso',
            `Abastecimento de ${refuelingType} finalizado!\nDuração: ${formatTime(durationMinutes)}`
        );
    };

    // Formatar tempo em horas e minutos
    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${Math.floor(minutes)} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = Math.floor(minutes % 60);
            return `${hours}h ${mins}min`;
        }
    };

    // Calcular o tempo total de abastecimento
    const calculateTotalRefuelingTime = () => {
        return refuelingHistory.reduce((total, refueling) => total + refueling.duration, 0);
    };

    // Obter ícone baseado no tipo de abastecimento
    const getRefuelingIcon = (type) => {
        return type.toLowerCase() === 'água' ? 'water-outline' : 'flame-outline';
    };

    // Obter cor baseada no tipo de abastecimento
    const getRefuelingColor = (type) => {
        return type.toLowerCase() === 'água' ? '#3498db' : '#e67e22';
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Controle de Abastecimento</Text>

                {isRefueling ? (
                    <View style={[
                        styles.refuelingActiveCard,
                        { borderColor: getRefuelingColor(refuelingType) + '4D' } // 30% opacity
                    ]}>
                        <View style={styles.statusContainer}>
                            <Ionicons
                                name={getRefuelingIcon(refuelingType)}
                                size={24}
                                color={getRefuelingColor(refuelingType)}
                            />
                            <Text style={[
                                styles.refuelingActiveTitle,
                                { color: getRefuelingColor(refuelingType) }
                            ]}>
                                ABASTECIMENTO DE {refuelingType.toUpperCase()} EM ANDAMENTO
                            </Text>
                        </View>

                        <View style={styles.timeContainer}>
                            <Text style={styles.timeLabel}>Iniciado às:</Text>
                            <Text style={styles.timeValue}>
                                {refuelingStartTime.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>

                        <View style={styles.timeContainer}>
                            <Text style={styles.timeLabel}>Tempo decorrido:</Text>
                            <Text style={[
                                styles.elapsedTimeValue,
                                { color: getRefuelingColor(refuelingType) }
                            ]}>
                                {formatTime(currentElapsedTime)}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.refuelingInactiveCard}>
                        <View style={styles.statusContainer}>
                            <Ionicons name="car-outline" size={24} color="#7f8c8d" />
                            <Text style={styles.refuelingInactiveTitle}>ABASTECIMENTO NÃO INICIADO</Text>
                        </View>

                        <Text style={styles.refuelingInstructions}>
                            Registre um abastecimento utilizando os botões abaixo.
                            Você poderá escolher entre água ou combustível.
                        </Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.startButton,
                            isRefueling && styles.disabledButton
                        ]}
                        onPress={startRefuelingSelection}
                        disabled={isRefueling}
                    >
                        <Ionicons name="play-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Iniciar Abastecimento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.endButton,
                            !isRefueling && styles.disabledButton
                        ]}
                        onPress={endRefueling}
                        disabled={!isRefueling}
                    >
                        <Ionicons name="stop-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Finalizar Abastecimento</Text>
                    </TouchableOpacity>
                </View>

                {refuelingHistory.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>
                            Histórico de Abastecimentos
                        </Text>

                        {refuelingHistory.map((refueling, index) => (
                            <View key={index} style={[
                                styles.historyItem,
                                { borderLeftColor: getRefuelingColor(refueling.type) }
                            ]}>
                                <View style={styles.historyItemHeader}>
                                    <Ionicons
                                        name={getRefuelingIcon(refueling.type)}
                                        size={18}
                                        color={getRefuelingColor(refueling.type)}
                                    />
                                    <Text style={styles.historyItemTitle}>
                                        Abastecimento de {refueling.type}
                                    </Text>
                                </View>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Início:</Text>
                                    <Text style={styles.historyValue}>
                                        {new Date(refueling.startTime).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Fim:</Text>
                                    <Text style={styles.historyValue}>
                                        {new Date(refueling.endTime).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Duração:</Text>
                                    <Text style={[
                                        styles.historyDuration,
                                        { color: getRefuelingColor(refueling.type) }
                                    ]}>
                                        {formatTime(refueling.duration)}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.totalTimeContainer}>
                            <Text style={styles.totalTimeLabel}>
                                Tempo Total de Abastecimento:
                            </Text>
                            <Text style={styles.totalTimeValue}>
                                {formatTime(calculateTotalRefuelingTime())}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Modal para selecionar tipo de abastecimento */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Tipo de Abastecimento</Text>

                        <TouchableOpacity
                            style={[styles.typeButton, styles.waterButton]}
                            onPress={() => startRefueling('Água')}
                        >
                            <Ionicons name="water-outline" size={28} color="#fff" />
                            <Text style={styles.typeButtonText}>Água</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeButton, styles.fuelButton]}
                            onPress={() => startRefueling('Combustível')}
                        >
                            <Ionicons name="flame-outline" size={28} color="#fff" />
                            <Text style={styles.typeButtonText}>Combustível</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 15,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    refuelingActiveCard: {
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#f9e79f',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    refuelingInactiveCard: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    refuelingActiveTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    refuelingInactiveTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7f8c8d',
        marginLeft: 8,
    },
    refuelingInstructions: {
        textAlign: 'center',
        color: '#34495e',
        fontSize: 14,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    timeLabel: {
        fontSize: 14,
        color: '#34495e',
        fontWeight: '600',
    },
    timeValue: {
        fontSize: 14,
        color: '#2c3e50',
    },
    elapsedTimeValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    startButton: {
        backgroundColor: '#2ecc71',
    },
    endButton: {
        backgroundColor: '#e74c3c',
    },
    disabledButton: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
    },
    historySection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
    },
    historyItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
    },
    historyItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    historyItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
        marginLeft: 8,
    },
    historyDetail: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    historyLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        width: 70,
    },
    historyValue: {
        fontSize: 14,
        color: '#2c3e50',
        flex: 1,
    },
    historyDuration: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalTimeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    totalTimeValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    waterButton: {
        backgroundColor: '#3498db',
    },
    fuelButton: {
        backgroundColor: '#e67e22',
    },
    typeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#7f8c8d',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default RefuelingScreen;