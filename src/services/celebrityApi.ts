import {
  AffiliateProduct,
  BlogPost,
  Celebrity,
  CategoryItem,
  Outfit,
} from "@/types/data";
import { API_CONFIG } from "../config/api";
import axios from "axios";

// Fetch celebrities with pagination
export async function fetchCelebritiesPaginated(
  page: number = 1,
  limit: number = 10
): Promise<any> {
  try {
    const response = await axios.get(
      `${API_CONFIG.baseUrl}/celebrities?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          // "api_key": API_CONFIG.websiteApiKey,
          "x-api-key": API_CONFIG.websiteApiKey,
        },
      }
    );
    console.log("Paginated response:", response.data);
    return response?.data;
  } catch (error: any) {
    console.error("Error fetching paginated celebrities:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch celebrities"
    );
  }
}

export default {
  fetchCelebritiesPaginated,
};
