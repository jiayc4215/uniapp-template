import request from "@/utils/http"

export function getUserInfo(data = {}) {
  return request.get("/user/info", data, { isLoading: false })
}
export function logout() {
  return request.get("/auth/logout")
}

export function login(data) {
  return request.post("/auth/login", data, { isLoading: false })
}
