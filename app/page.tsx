"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import lottie, { AnimationItem, BMEnterFrameEvent } from "lottie-web";
import ROG_URL from "@/components/ROG_URL.json";
import { hexToRGB, RGBAToHexA } from "@/lib/helpers";
import { Loader } from "@/components/Loader";

export default function Home() {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem>();
  const [animationData, setAnimationData] = useState({ ...ROG_URL });
  const [text, setText] = useState("");
  const [lottieLoader, setLottieLoader] = useState(true);
  const [duration, setDuration] = useState<number | undefined>(0);

  useEffect(() => {
    setLottieLoader(true);
    if (lottieContainer.current) {
      animationRef.current = lottie.loadAnimation({
        container: lottieContainer.current,
        loop: false,
        animationData,
      });
    }
    setDuration(animationRef?.current?.getDuration(true));
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
      a.layers?.[textIndex]?.t?.d?.k?.[0].s.t !==
        text.replace(new RegExp("\r\n", "g"), "\r")
    ) {
      a.layers[textIndex].t.d.k[0].s.t = text.replace(
        new RegExp("\n", "g"),
        "\r",
      );
      setAnimationData(a);
    }
  }, [animationData, text, textIndex]);

  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
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
      setLink(posts.url);
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

  const [playStatus, setPlayStatus] = useState(true);

  const handlePlay = () => {
    if (playStatus) {
      animationRef?.current?.pause();
    } else {
      animationRef?.current?.play();
    }
    setPlayStatus((status) => !status);
  };

  const handleStop = () => {
    animationRef?.current?.stop();
    setPlayStatus(false);
  };

  /*
   frame = {
    currentTime: 60.60749999999991
    direction: 1
    totalTime: 75
    type:"enterFrame"
   }
  */

  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    function manageFrame(frame: BMEnterFrameEvent) {
      setCurrentTime(frame.currentTime);
    }

    animationRef?.current?.addEventListener("enterFrame", manageFrame);
    animationRef?.current?.addEventListener("complete", () => {
      animationRef?.current?.goToAndStop(0, true);
      setPlayStatus(false);
    });
  }, []);

  const handleProgress = (e: React.MouseEvent<HTMLProgressElement>) => {
    const progress = e.target as HTMLProgressElement;
    console.log(
      "progress",
      e.clientX,
      progress.clientWidth,
      progress.offsetLeft,
      progress.value,
    );

    if (duration) {
      const length = progress.clientWidth + progress.offsetLeft + 32;
      const frame = (duration * e.clientX) / length;
      animationRef?.current?.goToAndStop(frame, true);
    }
  };

  const handleRewind = () => {
    const time = currentTime - 10;
    if (playStatus) {
      animationRef?.current?.goToAndPlay(time, true);
    } else {
      animationRef?.current?.goToAndStop(time, true);
    }
  };
  const handleForward = () => {
    const time = currentTime + 10;
    if (playStatus) {
      animationRef?.current?.goToAndPlay(time, true);
    } else {
      animationRef?.current?.goToAndStop(time, true);
    }
  };

  const [image, setImage] = useState("");
  const handleImage = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        "https://4qfw82mps9.execute-api.eu-west-1.amazonaws.com/prod/images",
        {
          method: "POST",
          body: JSON.stringify({
            animationData,
            frame: Math.round(currentTime),
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "k3dc9lEUYN1ec9xl64e923RujZYqiashaxzjvsmE",
          },
        },
      );
      const posts = await data.json();
      console.log("return", posts);
      setImage(posts.url);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 pb-20 gap-16 min-h-screen">
      <main className="row-start-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-start items-center relative group">
              {lottieLoader && (
                <div className="absolute w-100 h-100">
                  <Loader />
                </div>
              )}
              <div ref={lottieContainer} />
              <div
                id="controls"
                className="opacity-0 p-5 absolute bottom-0 left-0 w-full transition-opacity duration-300 ease-linear group-hover:opacity-100"
              >
                {/* PROGRESS BAR */}

                <progress
                  className="w-full progress-indicator"
                  value={currentTime}
                  max={duration}
                  onClick={handleProgress}
                >
                  {currentTime}%
                </progress>

                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between">
                    <button
                      id="rewind"
                      className="transition-all duration-100 ease-linear hover:scale-125"
                      onClick={handleRewind}
                    >
                      <span className="material-symbols-outlined text-white text-3xl w-12">
                        replay_10
                      </span>
                    </button>
                    <button
                      id="play-pause"
                      className="transition-all duration-100 ease-linear hover:scale-125"
                      onClick={handlePlay}
                    >
                      <span className="material-symbols-outlined text-white text-3xl w-12">
                        {playStatus ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <button type="button" onClick={handleStop}>
                      <span className="material-symbols-outlined text-white text-3xl w-12">
                        stop
                      </span>
                    </button>
                    <button
                      id="fast-forward"
                      className="transition-all duration-100 ease-linear hover:scale-125"
                      onClick={handleForward}
                    >
                      <span className="material-symbols-outlined text-white text-3xl w-12">
                        forward_10
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* colonna */}
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
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                onClick={handleImage}
              >
                {loading && <Loader />}
                Esporta come immagine (.png)
              </a>
              |
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2"
                onClick={handleClick}
              >
                {loading && <Loader />}
                Esporta come video (.mp4)
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center justify-center my-4">
          {link && (
            <div>
              Il tuo video è pronto! <br />
              <div className="flex gap-1 items-center justify-center">
                <span>Lo puoi scaricare</span>
                <a href={link} className="text-cyan-600">
                  qui!
                </a>
              </div>
            </div>
          )}
          {image && (
            <div>
              La tua immagine è pronta! <br />
              <div className="flex gap-1 items-center justify-center">
                <span>La puoi scaricare</span>
                <a href={image} className="text-cyan-600">
                  qui!
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        qui il footer
      </footer>
    </div>
  );
}
