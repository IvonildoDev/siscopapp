import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DisplacementScreen from './screens/DisplacementScreen';
import OperationsScreen from './screens/OperationsScreen';
import ReportsScreen from './screens/ReportsScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import WaitingScreen from './screens/WaitingScreen';

// Components
import UserHeader from './components/UserHeader';

// Context
import { AuthProvider, AuthContext } from './context/AuthContext';

// Navegadores
const Tab = createBottomTabNavigator();

// Componente principal com estados de autenticação
const Main = () => {
  // Estados para deslocamento
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [displacementStartTime, setDisplacementStartTime] = useState(null);
  const [displacementEndTime, setDisplacementEndTime] = useState(null);
  const [displacementDistance, setDisplacementDistance] = useState(0);
  const [isDisplacing, setIsDisplacing] = useState(false);

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

  // Estados para mobilização e desmobilização
  const [isMobilizando, setIsMobilizando] = useState(false);
  const [mobilizationStartTime, setMobilizationStartTime] = useState(null);
  const [mobilizationEndTime, setMobilizationEndTime] = useState(null);
  const [mobilizationDuration, setMobilizationDuration] = useState(0);
  const [isDemobilizando, setIsDemobilizando] = useState(false);
  const [demobilizationStartTime, setDemobilizationStartTime] = useState(null);
  const [demobilizationEndTime, setDemobilizationEndTime] = useState(null);
  const [demobilizationDuration, setDemobilizationDuration] = useState(0);
  const [operationSaved, setOperationSaved] = useState(false);

  // Estados para histórico
  const [history, setHistory] = useState([]);

  // Estados para autenticação
  const { isLoading, userToken, userData } = useContext(AuthContext);

  // Estados para aguardo
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingStartTime, setWaitingStartTime] = useState(null);
  const [waitingEndTime, setWaitingEndTime] = useState(null);
  const [waitingDuration, setWaitingDuration] = useState(0);
  const [waitingReasons, setWaitingReasons] = useState([]);

  // Verificar histórico guardado e carregar
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('@operations_history');
        if (savedHistory !== null) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    };

    loadHistory();
  }, []);

  // Função para salvar histórico
  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('@operations_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  // Componentes de tela como funções para passar props
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

  const RenderOperationsScreen = () => (
    <OperationsScreen
      // Props existentes para operação
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

      // Props para deslocamento
      origin={origin}
      destination={destination}
      startKm={startKm}
      endKm={endKm}

      // Props para mobilização
      mobilizationStartTime={mobilizationStartTime}
      setMobilizationStartTime={setMobilizationStartTime}
      mobilizationEndTime={mobilizationEndTime}
      setMobilizationEndTime={setMobilizationEndTime}
      mobilizationDuration={mobilizationDuration}
      setMobilizationDuration={setMobilizationDuration}
      isMobilizando={isMobilizando}
      setIsMobilizando={setIsMobilizando}

      // Props para desmobilização
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
      userData={userData} // Adicionamos os dados do usuário aqui
    />
  );

  const RenderWaitingScreen = () => (
    <WaitingScreen
      isWaiting={isWaiting}
      setIsWaiting={setIsWaiting}
      waitingStartTime={waitingStartTime}
      setWaitingStartTime={setWaitingStartTime}
      waitingEndTime={waitingEndTime}
      setWaitingEndTime={setWaitingEndTime}
      waitingDuration={waitingDuration}
      setWaitingDuration={setWaitingDuration}
      waitingReasons={waitingReasons}
      setWaitingReasons={setWaitingReasons}
      history={history}
      setHistory={setHistory}
      saveHistory={saveHistory}
    />
  );

  // Se estiver carregando, mostrar uma tela de carregamento
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Se não estiver autenticado, mostrar a tela de login
  if (!userToken) {
    return <LoginScreen />;
  }

  // Se estiver autenticado, mostrar o aplicativo normal
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <UserHeader />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Deslocamento') {
                iconName = focused ? 'car' : 'car-outline';
              } else if (route.name === 'Operações') {
                iconName = focused ? 'construct' : 'construct-outline';
              } else if (route.name === 'Aguardando') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Relatórios') {
                iconName = focused ? 'document-text' : 'document-text-outline';
              } else if (route.name === 'Perfil') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato', // Correto para v7
            tabBarInactiveTintColor: 'gray', // Correto para v7
          })}
        >
          <Tab.Screen
            name="Deslocamento"
            component={RenderDisplacementScreen}
            options={{ unmountOnBlur: true }}
          />
          <Tab.Screen
            name="Operações"
            component={RenderOperationsScreen}
            options={{ unmountOnBlur: true }}
          />
          <Tab.Screen
            name="Aguardando"
            component={RenderWaitingScreen}
            options={{ unmountOnBlur: true }}
          />
          <Tab.Screen
            name="Relatórios"
            component={RenderReportsScreen}
            options={{ unmountOnBlur: true }}
          />
          <Tab.Screen
            name="Perfil"
            component={ProfileScreen}
            options={{ unmountOnBlur: true }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

// Componente raiz que provê o contexto de autenticação
export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
