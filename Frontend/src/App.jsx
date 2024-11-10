import * as React from "react";
import URLShortener from "./components/URLShortener";

function App() {
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center text-center dark text-foreground">
        <URLShortener />
      </div>
    </>
  );
}

export default App;
