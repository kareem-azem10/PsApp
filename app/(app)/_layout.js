import { Stack } from 'expo-router';

const AppLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" />
    </Stack>
  );
};

export default AppLayout;
