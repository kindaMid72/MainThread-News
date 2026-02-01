

export function createTitleSlug(title: string) {
    return title.toLowerCase().replace(/[^a-zA-Z0-9\-_.~]/g, '-').replace(/-{2,}/g, '-')
}