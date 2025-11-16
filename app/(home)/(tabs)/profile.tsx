import Avatar from '@/components/Avatar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvide';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function ProfileScreen() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              username,
              website,
              avatar_url: url,
              full_name: fullname,
            });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Full name"
          value={fullname || ''}
          onChangeText={text => setFullname(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Username"
          value={username || ''}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Website"
          value={website || ''}
          onChangeText={text => setWebsite(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={() =>
            updateProfile({
              username,
              website,
              avatar_url: avatarUrl,
              full_name: fullname,
            })
          }>
          Update
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button mode="contained" onPress={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
