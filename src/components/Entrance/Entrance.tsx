import { useEffect, useRef, useState } from "react";
import "./Entrance.css";
const Entrance = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [finish, setFinish] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef?.current.play();
    }
    setTimeout(() => {
      if (audioRef.current?.volume) {
        audioRef.current.volume = 0.5;
      }
    }, 55000);
    setTimeout(() => {
      setFinish(!finish);
      if (audioRef.current?.volume) {
        audioRef.current.volume = 0;
      }
    }, 60000);
  }, []);

  if (finish) return (
    <h2>Please, login or signup to get starting with your adventure</h2>
  )

  return (
    <div
      className="bodyEntrance"
      style={{
        top: (document.body.clientHeight - 450) / 2,
      }}
    >
      <div className="star-wars-intro">
        <audio
          ref={audioRef}
          src="../../../public/star-wars-intro.mp3"
        />
        <div className="crawl">
          <p className="title">SPACE INVADERS</p>
          <p>Hace mucho tiempo, en una galaxia no tan lejana...</p>
          <p>
            El universo estaba en equilibrio, los planetas en paz, hasta que una
            oscura amenaza emergió de las profundidades del cosmos.{" "}
          </p>
          <p>
            Un ejército de invasores alienígenas, creado pixel a pixel en los
            oscuros confines del espacio, ha puesto su mirada en los rincones
            más tranquilos de la galaxia. Con su tecnología de vanguardia y una
            flota imparable, avanzan destruyendo sistemas estelares y sumiendo
            mundos enteros en la oscuridad.{" "}
          </p>
          <p>
            Pero la última esperanza de la humanidad no está en una nave de
            combate cualquiera. En este universo, el destino no está
            prefabricado. Tú, el piloto más audaz, serás quien cree tu propia
            nave pixel a pixel, forjando tu propio destino. Personaliza tu arma
            más poderosa y lánzate al vacío, enfrentando a las oleadas de
            invasores que intentan aniquilar todo lo que conocemos.{" "}
          </p>
          <p>
            Tu habilidad no solo será probada en la batalla... sino también en
            el arte. Cada nave es una obra maestra de píxeles, una extensión de
            tu voluntad, capaz de cambiar el curso de la guerra.
          </p>
          <p>
            Prepárate para una experiencia de juego única, donde la estrategia,
            la creatividad y el valor se mezclan en una lucha épica por la
            supervivencia. Explora una galaxia llena de enemigos que desafiarán
            cada movimiento, cada disparo, y cada pixel de tu creación.
          </p>
          <p>
            La batalla final por el control de la galaxia ha comenzado. Solo los
            mejores pilotos sobrevivirán.
          </p>
          <p>El destino del universo está en tus manos...</p>
        </div>
      </div>
    </div>
  );
};

const styles = {};

export default Entrance;
