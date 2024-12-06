export * from './arrays';
export * from './colors';
export * from './strings';
export * from './coordinates';
export * from './urls';

export function debounce(f: (params?: any) => void, ms: number) {
    let isCooldown = false;

    return function (this: any, ...args: any[]) {
        if (isCooldown) return;
        //@ts-ignore
        f.apply(this, args);

        isCooldown = true;

        setTimeout(() => (isCooldown = false), ms);
    };
}

export const isNullOrUndefined = (v: any) => v === undefined || v === null;

export function wait(timeout_ms: number) {
    return new Promise((res) => {
        setTimeout(res, timeout_ms);
    });
}

// export function copyToClipBoard(text: string) {
//    const selBox = document.createElement('textarea');
//    selBox.style.position = 'fixed';
//    selBox.style.left = '0';
//    selBox.style.top = '0';
//    selBox.style.opacity = '0';
//    selBox.value = text;
//    document.body.appendChild(selBox);
//    selBox.focus();
//    selBox.select();
//    const p = document.execCommand('copy');
//    document.body.removeChild(selBox);
// }
