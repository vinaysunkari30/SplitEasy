import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="h-screen bg-[url('/images/HeroBackground.png')] bg-cover bg-[position:65%_center] bg-no-repeat pt-18.5 md:bg-center">
      <div className="h-full flex items-center bg-white/20">
        <div className="px-5 sm:px-10 md:px-16 w-full flex flex-col items-center sm:items-start">
          <h1 className="font-syne max-w-md text-center sm:text-left text-3xl leading-tight font-bold text-slate-900 sm:text-4xl">
            Split expenses,
            <span className="block text-cyan-600">not friendships</span>
          </h1>
          <p className="mt-5 max-w-md text-center sm:text-left font-roboto text-base leading-7 text-slate-700 sm:text-lg">
            Share expenses, track balances, and settle up effortlessly with your
            friends. Less calculation, more celebration.
          </p>
          <div className="flex justify-center sm:justify-start w-full">
            <Link to={'/group'} className="mt-6 cursor-pointer rounded-2xl bg-cyan-500 px-6 py-3 font-roboto font-medium text-white shadow-lg shadow-cyan-500/20 transition active:scale-90 hover:bg-cyan-600">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
