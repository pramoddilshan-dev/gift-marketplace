import api from "./axios";

export const checkout = () => api.post("/orders/checkout");
export const getOrders = () => api.get("/orders");