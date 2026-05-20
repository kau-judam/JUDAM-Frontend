import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react-native';

export type FundingAlertTone = 'info' | 'success' | 'warning' | 'error';
export type FundingAlertButtonVariant = 'primary' | 'secondary' | 'danger';

export type FundingAlertButton = {
  label: string;
  onPress?: () => void;
  variant?: FundingAlertButtonVariant;
};

type FundingAlertModalProps = {
  visible: boolean;
  title: string;
  body: string;
  tone?: FundingAlertTone;
  buttons?: FundingAlertButton[];
  onClose: () => void;
};

const toneColor: Record<FundingAlertTone, string> = {
  info: '#111827',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
};

function ToneIcon({ tone }: { tone: FundingAlertTone }) {
  const color = toneColor[tone];
  if (tone === 'success') return <CheckCircle2 size={30} color={color} strokeWidth={2.4} />;
  if (tone === 'error') return <XCircle size={30} color={color} strokeWidth={2.4} />;
  if (tone === 'warning') return <AlertCircle size={30} color={color} strokeWidth={2.4} />;
  return <Info size={30} color={color} strokeWidth={2.4} />;
}

export default function FundingAlertModal({
  visible,
  title,
  body,
  tone = 'info',
  buttons,
  onClose,
}: FundingAlertModalProps) {
  const resolvedButtons = buttons?.length ? buttons : [{ label: '확인', variant: 'primary' as const }];

  const handlePress = (button: FundingAlertButton) => {
    onClose();
    requestAnimationFrame(() => {
      button.onPress?.();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: `${toneColor[tone]}12` }]}>
            <ToneIcon tone={tone} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.buttonGroup}>
            {resolvedButtons.map((button) => {
              const variant = button.variant || 'primary';
              const isPrimary = variant === 'primary';
              const isDanger = variant === 'danger';
              return (
                <TouchableOpacity
                  key={button.label}
                  style={[
                    styles.button,
                    isPrimary && styles.primaryButton,
                    variant === 'secondary' && styles.secondaryButton,
                    isDanger && styles.dangerButton,
                  ]}
                  activeOpacity={0.86}
                  onPress={() => handlePress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isPrimary && styles.primaryButtonText,
                      variant === 'secondary' && styles.secondaryButtonText,
                      isDanger && styles.primaryButtonText,
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.58)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  button: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#111827',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  primaryButtonText: {
    color: '#FFF',
  },
  secondaryButtonText: {
    color: '#111827',
  },
});
