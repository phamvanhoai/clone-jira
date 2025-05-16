import fetcher from "./fetcher";

export const getStatus = async () => {
  try {
    const response = await fetcher.get("/Status/getAll");
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
};
