import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, BottomTabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'CampaignsTab':
              iconName = focused ? 'megaphone' : 'megaphone-outline';
              break;
            case 'DonateTab':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'NewsTab':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="CampaignsTab" component={CampaignsScreen} options={{ title: 'Campaigns' }} />
      <Tab.Screen name="DonateTab" component={DonateScreen} options={{ title: 'Donate' }} />
      <Tab.Screen name="NewsTab" component={NewsScreen} options={{ title: 'News' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Campaign" component={CampaignDetailScreen} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Volunteer" component={VolunteerScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};