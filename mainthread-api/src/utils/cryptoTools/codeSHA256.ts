
export function encodeObjectToBase64(target: object): string{ // pass test

    return Buffer.from(JSON.stringify(target)).toString('base64');

}
export function decodeBase64ToObject(target: string): object{ //
    
    return JSON.parse(Buffer.from(target, 'base64').toString('utf-8'));
}

export default {
    encodeObjectToBase64,
    decodeBase64ToObject
};