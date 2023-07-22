export function fetcher(apiEndPoint: string) {
  return fetch(apiEndPoint).then((res) => res.json());
}
