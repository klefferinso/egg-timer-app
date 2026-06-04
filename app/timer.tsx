import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// 🎨 Progress ring constants
const RADIUS = 100;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const EggIcon = ({ type }: { type: string }) => {
  const icons: Record<string, any> = {
    hard:     require('../assets/icons/hard-boiled.png'),
    soft:     require('../assets/icons/soft-boiled.png'),
    sunny:    require('../assets/icons/sunny-side-up.png'),
    scramble: require('../assets/icons/scrambled.png'),
  };
  return <Image source={icons[type]} style={{ width: 64, height: 64 }} />;
};

export default function TimerScreen() {

  // 🔊 Configure audio session on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  }, []);

  const router = useRouter();
  const params = useLocalSearchParams();

  const name  = params.name as string;
  const icon  = params.icon as string;
  const tip   = params.tip as string;
  const total = Number(params.seconds);

  const [remaining, setRemaining] = useState(total);
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);

  // 🔔 Play bell sound when timer finishes
  const playBell = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/bell.mp3')
      );
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 5000);
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  // ⏱️ Countdown logic
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          setDone(true);
          playBell();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // Format seconds → MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Progress ring calculation
  const progress     = remaining / total;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);

  const handleReset = () => {
    setRunning(false);
    setDone(false);
    setRemaining(total);
  };

  // 🎉 Done screen
  if (done) {
    return (
      <View style={styles.doneContainer}>
        <View style={styles.doneIconWrap}>
          <EggIcon type={icon} />
        </View>
        <Text style={styles.doneTitle}>Your egg is ready!</Text>
        <Text style={styles.doneSub}>{name} is done. Enjoy! 🍽️</Text>

        <View style={styles.notifCard}>
          <Text style={styles.notifBell}>🔔</Text>
          <View>
            <Text style={styles.notifTitle}>Egg Timer</Text>
            <Text style={styles.notifBody}>{name} is ready! Time to eat.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Cook another egg</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ⏱️ Timer screen
  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Egg name */}
      <Text style={styles.eggName}>{name}</Text>

      {/* Progress ring */}
      <View style={styles.ringWrap}>
        <Svg width={240} height={240} viewBox="0 0 240 240">
          {/* Background ring */}
          <Circle
            cx="120" cy="120" r={RADIUS}
            fill="none"
            stroke="#F0D9A8"
            strokeWidth={STROKE}
          />
          {/* Progress ring */}
          <Circle
            cx="120" cy="120" r={RADIUS}
            fill="none"
            stroke="#D4890A"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 120 120)"
          />
        </Svg>

        {/* Timer text inside the ring */}
        <View style={styles.ringCenter}>
          <EggIcon type={icon} />
          <Text style={styles.timerDisplay}>{formatTime(remaining)}</Text>
          <Text style={styles.remainingLabel}>remaining</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setRunning(!running)}>
          <Text style={styles.primaryBtnText}>
            {running ? 'Pause' : remaining === total ? 'Start' : 'Resume'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tip */}
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>💡 {tip}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FDF6EC' },
  backBtn:        { position: 'absolute', top: 60, left: 24 },
  backText:       { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#B8935A' },
  eggName:        { fontFamily: 'Nunito_800ExtraBold', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#B8935A', marginBottom: 16 },

  ringWrap:       { width: 240, height: 240, position: 'relative', marginBottom: 32 },
  ringCenter:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  timerDisplay:   { fontFamily: 'Nunito_800ExtraBold', fontSize: 48, color: '#5C3D11', letterSpacing: -1, marginTop: 4 },
  remainingLabel: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#B8935A', marginTop: 2 },

  controls:       { flexDirection: 'row', gap: 12, marginBottom: 24 },
  resetBtn:       { borderWidth: 1.5, borderColor: '#F0D9A8', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28, backgroundColor: '#FFF8EE' },
  resetText:      { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#B8935A' },
  primaryBtn:     { backgroundColor: '#D4890A', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  primaryBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },

  tipBox:         { backgroundColor: '#FFF8EE', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: '#F0D9A8', maxWidth: 300 },
  tipText:        { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#B8935A', textAlign: 'center', lineHeight: 20 },

  doneContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FDF6EC' },
  doneIconWrap:   { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FDF0D5', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: '#F0D9A8' },
  doneTitle:      { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: '#5C3D11', marginBottom: 8 },
  doneSub:        { fontFamily: 'Nunito_400Regular', fontSize: 16, color: '#B8935A', marginBottom: 28 },
  notifCard:      { backgroundColor: '#FFF8EE', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#F0D9A8', width: '100%', maxWidth: 300, marginBottom: 28 },
  notifBell:      { fontSize: 24 },
  notifTitle:     { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#5C3D11' },
  notifBody:      { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#B8935A' },
});