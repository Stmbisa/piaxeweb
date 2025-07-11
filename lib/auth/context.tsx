"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthResponse, LoginCredentials, RegisterData, authAPI } from './api';
import { MerchantRegistrationData } from './merchant-api';

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    isDeveloper: boolean
    isBusiness: boolean
    hasStores: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshAuth: () => Promise<void>
    createDeveloperAccount: (developerData: MerchantRegistrationData) => Promise<void>
    createBusinessAccount: (businessData: any) => Promise<void>
    refreshProfileStatus: () => Promise<void>
    checkStores: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'piaxe_auth_token'
const REFRESH_TOKEN_KEY = 'piaxe_refresh_token'
const USER_KEY = 'piaxe_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasStores, setHasStores] = useState(false)

    const isAuthenticated = !!user && !!token
    const isDeveloper = !!user?.developer_profile
    const isBusiness = !!user?.business_profile || hasStores

    // Load auth data from localStorage on mount
    useEffect(() => {
        const loadStoredAuth = async () => {
            // Skip if we're on the server
            if (typeof window === 'undefined') {
                setIsLoading(false)
                return
            }

            try {
                const storedToken = localStorage.getItem(TOKEN_KEY)
                const storedUser = localStorage.getItem(USER_KEY)

                if (storedToken && storedUser) {
                    setToken(storedToken)
                    setUser(JSON.parse(storedUser))

                    // Verify token is still valid by fetching profile
                    try {
                        const profile = await authAPI.getProfile(storedToken)
                        setUser(profile)
                    } catch (error) {
                        console.log('Stored token invalid, attempting refresh...')
                        // Token is invalid, try to refresh
                        try {
                            await refreshAuth()
                        } catch (refreshError) {
                            console.log('Token refresh failed, clearing auth')
                            clearAuth()
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading stored auth:', error)
                clearAuth()
            } finally {
                setIsLoading(false)
            }
        }

        loadStoredAuth()
    }, [])

    const storeAuth = async (authData: AuthResponse) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, authData.access_token)
            localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token)

            // Also set cookies for middleware
            document.cookie = `piaxe_auth_token=${authData.access_token}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
            document.cookie = `piaxe_refresh_token=${authData.refresh_token}; path=/; max-age=${30 * 24 * 60 * 60}`
        }
        setToken(authData.access_token)

        // Fetch user profile after authentication
        try {
            const profile = await authAPI.getProfile(authData.access_token)
            if (typeof window !== 'undefined') {
                localStorage.setItem(USER_KEY, JSON.stringify(profile))
            }
            setUser(profile)
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
            clearAuth()
            throw new Error('Failed to load user profile')
        }
    }

    const clearAuth = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            localStorage.removeItem(USER_KEY)

            // Also clear cookies
            document.cookie = 'piaxe_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = 'piaxe_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        setToken(null)
        setUser(null)
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true)
            const authData = await authAPI.login(credentials)
            await storeAuth(authData)
        } catch (error) {
            clearAuth()
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true)
            const authData = await authAPI.register(data)
            await storeAuth(authData)
        } catch (error) {
            clearAuth()
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            if (token) {
                await authAPI.logout(token)
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            clearAuth()
        }
    }

    const refreshAuth = async () => {
        try {
            if (typeof window === 'undefined') {
                throw new Error('Cannot refresh auth on server')
            }

            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }

            const authData = await authAPI.refreshToken(refreshToken)
            await storeAuth(authData)
        } catch (error) {
            console.error('Token refresh failed:', error)
            clearAuth()
            // Only throw if it's not a network error - let the app continue with logged out state
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            if (!errorMessage.includes('Network error')) {
                throw error
            }
        }
    }

    const createDeveloperAccount = async (developerData: MerchantRegistrationData) => {
        if (!token) {
            throw new Error('Must be logged in to create developer account')
        }

        try {
            setIsLoading(true)
            await authAPI.createDeveloperAccount(token, developerData)
            // Refresh user profile to get updated developer info
            await refreshProfileStatus()
        } catch (error) {
            console.error('Developer account creation failed:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const createBusinessAccount = async (businessData: any) => {
        if (!token) {
            throw new Error('Must be logged in to create business account')
        }

        try {
            setIsLoading(true)
            await authAPI.createBusinessAccount(token, businessData)
            // Refresh user profile to get updated business info
            await refreshProfileStatus()
            // Check for stores since we just created one
            await checkStores()
        } catch (error) {
            console.error('Business account creation failed:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const refreshProfileStatus = async () => {
        if (!token) return

        try {
            const profile = await authAPI.getProfile(token)
            setUser(profile)
            if (typeof window !== 'undefined') {
                localStorage.setItem(USER_KEY, JSON.stringify(profile))
            }
        } catch (error) {
            console.error('Failed to refresh profile status:', error)
            throw error
        }
    }

    const checkStores = async (): Promise<boolean> => {
        if (!token || typeof window === 'undefined') return false

        try {
            const { shoppingInventoryAPI } = await import('../api/shopping-inventory')
            const stores = await shoppingInventoryAPI.getStores(token)
            const hasUserStores = stores.length > 0
            setHasStores(hasUserStores)
            return hasUserStores
        } catch (error) {
            console.error('Failed to check stores:', error)
            setHasStores(false)
            return false
        }
    }

    // Set up automatic token refresh
    useEffect(() => {
        if (!token) return

        const refreshInterval = setInterval(async () => {
            try {
                await refreshAuth()
            } catch (error) {
                console.error('Auto refresh failed:', error)
            }
        }, 15 * 60 * 1000) // Refresh every 15 minutes

        return () => clearInterval(refreshInterval)
    }, [token])

    // Check for stores when user is authenticated
    useEffect(() => {
        if (isAuthenticated && token && !user?.business_profile) {
            checkStores()
        }
    }, [isAuthenticated, token, user?.business_profile])

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        isDeveloper,
        isBusiness,
        hasStores,
        login,
        register,
        logout,
        refreshAuth,
        createDeveloperAccount,
        createBusinessAccount,
        refreshProfileStatus,
        checkStores,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
