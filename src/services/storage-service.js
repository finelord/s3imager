const CREDENTIALS_KEY = 'credentials';

export function getCredentials() {
  let credentials;
  try {
    credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY));
  } catch (err) {
    console.log('Error getting credentials:', err);
  }
  return credentials || {};
}

export function setCredentials(credentials) {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch (err) {
    console.log('Error setting credentials:', err);
  }
}

export function resetCredentials() {
  try {
    localStorage.removeItem(CREDENTIALS_KEY);
  } catch (err) {
    console.log('Error resetting credentials:', err);
  }
}
