import { useEffect, useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Any endpoint works - we only care whether the server responds at all,
// not whether the response is a 200. A 401/403 still means Spring Boot is up.
const PING_PATH = "/api/health/test";

export default function ServerWakeUp({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ready | error
  const startRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;

    async function ping() {
      const elapsed = Date.now() - startRef.current;

      // Give up gracefully after ~75s (Render says ~1 min for cold start)
      if (elapsed > 75000) {
        if (!cancelled) setStatus("error");
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        await fetch(`${API_BASE_URL}${PING_PATH}`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeout);
        // Any response (even 401/403) means the server is awake and answering
        if (!cancelled) setStatus("ready");
      } catch (err) {
        // Network error / timeout / aborted -> server still asleep or waking up
        if (!cancelled) setTimeout(ping, 2500);
      }
    }

    ping();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "ready") return children;

  if (status === "error") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.statusBar}>
          Taking longer than expected — the free-tier server may still be
          starting.{" "}
          <button style={styles.retryBtn} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Real browser navigation to the backend -> Render's own official
          spin-up page renders here. We don't fake this, it's the genuine page. */}
      <iframe
        src={API_BASE_URL}
        title="Starting up the server"
        style={styles.frame}
      />
      <div style={styles.statusBar}>
        Waking up the backend (free-tier hosting sleeps when idle) — usually
        ready within a minute.
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    background: "#0f0f14",
  },
  frame: {
    flex: 1,
    width: "100%",
    border: "none",
  },
  statusBar: {
    padding: "10px 16px",
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    color: "#a3a3a3",
    background: "#161620",
    textAlign: "center",
  },
  retryBtn: {
    marginLeft: 8,
    padding: "4px 12px",
    borderRadius: 6,
    border: "none",
    background: "#8B5CF6",
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
  },
};

