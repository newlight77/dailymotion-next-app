import { useState, useEffect } from "react";

// type SetterFn<A> = (value: A) => void;
// type Value<B> = B | undefined;

export function useLocalStorage<S> (key: string, defaultValue?: S):
    [S | undefined, (value: S) => void] {

    const initValue = getStorageValue(key, defaultValue);

    const [value, setValue] = useState(initValue);

    function getStorageValue(key: string, defaultValue?: S): S {
        const saved = localStorage.getItem(key);
        // console.log(`useLocalStorage ${key} saved=`, saved);
        return saved ? JSON.parse(saved): (defaultValue);
    }

    // function clear() {
    //     console.log(`useLocalStorage clear ${key} value=`, value);
    //     localStorage.removeItem(key);
    // }

    useEffect(() => {
        // console.log(`useLocalStorage ${key} new value=`, value);
        if (value) localStorage.setItem(key, JSON.stringify(value))
    }, [key, value, setValue]);

    return [value, setValue];
};