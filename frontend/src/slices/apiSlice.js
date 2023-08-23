import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({baseURL: BASE_URL});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  //instead of manually fetching the data with try catch and error handling, we use builder:
  endpoints: (builder) => ({}),
});