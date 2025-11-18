export const auth = {
  isAuthenticated() {
    return !!sessionStorage.getItem("token");
  },
  login(token) {
    sessionStorage.setItem("token", token);
  },
  logout() {
    sessionStorage.removeItem("token");
  },
};
