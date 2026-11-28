import api from "./api";

// Get all people
export const getPeople = async () => {
  const response = await api.get("/people");
  console.log(response)
  return response.data;
};

// Add a person
export const addPerson = async (name) => {
  const response = await api.post("/people", { name });
  return response.data;
};

// Delete a person
export const deletePerson = async (id) => {
  const response = await api.delete(`/people/${id}`);
  return response.data;
};