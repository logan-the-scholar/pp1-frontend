import { useEffect } from "react";

const GithubCallback = () => {
//TODO arreglar esto o cambiarlo a app
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    if (window.opener) {
      window.opener.postMessage({ code, type: "session-success" }, window.origin);
    }
  }, []);

  return (
    <div className="bg-neutral-950 w-lvw h-lvh">
      loading...
    </div>
  );
}

export default GithubCallback;