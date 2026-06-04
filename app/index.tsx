import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EGGS = [
  { id: '1', name: 'Hard Boiled',   seconds: 600, icon: 'hard',     tip: 'Drop egg in boiling water and cover.' },
  { id: '2', name: 'Soft Boiled',   seconds: 360, icon: 'soft',     tip: 'Use simmering water, not rolling boil.' },
  { id: '3', name: 'Sunny Side Up', seconds: 180, icon: 'sunny',    tip: 'Low heat, no flipping needed.' },
  { id: '4', name: 'Scrambled',     seconds: 240, icon: 'scramble', tip: 'Whisk well before pouring into pan.' },
];

const EggIcon = ({ type }: { type: string }) => {
  const icons: Record<string, any> = {
    hard:     require('../assets/icons/hard-boiled.png'),
    soft:     require('../assets/icons/soft-boiled.png'),
    sunny:    require('../assets/icons/sunny-side-up.png'),
    scramble: require('../assets/icons/scrambled.png'),
  };
  return <Image source={icons[type]} style={{ width: 52, height: 52 }} />;
};

export default function WelcomeScreen() {
  const router = useRouter();

  const handleEggPress = (egg: typeof EGGS[0]) => {
    router.push({
      pathname: '/timer',
      params: {
        name:    egg.name,
        seconds: egg.seconds,
        icon:    egg.icon,
        tip:     egg.tip,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🥚</Text>
        <Text style={styles.title}>What do you wanna{'\n'}cook today?</Text>
        <Text style={styles.subtitle}>Tap an egg to start the timer</Text>
      </View>

      {/* Egg Cards */}
      <View style={styles.grid}>
        {EGGS.map((egg) => (
          <TouchableOpacity
            key={egg.id}
            style={styles.card}
            onPress={() => handleEggPress(egg)}
            activeOpacity={0.75}
          >
            <View style={styles.iconWrap}>
              <EggIcon type={egg.icon} />
            </View>
            <Text style={styles.cardName}>{egg.name}</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.cardTime}>{egg.seconds / 60} min</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footer}>🌿 Fresh eggs cook best at room temperature</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FDF6EC' },
  header:      { alignItems: 'center', marginBottom: 32 },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  title:       { fontFamily: 'Fraunces_700Bold', fontSize: 26, textAlign: 'center', color: '#5C3D11', lineHeight: 34, marginBottom: 8 },
  subtitle:    { fontFamily: 'Nunito_400Regular', fontSize: 14, color: '#B8935A' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', width: '100%' },
  card:        { width: '45%', backgroundColor: '#FFF8EE', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1.5, borderColor: '#F0D9A8' },
  iconWrap:    { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FDF0D5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardName:    { fontFamily: 'Nunito_700Bold', fontSize: 14, textAlign: 'center', color: '#5C3D11', marginBottom: 8 },
  timeBadge:   { backgroundColor: '#FAEEDA', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  cardTime:    { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#854F0B' },
  footer:      { fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#C9A96E', marginTop: 32, textAlign: 'center' },
});