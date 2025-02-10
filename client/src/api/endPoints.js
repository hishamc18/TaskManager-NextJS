const ENDPOINTS = {
    // Auth Routes
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH_TOKEN: "/refresh-token",
    GET_LOGGED_IN_USER: "/me",
  
    // Admin Actions
    DELETE_USER: (userId) => `/delete/${userId}`,
    PROMOTE_USER: (userId) => `/promote/${userId}`,
    GET_ALLUSERS: "/getAllUsers/",
  
    // Task Routes
    CREATE_TASK: "/task",
    GET_TASKS: "/task",
    GET_TASK_BY_ID: (taskId) => `/task/${taskId}`,
    UPDATE_TASK: (taskId) => `/task/${taskId}`,
    DELETE_TASK: (taskId) => `/task/${taskId}`,
  };
  
  export default ENDPOINTS;  