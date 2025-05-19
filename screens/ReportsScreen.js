import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import globalStyles from '../styles/globalStyles';

// Adicionar userData como prop
function ReportsScreen({ history, setHistory, saveHistory, userData, navigation }) {
    // Função para gerar e compartilhar o relatório com design melhorado
    const generatePDF = async () => {
        console.log("Iniciando geração de relatório...");
        // Verificar se history existe e tem itens
        if (!history || !Array.isArray(history) || history.length === 0) {
            Alert.alert('Aviso', 'Não há operações para gerar relatório');
            return;
        }

        try {
            // Criar cabeçalho do relatório
            let reportText = "";

            // Linha decorativa superior
            reportText += "╔" + "═".repeat(60) + "╗\n";

            // Título centralizado
            const title = "RELATÓRIO DE OPERAÇÕES";
            const paddingSize = Math.floor((60 - title.length) / 2);
            reportText += "║" + " ".repeat(paddingSize) + title + " ".repeat(60 - paddingSize - title.length) + "║\n";

            // Data do relatório
            const dateStr = new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const dateText = `Gerado em: ${dateStr}`;
            reportText += "║" + " ".repeat(2) + dateText + " ".repeat(60 - 2 - dateText.length) + "║\n";

            // NOVO: Adicionar informações do usuário
            reportText += "║" + "─".repeat(60) + "║\n";
            reportText += "║" + " DADOS DO RESPONSÁVEL".padEnd(59) + "║\n";
            reportText += "║" + "─".repeat(60) + "║\n";

            reportText += formatLabelValue("║", "Nome", userData?.name || 'N/A', 60) + "\n";
            reportText += formatLabelValue("║", "Matrícula", userData?.registration || 'N/A', 60) + "\n";
            reportText += formatLabelValue("║", "Cargo", userData?.position || 'N/A', 60) + "\n";
            reportText += formatLabelValue("║", "Equipe", userData?.team || 'N/A', 60) + "\n";

            // Linha decorativa inferior do cabeçalho
            reportText += "╚" + "═".repeat(60) + "╝\n\n";

            // Contador de operações
            reportText += `Total de operações: ${history.length}\n\n`;

            // Processar cada operação do histórico
            const operationsText = history.map((item, index) => {
                // Se o item não existir, retornar mensagem genérica
                if (!item) return `Item ${index + 1}: Dados indisponíveis\n`;

                // Tentar processar o item com tratamento de erros em cada etapa
                let text = '';
                try {
                    // Cabeçalho da operação com numeração e borda completa
                    text += "┏" + "━".repeat(60) + "┓\n";
                    const opTitle = `OPERAÇÃO #${index + 1}`;
                    const opPaddingSize = Math.floor((60 - opTitle.length) / 2);
                    text += "┃" + " ".repeat(opPaddingSize) + opTitle + " ".repeat(60 - opPaddingSize - opTitle.length) + "┃\n";
                    text += "┣" + "━".repeat(60) + "┫\n";

                    // Seção de dados básicos
                    text += "┃" + " INFORMAÇÕES BÁSICAS".padEnd(59) + "┃\n";
                    text += "┃" + "─".repeat(60) + "┃\n";
                    text += formatLabelValue("┃", "Tipo", item.type || 'N/A', 60) + "\n";
                    text += formatLabelValue("┃", "Cidade", item.city || 'N/A', 60) + "\n";
                    text += formatLabelValue("┃", "Operador", item.operator || 'N/A', 60) + "\n";
                    text += formatLabelValue("┃", "Poço/Serviço", item.wellService || 'N/A', 60) + "\n";

                    // Datas com verificação segura
                    try {
                        const startTimeStr = item.startTime ?
                            new Date(item.startTime).toLocaleString('pt-BR') : 'N/A';
                        text += formatLabelValue("┃", "Data Início", startTimeStr, 60) + "\n";
                    } catch (e) {
                        text += formatLabelValue("┃", "Data Início", "N/A (erro formato)", 60) + "\n";
                    }

                    try {
                        const endTimeStr = item.endTime ?
                            new Date(item.endTime).toLocaleString('pt-BR') : 'N/A';
                        text += formatLabelValue("┃", "Data Fim", endTimeStr, 60) + "\n";
                    } catch (e) {
                        text += formatLabelValue("┃", "Data Fim", "N/A (erro formato)", 60) + "\n";
                    }

                    // Separador para próxima seção
                    text += "┃" + "─".repeat(60) + "┃\n";

                    // Seção de dados técnicos
                    text += "┃" + " DADOS TÉCNICOS".padEnd(59) + "┃\n";
                    text += "┃" + "─".repeat(60) + "┃\n";

                    if (item.volume) {
                        text += formatLabelValue("┃", "Volume", `${item.volume} bbl`, 60) + "\n";
                    }
                    if (item.temperature) {
                        text += formatLabelValue("┃", "Temperatura", `${item.temperature} °C`, 60) + "\n";
                    }
                    if (item.pressure) {
                        text += formatLabelValue("┃", "Pressão", `${item.pressure} PSI`, 60) + "\n";
                    }

                    // Espaço vazio se não houver dados técnicos
                    if (!item.volume && !item.temperature && !item.pressure) {
                        text += "┃" + " ".repeat(60) + "┃\n";
                        text += formatLabelValue("┃", "Dados técnicos", "Não informados", 60) + "\n";
                        text += "┃" + " ".repeat(60) + "┃\n";
                    }

                    // Separador para próxima seção
                    text += "┃" + "─".repeat(60) + "┃\n";

                    // Seção de deslocamento
                    text += "┃" + " DESLOCAMENTO".padEnd(59) + "┃\n";
                    text += "┃" + "─".repeat(60) + "┃\n";

                    if (item.origin && item.destination) {
                        text += formatLabelValue("┃", "Origem", item.origin, 60) + "\n";
                        text += formatLabelValue("┃", "Destino", item.destination, 60) + "\n";

                        // Cálculo de distância com tratamento de erro
                        if (item.startKm && item.endKm) {
                            try {
                                const startKmValue = parseFloat(item.startKm);
                                const endKmValue = parseFloat(item.endKm);
                                if (!isNaN(startKmValue) && !isNaN(endKmValue)) {
                                    const distance = (endKmValue - startKmValue).toFixed(1);
                                    text += formatLabelValue("┃", "KM Inicial", item.startKm, 60) + "\n";
                                    text += formatLabelValue("┃", "KM Final", item.endKm, 60) + "\n";
                                    text += formatLabelValue("┃", "Distância", `${distance} km`, 60) + "\n";
                                }
                            } catch (e) {
                                text += formatLabelValue("┃", "Distância", "Erro no cálculo", 60) + "\n";
                            }
                        }
                    } else {
                        text += "┃" + " ".repeat(60) + "┃\n";
                        text += formatLabelValue("┃", "Deslocamento", "Não informado", 60) + "\n";
                        text += "┃" + " ".repeat(60) + "┃\n";
                    }

                    // Separador para próxima seção
                    text += "┃" + "─".repeat(60) + "┃\n";

                    // Seção de mobilização
                    text += "┃" + " MOBILIZAÇÃO".padEnd(59) + "┃\n";
                    text += "┃" + "─".repeat(60) + "┃\n";

                    if (item.mobilizationDuration != null &&
                        typeof item.mobilizationDuration === 'number') {

                        try {
                            const mobilizationStartStr = item.mobilizationStartTime ?
                                new Date(item.mobilizationStartTime).toLocaleString('pt-BR') : 'N/A';
                            text += formatLabelValue("┃", "Início", mobilizationStartStr, 60) + "\n";
                        } catch (e) {
                            text += formatLabelValue("┃", "Início", "N/A (erro formato)", 60) + "\n";
                        }

                        try {
                            const mobilizationEndStr = item.mobilizationEndTime ?
                                new Date(item.mobilizationEndTime).toLocaleString('pt-BR') : 'N/A';
                            text += formatLabelValue("┃", "Fim", mobilizationEndStr, 60) + "\n";
                        } catch (e) {
                            text += formatLabelValue("┃", "Fim", "N/A (erro formato)", 60) + "\n";
                        }

                        const durFormatted = `${item.mobilizationDuration.toFixed(0)} minutos`;
                        text += formatLabelValue("┃", "Duração", durFormatted, 60) + "\n";
                    } else {
                        text += "┃" + " ".repeat(60) + "┃\n";
                        text += formatLabelValue("┃", "Mobilização", "Não registrada", 60) + "\n";
                        text += "┃" + " ".repeat(60) + "┃\n";
                    }

                    // Separador para próxima seção
                    text += "┃" + "─".repeat(60) + "┃\n";

                    // Seção de desmobilização
                    text += "┃" + " DESMOBILIZAÇÃO".padEnd(59) + "┃\n";
                    text += "┃" + "─".repeat(60) + "┃\n";

                    if (item.demobilizationDuration != null &&
                        typeof item.demobilizationDuration === 'number') {

                        try {
                            const demobilizationStartStr = item.demobilizationStartTime ?
                                new Date(item.demobilizationStartTime).toLocaleString('pt-BR') : 'N/A';
                            text += formatLabelValue("┃", "Início", demobilizationStartStr, 60) + "\n";
                        } catch (e) {
                            text += formatLabelValue("┃", "Início", "N/A (erro formato)", 60) + "\n";
                        }

                        try {
                            const demobilizationEndStr = item.demobilizationEndTime ?
                                new Date(item.demobilizationEndTime).toLocaleString('pt-BR') : 'N/A';
                            text += formatLabelValue("┃", "Fim", demobilizationEndStr, 60) + "\n";
                        } catch (e) {
                            text += formatLabelValue("┃", "Fim", "N/A (erro formato)", 60) + "\n";
                        }

                        const durFormatted = `${item.demobilizationDuration.toFixed(0)} minutos`;
                        text += formatLabelValue("┃", "Duração", durFormatted, 60) + "\n";
                    } else {
                        text += "┃" + " ".repeat(60) + "┃\n";
                        text += formatLabelValue("┃", "Desmobilização", "Não registrada", 60) + "\n";
                        text += "┃" + " ".repeat(60) + "┃\n";
                    }

                    // Separador para próxima seção
                    text += "┃" + "─".repeat(60) + "┃\n";

                    // Tempo total
                    if (item.mobilizationDuration != null &&
                        typeof item.mobilizationDuration === 'number' &&
                        item.demobilizationDuration != null &&
                        typeof item.demobilizationDuration === 'number') {

                        const totalTime = (item.mobilizationDuration + item.demobilizationDuration).toFixed(0);
                        text += "┃" + " TEMPO TOTAL".padEnd(59) + "┃\n";
                        text += "┃" + "─".repeat(60) + "┃\n";
                        text += formatLabelValue("┃", "Tempo Total", `${totalTime} minutos`, 60) + "\n";
                    }

                    // Seção de atividades
                    if (item.activities && typeof item.activities === 'string') {
                        text += "┃" + "─".repeat(60) + "┃\n";
                        text += "┃" + " ATIVIDADES".padEnd(59) + "┃\n";
                        text += "┃" + "─".repeat(60) + "┃\n";

                        // Quebrar o texto de atividades em linhas de no máximo 58 caracteres
                        const activityWords = item.activities.split(' ');
                        let currentLine = "";
                        activityWords.forEach(word => {
                            if ((currentLine + " " + word).length <= 58) {
                                currentLine += (currentLine.length > 0 ? " " : "") + word;
                            } else {
                                text += "┃ " + currentLine.padEnd(58) + " ┃\n";
                                currentLine = word;
                            }
                        });

                        if (currentLine.length > 0) {
                            text += "┃ " + currentLine.padEnd(58) + " ┃\n";
                        }
                    }

                    // Rodapé da operação
                    text += "┗" + "━".repeat(60) + "┛\n\n";

                    return text;

                } catch (error) {
                    console.error(`Erro ao processar item ${index}:`, error);
                    text += "┃ " + `Item ${index + 1}: Erro ao processar (${error.message})`.padEnd(58) + " ┃\n";
                    text += "┗" + "━".repeat(60) + "┛\n\n";
                    return text;
                }
            }).join('');

            // Adicionar o conteúdo das operações ao relatório
            reportText += operationsText;

            // Adicionar rodapé do relatório
            reportText += "╔" + "═".repeat(60) + "╗\n";
            const footerText = "FIM DO RELATÓRIO";
            const footerPadding = Math.floor((60 - footerText.length) / 2);
            reportText += "║" + " ".repeat(footerPadding) + footerText + " ".repeat(60 - footerPadding - footerText.length) + "║\n";
            reportText += "╚" + "═".repeat(60) + "╝\n";

            console.log("Texto do relatório gerado, salvando arquivo...");

            // Caminho do arquivo
            const fileName = `Operacoes_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            const fileUri = FileSystem.documentDirectory + fileName;

            // Escrever no arquivo
            await FileSystem.writeAsStringAsync(fileUri, reportText);
            console.log("Arquivo salvo em:", fileUri);

            // Verificar se o compartilhamento está disponível
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo');
                return;
            }

            // Compartilhar o arquivo
            console.log("Iniciando compartilhamento...");
            await Sharing.shareAsync(fileUri, {
                mimeType: 'text/plain',
                dialogTitle: 'Compartilhar Relatório de Operações',
                UTI: 'public.plain-text' // para iOS
            });
            console.log("Compartilhamento concluído");

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            Alert.alert('Erro', `Falha ao gerar relatório: ${error.message}`);
        }
    };

    // Adicionar esta função de formatação caso não exista
    const formatLabelValue = (prefix, label, value, totalWidth) => {
        const labelStr = ` ${label}: `;
        const valueStr = value.toString();
        const padding = totalWidth - labelStr.length - valueStr.length - 1;

        if (padding >= 0) {
            return `${prefix}${labelStr}${valueStr}${" ".repeat(padding)}┃`;
        } else {
            // Se o valor for muito longo, truncar com ...
            const truncatedValue = valueStr.slice(0, totalWidth - labelStr.length - 4) + "...";
            return `${prefix}${labelStr}${truncatedValue}┃`;
        }
    };

    // Renderizar item do histórico com verificações seguras
    const renderHistoryItem = ({ item, index }) => {
        // Se o item não existir, mostrar mensagem de erro
        if (!item) {
            return (
                <View style={globalStyles.historyItem}>
                    <Text style={globalStyles.historyTitle}>Item corrompido</Text>
                </View>
            );
        }

        // Renderizar detalhes do item com verificações seguras
        return (
            <View style={globalStyles.historyItem}>
                <Text style={globalStyles.historyTitle}>
                    {item.type || 'N/A'} - {item.wellService || 'N/A'}
                </Text>

                <Text>Cidade: {item.city || 'N/A'}</Text>
                <Text>Operador: {item.operator || 'N/A'}</Text>

                {/* Datas com verificações seguras */}
                {item.startTime && (
                    <Text>Início: {
                        (() => {
                            try {
                                return new Date(item.startTime).toLocaleString()
                            } catch (e) {
                                return 'Data inválida'
                            }
                        })()
                    }</Text>
                )}

                {item.endTime && (
                    <Text>Fim: {
                        (() => {
                            try {
                                return new Date(item.endTime).toLocaleString()
                            } catch (e) {
                                return 'Data inválida'
                            }
                        })()
                    }</Text>
                )}

                {/* Dados extras */}
                {item.volume && <Text>Volume: {item.volume} bbl</Text>}
                {item.temperature && <Text>Temperatura: {item.temperature} °C</Text>}
                {item.pressure && <Text>Pressão: {item.pressure} PSI</Text>}

                {/* Deslocamento */}
                {item.origin && item.destination && (
                    <Text>Deslocamento: {item.origin} → {item.destination}</Text>
                )}

                {/* Distância com tratamento de erro */}
                {item.startKm && item.endKm && (() => {
                    try {
                        const distance = parseFloat(item.endKm) - parseFloat(item.startKm);
                        if (!isNaN(distance)) {
                            return <Text>Distância: {distance.toFixed(1)} km</Text>;
                        }
                        return null;
                    } catch (e) {
                        return null;
                    }
                })()}

                {/* Mobilização com verificação segura */}
                {(item.mobilizationDuration != null &&
                    typeof item.mobilizationDuration === 'number') && (
                        <View style={globalStyles.timeItem}>
                            <Text>Mobilização:</Text>

                            {/* Horários com tratamento de erro */}
                            {item.mobilizationStartTime && (() => {
                                try {
                                    return <Text>Início: {new Date(item.mobilizationStartTime).toLocaleString()}</Text>;
                                } catch (e) {
                                    return <Text>Início: Data inválida</Text>;
                                }
                            })()}

                            {item.mobilizationEndTime && (() => {
                                try {
                                    return <Text>Fim: {new Date(item.mobilizationEndTime).toLocaleString()}</Text>;
                                } catch (e) {
                                    return <Text>Fim: Data inválida</Text>;
                                }
                            })()}

                            <Text>Duração: {item.mobilizationDuration.toFixed(0)} minutos</Text>
                        </View>
                    )}

                {/* Desmobilização com verificação segura */}
                {(item.demobilizationDuration != null &&
                    typeof item.demobilizationDuration === 'number') && (
                        <View style={globalStyles.timeItem}>
                            <Text>Desmobilização:</Text>

                            {/* Horários com tratamento de erro */}
                            {item.demobilizationStartTime && (() => {
                                try {
                                    return <Text>Início: {new Date(item.demobilizationStartTime).toLocaleString()}</Text>;
                                } catch (e) {
                                    return <Text>Início: Data inválida</Text>;
                                }
                            })()}

                            {item.demobilizationEndTime && (() => {
                                try {
                                    return <Text>Fim: {new Date(item.demobilizationEndTime).toLocaleString()}</Text>;
                                } catch (e) {
                                    return <Text>Fim: Data inválida</Text>;
                                }
                            })()}

                            <Text>Duração: {item.demobilizationDuration.toFixed(0)} minutos</Text>
                        </View>
                    )}

                {/* Tempo total com verificação segura */}
                {(item.mobilizationDuration != null &&
                    typeof item.mobilizationDuration === 'number' &&
                    item.demobilizationDuration != null &&
                    typeof item.demobilizationDuration === 'number') && (
                        <Text style={globalStyles.totalTime}>
                            Tempo Total: {(item.mobilizationDuration + item.demobilizationDuration).toFixed(0)} minutos
                        </Text>
                    )}

                {/* Atividades */}
                {item.activities && (
                    <Text>Atividades: {item.activities}</Text>
                )}
            </View>
        );
    };

    // Limpar histórico
    const clearHistory = () => {
        // Confirmação antes de limpar
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja limpar todo o histórico?',
            [
                { text: 'Cancelar' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        try {
                            setHistory([]);
                            saveHistory([]);
                            Alert.alert('Sucesso', 'Histórico limpo com sucesso');
                        } catch (error) {
                            console.error("Erro ao limpar histórico:", error);
                            Alert.alert('Erro', 'Falha ao limpar o histórico');
                        }
                    }
                }
            ]
        );
    };

    // UI do componente
    return (
        <ScrollView style={globalStyles.scrollView}>
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Histórico de Operações</Text>

                {/* Verificação segura antes de mostrar o FlatList */}
                {history && Array.isArray(history) && history.length > 0 ? (
                    <FlatList
                        data={history}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item, index) => (item && item.id) ? item.id.toString() : `item-${index}`}
                        scrollEnabled={false}
                        style={{ maxHeight: undefined }}
                    />
                ) : (
                    <Text style={globalStyles.emptyHistory}>Nenhuma operação registrada</Text>
                )}

                <View style={globalStyles.buttonRow}>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={generatePDF}
                    >
                        <Text style={globalStyles.buttonText}>Gerar Relatório</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[globalStyles.button, globalStyles.dangerButton]}
                        onPress={clearHistory}
                    >
                        <Text style={globalStyles.buttonText}>Limpar Histórico</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default ReportsScreen;