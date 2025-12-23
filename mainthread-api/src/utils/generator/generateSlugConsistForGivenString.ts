import crypto from 'crypto'

export default function uniqueSlug(input: string) {
    // same string = same slug
    // different string = different slug
    // btw, konz
    const base = input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const hash = crypto
        .createHash('sha1')
        .update(input)
        .digest('hex')
        .slice(0, 8);

    return `${base}-${hash}`;
}
