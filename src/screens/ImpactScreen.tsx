import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';

type DonationStats = {
  totalDonations: number;
  totalDonors: number;
  peopleHelped: number;
  mealsProvided: number;
};

type RecentDonation = {
  id: string;
  name: string;
  amount: number;
  date: string;
  isAnonymous: boolean;
};

export const ImpactScreen = () => {
  const { data: stats, isLoading: statsLoading } = useQuery<DonationStats>({
    queryKey: ['donationStats'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalDonations: 150000,
        totalDonors: 1200,
        peopleHelped: 500,
        mealsProvided: 15000
      };
    }
  });

  const { data: recentDonations, isLoading: donationsLoading } = useQuery<RecentDonation[]>({
    queryKey: ['recentDonations'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        { id: '1', name: 'John D.', amount: 100, date: '2024-02-20', isAnonymous: false },
        { id: '2', name: 'Anonymous', amount: 50, date: '2024-02-19', isAnonymous: true },
        { id: '3', name: 'Sarah M.', amount: 200, date: '2024-02-18', isAnonymous: false },
      ];
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderDonationItem = ({ item }: { item: RecentDonation }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <Text className="text-text font-semibold">
          {item.isAnonymous ? 'Anonymous' : item.name}
        </Text>
        <Text className="text-primary font-bold">
          {formatCurrency(item.amount)}
        </Text>
      </View>
      <Text className="text-text/60 text-sm mt-1">{item.date}</Text>
    </View>
  );

  if (statsLoading || donationsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-text">Loading impact data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-6">Our Impact</Text>

        <View className="flex-row flex-wrap justify-between mb-8">
          <View className="w-[48%] bg-white p-4 rounded-lg mb-4 shadow-sm">
            <Text className="text-primary text-2xl font-bold">
              {formatCurrency(stats?.totalDonations || 0)}
            </Text>
            <Text className="text-text/80 mt-1">Total Donations</Text>
          </View>

          <View className="w-[48%] bg-white p-4 rounded-lg mb-4 shadow-sm">
            <Text className="text-primary text-2xl font-bold">
              {stats?.totalDonors || 0}
            </Text>
            <Text className="text-text/80 mt-1">Total Donors</Text>
          </View>

          <View className="w-[48%] bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-primary text-2xl font-bold">
              {stats?.peopleHelped || 0}
            </Text>
            <Text className="text-text/80 mt-1">People Helped</Text>
          </View>

          <View className="w-[48%] bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-primary text-2xl font-bold">
              {stats?.mealsProvided || 0}
            </Text>
            <Text className="text-text/80 mt-1">Meals Provided</Text>
          </View>
        </View>

        <View>
          <Text className="text-xl font-semibold text-text mb-4">Recent Donations</Text>
          <FlatList
            data={recentDonations}
            renderItem={renderDonationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ImpactScreen;