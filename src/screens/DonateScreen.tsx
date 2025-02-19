import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../contexts/AuthContext';

type DonationAmount = 10 | 25 | 50 | 100;

export const DonateScreen = () => {
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [amount, setAmount] = useState<DonationAmount | number>(25);
  const [loading, setLoading] = useState(false);

  const predefinedAmounts: DonationAmount[] = [10, 25, 50, 100];

  const handleDonation = async () => {
    if (!user) {
      Alert.alert('Please sign in', 'You need to be signed in to make a donation');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call to create payment intent
      const response = await fetch('YOUR_API_ENDPOINT/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
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

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Error', presentError.message);
      } else {
        Alert.alert('Success', 'Thank you for your donation!');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Something went wrong with the payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-2xl font-bold text-text mb-6">Make a Donation</Text>
        
        <Text className="text-base text-text/80 mb-6">
          Your generous donation helps us provide care and support to those in need.
        </Text>

        <View className="flex-row flex-wrap justify-between mb-6">
          {predefinedAmounts.map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => setAmount(preset)}
              className={`w-[48%] p-4 rounded-lg mb-4 ${amount === preset ? 'bg-primary' : 'bg-gray-100'}`}
            >
              <Text
                className={`text-center text-lg font-semibold ${amount === preset ? 'text-white' : 'text-text'}`}
              >
                ${preset}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold text-text mb-2">Custom Amount</Text>
          <TextInput
            className="p-4 bg-gray-100 rounded-lg text-text"
            keyboardType="numeric"
            value={amount.toString()}
            onChangeText={(value) => setAmount(Number(value) || 0)}
            placeholder="Enter amount"
          />
        </View>

        <TouchableOpacity
          onPress={handleDonation}
          disabled={loading || amount <= 0}
          className={`p-4 rounded-lg ${loading || amount <= 0 ? 'bg-gray-300' : 'bg-primary'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Processing...' : `Donate $${amount}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DonateScreen;