import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  availability: z.enum(['weekdays', 'weekends', 'both']),
  skills: z.string().min(1, 'Please list your relevant skills'),
  motivation: z.string().min(10, 'Please share your motivation')
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

export const VolunteerScreen = () => {
  const [formData, setFormData] = useState<Partial<VolunteerFormData>>({
    fullName: '',
    email: '',
    phone: '',
    availability: 'weekdays',
    skills: '',
    motivation: ''
  });

  const volunteerMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      // TODO: Replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      Alert.alert(
        'Success',
        'Thank you for volunteering! We will contact you soon.',
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    },
    onError: () => {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      availability: 'weekdays',
      skills: '',
      motivation: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const validatedData = volunteerSchema.parse(formData);
      volunteerMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert('Validation Error', error.errors[0].message);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-6">Volunteer Registration</Text>

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-base text-text mb-2">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View>
            <Text className="text-base text-text mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-base text-text mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-base text-text mb-2">Availability</Text>
            <View className="flex-row space-x-2">
              {(['weekdays', 'weekends', 'both'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setFormData({ ...formData, availability: option })}
                  className={`flex-1 p-3 rounded-lg ${formData.availability === option ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <Text className={`text-center font-semibold ${formData.availability === option ? 'text-white' : 'text-text'}`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-base text-text mb-2">Skills & Experience</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              value={formData.skills}
              onChangeText={(text) => setFormData({ ...formData, skills: text })}
              placeholder="List your relevant skills and experience"
              multiline
              numberOfLines={3}
            />
          </View>

          <View>
            <Text className="text-base text-text mb-2">Motivation</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-text"
              value={formData.motivation}
              onChangeText={(text) => setFormData({ ...formData, motivation: text })}
              placeholder="Why do you want to volunteer with us?"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={volunteerMutation.isPending}
          className={`p-4 rounded-lg ${volunteerMutation.isPending ? 'bg-gray-400' : 'bg-primary'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {volunteerMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VolunteerScreen;