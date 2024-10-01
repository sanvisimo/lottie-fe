"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import lottie, { AnimationItem } from "lottie-web";
import ROG_URL from "@/components/ROG_URL.json";
import { hexToRGB, RGBAToHexA } from "@/lib/helpers";

export default function Home() {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem>();
  const [animationData, setAnimationData] = useState({ ...ROG_URL });
  const [text, setText] = useState("");

  useEffect(() => {
    if (lottieContainer.current) {
      animationRef.current = lottie.loadAnimation({
        container: lottieContainer.current,
        animationData,
      });
    }
    return () => animationRef.current?.destroy();
  }, [animationData]);

  const textIndex = useMemo(() => {
    return animationData.layers.findIndex((l) => l.ty === 5);
  }, [animationData]);

  useEffect(() => {
    if (textIndex >= 0) {
      const newText = animationData?.layers?.[textIndex]?.t?.d?.k?.[0].s.t;
      setText(newText ?? "");
    }
  }, [animationData, textIndex]);

  useEffect(() => {
    if (
      text &&
      textIndex !== undefined &&
      textIndex !== null &&
      animationData?.layers?.[textIndex]?.t?.d?.k?.[0].s.t !== text
    ) {
      const a = { ...animationData };
      a.layers[textIndex].t.d.k[0].s.t = text;
      setAnimationData(a);
    }
  }, [animationData, text, textIndex]);

  useEffect(() => {
    const col = { ...animationData.layers[2] };
    console.log("col", col.shapes[0].it[2]);
    col.shapes[0].it[2].c.k = [1, 1, 1];
    const a = { ...animationData };
    a.layers[2] = col;
    setAnimationData(a);
  }, []);

  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        "https://4qfw82mps9.execute-api.eu-west-1.amazonaws.com/prod/lottie",
        {
          method: "POST",
          body: JSON.stringify(animationData),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "k3dc9lEUYN1ec9xl64e923RujZYqiashaxzjvsmE",
          },
        },
      );
      const posts = await data.json();
      console.log("return", posts);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const handleColor = (e: string, index: number) => {
    const a = { ...animationData };
    a.layers[index].shapes[0].it.find((it) => it.ty === "fl").c.k = hexToRGB(e);
    setAnimationData(a);
    z;
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 pb-20 gap-16 min-h-screen">
      <main className="row-start-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start items-center">
            <div ref={lottieContainer} />
          </div>

          <div>
            <div className="my-4">
              <h6>Colori:</h6>
              {animationData.layers.map((s, index) => {
                if (s.ty !== 4 || s.shapes.length !== 1) return;
                const color = RGBAToHexA(
                  s.shapes[0].it.find((it) => it.ty === "fl").c.k,
                );

                return (
                  <div key={s.nm}>
                    <label
                      htmlFor="hs-color-input"
                      className="block text-sm font-medium mb-2 dark:text-white"
                    >
                      {s.nm}
                    </label>
                    <input
                      type="color"
                      className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                      id="hs-color-input"
                      value={color}
                      title="Choose your color"
                      onChange={(e) => handleColor(e.target.value, index)}
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Test
              </label>
              <textarea
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your thoughts here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={handleClick}
              >
                {loading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Salva
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        qui il footer
      </footer>
    </div>
  );
}
