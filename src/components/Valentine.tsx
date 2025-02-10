import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import YouTube from "react-youtube";

const messages = [
    "¡Sí, quiero! 💖",
    "¡Por favor, di que sí! 🥺",
    "¡No te arrepentirás! 💝",
    "¡Seremos muy felices! 💕",
    "¡La mejor decisión! 💗",
    "¡Di que sí! 🌹",
    "¡Nos divertiremos mucho! 💓",
    "¡Será inolvidable! 💘",
    "¡Última oportunidad! 🥺",
    "¡Por favor! 💝"
];

const noMessages = [
    "No, gracias",
    "Mejor no...",
    "Lo siento...",
    "Paso...",
    "Uhm, no...",
    "Nop...",
    "Creo que no...",
    "No por ahora...",
    "No estoy seguro/a...",
    "Déjame pensarlo..."
];

// Lista de gifs que se utilizarán
const gifUrls = [
    "https://i.gifer.com/Pak.gif",
    "https://i.gifer.com/45RT.gif",
    "https://i.gifer.com/VeC.gif",
    "https://i.gifer.com/2iFb.gif",
    "https://i.gifer.com/47tj.gif",
    "https://i.gifer.com/VgJ.gif",
    "https://i.gifer.com/DDq.gif",
    "https://i.gifer.com/y2.gif",
    "https://i.gifer.com/3mRG.gif",
    "https://i.gifer.com/7V0.gif"
];

/**
 * Componente que genera los gifs en posiciones aleatorias
 * FORZANDO que sus coordenadas estén fuera del área central (segura)
 * donde se ubica el contenido principal.
 */
