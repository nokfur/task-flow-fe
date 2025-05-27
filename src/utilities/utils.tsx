import type { FormikValues } from 'formik';

export function getFirstLetterOfFirst2Word(
    name: string | null | undefined,
): string {
    if (!name || name.length === 0) return '';
    const names = name.split(' ');
    const n = names.length;
    return n > 1 ? names[n - 1][0] + names[n - 2][0] : names[n - 1][0];
}

export function numberFormatter(num: number, digits: number = 1): string {
    const lookup: { value: number; symbol: string }[] = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];

    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find((item) => num >= item.value); // Using slice to avoid mutating the original array

    return item
        ? (num / item.value)
              .toFixed(digits)
              .replace(regexp, '')
              .concat(item.symbol)
        : '0';
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function variable2DisplayString(str: string): string {
    // Insert spaces before uppercase letters and replace underscores with spaces
    str = str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space between lowercase and uppercase letters
        .replace(/_/g, ' '); // Replace underscores with spaces

    // Trim leading and trailing spaces
    str = str.trim();

    // Capitalize the first letter of each word
    str = str.replace(/\b\w/g, (char) => char.toUpperCase());

    return str;
}

export const getFormikTouchError = (formik: FormikValues) => {
    return (name: string): string => {
        const splitted = String(name).split('.');

        // Get nested error value
        let error = formik.errors;
        for (const key of splitted) {
            if (!error || typeof error !== 'object') return '';
            error = error[key];
        }

        // Get nested touched value
        let touched = formik.touched;
        for (const key of splitted) {
            if (!touched || typeof touched !== 'object') return '';
            touched = touched[key];
        }

        // Return error message if field is touched and has error
        if (error && touched) {
            return error as string;
        }

        return '';
    };
};

export function formatMoney(num: number | string): string {
    return (+num)
        .toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
        .replace('VND', '')
        .trim();
}

export const formatMoneyDong = (price: number | string): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(+price);
};

export function parseMoney(value: string): number {
    return +value.replace(/\./g, '');
}

export function maskString(str: string): string {
    if (str.length === 0) return '';
    return str[0] + '*'.repeat(str.length - 1);
}

export function isValidYouTubeUrl(url: string | undefined): boolean {
    if (!url) return false;

    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\/&v=|\?v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        // const embed =
        //     'https://www.youtube.com/embed/' + match[2] + '?autoplay=0';
        return true;
    }
    return false;
}
