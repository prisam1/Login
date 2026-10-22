const KEY = "itinerary-cache";
const MAX = 200;

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const cacheItineraries = (items) => {
  try {
    const cache = read();
    items.forEach((item) => {
      if (item?._id) cache[item._id] = item;
    });
    const ids = Object.keys(cache);
    ids.slice(0, Math.max(0, ids.length - MAX)).forEach((id) => delete cache[id]);
    sessionStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable */
  }
};

export const getCachedItinerary = (id) => read()[id] || null;

const ownedKey = (userId) => `owned-itineraries:${userId}`;

const readOwned = (userId) => {
  try {
    const list = JSON.parse(localStorage.getItem(ownedKey(userId)));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const rememberOwned = (userId, itineraryId) => {
  if (!userId || !itineraryId) return;
  try {
    const list = readOwned(userId).filter((id) => id !== itineraryId);
    list.push(itineraryId);
    localStorage.setItem(ownedKey(userId), JSON.stringify(list.slice(-500)));
  } catch {
    /* storage unavailable */
  }
};

export const isOwnedBy = (itinerary, userId) => {
  if (!itinerary || !userId) return false;
  return String(itinerary.userId) === String(userId) || readOwned(userId).includes(itinerary._id);
};

export const clearItineraryCache = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
};
