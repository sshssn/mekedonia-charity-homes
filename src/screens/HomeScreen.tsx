import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="items-center mb-6">
          <Image
            source={require('../../assets/icon.png')}
            className="w-32 h-32 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold text-text mb-2">Mekedonia Charity Home</Text>
          <Text className="text-base text-text/80 text-center mb-6">
            Providing hope and support to those in need through compassionate care and community engagement.
          </Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Donate', {})}
            className="bg-primary p-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">Make a Donation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Volunteer')}
            className="bg-secondary p-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">Become a Volunteer</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Text className="text-xl font-semibold text-text mb-4">Our Impact</Text>
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-base text-text/90 mb-2">• Supporting 500+ individuals daily</Text>
            <Text className="text-base text-text/90 mb-2">• Providing shelter and care</Text>
            <Text className="text-base text-text/90 mb-2">• Offering medical assistance</Text>
            <Text className="text-base text-text/90">• Creating sustainable solutions</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;