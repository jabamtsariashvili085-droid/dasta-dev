import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('ka-GE', {
        style: 'currency',
        currency: 'GEL',
    }).format(amount);
}

export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat('ka-GE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}
