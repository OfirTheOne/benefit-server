

export async function sleep(ms: number) {
    return setTimeout(() => Promise.resolve(), ms);
} 