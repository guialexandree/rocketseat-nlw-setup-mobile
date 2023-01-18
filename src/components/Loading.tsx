import { ActivityIndicator, View } from "react-native";

interface LoadingProps { }

export function Loading(props: LoadingProps) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#09090A'
    }}>
      <ActivityIndicator color='#7C3AED' />
    </View>
  )
}
