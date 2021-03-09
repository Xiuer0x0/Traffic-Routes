import Papa from "papaparse";

function fetchJSON(url: string) {
    return fetch(url).then(response => response.json());
}

function fetchCSV(url: string, config?: Papa.ParseConfig) {
    return fetch(url)
        .then(response => response.text())
        .then(str => Papa.parse(str, config));
}

export {
    fetchJSON,
    fetchCSV,
};