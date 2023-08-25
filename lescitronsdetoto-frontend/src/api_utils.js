"use strict";

export function addApiPrefixToPath(path) {
    const cacheKey = + new Date();
    return "/api/" + path + "?v=" + cacheKey;
}
