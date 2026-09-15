export const getResponseData = async (response) => {
    try {
        return await response.json();
    } catch {
        return {
            message: "Unexpected server response."
        };
    }
};