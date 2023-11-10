function to(path: string) {
    if (typeof window !== 'undefined') {
        window.location.assign(path);
    }
}

export { to }