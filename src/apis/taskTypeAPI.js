import fetcher from "./fetcher";

export const getTaskType = async () => {
  try {
    const response = await fetcher.get("/TaskType/getAll");
    return response.data.content;
  } catch (error) {
    throw error.response.data.content;
  }
};
