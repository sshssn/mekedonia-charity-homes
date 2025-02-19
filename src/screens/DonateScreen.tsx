import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';

type DonationAmount = 10 | 25 | 50 | 100;
type PaymentMethod = 'stripe' | 'paypal' | 'crypto';

const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['stripe', 'paypal', 'crypto']),
  isRecurring: z.boolean(),
});

export const DonateScreen = () => {
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [amount, setAmount] = useState<DonationAmount | number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isRecurring, setIsRecurring] = useState(false);

  const predefinedAmounts: DonationAmount[] = [10, 25, 50, 100];

  const handleDonation = async () => {
    if (!user) {
      Alert.alert('Please sign in', 'You need to be signed in to make a donation');
      return;
    }

    try {
      const finalAmount = customAmount ? parseFloat(customAmount) : amount;
      const validatedData = donationSchema.parse({
        amount: finalAmount,
        paymentMethod,
        isRecurring,
      });

      setLoading(true);

      switch (paymentMethod) {
        case 'stripe':
          await handleStripePayment(finalAmount);
          break;
        case 'paypal':
          await handlePayPalPayment(finalAmount);
          break;
        case 'crypto':
          await handleCryptoPayment(finalAmount);
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert('Validation Error', error.errors[0].message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async (finalAmount: number) => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount * 100,
          currency: 'usd',
          isRecurring,
        }),
      });

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Mekedonia Charity',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: user.name,
          email: user.email,
        },
      });

      if (error) throw error;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        throw presentError;
      }

      Alert.alert('Success', 'Thank you for your donation!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handlePayPalPayment = async (finalAmount: number) => {
    // TODO: Implement PayPal payment integration
    Alert.alert('Coming Soon', 'PayPal integration will be available soon!');
  };

  const handleCryptoPayment = async (finalAmount: number) => {
    // TODO: Implement Crypto payment integration
    Alert.alert('Coming Soon', 'Cryptocurrency payments will be available soon!');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-6">Make a Donation</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-4">Select Amount</Text>
          <View className="flex-row flex-wrap justify-between">
            {predefinedAmounts.map((predefinedAmount) => (
              <TouchableOpacity
                key={predefinedAmount}
                onPress={() => {
                  setAmount(predefinedAmount);
                  setCustomAmount('');
                }}
                className={`w-[48%] p-4 rounded-lg mb-3 ${!customAmount && amount === predefinedAmount ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <Text className={`text-center font-semibold ${!customAmount && amount === predefinedAmount ? 'text-white' : 'text-text'}`}>
                  ${predefinedAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-4">
            <Text className="text-base text-text mb-2">Custom Amount</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-text mb-4">Payment Method</Text>
          <View className="space-y-3">
            {(['stripe', 'paypal', 'crypto'] as PaymentMethod[]).map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                className={`p-4 rounded-lg ${paymentMethod === method ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <Text className={`text-center font-semibold ${paymentMethod === method ? 'text-white' : 'text-text'}`}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setIsRecurring(!isRecurring)}
            className="flex-row items-center"
          >
            <View className={`w-6 h-6 rounded-md border-2 mr-2 ${isRecurring ? 'bg-primary border-primary' : 'border-gray-400'}`} />
            <Text className="text-text">Make this a monthly donation</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleDonation}
          disabled={loading}
          className={`p-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-primary'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Processing...' : `Donate $${customAmount || amount}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DonateScreen;