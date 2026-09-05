type RefreshResult = {
    access_token: string;
    refresh_token: string;
};

const refreshLocks = new Map<string, Promise<RefreshResult>>();

export async function withRefreshLock(
    key: string,
    refreshFn: () => Promise<RefreshResult>,
): Promise<RefreshResult> {
    const existingRefresh = refreshLocks.get(key);

    // Đã có request khác đang refresh
    if (existingRefresh) {
        return existingRefresh;
    }

    // Tạo refresh request
    const refreshPromise = refreshFn();

    refreshLocks.set(key, refreshPromise);

    try {
        return await refreshPromise;
    } finally {
        refreshLocks.delete(key);
    }
}