import { UserAuthenticate } from "@/app/types/user";
import globalRouter from "@/tools/globalRouter";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
interface SessionService {
  loggedInUser: UserAuthenticate | null;
  isLoggedIn: boolean;
  clearSession?: () => void;
  saveSession: (userAuth: UserAuthenticate) => void;
}
const apiClient: AxiosInstance = axios.create({
  // baseURL: "http://cinephilewebapi.southeastasia.cloudapp.azure.com/api/v1",
  baseURL: "http://localhost:3000/api",
  // transformRequest: [],
  // headers: {
  //   Accept: "application/json; multipart/form-data",
  //   "Content-Type":
  //     "application/json; multipart/form-data; application/x-www-form-urlencoded; charset=UTF-8",
  //   "Access-Control-Allow-Headers": "Content-Type",
  //   "Access-Control-Allow-Origin": "*",
  // },
});

// const useSessionService = (): SessionService => {
//   const loggedInUser: UserAuthenticate | null = (() => {
//     try {
//       const value = JSON.parse(localStorage.getItem("USER") || "false");
//       console.log(value)
//       return value;
//     } catch (e) {
//       console.log(e);
//     }
//   })();

//   if (loggedInUser) {
//     localStorage.setItem("USER", JSON.stringify(loggedInUser));
//   } else {
//     localStorage.removeItem("USER");
//   }

//   const saveSession = (userAuth: UserAuthenticate): void => {
//     localStorage.setItem("USER", JSON.stringify(userAuth));
//   };

//   const isLoggedIn = !!loggedInUser;

//   return {
//     loggedInUser,
//     isLoggedIn,
//     saveSession,
//   };
// };

// // TODO / change temp token to access token when successful testing api
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const sessionService = useSessionService();
//     console.log(sessionService)
//     const accessToken = sessionService.loggedInUser?.token;
//     console.log(accessToken)

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     } else {
//       globalRouter.navigate.push("/auth/login");
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default apiClient;
