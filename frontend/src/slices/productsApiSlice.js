import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({keyword, pageNumber, category}) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          category,
        }
      }),
      providesTags: ['Product', 'Products'],
      keepUnusedDataFor: 5, //5 seconds
    }),
    getFilteredProducts: builder.query({
      query: ({ keyword, pageNumber, category, gender, type }) => ({
        url: `${PRODUCTS_URL}/filtered`,
        params: {
          keyword,
          pageNumber,
          category,
          gender,
          type,
        },
      }),
      providesTags: ['Product', 'Products'],
      keepUnusedDataFor: 5, // 5 seconds
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,

      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      //we don't need to pass anything in () at query
      //because it will create the sample product that we edit afterwards
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      //it will stop from being cached so we have fresh data
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getBestProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/best`,
      }),
      keepUnusedDataFor: 5,
    }),
    
  }),
});

export const  { 
   useGetProductsQuery,
   useGetFilteredProductsQuery,
   useGetProductDetailsQuery,
   useCreateProductMutation,
   useUpdateProductMutation,
   useUploadProductImageMutation,
   useDeleteProductMutation,
   useCreateReviewMutation,
   useGetBestProductsQuery,
  } = productsApiSlice;