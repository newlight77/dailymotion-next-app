import { useEffect, useRef, useState } from "react";
import { prefixedKey } from './localStoragePrefix';

// type SetterFn<A> = (value: A) => void;
// type Value<B> = B | undefined;

export function useLocalStorage<S>(key: string, defaultValue?: S):
    [S | undefined, (value: S) => void] {

    const [value, setValue] = useState<S | undefined>(() => defaultValue);
    const userUpdatedRef = useRef(false);
    const defaultValueRef = useRef(defaultValue);
    const valueRef = useRef(value);
    const lastLoadedRef = useRef<{ key?: string; raw?: string | null }>({});

    useEffect(() => {
        defaultValueRef.current = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const setValueAndMark = (nextValue: S) => {
        userUpdatedRef.current = true;
        setValue(nextValue);
    };

    // function clear() {
    //     console.log(`useLocalStorage clear ${key} value=`, value);
    //     localStorage.removeItem(key);
    // }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const newKey = prefixedKey(key);
        const savedNew = localStorage.getItem(newKey);
        // avoid unnecessary parse if nothing changed
        if (lastLoadedRef.current.key === newKey && lastLoadedRef.current.raw === savedNew) return;
        lastLoadedRef.current = { key: newKey, raw: savedNew };

        if (savedNew !== null) {
            if (userUpdatedRef.current) return;
            try {
                const parsed = JSON.parse(savedNew) as S;
                setValue(parsed);
            } catch {
                if (valueRef.current !== defaultValueRef.current) {
                    setValue(defaultValueRef.current as S);
                }
            }
            return;
        }

        // migrate old key if present
        const savedOld = localStorage.getItem(key);
        if (savedOld !== null) {
            try {
                localStorage.setItem(newKey, savedOld);
                localStorage.removeItem(key);
                const parsed = JSON.parse(savedOld) as S;
                setValue(parsed);
                return;
            } catch {
                // ignore migration errors
            }
        }

        if (valueRef.current === undefined && defaultValueRef.current !== undefined) {
            setValue(defaultValueRef.current as S);
        }
    }, [key]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const newKey = prefixedKey(key);
        if (value === undefined) {
            localStorage.removeItem(newKey);
            return;
        }
        try {
            localStorage.setItem(newKey, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to persist ${newKey} to localStorage`, error);
        }
    }, [key, value]);

    return [value, setValueAndMark];
};