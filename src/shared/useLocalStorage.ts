import { useState, useEffect } from "react";

// type SetterFn<A> = (value: A) => void;
// type Value<B> = B | undefined;

export function useLocalStorage<S>(key: string, defaultValue?: S):
    [S | undefined, (value: S) => void] {

    const [value, setValue] = useState<S | undefined>(() => defaultValue);

    // function clear() {
    //     console.log(`useLocalStorage clear ${key} value=`, value);
    //     localStorage.removeItem(key);
    // }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            try {
                setValue(JSON.parse(saved));
            } catch {
                setValue(defaultValue);
            }
        }
    }, [key]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (value === undefined) {
            localStorage.removeItem(key);
            return;
        }
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};