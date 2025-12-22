import crypto from 'crypto';

export default async function generateRandomToken(): Promise<string> {
    return crypto.randomBytes(64).toString('hex');
}