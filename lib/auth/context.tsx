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
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshAuth: () => Promise<void>
    createDeveloperAccount: (developerData: MerchantRegistrationData) => Promise<void>
    createBusinessAccount: (businessData: any) => Promise<void>
    refreshProfileStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'piaxe_auth_token'
const REFRESH_TOKEN_KEY = 'piaxe_refresh_token'
const USER_KEY = 'piaxe_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!user && !!token
    const isDeveloper = !!user?.developer_profile
    const isBusiness = !!user?.business_profile

    // Load auth data from localStorage on mount
    useEffect(() => {
        const loadStoredAuth = async () => {
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
                        // Token is invalid, try to refresh
                        await refreshAuth()
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
        localStorage.setItem(TOKEN_KEY, authData.access_token)
        localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token)
        setToken(authData.access_token)

        // Fetch user profile after authentication
        try {
            const profile = await authAPI.getProfile(authData.access_token)
            localStorage.setItem(USER_KEY, JSON.stringify(profile))
            setUser(profile)
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
            clearAuth()
            throw new Error('Failed to load user profile')
        }
    }

    const clearAuth = () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
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
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }

            const authData = await authAPI.refreshToken(refreshToken)
            await storeAuth(authData)
        } catch (error) {
            console.error('Token refresh failed:', error)
            clearAuth()
            throw error
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
            localStorage.setItem(USER_KEY, JSON.stringify(profile))
        } catch (error) {
            console.error('Failed to refresh profile status:', error)
            throw error
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

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        isDeveloper,
        isBusiness,
        login,
        register,
        logout,
        refreshAuth,
        createDeveloperAccount,
        createBusinessAccount,
        refreshProfileStatus,
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
