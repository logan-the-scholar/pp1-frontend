import { Dispatch, useState } from "react";

export type FormErrors<T> = { [K in keyof T]?: { _errors: string[] } | undefined };
export type FormatedErrors<T> = { [K in keyof T]?: string[] | undefined };

export function formatErrors<T>(errors: FormErrors<T>): FormatedErrors<T> {
    const formated_error: FormatedErrors<T> = {};

    for (const key in errors) {
        if (errors[key] && errors[key]._errors) {
            formated_error[key] = errors[key]._errors;
        }
    }

    return formated_error;
}

export function useError<T>(initialValue: any): [FormatedErrors<T>, Dispatch<any>] {

    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

    });

    return [storedValue, setStoredValue];
}