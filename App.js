import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Platform, Alert, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar telas
import DisplacementScreen from './screens/DisplacementScreen';
import MobilizationScreen from './screens/MobilizationScreen';
import OperationsScreen from './screens/OperationsScreen';
import ReportsScreen from './screens/ReportsScreen';

// Importar utilidades
import { saveHistory, loadHistory } from './utils/storage';
// Importar estilos globais
import globalStyles from './styles/globalStyles';

// Criação do TabNavigator
const Tab = createBottomTabNavigator();

export default function App() {
  // Estados para operação
  const [operationStart, setOperationStart] = useState(null);
  const [operationEnd, setOperationEnd] = useState(null);
  const [operationType, setOperationType] = useState('');
  const [city, setCity] = useState('');
  const [wellServiceName, setWellServiceName] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [volume, setVolume] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [activities, setActivities] = useState('');

  // Estados para deslocamento
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [displacementStartTime, setDisplacementStartTime] = useState(null);
  const [displacementEndTime, setDisplacementEndTime] = useState(null);
  const [displacementDistance, setDisplacementDistance] = useState(null);
  const [isDisplacing, setIsDisplacing] = useState(false);

  // Estados para mobilização
  const [isMobilizando, setIsMobilizando] = useState(false);
  const [mobilizationStartTime, setMobilizationStartTime] = useState(null);
  const [mobilizationEndTime, setMobilizationEndTime] = useState(null);
  const [mobilizationDuration, setMobilizationDuration] = useState(null);

  // Estados para desmobilização
  const [isDemobilizando, setIsDemobilizando] = useState(false);
  const [demobilizationStartTime, setDemobilizationStartTime] = useState(null);
  const [demobilizationEndTime, setDemobilizationEndTime] = useState(null);
  const [demobilizationDuration, setDemobilizationDuration] = useState(null);

  // Estado para controlar se a operação foi salva
  const [operationSaved, setOperationSaved] = useState(false);

  // Estado para histórico
  const [history, setHistory] = useState([]);

  // Carregar histórico e verificar permissões ao iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        let historyData = await loadHistory();

        // Se for null ou undefined, inicialize como array vazio
        if (!historyData) historyData = [];

        // Verificar cada item do histórico
        const validHistory = historyData.filter(item => item !== null && typeof item === 'object');

        // Migrar histórico para garantir que todas as propriedades existam
        const migratedHistory = validHistory.map(item => {
          // Criar um novo objeto com propriedades padrão
          const safeItem = {
            id: String(item.id || Date.now()),
            startTime: item.startTime || null,
            endTime: item.endTime || null,
            type: item.type || '',
            city: item.city || '',
            wellService: item.wellService || '',
            operator: item.operator || '',
            volume: item.volume || '',
            temperature: item.temperature || '',
            pressure: item.pressure || '',
            activities: item.activities || '',
            origin: item.origin || '',
            destination: item.destination || '',
            startKm: item.startKm || '',
            endKm: item.endKm || '',

            // Propriedades relacionadas a mobilização/desmobilização
            mobilizationStartTime: item.mobilizationStartTime || null,
            mobilizationEndTime: item.mobilizationEndTime || null,
            mobilizationDuration: typeof item.mobilizationDuration === 'number' ? item.mobilizationDuration : null,
            demobilizationStartTime: item.demobilizationStartTime || null,
            demobilizationEndTime: item.demobilizationEndTime || null,
            demobilizationDuration: typeof item.demobilizationDuration === 'number' ? item.demobilizationDuration : null
          };

          return safeItem;
        });

        // Se houve alterações, salve o histórico migrado
        if (JSON.stringify(historyData) !== JSON.stringify(migratedHistory)) {
          console.log("Migração de dados necessária - histórico atualizado");
          await saveHistory(migratedHistory);
        }

        setHistory(migratedHistory);
        checkPermissions();
      } catch (error) {
        console.error("Erro crítico na inicialização:", error);
        // Em caso de erro grave, inicialize com um histórico vazio
        setHistory([]);
        Alert.alert('Erro', 'Houve um problema ao carregar o histórico. Os dados foram redefinidos.');
      }
    };

    loadInitialData();
  }, []);

  // Verificar permissões de localização
  const checkPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Permissão de localização não concedida. Algumas funcionalidades podem ser limitadas.');
      }
    } catch (error) {
      console.log('Erro ao verificar permissões:', error);
    }
  };

  // Função para redefinir o aplicativo
  const resetApp = async () => {
    try {
      await AsyncStorage.removeItem('@operations_history');
      setHistory([]);
      Alert.alert('Sucesso', 'Histórico limpo. Reinicie o aplicativo.');
    } catch (e) {
      console.error("Erro ao redefinir app:", e);
      Alert.alert('Erro', 'Falha ao limpar o histórico');
    }
  };

  // Renderização condicional das telas com props
  const RenderDisplacementScreen = () => (
    <DisplacementScreen
      origin={origin}
      setOrigin={setOrigin}
      destination={destination}
      setDestination={setDestination}
      startKm={startKm}
      setStartKm={setStartKm}
      endKm={endKm}
      setEndKm={setEndKm}
      displacementStartTime={displacementStartTime}
      setDisplacementStartTime={setDisplacementStartTime}
      displacementEndTime={displacementEndTime}
      setDisplacementEndTime={setDisplacementEndTime}
      displacementDistance={displacementDistance}
      setDisplacementDistance={setDisplacementDistance}
      isDisplacing={isDisplacing}
      setIsDisplacing={setIsDisplacing}
    />
  );

  const RenderMobilizationScreen = () => (
    <MobilizationScreen
      origin={origin}
      destination={destination}
      displacementDistance={displacementDistance}
      displacementEndTime={displacementEndTime}
      isMobilizando={isMobilizando}
      setIsMobilizando={setIsMobilizando}
      isDemobilizando={isDemobilizando}
      setIsDemobilizando={setIsDemobilizando}
      mobilizationStartTime={mobilizationStartTime}
      setMobilizationStartTime={setMobilizationStartTime}
      mobilizationEndTime={mobilizationEndTime}
      setMobilizationEndTime={setMobilizationEndTime}
      mobilizationDuration={mobilizationDuration}
      setMobilizationDuration={setMobilizationDuration}
      operationSaved={operationSaved}
      demobilizationStartTime={demobilizationStartTime}
      setDemobilizationStartTime={setDemobilizationStartTime}
      demobilizationEndTime={demobilizationEndTime}
      setDemobilizationEndTime={setDemobilizationEndTime}
      demobilizationDuration={demobilizationDuration}
      setDemobilizationDuration={setDemobilizationDuration}
    />
  );

  const RenderOperationsScreen = () => (
    <OperationsScreen
      // Props existentes
      operationStart={operationStart}
      setOperationStart={setOperationStart}
      operationEnd={operationEnd}
      setOperationEnd={setOperationEnd}
      operationType={operationType}
      setOperationType={setOperationType}
      city={city}
      setCity={setCity}
      wellServiceName={wellServiceName}
      setWellServiceName={setWellServiceName}
      operatorName={operatorName}
      setOperatorName={setOperatorName}
      volume={volume}
      setVolume={setVolume}
      temperature={temperature}
      setTemperature={setTemperature}
      pressure={pressure}
      setPressure={setPressure}
      activities={activities}
      setActivities={setActivities}

      // Props de deslocamento
      origin={origin}
      destination={destination}
      startKm={startKm}
      endKm={endKm}

      // Props de mobilização
      mobilizationStartTime={mobilizationStartTime}
      setMobilizationStartTime={setMobilizationStartTime}
      mobilizationEndTime={mobilizationEndTime}
      setMobilizationEndTime={setMobilizationEndTime}
      mobilizationDuration={mobilizationDuration}
      setMobilizationDuration={setMobilizationDuration}
      isMobilizando={isMobilizando}
      setIsMobilizando={setIsMobilizando}

      // Props de desmobilização
      demobilizationStartTime={demobilizationStartTime}
      setDemobilizationStartTime={setDemobilizationStartTime}
      demobilizationEndTime={demobilizationEndTime}
      setDemobilizationEndTime={setDemobilizationEndTime}
      demobilizationDuration={demobilizationDuration}
      setDemobilizationDuration={setDemobilizationDuration}
      isDemobilizando={isDemobilizando}
      setIsDemobilizando={setIsDemobilizando}

      // Props para histórico e controle
      history={history}
      setHistory={setHistory}
      saveHistory={saveHistory}
      operationSaved={operationSaved}
      setOperationSaved={setOperationSaved}
    />
  );

  const RenderReportsScreen = () => (
    <ReportsScreen
      history={history}
      setHistory={setHistory}
      saveHistory={saveHistory}
    />
  );

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Deslocamento') {
              iconName = focused ? 'road' : 'road';
            } else if (route.name === 'Mobilização') {
              iconName = focused ? 'arrow-circle-up' : 'arrow-circle-up';
            } else if (route.name === 'Operações') {
              iconName = focused ? 'cogs' : 'cogs';
            } else if (route.name === 'Relatórios') {
              iconName = focused ? 'file-text' : 'file-text';
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e91e63',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Deslocamento" component={RenderDisplacementScreen} />
        <Tab.Screen name="Operações" component={RenderOperationsScreen} />
        <Tab.Screen name="Relatórios" component={RenderReportsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
