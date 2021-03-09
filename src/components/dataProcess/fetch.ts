function fetchJSON(url: string) {
    return fetch(url).then(response => response.json());
}

export {
    fetchJSON,
};