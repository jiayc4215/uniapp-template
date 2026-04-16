import mock from "./mock"

mock("/mock/auth/login", "post", options => {
  let data = typeof options.body === "string" ? JSON.parse(options.body) : options.body
  const role = ["admin", "user"].includes(data?.role) ? data.role : "user"

  return {
    code: 200,
    message: "success",
    data: {
      token: role
    }
  }
})
mock("/mock/auth/logout", "get", () => {
  return {
    code: 200,
    message: "success",
    data: null
  }
})
mock("/mock/user/info", "get", options => {
  let data = typeof options.headers === "string" ? JSON.parse(options.headers) : options.headers
  let role = data.Authorization.split(" ")[1]
  return {
    code: 200,
    message: "success",
    data: {
      username: role === "admin" ? "admin-demo" : "user-demo",
      avatar: "https://example.com/avatar.jpg",
      role
    }
  }
})
