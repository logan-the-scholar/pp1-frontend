import { useRouter } from "next/router";
import { JSX, useEffect } from "react";

export default function GithubCallback(): JSX.Element {
  // const { code } = router.query;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    if (window.opener) {
      // if(code === null) {
      //   window.opener.postMessage({error: "no se"}, window.origin);
      //   window.close();
      // } 
      // else {
      //   window.close();
      // }
      window.opener.postMessage({ code }, window.origin);
    }
  }, []);

  return (
    <div className="bg-neutral-950 w-lvw h-lvh">
      loading...
    </div>
  );
}