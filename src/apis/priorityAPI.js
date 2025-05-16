import fetcher from "./fetcher";

export const getPriority = async () => {
  try {
    const response = await fetcher.get("/Priority/getAll");
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
};
