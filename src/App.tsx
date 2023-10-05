import { Button } from "./components/ui/button";

import { Magic } from "magic-sdk";

export default function Home() {
  const m = new Magic("API_KEY"); // ✨

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>Hello World</div>
        <Button onClick={() => console.log("hello world")}>Hello</Button>
      </main>
    </>
  );
}
