import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext'; // Importe o contexto de autenticação

function OperationsScreen({
    // Props existentes para operação
    operationStart, setOperationStart,
    operationEnd, setOperationEnd,
    operationType, setOperationType,
    city, setCity,
    wellServiceName, setWellServiceName,
    operatorName, setOperatorName,
    volume, setVolume,
    temperature, setTemperature,
    pressure, setPressure,
    activities, setActivities,

    // Props para deslocamento
    origin, destination, startKm, endKm,

    // Props para mobilização
    mobilizationStartTime, setMobilizationStartTime,
    mobilizationEndTime, setMobilizationEndTime,
    mobilizationDuration, setMobilizationDuration,
    isMobilizando, setIsMobilizando,

    // Props para desmobilização
    demobilizationStartTime, setDemobilizationStartTime,
    demobilizationEndTime, setDemobilizationEndTime,
    demobilizationDuration, setDemobilizationDuration,
    isDemobilizando, setIsDemobilizando,

    // Props para histórico e estado da operação
    history, setHistory, saveHistory,
    operationSaved, setOperationSaved,

    // Navegação
    navigation
}) {
    // Estados locais para os campos
    const [localOperationType, setLocalOperationType] = useState(operationType);
    const [localCity, setLocalCity] = useState(city);
    const [localWellServiceName, setLocalWellServiceName] = useState(wellServiceName);
    const [localOperatorName, setLocalOperatorName] = useState(operatorName);
    const [localVolume, setLocalVolume] = useState(volume);
    const [localTemperature, setLocalTemperature] = useState(temperature);
    const [localPressure, setLocalPressure] = useState(pressure);
    const [localActivities, setLocalActivities] = useState(activities);

    // Estado local para controle de mobilização/desmobilização dentro da tela
    const [mobilizationActive, setMobilizationActive] = useState(false);
    const [demobilizationActive, setDemobilizationActive] = useState(false);

    // Funções para iniciar e encerrar operação
    const startOperation = () => {
        const now = new Date();
        setOperationStart(now);
        Alert.alert('Sucesso', 'Operação iniciada');
    };

    // Função de mobilização
    const startMobilization = () => {
        if (!origin || !destination) {
            Alert.alert('Erro', 'Configure o deslocamento antes de iniciar a mobilização');
            return;
        }

        const now = new Date();
        setMobilizationStartTime(now);
        setIsMobilizando(true);
        setMobilizationActive(true);
        Alert.alert('Sucesso', 'Mobilização iniciada');
    };

    const endMobilization = () => {
        if (!isMobilizando || !mobilizationStartTime) {
            Alert.alert('Erro', 'Inicie a mobilização primeiro');
            return;
        }

        const now = new Date();
        setMobilizationEndTime(now);

        // Calcular duração em minutos
        const durationMs = now - mobilizationStartTime;
        const durationMinutes = durationMs / (1000 * 60);

        setMobilizationDuration(durationMinutes);
        setIsMobilizando(false);

        Alert.alert(
            'Sucesso',
            `Mobilização finalizada!\nDuração: ${durationMinutes.toFixed(0)} minutos`
        );
    };

    // Função para salvar a operação
    const saveOperation = () => {
        // Validações básicas
        if (!operationStart) {
            Alert.alert('Erro', 'Inicie a operação primeiro');
            return;
        }

        if (!localOperationType || !localCity || !localWellServiceName || !localOperatorName) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
            return;
        }

        // Remover a validação de mobilização obrigatória
        // if (mobilizationActive && (!mobilizationEndTime || !mobilizationDuration)) {
        //     Alert.alert('Erro', 'Conclua a mobilização antes de salvar a operação');
        //     return;
        // }

        const now = new Date();
        setOperationEnd(now);

        // Criar objeto da operação
        const newOperation = {
            id: Date.now().toString(),
            startTime: operationStart.toISOString(),
            endTime: now.toISOString(),
            type: localOperationType,
            city: localCity,
            wellService: localWellServiceName,
            operator: localOperatorName,
            volume: localVolume,
            temperature: localTemperature,
            pressure: localPressure,
            activities: localActivities,

            // Dados de deslocamento
            origin: origin || '',
            destination: destination || '',
            startKm: startKm || '',
            endKm: endKm || '',

            // Dados de mobilização
            mobilizationStartTime: mobilizationStartTime ? mobilizationStartTime.toISOString() : null,
            mobilizationEndTime: mobilizationEndTime ? mobilizationEndTime.toISOString() : null,
            mobilizationDuration: mobilizationDuration,

            // Campos para desmobilização (serão preenchidos depois)
            demobilizationStartTime: null,
            demobilizationEndTime: null,
            demobilizationDuration: null
        };

        // Atualizar histórico
        const updatedHistory = [...history, newOperation];
        setHistory(updatedHistory);
        saveHistory(updatedHistory);

        // Indicar que a operação foi salva
        setOperationSaved(true);

        Alert.alert('Sucesso', 'Operação salva com sucesso');

        // Limpar campos locais
        setLocalOperationType('');
        setLocalCity('');
        setLocalWellServiceName('');
        setLocalOperatorName('');
        setLocalVolume('');
        setLocalTemperature('');
        setLocalPressure('');
        setLocalActivities('');
    };

    // Funções para desmobilização
    const startDemobilization = () => {
        if (!operationSaved) {
            Alert.alert('Erro', 'Salve uma operação antes de iniciar a desmobilização');
            return;
        }

        const now = new Date();
        setDemobilizationStartTime(now);
        setIsDemobilizando(true);
        setDemobilizationActive(true);
        Alert.alert('Sucesso', 'Desmobilização iniciada');
    };

    const endDemobilization = () => {
        if (!isDemobilizando || !demobilizationStartTime) {
            Alert.alert('Erro', 'Inicie a desmobilização primeiro');
            return;
        }

        const now = new Date();
        setDemobilizationEndTime(now);

        // Calcular duração em minutos
        const durationMs = now - demobilizationStartTime;
        const durationMinutes = durationMs / (1000 * 60);

        setDemobilizationDuration(durationMinutes);
        setIsDemobilizando(false);

        // Atualizar o histórico com os dados de desmobilização
        if (history.length > 0) {
            const lastOperation = { ...history[history.length - 1] };
            lastOperation.demobilizationStartTime = demobilizationStartTime.toISOString();
            lastOperation.demobilizationEndTime = now.toISOString();
            lastOperation.demobilizationDuration = durationMinutes;

            const updatedHistory = [...history.slice(0, -1), lastOperation];
            setHistory(updatedHistory);
            saveHistory(updatedHistory);
        }

        Alert.alert(
            'Sucesso',
            `Desmobilização finalizada!\nDuração: ${durationMinutes.toFixed(0)} minutos`
        );

        // Reiniciar estados para nova operação
        setOperationSaved(false);
        setMobilizationActive(false);
        setDemobilizationActive(false);
    };

    // Validação para aceitar apenas números no campo de pressão
    const handlePressureChange = (text) => {
        // Remover qualquer caractere que não seja número ou ponto decimal
        const filteredText = text.replace(/[^0-9.]/g, '');
        setLocalPressure(filteredText);
    };

    // Pegue os dados do usuário logado
    const { user } = useContext(AuthContext);

    // Exemplo de fallback caso user não esteja definido
    const operador = user?.name || '';
    const auxiliar = user?.auxiliarName || '';
    const unidade = user?.unit || '';
    const placa = user?.vehiclePlate || '';

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // ajuste conforme necessário
        >
            <ScrollView
                style={globalStyles.scrollView}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header com informações do operador, auxiliar, unidade e placa */}
                {/* <View style={[globalStyles.section, { marginBottom: 10, backgroundColor: '#eaf6fb', borderRadius: 8 }]}>
                    <Text style={[globalStyles.sectionTitle, { marginBottom: 5 }]}>Dados do Operador</Text>
                    <Text>Operador: <Text style={{ fontWeight: 'bold' }}>{operador}</Text></Text>
                    <Text>Auxiliar: <Text style={{ fontWeight: 'bold' }}>{auxiliar}</Text></Text>
                    <Text>Unidade: <Text style={{ fontWeight: 'bold' }}>{unidade}</Text></Text>
                    <Text>Placa do Veículo: <Text style={{ fontWeight: 'bold' }}>{placa}</Text></Text>
                </View> */}

                {/* Seção de Mobilização */}
                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Mobilização</Text>

                    {mobilizationActive && mobilizationStartTime && !mobilizationEndTime ? (
                        <View style={globalStyles.infoCard}>
                            <Text style={globalStyles.infoTitle}>Mobilização em andamento</Text>
                            <Text>Início: {mobilizationStartTime.toLocaleString()}</Text>
                            <Text>Origem: {origin || 'N/A'}</Text>
                            <Text>Destino: {destination || 'N/A'}</Text>
                        </View>
                    ) : mobilizationEndTime ? (
                        <View style={globalStyles.infoCard}>
                            <Text style={globalStyles.infoTitle}>Mobilização concluída</Text>
                            <Text>Início: {mobilizationStartTime.toLocaleString()}</Text>
                            <Text>Fim: {mobilizationEndTime.toLocaleString()}</Text>
                            <Text>Duração: {mobilizationDuration.toFixed(0)} minutos</Text>
                        </View>
                    ) : null}

                    <View style={globalStyles.buttonRow}>
                        <TouchableOpacity
                            style={[globalStyles.button, isMobilizando && globalStyles.disabledButton]}
                            onPress={startMobilization}
                            disabled={isMobilizando || mobilizationEndTime !== null}
                        >
                            <Text style={globalStyles.buttonText}>Iniciar Mobilização</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[globalStyles.button, (!isMobilizando) && globalStyles.disabledButton]}
                            onPress={endMobilization}
                            disabled={!isMobilizando}
                        >
                            <Text style={globalStyles.buttonText}>Finalizar Mobilização</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Seção de Operação */}
                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Controle de Operações</Text>

                    <View style={globalStyles.operationTimeGroup}>
                        <Text style={globalStyles.timeText}>
                            {operationStart ? `Início: ${operationStart.toLocaleString()}` : 'Operação não iniciada'}
                        </Text>
                        <TouchableOpacity
                            style={[globalStyles.timeButton, operationStart && globalStyles.disabledButton]}
                            onPress={startOperation}
                            disabled={operationStart !== null}
                        >
                            <Text style={globalStyles.buttonText}>Iniciar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tipo de Operação - Agora como texto manual */}
                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Tipo de Operação *</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localOperationType}
                            onChangeText={setLocalOperationType}
                            placeholder="Digite o tipo de operação"
                        />
                    </View>

                    {/* Campos restantes da operação */}
                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Cidade *</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localCity}
                            onChangeText={setLocalCity}
                            placeholder="Digite a cidade"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Poço/Serviço *</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localWellServiceName}
                            onChangeText={setLocalWellServiceName}
                            placeholder="Digite o nome do poço ou serviço"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Rep: Empresa</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localOperatorName}
                            onChangeText={setLocalOperatorName}
                            placeholder="Digite o nome do representante da empresa"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Volume (bbl)</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localVolume}
                            onChangeText={setLocalVolume}
                            placeholder="Digite o volume"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Temperatura (°C)</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localTemperature}
                            onChangeText={setLocalTemperature}
                            placeholder="Digite a temperatura"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Pressão (PSI)</Text>
                        <TextInput
                            style={globalStyles.input}
                            value={localPressure}
                            onChangeText={handlePressureChange}
                            placeholder="Digite a pressão"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.label}>Atividades</Text>
                        <TextInput
                            style={globalStyles.textArea}
                            value={localActivities}
                            onChangeText={setLocalActivities}
                            placeholder="Descreva as atividades realizadas"
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>

                    <TouchableOpacity
                        style={[globalStyles.button, (!operationStart) && globalStyles.disabledButton]}
                        onPress={saveOperation}
                        disabled={!operationStart}
                    >
                        <Text style={globalStyles.buttonText}>Salvar Operação</Text>
                    </TouchableOpacity>
                </View>

                {/* Seção de Desmobilização - visível apenas após salvar operação */}
                {operationSaved && (
                    <View style={globalStyles.section}>
                        <Text style={globalStyles.sectionTitle}>Desmobilização</Text>

                        {demobilizationActive && demobilizationStartTime && !demobilizationEndTime ? (
                            <View style={globalStyles.infoCard}>
                                <Text style={globalStyles.infoTitle}>Desmobilização em andamento</Text>
                                <Text>Início: {demobilizationStartTime.toLocaleString()}</Text>
                                <Text>Origem: {destination || 'N/A'}</Text>
                                <Text>Destino: {origin || 'N/A'}</Text>
                            </View>
                        ) : demobilizationEndTime ? (
                            <View style={globalStyles.infoCard}>
                                <Text style={globalStyles.infoTitle}>Desmobilização concluída</Text>
                                <Text>Início: {demobilizationStartTime.toLocaleString()}</Text>
                                <Text>Fim: {demobilizationEndTime.toLocaleString()}</Text>
                                <Text>Duração: {demobilizationDuration.toFixed(0)} minutos</Text>

                                {mobilizationDuration && (
                                    <Text style={globalStyles.totalTime}>
                                        Tempo Total: {(mobilizationDuration + demobilizationDuration).toFixed(0)} minutos
                                    </Text>
                                )}
                            </View>
                        ) : null}

                        <View style={globalStyles.buttonRow}>
                            <TouchableOpacity
                                style={[globalStyles.button, isDemobilizando && globalStyles.disabledButton]}
                                onPress={startDemobilization}
                                disabled={isDemobilizando || demobilizationEndTime !== null}
                            >
                                <Text style={globalStyles.buttonText}>Iniciar Desmobilização</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[globalStyles.button, (!isDemobilizando) && globalStyles.disabledButton]}
                                onPress={endDemobilization}
                                disabled={!isDemobilizando}
                            >
                                <Text style={globalStyles.buttonText}>Finalizar Desmobilização</Text>
                            </TouchableOpacity>
                        </View>

                        {demobilizationEndTime && (
                            <View style={globalStyles.section}>
                                <Text style={globalStyles.sectionTitle}>Resultado</Text>
                                <View style={globalStyles.infoCard}>
                                    {/* DADOS DO OPERADOR NO RELATÓRIO */}
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Dados do Operador</Text>
                                    <Text>Operador: {operador}</Text>
                                    <Text>Auxiliar: {auxiliar}</Text>
                                    <Text>Unidade: {unidade}</Text>
                                    <Text>Placa do Veículo: {placa}</Text>

                                    <Text style={globalStyles.infoTitle}>Resumo da Operação</Text>
                                    <Text>Tipo: {history[history.length - 1]?.type || 'N/A'}</Text>
                                    <Text>Cidade: {history[history.length - 1]?.city || 'N/A'}</Text>
                                    <Text>Operador: {history[history.length - 1]?.operator || 'N/A'}</Text>
                                    <Text>Poço/Serviço: {history[history.length - 1]?.wellService || 'N/A'}</Text>

                                    {history[history.length - 1]?.volume && (
                                        <Text>Volume: {history[history.length - 1].volume} bbl</Text>
                                    )}

                                    {history[history.length - 1]?.temperature && (
                                        <Text>Temperatura: {history[history.length - 1].temperature} °C</Text>
                                    )}

                                    {history[history.length - 1]?.pressure && (
                                        <Text>Pressão: {history[history.length - 1].pressure} PSI</Text>
                                    )}

                                    <View style={globalStyles.timeItem}>
                                        <Text>Deslocamento: {origin} → {destination}</Text>
                                        {startKm && endKm && (
                                            <Text>Distância: {(parseFloat(endKm) - parseFloat(startKm)).toFixed(1)} km</Text>
                                        )}
                                    </View>

                                    <View style={globalStyles.timeItem}>
                                        <Text>Mobilização:</Text>
                                        <Text>Início: {mobilizationStartTime.toLocaleString()}</Text>
                                        <Text>Fim: {mobilizationEndTime.toLocaleString()}</Text>
                                        <Text>Duração: {mobilizationDuration.toFixed(0)} minutos</Text>
                                    </View>

                                    <View style={globalStyles.timeItem}>
                                        <Text>Desmobilização:</Text>
                                        <Text>Início: {demobilizationStartTime.toLocaleString()}</Text>
                                        <Text>Fim: {demobilizationEndTime.toLocaleString()}</Text>
                                        <Text>Duração: {demobilizationDuration.toFixed(0)} minutos</Text>
                                    </View>

                                    <Text style={globalStyles.totalTime}>
                                        Tempo Total: {(mobilizationDuration + demobilizationDuration).toFixed(0)} minutos
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default OperationsScreen;