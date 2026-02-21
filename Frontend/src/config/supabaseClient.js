import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using mock mode.')
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Auth helper functions
export const signUp = async (email, password, fullName) => {
    if (!supabase) {
        // Mock mode
        return {
            data: {
                user: { id: 'mock-' + Date.now(), email, user_metadata: { full_name: fullName } },
                session: { access_token: 'mock-token' }
            },
            error: null
        }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })

    return { data, error }
}

export const signIn = async (email, password) => {
    if (!supabase) {
        // Mock mode - accept test credentials
        if (email === 'test@example.com' && password === 'password123') {
            return {
                data: {
                    user: { id: 'mock-user', email, user_metadata: { full_name: 'Test User' } },
                    session: { access_token: 'mock-token' }
                },
                error: null
            }
        }
        return { data: null, error: { message: 'Invalid credentials' } }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return { data, error }
}

export const signOut = async () => {
    if (!supabase) {
        return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async () => {
    if (!supabase) {
        return { user: null }
    }

    const { data: { user } } = await supabase.auth.getUser()
    return { user }
}

export const getSession = async () => {
    if (!supabase) {
        return { session: null }
    }

    const { data: { session } } = await supabase.auth.getSession()
    return { session }
}

export const onAuthStateChange = (callback) => {
    if (!supabase) {
        // Return mock subscription
        return {
            data: {
                subscription: {
                    unsubscribe: () => { }
                }
            }
        }
    }

    return supabase.auth.onAuthStateChange(callback)
}

export const resetPassword = async (email) => {
    if (!supabase) {
        return { error: null }
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
}

export const updatePassword = async (newPassword) => {
    if (!supabase) {
        return { error: { message: 'Supabase not configured' } }
    }

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    })
    return { data, error }
}

// Google OAuth sign in
export const signInWithGoogle = async () => {
    if (!supabase) {
        return { error: { message: 'Supabase not configured' } }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })

    return { data, error }
}

// GitHub OAuth sign in
export const signInWithGitHub = async () => {
    if (!supabase) {
        return { error: { message: 'Supabase not configured' } }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })

    return { data, error }
}

export default supabase
