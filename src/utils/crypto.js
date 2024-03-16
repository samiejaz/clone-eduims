export function encryptID(id) {
  return btoa(id);
}

export function decryptID(encryptedId) {
  return atob(encryptedId);
}
