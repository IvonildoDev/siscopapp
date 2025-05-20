import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';

const LunchScreen = ({
    isLunchBreak, setIsLunchBreak,
    lunchStartTime, setLunchStartTime,
    lunchEndTime, setLunchEndTime,
    lunchDuration, setLunchDuration,
    history, setHistory, saveHistory
}) => {
    const [elapsedTimeInterval, setElapsedTimeInterval] = useState(null);
    const [currentElapsedTime, setCurrentElapsedTime] = useState(0);
    const [lunchHistory, setLunchHistory] = useState([]);

    // Efeito para atualizar o tempo decorrido em tempo real
    useEffect(() => {
        if (isLunchBreak && lunchStartTime) {
            // Iniciar o intervalo para atualizar o tempo decorrido
            const interval = setInterval(() => {
                const now = new Date();
                const elapsed = (now - lunchStartTime) / (1000 * 60); // em minutos
                setCurrentElapsedTime(elapsed);
            }, 1000); // Atualiza a cada segundo

            setElapsedTimeInterval(interval);

            return () => clearInterval(interval);
        } else if (elapsedTimeInterval) {
            clearInterval(elapsedTimeInterval);
            setElapsedTimeInterval(null);
        }
    }, [isLunchBreak, lunchStartTime]);

    // Função para iniciar o intervalo de almoço
    const startLunch = () => {
        if (isLunchBreak) {
            Alert.alert('Aviso', 'Já existe um intervalo de almoço em andamento.');
            return;
        }

        const now = new Date();
        setLunchStartTime(now);
        setLunchEndTime(null);
        setLunchDuration(0);
        setIsLunchBreak(true);

        Alert.alert('Sucesso', 'Intervalo de almoço iniciado');
    };

    // Função para finalizar o intervalo de almoço
    const endLunch = () => {
        if (!isLunchBreak || !lunchStartTime) {
            Alert.alert('Erro', 'Inicie o intervalo de almoço primeiro');
            return;
        }

        const now = new Date();
        setLunchEndTime(now);

        // Calcular duração em minutos
        const durationMs = now - lunchStartTime;
        const durationMinutes = durationMs / (1000 * 60);

        setLunchDuration(durationMinutes);
        setIsLunchBreak(false);

        // Adicionar ao histórico local
        const newLunchRecord = {
            startTime: lunchStartTime.toISOString(),
            endTime: now.toISOString(),
            duration: durationMinutes
        };

        const updatedLunchHistory = [...lunchHistory, newLunchRecord];
        setLunchHistory(updatedLunchHistory);

        // Atualizar histórico de operações se existir uma operação atual
        if (history && history.length > 0) {
            const lastOperation = { ...history[history.length - 1] };

            // Criar ou atualizar o campo de intervalos de almoço na operação
            const lunchBreaks = lastOperation.lunchBreaks || [];
            lunchBreaks.push(newLunchRecord);

            lastOperation.lunchBreaks = lunchBreaks;
            lastOperation.totalLunchTime = (lastOperation.totalLunchTime || 0) + durationMinutes;

            const updatedHistory = [...history.slice(0, -1), lastOperation];
            setHistory(updatedHistory);
            saveHistory(updatedHistory);
        }

        Alert.alert(
            'Sucesso',
            `Intervalo de almoço finalizado!\nDuração: ${formatTime(durationMinutes)}`
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

    // Calcular o tempo total de almoço
    const calculateTotalLunchTime = () => {
        return lunchHistory.reduce((total, lunch) => total + lunch.duration, 0);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Controle de Horário de Almoço</Text>

                {isLunchBreak ? (
                    <View style={styles.lunchActiveCard}>
                        <View style={styles.statusContainer}>
                            <Ionicons name="restaurant" size={24} color="#e67e22" />
                            <Text style={styles.lunchActiveTitle}>ALMOÇO EM ANDAMENTO</Text>
                        </View>

                        <View style={styles.timeContainer}>
                            <Text style={styles.timeLabel}>Iniciado às:</Text>
                            <Text style={styles.timeValue}>
                                {lunchStartTime.toLocaleTimeString()}
                            </Text>
                        </View>

                        <View style={styles.timeContainer}>
                            <Text style={styles.timeLabel}>Tempo decorrido:</Text>
                            <Text style={styles.elapsedTimeValue}>
                                {formatTime(currentElapsedTime)}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.lunchInactiveCard}>
                        <View style={styles.statusContainer}>
                            <Ionicons name="restaurant-outline" size={24} color="#7f8c8d" />
                            <Text style={styles.lunchInactiveTitle}>ALMOÇO NÃO INICIADO</Text>
                        </View>

                        <Text style={styles.lunchInstructions}>
                            Registre seu intervalo de almoço utilizando os botões abaixo.
                        </Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.startButton,
                            isLunchBreak && styles.disabledButton
                        ]}
                        onPress={startLunch}
                        disabled={isLunchBreak}
                    >
                        <Ionicons name="play-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Iniciar Almoço</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.endButton,
                            !isLunchBreak && styles.disabledButton
                        ]}
                        onPress={endLunch}
                        disabled={!isLunchBreak}
                    >
                        <Ionicons name="stop-circle-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Finalizar Almoço</Text>
                    </TouchableOpacity>
                </View>

                {lunchHistory.length > 0 && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>
                            Histórico de Almoços
                        </Text>

                        {lunchHistory.map((lunch, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Text style={styles.historyItemTitle}>
                                    Almoço {index + 1}
                                </Text>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Início:</Text>
                                    <Text style={styles.historyValue}>
                                        {new Date(lunch.startTime).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Fim:</Text>
                                    <Text style={styles.historyValue}>
                                        {new Date(lunch.endTime).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.historyDetail}>
                                    <Text style={styles.historyLabel}>Duração:</Text>
                                    <Text style={styles.historyDuration}>
                                        {formatTime(lunch.duration)}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.totalTimeContainer}>
                            <Text style={styles.totalTimeLabel}>
                                Tempo Total de Almoço:
                            </Text>
                            <Text style={styles.totalTimeValue}>
                                {formatTime(calculateTotalLunchTime())}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
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
    lunchActiveCard: {
        backgroundColor: '#fef9e7',
        borderWidth: 1,
        borderColor: '#f9e79f',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    lunchInactiveCard: {
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
    lunchActiveTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e67e22',
        marginLeft: 8,
    },
    lunchInactiveTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7f8c8d',
        marginLeft: 8,
    },
    lunchInstructions: {
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
        borderBottomColor: '#f0e6d2',
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
        color: '#e67e22',
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
        borderLeftColor: '#e67e22',
    },
    historyItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 8,
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
        color: '#e67e22',
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
        color: '#e67e22',
    },
});

export default LunchScreen;