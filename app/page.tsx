"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import lottie, { AnimationItem } from "lottie-web";
import ROG_URL from "@/components/ROG_URL.json";
import { hexToRGB, RGBAToHexA } from "@/lib/helpers";
import { Loader } from "@/components/Loader";

export default function Home() {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem>();
  const [animationData, setAnimationData] = useState({ ...ROG_URL });
  const [text, setText] = useState("");
  const [lottieLoader, setLottieLoader] = useState(true);

  useEffect(() => {
    setLottieLoader(true);
    if (lottieContainer.current) {
      animationRef.current = lottie.loadAnimation({
        container: lottieContainer.current,
        animationData,
      });
    }
    setLottieLoader(false);
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
    const a = { ...animationData };
    if (
      text &&
      textIndex !== undefined &&
      textIndex !== null &&
      a.layers &&
      a.layers?.[textIndex]?.t?.d?.k?.[0].s.t &&
      a.layers?.[textIndex]?.t?.d?.k?.[0].s.t !== text
    ) {
      a.layers[textIndex].t.d.k[0].s.t = text;
      setAnimationData(a);
    }
  }, [animationData, text, textIndex]);

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
    // @ts-expect-error layer is undefined
    a.layers[index].shapes[0].it.find((it) => it.ty === "fl").c.k = hexToRGB(e);
    setAnimationData(a);
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 pb-20 gap-16 min-h-screen">
      <main className="row-start-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start items-center relative">
            {lottieLoader && (
              <div className="absolute w-100 h-100">
                <Loader />
              </div>
            )}
            <div ref={lottieContainer} />
          </div>

          <div>
            <div className="my-4">
              <h6>Colori:</h6>
              {animationData.layers.map((s, index) => {
                if (s.ty !== 4 || s?.shapes?.length !== 1) return;
                const color = RGBAToHexA(
                  s?.shapes?.[0]?.it?.find((it) => it.ty === "fl")?.c?.k ?? [
                    0, 0, 0, 1,
                  ],
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
                {loading && <Loader />}
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
