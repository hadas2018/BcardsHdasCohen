import axios from "axios";
import { decodeToken } from "../services/tokenService";
import { Card } from "../interfaces/cards/Cards";
import { Address } from "../interfaces/cards/Address";
import { Image } from "../interfaces/cards/Image";

const API: string = import.meta.env.VITE_CARDS_API || "";
export const CARDS_UPDATED_EVENT = "cardsUpdated";

let allCardsCache: Card[] | null = null;
let lastAllCardsFetchTime: number = 0;
let favoriteCardsCache: Card[] | null = null;
let lastFavoriteFetchTime: number = 0;
const CACHE_DURATION = 2 * 60 * 1000; 


const apiService = {

  setup() {
    axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers["x-auth-token"] = token;
      }
      return config;
    });
  },

  processUpdate(promise: Promise<any>) {
    return promise.then((response) => {
      clearAllCaches();
      dispatchCardsUpdated();
      return response;
    });
  },

  get(endpoint: string) {
    return axios.get(`${API}${endpoint}`);
  },

  post(endpoint: string, data: Omit<Card, "_id">) {
    return this.processUpdate(axios.post(`${API}${endpoint}`, data));
  },

  put(
    endpoint: string,
    data: {
      userId: (userId: any) => import("react").ReactNode;
      createdAt: string | number | Date;
      imageAlt: string | number | readonly string[] | undefined;
      imageUrl: string | number | readonly string[] | undefined;
      fallbackImage: string;
      title: string;
      subtitle: string;
      description: string;
      phone: string;
      email: string;
      web: string;
      image: Image;
      address: Address;
      bizNumber?: number | undefined;
      likes?: string[] | undefined;
      user_id?: string | undefined;
    }
  ) {
    return this.processUpdate(
      axios.put(`${API}${endpoint}`, data, {
        headers: {
          "x-auth-token": sessionStorage.getItem("token"),
        },
      })
    );
  },

  delete(endpoint: string) {
    return this.processUpdate(axios.delete(`${API}${endpoint}`));
  },

  patch(endpoint: string) {
    return this.processUpdate(axios.patch(`${API}${endpoint}`));
  },
};

apiService.setup();

function dispatchCardsUpdated() {
  window.dispatchEvent(new CustomEvent(CARDS_UPDATED_EVENT));
}

export function clearAllCaches() {
  allCardsCache = null;
  lastAllCardsFetchTime = 0;
  favoriteCardsCache = null;
  lastFavoriteFetchTime = 0;
  console.log("All caches cleared");
}

export async function getAllCards(forceRefresh: boolean = false) {
  const now = Date.now();
  const isCacheValid =
    allCardsCache !== null && now - lastAllCardsFetchTime < CACHE_DURATION;

  if (isCacheValid && !forceRefresh) {
    console.log("Using cached all cards");
    return { data: allCardsCache };
  }

  try {
    const response = await apiService.get("");

    allCardsCache = response.data;
    lastAllCardsFetchTime = now;

    return response;
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw error;
  }
}

export function getCardById(id: string) {
  return apiService.get(`/${id}`);
}

export function getMyCards() {
  return apiService.get("/my-cards");
}

export async function getFavoriteCards(forceRefresh: boolean = false) {
  const now = Date.now();
  const isCacheValid =
    favoriteCardsCache !== null && now - lastFavoriteFetchTime < CACHE_DURATION;

  if (isCacheValid && !forceRefresh) {
    console.log("Using cached favorite cards");
    return { data: favoriteCardsCache };
  }

  try {
    const allCardsResponse = await getAllCards(forceRefresh);
    const allCards = allCardsResponse.data;
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("User not logged in");
    }

    const decodedToken = decodeToken(token);
    const userId = decodedToken._id;

    if (!userId) {
      throw new Error("Cannot identify user");
    }
    const favoriteCards = allCards.filter(
      (card: { likes: string | any[] }) =>
        card.likes && Array.isArray(card.likes) && card.likes.includes(userId)
    );

    favoriteCardsCache = favoriteCards;
    lastFavoriteFetchTime = now;

    return { data: favoriteCards };
  } catch (error) {
    console.error("Error loading favorite cards:", error);
    throw error;
  }
}

export function postNewCard(card: Omit<Card, "_id">) {
  return apiService.post("", card);
}

export function updateCard(id: string, card: Omit<Card, "_id">) {
  const cardToUpdate = { ...card };

  if ("_id" in cardToUpdate) {
    delete cardToUpdate._id;
  }

  if ("likes" in cardToUpdate) {
    delete cardToUpdate.likes;
  }

  if ("user_id" in cardToUpdate) {
    delete cardToUpdate.user_id;
  }

  if ("bizNumber" in cardToUpdate) {
    delete cardToUpdate.bizNumber;
  }

  console.log("Sending to server:", cardToUpdate);

  return apiService.put(`/${id}`, cardToUpdate);
}

export function deleteCard(id: string) {
  return apiService.delete(`/${id}`);
}

export function toggleCardLike(id: string) {
  return apiService.patch(`/${id}`);
}
