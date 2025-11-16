import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Session | null>();

  //* If user login/logout, session will be update
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //* fetch profile only when user changed
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    //** Session id (store in public table) and profile id (stored in auth table)
    // * is the same */
    const fetchProfile = async () => {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [session?.user]);

  return (
    //* If user is undefined, use null instead
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
