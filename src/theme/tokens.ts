import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

export interface AppTheme {
    colors: {
        background: string;
        backgroundAccent: string;
        card: string;
        cardElevated: string;
        cardMuted: string;
        text: string;
        textMuted: string;
        textOnPrimary: string;
        primary: string;
        primaryDim: string;
        primarySoft: string;
        steady: string;
        steadySoft: string;
        watch: string;
        watchSoft: string;
        urgent: string;
        urgentSoft: string;
        critical: string;
        criticalSoft: string;
        neutral: string;
        neutralSoft: string;
        border: string;
        shadow: string;
        overlay: string;
        tabIcon: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    radius: {
        sm: number;
        md: number;
        lg: number;
        pill: number;
    };
    typography: {
        hero: number;
        title: number;
        section: number;
        body: number;
        bodySmall: number;
        label: number;
    };
    isDark: boolean;
    navigationTheme: NavigationTheme;
}

const sharedTheme = {
    spacing: {
        xs: 6,
        sm: 10,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    radius: {
        sm: 14,
        md: 20,
        lg: 28,
        pill: 999,
    },
    typography: {
        hero: 38,
        title: 28,
        section: 22,
        body: 16,
        bodySmall: 14,
        label: 12,
    },
};

export const lightTheme: AppTheme = {
    ...sharedTheme,
    colors: {
        background: '#f7f9fb',
        backgroundAccent: '#eef4f6',
        card: '#ffffff',
        cardElevated: '#f0f4f7',
        cardMuted: '#dce4e8',
        text: '#2c3437',
        textMuted: '#596064',
        textOnPrimary: '#e6ffee',
        primary: '#006d4a',
        primaryDim: '#005f40',
        primarySoft: '#69f6b8',
        steady: '#72c97d',
        steadySoft: '#dff6db',
        watch: '#c79524',
        watchSoft: '#fff1c8',
        urgent: '#cc7a00',
        urgentSoft: '#ffe0b0',
        critical: '#ba1b24',
        criticalSoft: '#ffd5d4',
        neutral: '#7c8a91',
        neutralSoft: '#edf1f4',
        border: 'rgba(116, 124, 128, 0.16)',
        shadow: 'rgba(44, 52, 55, 0.08)',
        overlay: 'rgba(44, 52, 55, 0.28)',
        tabIcon: '#667378',
    },
    isDark: false,
    navigationTheme: {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: '#f7f9fb',
            card: '#f7f9fb',
            primary: '#006d4a',
            text: '#2c3437',
            border: 'rgba(116, 124, 128, 0.16)',
            notification: '#ba1b24',
        },
    },
};

export const darkTheme: AppTheme = {
    ...sharedTheme,
    colors: {
        background: '#0b1113',
        backgroundAccent: '#102127',
        card: '#122228',
        cardElevated: '#173038',
        cardMuted: '#203b44',
        text: '#edf5f1',
        textMuted: '#a3b7b3',
        textOnPrimary: '#effff7',
        primary: '#51d9a0',
        primaryDim: '#1fa06d',
        primarySoft: '#14372a',
        steady: '#7bd892',
        steadySoft: '#173b2b',
        watch: '#f2c35b',
        watchSoft: '#43361a',
        urgent: '#ff9b47',
        urgentSoft: '#4a2d13',
        critical: '#ff7676',
        criticalSoft: '#4d1e22',
        neutral: '#93a5ac',
        neutralSoft: '#24343b',
        border: 'rgba(163, 183, 179, 0.16)',
        shadow: 'rgba(0, 0, 0, 0.3)',
        overlay: 'rgba(0, 0, 0, 0.5)',
        tabIcon: '#8aa09a',
    },
    isDark: true,
    navigationTheme: {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: '#0b1113',
            card: '#0b1113',
            primary: '#51d9a0',
            text: '#edf5f1',
            border: 'rgba(163, 183, 179, 0.16)',
            notification: '#ff7676',
        },
    },
};
