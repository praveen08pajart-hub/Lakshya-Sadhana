export const handleUnauthorized = (response, navigate) => {
    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

        return true;
    }

    return false;
};