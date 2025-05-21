import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import globalStyles from '../styles/globalStyles';

// Adicionar userData como prop
function ReportsScreen({ history, setHistory, saveHistory, userData, navigation }) {
    // Função para gerar e compartilhar o relatório em PDF
    const generatePDF = async () => {
        console.log("Iniciando geração de relatório PDF...");
        // Verificar se history existe e tem itens
        if (!history || !Array.isArray(history) || history.length === 0) {
            Alert.alert('Aviso', 'Não há operações para gerar relatório');
            return;
        }

        try {
            // Preparar o HTML para o PDF
            let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Relatório de Operações</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        color: #2c3e50;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .title {
                        font-size: 22px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .subtitle {
                        font-size: 14px;
                        color: #7f8c8d;
                        margin-bottom: 15px;
                    }
                    .divider {
                        border-top: 1px solid #bdc3c7;
                        margin: 15px 0;
                    }
                    .user-info {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                    .user-info-title {
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #34495e;
                    }
                    .user-info-item {
                        margin-bottom: 5px;
                    }
                    .operation-count {
                        font-weight: bold;
                        margin: 15px 0;
                        color: #2c3e50;
                    }
                    .operation {
                        border: 1px solid #bdc3c7;
                        border-radius: 5px;
                        margin-bottom: 25px;
                        overflow: hidden;
                    }
                    .operation-header {
                        background-color: #34495e;
                        color: white;
                        padding: 10px 15px;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .section {
                        padding: 15px;
                        border-bottom: 1px solid #ecf0f1;
                    }
                    .section:last-child {
                        border-bottom: none;
                    }
                    .section-title {
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #34495e;
                        border-bottom: 1px solid #ecf0f1;
                        padding-bottom: 5px;
                    }
                    .item-row {
                        display: flex;
                        margin-bottom: 5px;
                    }
                    .item-label {
                        font-weight: bold;
                        min-width: 120px;
                        color: #7f8c8d;
                    }
                    .item-value {
                        flex: 1;
                    }
                    .subsection {
                        background-color: #f9f9f9;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 10px;
                    }
                    .subsection-title {
                        font-weight: bold;
                        color: #2c3e50;
                        margin-bottom: 5px;
                    }
                    .total {
                        font-weight: bold;
                        text-align: right;
                        margin-top: 10px;
                        color: #e74c3c;
                    }
                    .waiting {
                        border-left: 3px solid #e74c3c;
                        padding-left: 10px;
                    }
                    .lunch {
                        border-left: 3px solid #e67e22;
                        padding-left: 10px;
                    }
                    .refueling {
                        border-left: 3px solid #f39c12;
                        padding-left: 10px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #bdc3c7;
                        color: #7f8c8d;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">RELATÓRIO DE OPERAÇÕES</div>
                    <div class="subtitle">Gerado em: ${new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
                </div>

                <div class="user-info">
                    <div class="user-info-title">DADOS DO RESPONSÁVEL</div>
                    <div class="user-info-item"><b>Nome:</b> ${userData?.name || 'N/A'}</div>
                    <div class="user-info-item"><b>Matrícula:</b> ${userData?.registration || 'N/A'}</div>
                    <div class="user-info-item"><b>Cargo:</b> ${userData?.position || 'Operador'}</div>
                    <div class="user-info-item"><b>Auxiliar:</b> ${userData?.auxiliarName || 'N/A'}</div>
                </div>

                <div class="operation-count">Total de operações: ${history.length}</div>
            `;

            // Processar cada operação do histórico
            history.forEach((item, index) => {
                if (!item) {
                    htmlContent += `
                    <div class="operation">
                        <div class="operation-header">OPERAÇÃO #${index + 1}</div>
                        <div class="section">Item corrompido ou com dados indisponíveis</div>
                    </div>`;
                    return;
                }

                // Formato da operação
                htmlContent += `
                <div class="operation">
                    <div class="operation-header">OPERAÇÃO #${index + 1}</div>
                    
                    <div class="section">
                        <div class="section-title">INFORMAÇÕES BÁSICAS</div>
                        <div class="item-row">
                            <div class="item-label">Tipo:</div>
                            <div class="item-value">${item.type || 'N/A'}</div>
                        </div>
                        <div class="item-row">
                            <div class="item-label">Cidade:</div>
                            <div class="item-value">${item.city || 'N/A'}</div>
                        </div>
                        <div class="item-row">
                            <div class="item-label">Operador:</div>
                            <div class="item-value">${item.operator || 'N/A'}</div>
                        </div>
                        <div class="item-row">
                            <div class="item-label">Poço/Serviço:</div>
                            <div class="item-value">${item.wellService || 'N/A'}</div>
                        </div>`;

                if (item.startTime) {
                    try {
                        const startTimeStr = new Date(item.startTime).toLocaleString('pt-BR');
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Data Início:</div>
                            <div class="item-value">${startTimeStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Data Início:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }
                }

                if (item.endTime) {
                    try {
                        const endTimeStr = new Date(item.endTime).toLocaleString('pt-BR');
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Data Fim:</div>
                            <div class="item-value">${endTimeStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Data Fim:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }
                }

                htmlContent += `
                    </div>`;  // Fim da seção de informações básicas

                // Dados técnicos
                htmlContent += `
                    <div class="section">
                        <div class="section-title">DADOS TÉCNICOS</div>`;

                if (item.volume || item.temperature || item.pressure) {
                    if (item.volume) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Volume:</div>
                            <div class="item-value">${item.volume} bbl</div>
                        </div>`;
                    }

                    if (item.temperature) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Temperatura:</div>
                            <div class="item-value">${item.temperature} °C</div>
                        </div>`;
                    }

                    if (item.pressure) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Pressão:</div>
                            <div class="item-value">${item.pressure} PSI</div>
                        </div>`;
                    }
                } else {
                    htmlContent += `<div>Dados técnicos não informados</div>`;
                }

                htmlContent += `
                    </div>`; // Fim da seção de dados técnicos

                // Deslocamento
                htmlContent += `
                    <div class="section">
                        <div class="section-title">DESLOCAMENTO</div>`;

                if (item.origin && item.destination) {
                    htmlContent += `
                    <div class="item-row">
                        <div class="item-label">Origem:</div>
                        <div class="item-value">${item.origin}</div>
                    </div>
                    <div class="item-row">
                        <div class="item-label">Destino:</div>
                        <div class="item-value">${item.destination}</div>
                    </div>`;

                    if (item.startKm && item.endKm) {
                        try {
                            const startKmValue = parseFloat(item.startKm);
                            const endKmValue = parseFloat(item.endKm);
                            if (!isNaN(startKmValue) && !isNaN(endKmValue)) {
                                const distance = (endKmValue - startKmValue).toFixed(1);
                                htmlContent += `
                                <div class="item-row">
                                    <div class="item-label">KM Inicial:</div>
                                    <div class="item-value">${item.startKm}</div>
                                </div>
                                <div class="item-row">
                                    <div class="item-label">KM Final:</div>
                                    <div class="item-value">${item.endKm}</div>
                                </div>
                                <div class="item-row">
                                    <div class="item-label">Distância:</div>
                                    <div class="item-value">${distance} km</div>
                                </div>`;
                            }
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Distância:</div>
                                <div class="item-value">Erro no cálculo</div>
                            </div>`;
                        }
                    }
                } else {
                    htmlContent += `<div>Deslocamento não informado</div>`;
                }

                htmlContent += `
                    </div>`; // Fim da seção de deslocamento

                // Mobilização
                htmlContent += `
                    <div class="section">
                        <div class="section-title">MOBILIZAÇÃO</div>`;

                if (item.mobilizationDuration != null && typeof item.mobilizationDuration === 'number') {
                    try {
                        const mobilizationStartStr = item.mobilizationStartTime ?
                            new Date(item.mobilizationStartTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A';

                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Início:</div>
                            <div class="item-value">${mobilizationStartStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Início:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }

                    try {
                        const mobilizationEndStr = item.mobilizationEndTime ?
                            new Date(item.mobilizationEndTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A';

                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Fim:</div>
                            <div class="item-value">${mobilizationEndStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Fim:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }

                    htmlContent += `
                    <div class="item-row">
                        <div class="item-label">Duração:</div>
                        <div class="item-value">${item.mobilizationDuration.toFixed(0)} minutos</div>
                    </div>`;
                } else {
                    htmlContent += `<div>Mobilização não registrada</div>`;
                }

                htmlContent += `
                    </div>`; // Fim da seção de mobilização

                // Desmobilização
                htmlContent += `
                    <div class="section">
                        <div class="section-title">DESMOBILIZAÇÃO</div>`;

                if (item.demobilizationDuration != null && typeof item.demobilizationDuration === 'number') {
                    try {
                        const demobilizationStartStr = item.demobilizationStartTime ?
                            new Date(item.demobilizationStartTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A';

                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Início:</div>
                            <div class="item-value">${demobilizationStartStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Início:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }

                    try {
                        const demobilizationEndStr = item.demobilizationEndTime ?
                            new Date(item.demobilizationEndTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A';

                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Fim:</div>
                            <div class="item-value">${demobilizationEndStr}</div>
                        </div>`;
                    } catch (e) {
                        htmlContent += `
                        <div class="item-row">
                            <div class="item-label">Fim:</div>
                            <div class="item-value">N/A (erro formato)</div>
                        </div>`;
                    }

                    htmlContent += `
                    <div class="item-row">
                        <div class="item-label">Duração:</div>
                        <div class="item-value">${item.demobilizationDuration.toFixed(0)} minutos</div>
                    </div>`;
                } else {
                    htmlContent += `<div>Desmobilização não registrada</div>`;
                }

                htmlContent += `
                    </div>`; // Fim da seção de desmobilização

                // Intervalos de almoço
                if (item.lunchBreaks && item.lunchBreaks.length > 0) {
                    htmlContent += `
                    <div class="section">
                        <div class="section-title">INTERVALOS DE ALMOÇO</div>`;

                    item.lunchBreaks.forEach((lunch, i) => {
                        htmlContent += `
                        <div class="subsection lunch">
                            <div class="subsection-title">Almoço ${i + 1}</div>`;

                        try {
                            const startTimeStr = new Date(lunch.startTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">${startTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        try {
                            const endTimeStr = new Date(lunch.endTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">${endTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Duração:</div>
                                <div class="item-value">${lunch.duration.toFixed(0)} minutos</div>
                            </div>
                        </div>`;
                    });

                    if (item.totalLunchTime) {
                        htmlContent += `
                        <div class="total">
                            Tempo Total de Almoço: ${item.totalLunchTime.toFixed(0)} minutos
                        </div>`;
                    }

                    htmlContent += `
                    </div>`; // Fim da seção de almoço
                }

                // Abastecimentos
                if (item.refuelings && item.refuelings.length > 0) {
                    htmlContent += `
                    <div class="section">
                        <div class="section-title">ABASTECIMENTOS</div>`;

                    item.refuelings.forEach((refueling, i) => {
                        htmlContent += `
                        <div class="subsection refueling">
                            <div class="subsection-title">Abastecimento ${i + 1}</div>
                            
                            <div class="item-row">
                                <div class="item-label">Tipo:</div>
                                <div class="item-value">${refueling.type}</div>
                            </div>`;

                        try {
                            const startTimeStr = new Date(refueling.startTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">${startTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        try {
                            const endTimeStr = new Date(refueling.endTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">${endTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Duração:</div>
                                <div class="item-value">${refueling.duration.toFixed(0)} minutos</div>
                            </div>
                        </div>`;
                    });

                    if (item.totalRefuelingTime) {
                        htmlContent += `
                        <div class="total">
                            Tempo Total de Abastecimento: ${item.totalRefuelingTime.toFixed(0)} minutos
                        </div>`;
                    }

                    htmlContent += `
                    </div>`; // Fim da seção de abastecimento
                }

                // Períodos de Aguardo
                if (item.waitingPeriods && item.waitingPeriods.length > 0) {
                    htmlContent += `
                    <div class="section">
                        <div class="section-title">PERÍODOS DE AGUARDO</div>`;

                    item.waitingPeriods.forEach((period, i) => {
                        htmlContent += `
                        <div class="subsection waiting">
                            <div class="subsection-title">Aguardo ${i + 1}</div>`;

                        try {
                            const startTimeStr = new Date(period.startTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">${startTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Início:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        try {
                            const endTimeStr = new Date(period.endTime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">${endTimeStr}</div>
                            </div>`;
                        } catch (e) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Fim:</div>
                                <div class="item-value">Horário inválido</div>
                            </div>`;
                        }

                        htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Duração:</div>
                                <div class="item-value">${period.duration.toFixed(0)} minutos</div>
                            </div>`;

                        if (period.reasons && period.reasons.length > 0) {
                            htmlContent += `
                            <div class="item-row">
                                <div class="item-label">Motivo:</div>
                                <div class="item-value">${period.reasons.map(r => r.reason).join(', ')}</div>
                            </div>`;
                        }

                        htmlContent += `
                        </div>`;
                    });

                    if (item.totalWaitingTime) {
                        htmlContent += `
                        <div class="total">
                            Tempo Total de Aguardo: ${item.totalWaitingTime.toFixed(0)} minutos
                        </div>`;
                    }

                    htmlContent += `
                    </div>`; // Fim da seção de aguardo
                }

                // Tempo total
                if (item.mobilizationDuration != null &&
                    typeof item.mobilizationDuration === 'number' &&
                    item.demobilizationDuration != null &&
                    typeof item.demobilizationDuration === 'number') {

                    const totalTime = (item.mobilizationDuration + item.demobilizationDuration).toFixed(0);
                    htmlContent += `
                    <div class="section">
                        <div class="section-title">TEMPO TOTAL</div>
                        <div class="item-row">
                            <div class="item-label">Tempo Total:</div>
                            <div class="item-value">${totalTime} minutos</div>
                        </div>
                    </div>`;
                }

                // Atividades
                if (item.activities && typeof item.activities === 'string') {
                    htmlContent += `
                    <div class="section">
                        <div class="section-title">ATIVIDADES</div>
                        <div>${item.activities.replace(/\n/g, '<br>')}</div>
                    </div>`;
                }

                htmlContent += `
                </div>`; // Fim da operação
            });

            // Rodapé
            htmlContent += `
                <div class="footer">
                    <p>SISCOP - Sistema de Controle Operacional</p>
                    <p>Desenvolvido por Ivonildo Lima</p>
                    <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
                </div>
            </body>
            </html>`;

            console.log("HTML do relatório gerado, criando PDF...");

            // Gerar o PDF usando expo-print
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                width: 612, // Largura de uma página A4 em pontos (72dpi)
                height: 792, // Altura de uma página A4 em pontos
                base64: false,
            });

            console.log("PDF gerado em:", uri);

            // Verificar se o compartilhamento está disponível
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo');
                return;
            }

            // Compartilhar o arquivo
            console.log("Iniciando compartilhamento...");
            await Sharing.shareAsync(uri, {
                UTI: '.pdf',
                mimeType: 'application/pdf',
                dialogTitle: 'Compartilhar Relatório de Operações'
            });
            console.log("Compartilhamento concluído");

        } catch (error) {
            console.error("Erro ao gerar relatório PDF:", error);
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

    // Função para formatar apenas a hora:minuto de uma data
    const formatTimeOnly = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Horário inválido';
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

                            {item.mobilizationStartTime && (
                                <Text>Início: {formatTimeOnly(item.mobilizationStartTime)}</Text>
                            )}

                            {item.mobilizationEndTime && (
                                <Text>Fim: {formatTimeOnly(item.mobilizationEndTime)}</Text>
                            )}

                            <Text>Duração: {item.mobilizationDuration.toFixed(0)} minutos</Text>
                        </View>
                    )}

                {/* Desmobilização com verificação segura */}
                {(item.demobilizationDuration != null &&
                    typeof item.demobilizationDuration === 'number') && (
                        <View style={globalStyles.timeItem}>
                            <Text>Desmobilização:</Text>

                            {item.demobilizationStartTime && (
                                <Text>Início: {formatTimeOnly(item.demobilizationStartTime)}</Text>
                            )}

                            {item.demobilizationEndTime && (
                                <Text>Fim: {formatTimeOnly(item.demobilizationEndTime)}</Text>
                            )}

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

                {/* Períodos de Aguardo */}
                {item.waitingPeriods && item.waitingPeriods.length > 0 && (
                    <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Períodos de Aguardo</Text>
                        {item.waitingPeriods.map((period, i) => (
                            <View key={i} style={styles.waitingPeriodItem}>
                                <Text style={styles.waitingPeriodTitle}>Aguardo {i + 1}</Text>
                                <Text>Início: {formatTimeOnly(period.startTime)}</Text>
                                <Text>Fim: {formatTimeOnly(period.endTime)}</Text>
                                <Text>Duração: {period.duration.toFixed(0)} minutos</Text>
                                <Text style={styles.reasonsTitle}>Motivo:</Text>
                                {period.reasons && period.reasons.map((reason, j) => (
                                    <View key={j} style={styles.reasonItem}>
                                        <Text>{reason.reason}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                        <Text style={styles.totalWaitingTime}>
                            Tempo Total de Aguardo: {item.totalWaitingTime ? item.totalWaitingTime.toFixed(0) : 0} minutos
                        </Text>
                    </View>
                )}

                {/* Intervalos de Almoço */}
                {item.lunchBreaks && item.lunchBreaks.length > 0 && (
                    <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Intervalos de Almoço</Text>
                        {item.lunchBreaks.map((lunch, i) => (
                            <View key={i} style={styles.lunchBreakItem}>
                                <Text style={styles.lunchBreakTitle}>Almoço {i + 1}</Text>
                                <Text>Início: {formatTimeOnly(lunch.startTime)}</Text>
                                <Text>Fim: {formatTimeOnly(lunch.endTime)}</Text>
                                <Text>Duração: {lunch.duration.toFixed(0)} minutos</Text>
                            </View>
                        ))}
                        <Text style={styles.totalLunchTime}>
                            Tempo Total de Almoço: {item.totalLunchTime ? item.totalLunchTime.toFixed(0) : 0} minutos
                        </Text>
                    </View>
                )}

                {/* Abastecimentos */}
                {item.refuelings && item.refuelings.length > 0 && (
                    <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Abastecimentos</Text>
                        {item.refuelings.map((refueling, i) => (
                            <View key={i} style={styles.refuelingItem}>
                                <Text style={styles.refuelingTitle}>
                                    Abastecimento de {refueling.type} {i + 1}
                                </Text>
                                <Text>Início: {formatTimeOnly(refueling.startTime)}</Text>
                                <Text>Fim: {formatTimeOnly(refueling.endTime)}</Text>
                                <Text>Duração: {refueling.duration.toFixed(0)} minutos</Text>
                            </View>
                        ))}
                        <Text style={styles.totalRefuelingTime}>
                            Tempo Total de Abastecimento: {item.totalRefuelingTime ? item.totalRefuelingTime.toFixed(0) : 0} minutos
                        </Text>
                    </View>
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

const styles = {
    waitingPeriodItem: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#e74c3c',
    },
    waitingPeriodTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
        color: '#2c3e50',
    },
    reasonsTitle: {
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 13,
        color: '#34495e',
    },
    reasonItem: {
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 4,
        marginVertical: 3,
        borderLeftWidth: 2,
        borderLeftColor: '#3498db',
    },
    totalWaitingTime: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 14,
        color: '#e74c3c',
    },
    lunchBreakItem: {
        backgroundColor: '#fef9e7',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#e67e22',
    },
    lunchBreakTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
        color: '#2c3e50',
    },
    totalLunchTime: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 14,
        color: '#e67e22',
    },
    refuelingItem: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#f39c12',
    },
    refuelingTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
        color: '#2c3e50',
    },
    totalRefuelingTime: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 14,
        color: '#f39c12',
    },
};

export default ReportsScreen;