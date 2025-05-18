import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import globalStyles from '../styles/globalStyles';

function KeyboardAwareScreen({ children, style }) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 30}
            enabled
        >
            <ScrollView
                style={[globalStyles.scrollView, style]}
                contentContainerStyle={{ paddingBottom: 150 }}
                // Evite que o sistema feche o teclado entre os campos
                keyboardShouldPersistTaps="handled"
                // Não fechar o teclado ao arrastar a tela
                keyboardDismissMode="none"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAwareScreen;