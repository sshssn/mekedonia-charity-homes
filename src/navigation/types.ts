export type RootStackParamList = {
  Home: undefined;
  Campaign: { id: string };
  Donate: { campaignId?: string };
  Auth: undefined;
  Profile: undefined;
  Volunteer: undefined;
  News: undefined;
  NewsDetail: { id: string };
};

export type BottomTabParamList = {
  HomeTab: undefined;
  CampaignsTab: undefined;
  DonateTab: undefined;
  NewsTab: undefined;
  ProfileTab: undefined;
};