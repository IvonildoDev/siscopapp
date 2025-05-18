import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import KeyboardAwareScreen from '../components/KeyboardAwareScreen';
import globalStyles from '../styles/globalStyles';

function MobilizationScreen({
    origin, destination, displacementDistance,
    displacementEndTime,
    isMobilizando, setIsMobilizando,
    isDemobilizando, setIsDemobilizando,
    mobilizationStartTime, setMobilizationStartTime,
    mobilizationEndTime, setMobilizationEndTime,
    mobilizationDuration, setMobilizationDuration,
    operationSaved, // Novo prop para verificar se uma operação foi salva
    demobilizationStartTime, setDemobilizationStartTime, // Novos estados para desmobilização
    demobilizationEndTime, setDemobilizationEndTime,
    demobilizationDuration, setDemobilizationDuration
}) {
    // Estados locais
    const [localMobilizationStartTime, setLocalMobilizationStartTime] = useState(null);
    const [localMobilizationEndTime, setLocalMobilizationEndTime] = useState(null);
    const [localMobilizationDuration, setLocalMobilizationDuration] = useState(null);
    const [localDemobilizationStartTime, setLocalDemobilizationStartTime] = useState(null);
    const [localDemobilizationEndTime, setLocalDemobilizationEndTime] = useState(null);
    const [localDemobilizationDuration, setLocalDemobilizationDuration] = useState(null);

    // Verificação defensiva para garantir que as props foram devidamente inicializadas
    useEffect(() => {
        if (mobilizationStartTime === undefined) {
            console.warn("mobilizationStartTime é undefined. Inicializando com null.");
            setMobilizationStartTime(null);
        }

        if (mobilizationEndTime === undefined) {
            console.warn("mobilizationEndTime é undefined. Inicializando com null.");
            setMobilizationEndTime(null);
        }

        if (mobilizationDuration === undefined) {
            console.warn("mobilizationDuration é undefined. Inicializando com null.");
            setMobilizationDuration(null);
        }

        if (demobilizationStartTime === undefined) {
            console.warn("demobilizationStartTime é undefined. Inicializando com null.");
            setDemobilizationStartTime(null);
        }

        if (demobilizationEndTime === undefined) {
            console.warn("demobilizationEndTime é undefined. Inicializando com null.");
            setDemobilizationEndTime(null);
        }

        if (demobilizationDuration === undefined) {
            console.warn("demobilizationDuration é undefined. Inicializando com null.");
            setDemobilizationDuration(null);
        }
    }, []);

    // Funções para mobilização
    const startMobilization = () => {
        if (!displacementEndTime) {
            Alert.alert('Erro', 'Conclua o deslocamento primeiro');
            return;
        }

        const now = new Date();
        console.log("Iniciando mobilização:", now); // Debug
        setLocalMobilizationStartTime(now);
        setMobilizationStartTime(now); // Atualizar estado global também
        setIsMobilizando(true);
        Alert.alert('Sucesso', 'Mobilização iniciada');
    };

    const endMobilization = () => {
        if (!isMobilizando) {
            Alert.alert('Erro', 'Inicie a mobilização primeiro');
            return;
        }

        const now = new Date();
        console.log("Finalizando mobilização:", now); // Debug

        setLocalMobilizationEndTime(now);
        setMobilizationEndTime(now); // Atualizar estado global

        // Calcular duração da mobilização
        const startTime = localMobilizationStartTime || mobilizationStartTime;
        const durationMs = now - startTime;
        const durationMinutes = durationMs / (1000 * 60);

        console.log("Duração calculada:", durationMinutes); // Debug

        setLocalMobilizationDuration(durationMinutes);
        setMobilizationDuration(durationMinutes); // Atualizar estado global
        setIsMobilizando(false);

        Alert.alert(
            'Sucesso',
            `Mobilização finalizada!\nDuração: ${durationMinutes.toFixed(0)} minutos`
        );
    };

    // Funções para desmobilização
    const startDemobilization = () => {
        const now = new Date();
        setLocalDemobilizationStartTime(now);
        setDemobilizationStartTime(now); // Atualizar estado global
        setIsDemobilizando(true);
        Alert.alert('Sucesso', 'Desmobilização iniciada');
    };

    const endDemobilization = () => {
        if (!isDemobilizando) {
            Alert.alert('Erro', 'Inicie a desmobilização primeiro');
            return;
        }

        const now = new Date();
        setLocalDemobilizationEndTime(now);
        setDemobilizationEndTime(now); // Atualizar estado global

        // Calcular duração da desmobilização
        const startTime = localDemobilizationStartTime || demobilizationStartTime;
        const durationMs = now - startTime;
        const durationMinutes = durationMs / (1000 * 60);

        setLocalDemobilizationDuration(durationMinutes);
        setDemobilizationDuration(durationMinutes); // Atualizar estado global
        setIsDemobilizando(false);

        Alert.alert(
            'Sucesso',
            `Desmobilização finalizada!\nDuração: ${durationMinutes.toFixed(0)} minutos`
        );
    };

    return (
        <KeyboardAwareScreen>
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Mobilização</Text>

                {displacementEndTime && (
                    <View style={globalStyles.infoCard}>
                        <Text style={globalStyles.infoTitle}>Deslocamento Concluído</Text>
                        <Text>Origem: {origin} → Destino: {destination}</Text>
                        <Text>Distância: {displacementDistance ? displacementDistance.toFixed(1) + ' km' : 'N/A'}</Text>
                    </View>
                )}

                <View style={globalStyles.buttonRow}>
                    <TouchableOpacity
                        style={[globalStyles.button, (isMobilizando || !displacementEndTime) && globalStyles.disabledButton]}
                        disabled={isMobilizando || !displacementEndTime}
                        onPress={startMobilization}
                    >
                        <Text style={globalStyles.buttonText}>Iniciar Mobilização</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[globalStyles.button, !isMobilizando && globalStyles.disabledButton]}
                        disabled={!isMobilizando}
                        onPress={endMobilization}
                    >
                        <Text style={globalStyles.buttonText}>Finalizar Mobilização</Text>
                    </TouchableOpacity>
                </View>

                {(localMobilizationDuration !== null || mobilizationDuration !== null) && (
                    <View style={globalStyles.infoCard}>
                        <Text style={globalStyles.infoTitle}>Mobilização Concluída</Text>
                        <Text>Início: {(localMobilizationStartTime || mobilizationStartTime)?.toLocaleString() || 'N/A'}</Text>
                        <Text>Fim: {(localMobilizationEndTime || mobilizationEndTime)?.toLocaleString() || 'N/A'}</Text>
                        <Text>Duração: {(localMobilizationDuration || mobilizationDuration)?.toFixed(0)} minutos</Text>
                    </View>
                )}
            </View>

            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Desmobilização</Text>

                <View style={globalStyles.buttonRow}>
                    <TouchableOpacity
                        style={[globalStyles.button,
                        (!operationSaved || isDemobilizando) && globalStyles.disabledButton]}
                        disabled={!operationSaved || isDemobilizando}
                        onPress={startDemobilization}
                    >
                        <Text style={globalStyles.buttonText}>Iniciar Desmobilização</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[globalStyles.button, !isDemobilizando && globalStyles.disabledButton]}
                        disabled={!isDemobilizando}
                        onPress={endDemobilization}
                    >
                        <Text style={globalStyles.buttonText}>Finalizar Desmobilização</Text>
                    </TouchableOpacity>
                </View>

                {(localDemobilizationDuration !== null || demobilizationDuration !== null) && (
                    <View style={globalStyles.infoCard}>
                        <Text style={globalStyles.infoTitle}>Desmobilização Concluída</Text>
                        <Text>Início: {(localDemobilizationStartTime || demobilizationStartTime)?.toLocaleString() || 'N/A'}</Text>
                        <Text>Fim: {(localDemobilizationEndTime || demobilizationEndTime)?.toLocaleString() || 'N/A'}</Text>
                        <Text>Duração: {(localDemobilizationDuration || demobilizationDuration)?.toFixed(0)} minutos</Text>
                    </View>
                )}
            </View>

            {/* Resumo de tempos para o relatório */}
            {(mobilizationDuration !== null || demobilizationDuration !== null) && (
                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Resumo para Relatório</Text>

                    <View style={globalStyles.infoCard}>
                        <Text style={globalStyles.infoTitle}>Tempo Total da Operação</Text>

                        <Text>Deslocamento: {origin} → {destination}</Text>
                        <Text>Distância: {displacementDistance?.toFixed(1) || 'N/A'} km</Text>

                        {/* Verificação segura para informações de mobilização */}
                        {(mobilizationStartTime && mobilizationEndTime && mobilizationDuration !== null) && (
                            <View style={globalStyles.timeItem}>
                                <Text>Mobilização:</Text>
                                <Text>Início: {mobilizationStartTime.toLocaleString()}</Text>
                                <Text>Fim: {mobilizationEndTime.toLocaleString()}</Text>
                                <Text>Duração: {mobilizationDuration.toFixed(0)} minutos</Text>
                            </View>
                        )}

                        {/* Verificação segura para informações de desmobilização */}
                        {(demobilizationStartTime && demobilizationEndTime && demobilizationDuration !== null) && (
                            <View style={globalStyles.timeItem}>
                                <Text>Desmobilização:</Text>
                                <Text>Início: {demobilizationStartTime.toLocaleString()}</Text>
                                <Text>Fim: {demobilizationEndTime.toLocaleString()}</Text>
                                <Text>Duração: {demobilizationDuration.toFixed(0)} minutos</Text>
                            </View>
                        )}

                        {/* Verificação segura para tempo total */}
                        {(mobilizationDuration !== null && demobilizationDuration !== null) && (
                            <Text style={globalStyles.totalTime}>
                                Tempo Total: {(mobilizationDuration + demobilizationDuration).toFixed(0)} minutos
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </KeyboardAwareScreen>
    );
}

export default MobilizationScreen;