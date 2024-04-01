export function getExecutionEnv() {
    if (typeof window === "undefined") {
        return 'node' as const;
    }
    return 'browser' as const;
}