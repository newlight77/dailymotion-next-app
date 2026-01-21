import { useEffect, useRef, useState } from "react";

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
        const saved = localStorage.getItem(key);
        if (lastLoadedRef.current.key === key && lastLoadedRef.current.raw === saved) return;
        lastLoadedRef.current = { key, raw: saved };

        if (saved !== null) {
            if (userUpdatedRef.current) return;
            try {
                const parsed = JSON.parse(saved) as S;
                setValue(parsed);
            } catch {
                if (valueRef.current !== defaultValueRef.current) {
                    setValue(defaultValueRef.current as S);
                }
            }
            return;
        }

        if (valueRef.current === undefined && defaultValueRef.current !== undefined) {
            setValue(defaultValueRef.current as S);
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

    return [value, setValueAndMark];
};