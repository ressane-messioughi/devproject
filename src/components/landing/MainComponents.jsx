import Home1 from '../../assets/image/home1.png';
import Home2 from '../../assets/image/home2.png';

function MainComponents() {
  return (
    <>
      <section className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <img
            src={Home1}
            className="bg-(--color-background) flex flex-col items-center justify-center gap-4 border border-(--color-card-border) rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 w-full max-w-100"
            alt=""
          />
          <p className="w-full max-w-lg p-8 bg-[#b9b2b2] rounded-3xl text-(--color-surface)">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse possimus iure dolorum
            illo, quae, dicta distinctio blanditiis reprehenderit quibusdam dolores temporibus
            asperiores doloribus ea tempora neque quas eos veniam sed!
          </p>
        </div>
        <div className="flex gap-5 items-center justify-center"></div>
        <div className="flex flex-col md:flex-row-reverse items-center justify-around gap-6">
          <img
            src={Home2}
            className="bg-(--color-background) flex flex-col items-center justify-center gap-4 border border-(--color-card-border) rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 w-full max-w-100"
            alt=""
          />
          <p className="w-full max-w-lg p-8 bg-[#b9b2b2] rounded-3xl text-(--color-surface)">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse possimus iure dolorum
            illo, quae, dicta distinctio blanditiis reprehenderit quibusdam dolores temporibus
            asperiores doloribus ea tempora neque quas eos veniam sed!
          </p>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <div>
            <h1 className="p-8 bg-[#b9b2b2] rounded-3xl text-(--color-surface) font-bold text-center">
              Projet
            </h1>
            <ul className="flex flex-col p-8 bg-[#b9b2b2] rounded-3xl text-(--color-surface)">
              <li>Transfert de fichiers</li>
              <li>Communication</li>
              <li>Gestion Agile</li>
              <li>Intégrations externes</li>
              <li>Gestion des Users Stories</li>
              <li>Gestion MVP</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainComponents;
