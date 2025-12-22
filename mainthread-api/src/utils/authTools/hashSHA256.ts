import crypto from 'crypto';

export default function hashSHA256(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}