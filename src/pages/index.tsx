import { NextPage } from "next";

const MinecraftCTA = () => {
  return (
    <div className="mt-12 rounded-xl bg-black/25 p-8 py-4 font-inter lg:ml-12 lg:mt-0">
      <div>
        <span className="text-gray-500">(( </span>
        <span className="text-blue-200">Aroze</span>
        <span className="text-blue-100"> requested to link their Discord</span>
        <span className="text-gray-500"> ))</span>
      </div>
      <div className="mb-4" />
      <div>
        <span className="text-green-200">✅ Yup that's my account </span>
        <span className="text-gray-500">|</span>
        <span className="text-red-100">❌ Not my account</span>
      </div>
      <div className="mb-4" />
      <div>
        <span className="text-gray-500">(( </span>
        <span className="cursor-pointer text-blue-300">
          {" "}
          Not you? Click to block future requests.
        </span>
        <span className="text-gray-500"> ))</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <div>
            <h1 className="select-none text-5xl font-bold">Linky</h1>
            <p className="select-none py-6">
              Bring Discord into the Minecraft world.
            </p>
            <button className="btn-secondary btn normal-case text-slate-200 transition duration-300 ease-in">
              Panel
            </button>
          </div>
          <MinecraftCTA />
        </div>
      </div>
    </>
  );
};

export default Home;