const RandomGifs = () => {
    const [gifs, setGifs] = useState([]);

    // Esta función devuelve una posición aleatoria fuera del "área segura"
    // Definida como el 60% central de la pantalla (del 20% al 80% en ancho y alto).
    const getRandomPositionOutsideSafeArea = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const safeX = width * 0.2;
        const safeY = height * 0.2;
        const safeWidth = width * 0.6;
        const safeHeight = height * 0.6;
        let left, top;
        do {
            left = Math.random() * width;
            top = Math.random() * height;
        } while (
            left >= safeX &&
            left <= safeX + safeWidth &&
            top >= safeY &&
            top <= safeY + safeHeight
        );
        return { left, top };
    };

    // Cada 500 ms se crea un nuevo gif en una posición aleatoria fuera del área segura
    useEffect(() => {
        const interval = setInterval(() => {
            const { left, top } = getRandomPositionOutsideSafeArea();
            const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
            const newGif = {
                id: Date.now(),
                url: randomGif,
                left,
                top,
            };
            // Mantenemos sólo los últimos 20 gifs
            setGifs((current) => [...current, newGif].slice(-20));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Se eliminan periódicamente los gifs más antiguos (cada 4 segundos)
    useEffect(() => {
        const cleanup = setInterval(() => {
            setGifs((current) => current.slice(1));
        }, 4000);
        return () => clearInterval(cleanup);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none", // para que no interfieran con la interacción
                zIndex: 1,           // Colocamos este contenedor en un nivel inferior,
                // pero sus posiciones se calculan para estar fuera del área central.
                overflow: "hidden",
            }}
        >
            {gifs.map((gif) => (
                <img
                    key={gif.id}
                    src={gif.url}
                    alt="gif animado"
                    style={{
                        position: "absolute",
                        left: gif.left,
                        top: gif.top,
                        width: "200px",      // Tamaño uniforme para todos los gifs
                        height: "200px",
                        objectFit: "cover",
                        opacity: 0.9,
                        animation: "fadeOut 4s forwards", // para que se desvanezcan gradualmente
                    }}
                />
            ))}
            <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
        </div>
    );
};

const Valentine = () => {
    const [noCount, setNoCount] = useState(0);
    const [yesPressed, setYesPressed] = useState(false);
    const [hearts, setHearts] = useState([]);
    const [volume, setVolume] = useState(100); // Volumen inicial 100%

    // Referencia para el reproductor de YouTube
    const playerRef = useRef(null);

    // Genera corazones en posiciones aleatorias (efecto decorativo)
    useEffect(() => {
        const interval = setInterval(() => {
            setHearts((current) => {
                const newHeart = {
                    id: Date.now(),
                    left: Math.random() * window.innerWidth,
                };
                return [...current, newHeart].slice(-20);
            });
        }, 300);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const cleanup = setInterval(() => {
            setHearts((current) => current.slice(1));
        }, 4000);
        return () => clearInterval(cleanup);
    }, []);

    const handleNoClick = () => {
        setNoCount((count) => count + 1);
    };

    const getNoButtonSize = () => Math.max(0.5, 1 - noCount * 0.1);
    const getYesButtonSize = () => 1 + noCount * 0.15;

    // Actualiza el volumen en el estado y en el reproductor
    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
    };

    const youtubeOpts = {
        height: "0",
        width: "0",
        playerVars: {
            autoplay: 1,
            controls: 0,
            loop: 1,
            playlist: "R5cbxTPZNL0",
            mute: 0,
        },
    };

    const onPlayerReady = (event) => {
        playerRef.current = event.target;
        event.target.playVideo();
        event.target.unMute();
        event.target.setVolume(volume);
    };

    // Contenido para el estado "sí" (mensaje de agradecimiento)
    if (yesPressed) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-white p-8"
                style={{ position: "relative", zIndex: 10 }}
            >
                {/* Los gifs se generan en el fondo, solo en las áreas fuera del centro */}
                <RandomGifs />

                {/* Efecto de corazones (decorativo) */}
                <div className="hearts-container">
                    {hearts.map((heart) => (
                        <div
                            key={heart.id}
                            className="heart"
                            style={{
                                left: `${heart.left}px`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        >
                            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                        </div>
                    ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-primary text-center mb-8 fade-in">
                    ¡Gracias por decir que sí! 💖
                </h1>
                <div className="max-w-2xl mx-auto space-y-6 text-center fade-in">
                    <p className="text-xl md:text-2xl text-gray-800">
                        Te espero el 14 de febrero a la 1:30 PM para nuestra cita en:
                    </p>
                    <p className="text-lg md:text-xl text-gray-700">
                        Av. Insurgentes Sur 1431, Insurgentes Mixcoac, Benito Juárez, 03920 Ciudad de
                        México, CDMX
                    </p>
                    <div className="pt-6">
                        <p className="text-lg text-gray-800 font-medium">Para más información:</p>
                        <p className="text-lg text-gray-700">
                            Llámame o envíame mensaje al:{" "}
                            <a href="tel:5584322688" className="text-primary hover:underline">
                                55 8432 2688
                            </a>
                        </p>
                    </div>
                </div>

                <YouTube
                    videoId="R5cbxTPZNL0"
                    opts={youtubeOpts}
                    onReady={onPlayerReady}
                    className="fixed bottom-0 right-0"
                />

                <div
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        right: "10px",
                        zIndex: 20,
                        background: "rgba(255,255,255,0.7)",
                        padding: "5px",
                        borderRadius: "5px",
                    }}
                >
                    <label style={{ fontSize: "0.8rem", marginRight: "5px" }}>Volumen:</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    />
                </div>
            </div>
        );
    }

    // Contenido para el estado inicial (mensaje y botones de respuesta)
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-white p-8"
            style={{ position: "relative", zIndex: 10 }}
        >
            <RandomGifs />

            <div className="hearts-container">
                {hearts.map((heart) => (
                    <div
                        key={heart.id}
                        className="heart"
                        style={{
                            left: `${heart.left}px`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                    </div>
                ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-primary text-center mb-8">
                ¿Quieres ser mi Valentín?
            </h1>

            <div className="fixed bottom-20 left-0 right-0 flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
                <button
                    className="valentine-button yes-button"
                    style={{ transform: `scale(${getYesButtonSize()})`, zIndex: 10 }}
                    onClick={() => setYesPressed(true)}
                >
                    {messages[Math.min(noCount, messages.length - 1)]}
                </button>
                <button
                    className="valentine-button no-button"
                    style={{ transform: `scale(${getNoButtonSize()})`, position: "relative", zIndex: 5 }}
                    onClick={handleNoClick}
                >
                    {noMessages[Math.min(noCount, noMessages.length - 1)]}
                </button>
            </div>

            <YouTube
                videoId="R5cbxTPZNL0"
                opts={youtubeOpts}
                onReady={onPlayerReady}
                className="fixed bottom-0 right-0"
            />

            <div
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: "10px",
                    zIndex: 20,
                    background: "rgba(255,255,255,0.7)",
                    padding: "5px",
                    borderRadius: "5px",
                }}
            >
                <label style={{ fontSize: "0.8rem", marginRight: "5px" }}>Volumen:</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default Valentine;
