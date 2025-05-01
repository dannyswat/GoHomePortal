import { UserScript } from "./UserScript";

export const saveUserScript = async (
  scriptData: Omit<UserScript, "uniqueId" | "createdBy" | "createdAt">
): Promise<UserScript> => {
  const response = await fetch("/api/userscript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scriptData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getUserScript = async (id: string): Promise<UserScript> => {
  const response = await fetch(`/api/userscript/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getAllUserScripts = async (): Promise<UserScript[]> => {
  const response = await fetch("/api/userscripts");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const deleteUserScript = async (id: string): Promise<void> => {
  const response = await fetch(`/api/userscript/${id}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
