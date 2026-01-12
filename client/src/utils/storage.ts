import { SECURITY_CONFIG } from './constants';

interface StorageData<T> {
    value: T;
    timestamp: number;
}

class SecureStorage {
    private prefix = 'sv_waitlist_';

    set<T>(key: string, value: T): void {
        if (typeof window === 'undefined') {
            console.warn('Storage.set called outside browser environment');
            return;
        }

        try {
            const data: StorageData<T> = {
                value,
                timestamp: Date.now(),
            };
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.prefix + key, serialized);
        } catch (error) {
            console.error('Storage set error:', error);
            throw new Error('Failed to save data. Storage may be full or unavailable.');
        }
    }

    get<T>(key: string): T | null {
        if (typeof window === 'undefined') {
            console.warn('Storage.get called outside browser environment');
            return null;
        }

        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;

            const data: StorageData<T> = JSON.parse(item);

            // Validate data structure
            if (!data || typeof data !== 'object' || !('value' in data) || !('timestamp' in data)) {
                console.warn('Invalid storage data format, removing corrupted data');
                this.remove(key);
                return null;
            }

            // Check if session has expired
            if (Date.now() - data.timestamp > SECURITY_CONFIG.SESSION_TIMEOUT) {
                this.remove(key);
                return null;
            }

            return data.value;
        } catch (error) {
            console.error('Storage retrieval error:', error);
            // Try to clean up corrupted data
            try {
                this.remove(key);
            } catch (removeError) {
                console.error('Failed to remove corrupted data:', removeError);
            }
            return null;
        }
    }

    remove(key: string): void {
        if (typeof window === 'undefined') {
            console.warn('Storage.remove called outside browser environment');
            return;
        }

        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    }

    clear(): void {
        if (typeof window === 'undefined') {
            console.warn('Storage.clear called outside browser environment');
            return;
        }

        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => {
                    try {
                        localStorage.removeItem(key);
                    } catch (error) {
                        console.error(`Failed to remove key ${key}:`, error);
                    }
                });
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    }

    // Refresh session timestamp
    refresh(key: string): void {
        if (typeof window === 'undefined') {
            console.warn('Storage.refresh called outside browser environment');
            return;
        }

        try {
            const value = this.get(key);
            if (value !== null) {
                this.set(key, value);
            }
        } catch (error) {
            console.error('Storage refresh error:', error);
        }
    }
}

export const storage = new SecureStorage();
export default storage;
