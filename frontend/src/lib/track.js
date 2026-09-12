const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const trackEvent = (type, flag) => {
  if (sessionStorage.getItem(flag)) return;
  sessionStorage.setItem(flag, "1");
  fetch(`${API}/analytics/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  }).catch(() => {});
};

export const trackPageview = () => trackEvent("pageview", "ovx_pv");
export const trackChat = () => trackEvent("chat", "ovx_chat");
