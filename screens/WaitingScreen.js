import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';

const WaitingScreen = ({
    isWaiting, setIsWaiting,
    waitingStartTime, setWaitingStartTime,
    waitingEndTime, setWaitingEndTime,
    waitingDuration, setWaitingDuration,
    waitingReasons, setWaitingReasons,
    history, setHistory, saveHistory
}) => {
    // Estado local para observações do modal
    const [observations, setObservations] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [remainingChars, setRemainingChars] = useState(200);
    const [elapsedTimeInterval, setElapsedTimeInterval] = useState(null);
    const [currentElapsedTime, setCurrentElapsedTime] = useState(0);

    // Efeito para atualizar o contador de caracteres restantes
    useEffect(() => {
        setRemainingChars(200 - observations.length);
    }, [observations]);

    // Efeito para atualizar o tempo decorrido em tempo real
    useEffect(() => {
        if (isWaiting && waitingStartTime) {
            // Iniciar o intervalo para atualizar o tempo decorrido
            const interval = setInterval(() => {
                const now = new Date();
                const elapsed = (now - waitingStartTime) / (1000 * 60); // em minutos
                setCurrentElapsedTime(elapsed);
            }, 1000); // Atualiza a cada segundo

            setElapsedTimeInterval(interval);

            return () => clearInterval(interval);
        } else if (elapsedTimeInterval) {
            clearInterval(elapsedTimeInterval);
            setElapsedTimeInterval(null);
        }
    }, [isWaiting, waitingStartTime]);

    // Função para iniciar o período de aguardo
    const startWaiting = () => {
        setModalVisible(true);
    };

    // Função para confirmar o início do período de aguardo após preencher as observações
    const confirmStartWaiting = () => {
        if (!observations.trim()) {
            Alert.alert('Erro', 'Insira uma observação para o período de aguardo');
            return;
        }

        const now = new Date();
        setWaitingStartTime(now);
        setIsWaiting(true);

        // Adicionar a observação ao histórico de razões
        const newReason = {
            timestamp: now.toISOString(),
            reason: observations,
        };

        const updatedReasons = [...(waitingReasons || []), newReason];
        setWaitingReasons(updatedReasons);

        // Limpar campo de observações e fechar modal
        setObservations('');
        setModalVisible(false);

        Alert.alert('Sucesso', 'Período de aguardo iniciado');
    };

    // Função para finalizar o período de aguardo
    const endWaiting = () => {
        if (!isWaiting || !waitingStartTime) {
            Alert.alert('Erro', 'Inicie o período de aguardo primeiro');
            return;
        }

        const now = new Date();
        setWaitingEndTime(now);

        // Calcular duração em minutos
        const durationMs = now - waitingStartTime;
        const durationMinutes = durationMs / (1000 * 60);

        setWaitingDuration(durationMinutes);
        setIsWaiting(false);

        // Atualizar histórico se necessário
        if (history && history.length > 0) {
            const lastOperation = { ...history[history.length - 1] };

            // Criar ou atualizar o campo de períodos de aguardo na operação
            const waitingPeriods = lastOperation.waitingPeriods || [];
            waitingPeriods.push({
                startTime: waitingStartTime.toISOString(),
                endTime: now.toISOString(),
                duration: durationMinutes,
                reasons: waitingReasons
            });

            lastOperation.waitingPeriods = waitingPeriods;
            lastOperation.totalWaitingTime = (lastOperation.totalWaitingTime || 0) + durationMinutes;

            const updatedHistory = [...history.slice(0, -1), lastOperation];
            setHistory(updatedHistory);
            saveHistory(updatedHistory);
        }

        Alert.alert(
            'Sucesso',
            `Período de aguardo finalizado!\nDuração: ${durationMinutes.toFixed(0)} minutos`
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Controle de Aguardo</Text>

                {isWaiting ? (
                    <View style={styles.waitingCard}>
                        <Text style={styles.waitingTitle}>
                            <Ionicons name="time" size={24} color="#e74c3c" /> AGUARDANDO
                        </Text>
                        <Text style={styles.waitingTime}>
                            Tempo decorrido: {formatTime(currentElapsedTime)}
                        </Text>
                        <Text style={styles.waitingSubtitle}>Motivo do aguardo:</Text>
                        {waitingReasons && waitingReasons.length > 0 && (
                            <View style={styles.reasonsContainer}>
                                <Text style={styles.reasonText}>
                                    {waitingReasons[waitingReasons.length - 1].reason}
                                </Text>
                                <Text style={styles.reasonTimestamp}>
                                    Registrado em: {new Date(waitingReasons[waitingReasons.length - 1].timestamp).toLocaleString()}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.instructions}>
                        <Text style={styles.instructionText}>
                            Registre períodos de aguardo durante a operação.
                        </Text>
                        <Text style={styles.instructionText}>
                            Informe o motivo ao iniciar e registre quando finalizar.
                        </Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.startButton,
                            isWaiting && styles.disabledButton
                        ]}
                        onPress={startWaiting}
                        disabled={isWaiting}
                    >
                        <Ionicons name="play-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Iniciar Aguardo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.endButton,
                            !isWaiting && styles.disabledButton
                        ]}
                        onPress={endWaiting}
                        disabled={!isWaiting}
                    >
                        <Ionicons name="stop-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Finalizar Aguardo</Text>
                    </TouchableOpacity>
                </View>

                {waitingReasons && waitingReasons.length > 0 && !isWaiting && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>Histórico de Aguardos</Text>
                        {waitingReasons.map((item, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Text style={styles.historyReason}>{item.reason}</Text>
                                <Text style={styles.historyTimestamp}>
                                    {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Modal para inserir observações */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Motivo do Aguardo</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Descreva o motivo do aguardo (até 200 caracteres)"
                            multiline={true}
                            numberOfLines={4}
                            maxLength={200}
                            value={observations}
                            onChangeText={setObservations}
                        />

                        <Text style={[
                            styles.charCounter,
                            remainingChars < 50 ? styles.charCounterWarning : null,
                            remainingChars < 20 ? styles.charCounterDanger : null
                        ]}>
                            {remainingChars} caracteres restantes
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setObservations('');
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmStartWaiting}
                            >
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
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
    waitingCard: {
        backgroundColor: '#fff9f9',
        borderWidth: 1,
        borderColor: '#ffcccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    waitingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10,
        textAlign: 'center',
    },
    waitingTime: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    waitingSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 5,
    },
    instructions: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
    },
    instructionText: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 5,
    },
    buttonRow: {
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
        backgroundColor: '#3498db',
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
    reasonsContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reasonText: {
        fontSize: 14,
        color: '#2c3e50',
    },
    reasonTimestamp: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 5,
        fontStyle: 'italic',
    },
    historySection: {
        marginTop: 10,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    historyItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        padding: 10,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#3498db',
    },
    historyReason: {
        fontSize: 14,
        color: '#2c3e50',
    },
    historyTimestamp: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
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
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    charCounter: {
        fontSize: 12,
        color: '#7f8c8d',
        textAlign: 'right',
        marginTop: 5,
    },
    charCounterWarning: {
        color: '#f39c12',
    },
    charCounterDanger: {
        color: '#e74c3c',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#7f8c8d',
    },
    confirmButton: {
        backgroundColor: '#2ecc71',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default WaitingScreen;