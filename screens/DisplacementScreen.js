import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import KeyboardAwareScreen from '../components/KeyboardAwareScreen';
import globalStyles from '../styles/globalStyles';
import { saveDisplacementInfo } from '../utils/storage';

function DisplacementScreen({
    origin, setOrigin,
    destination, setDestination,
    startKm, setStartKm,
    endKm, setEndKm,
    displacementStartTime, setDisplacementStartTime,
    displacementEndTime, setDisplacementEndTime,
    displacementDistance, setDisplacementDistance,
    isDisplacing, setIsDisplacing,
    navigation
}) {
    // Estados locais para armazenar os valores durante a digitação
    const [localOrigin, setLocalOrigin] = useState(origin);
    const [localDestination, setLocalDestination] = useState(destination);
    const [localStartKm, setLocalStartKm] = useState(startKm);
    const [localEndKm, setLocalEndKm] = useState(endKm);

    // Obter localização atual
    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            return location;
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter sua localização.');
            return null;
        }
    };

    // Iniciar deslocamento
    const startDisplacement = async () => {
        if (!localOrigin || !localDestination || !localStartKm) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
            return;
        }

        // Atualizar os estados globais apenas quando o usuário clicar em iniciar
        setOrigin(localOrigin);
        setDestination(localDestination);
        setStartKm(localStartKm);

        const location = await getCurrentLocation();

        setDisplacementStartTime(new Date());
        setIsDisplacing(true);
        Alert.alert('Sucesso', 'Deslocamento iniciado');
    };

    // Finalizar deslocamento
    const endDisplacement = async () => {
        if (!localEndKm) {
            Alert.alert('Erro', 'Informe o KM Final');
            return;
        }

        // Atualizar o estado global apenas quando o usuário clicar em finalizar
        setEndKm(localEndKm);

        const location = await getCurrentLocation();
        const now = new Date();

        // Calcular distância percorrida
        const startKmValue = parseFloat(startKm);
        const endKmValue = parseFloat(localEndKm);
        const distance = endKmValue - startKmValue;

        if (distance < 0) {
            Alert.alert('Erro', 'KM Final não pode ser menor que KM Inicial');
            return;
        }

        setDisplacementEndTime(now);
        setDisplacementDistance(distance);
        setIsDisplacing(false);

        // Salvar informações do deslocamento
        const displacementInfo = {
            origin,
            destination,
            startKm: startKmValue,
            endKm: endKmValue,
            distance,
            startTime: displacementStartTime.toISOString(),
            endTime: now.toISOString(),
            duration: (now - displacementStartTime) / (1000 * 60) // em minutos
        };

        await saveDisplacementInfo(displacementInfo);

        Alert.alert(
            'Sucesso',
            `Deslocamento finalizado!\nDistância percorrida: ${distance.toFixed(1)} km\nTempo: ${(displacementInfo.duration).toFixed(0)} minutos`
        );

        // Navegar para a tela da aba desejada após finalizar o deslocamento
        navigation.navigate('Operações');
    };

    return (
        <KeyboardAwareScreen>
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Controle de Deslocamento</Text>

                <TextInput
                    style={globalStyles.input}
                    placeholder="Digite a origem"
                    value={localOrigin}
                    onChangeText={setLocalOrigin}
                    editable={!isDisplacing}
                    returnKeyType="next"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="Digite o destino"
                    value={localDestination}
                    onChangeText={setLocalDestination}
                    editable={!isDisplacing}
                    returnKeyType="next"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="KM Inicial"
                    value={localStartKm}
                    onChangeText={setLocalStartKm}
                    keyboardType="numeric"
                    editable={!isDisplacing}
                    returnKeyType="done"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="KM Final"
                    value={localEndKm}
                    onChangeText={setLocalEndKm}
                    keyboardType="numeric"
                    editable={isDisplacing}
                    returnKeyType="done"
                />

                <View style={globalStyles.buttonRow}>
                    <TouchableOpacity
                        style={[globalStyles.button, isDisplacing && globalStyles.disabledButton]}
                        disabled={isDisplacing}
                        onPress={() => {
                            Keyboard.dismiss();
                            startDisplacement();
                        }}
                    >
                        <Text style={globalStyles.buttonText}>Iniciar Deslocamento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[globalStyles.button, !isDisplacing && globalStyles.disabledButton]}
                        disabled={!isDisplacing}
                        onPress={() => {
                            Keyboard.dismiss();
                            endDisplacement();
                        }}
                    >
                        <Text style={globalStyles.buttonText}>Finalizar Deslocamento</Text>
                    </TouchableOpacity>
                </View>

                {/* Modificado para mostrar apenas se existir um deslocamento completado */}
                {displacementDistance > 0 && displacementEndTime && displacementStartTime && (
                    <View style={globalStyles.infoCard}>
                        <Text style={globalStyles.infoTitle}>Último Deslocamento</Text>
                        <Text>Origem: {origin}</Text>
                        <Text>Destino: {destination}</Text>
                        <Text>Distância: {displacementDistance.toFixed(1)} km</Text>
                        <Text>Duração: {((displacementEndTime - displacementStartTime) / (1000 * 60)).toFixed(0)} minutos</Text>
                    </View>
                )}
            </View>
        </KeyboardAwareScreen>
    );
}

export default DisplacementScreen;