import { Server } from "@prisma/client";
import { NextPage } from "next";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/Loader";
import CreateServer from "~/components/CreateServer";
import Link from "next/link";

const Home: NextPage = () => {
  const {
    data: userServers,
    isLoading,
    isError,
  } = api.servers.fetch.useQuery();

  const Server = (props: { server: Server }) => {
    return (
      <div
        className={`card mt-10 w-52 outline outline-2 outline-offset-2 outline-success md:ml-12`}
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title">{props.server.name}</h2>
          <div className="card-actions mt-4 justify-end">
            <Link href={`/panel/${props.server.id}`} passHref>
              <button className={`btn-secondary btn`}>Manage</button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || isError) {
    return (
      <>
        <Navbar />
        <main className="flex h-screen justify-center">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner />
            <article className="prose">
              <h3>Loading</h3>
            </article>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <div className="flex h-full w-full flex-col px-8 py-8 md:px-32 md:py-12">
          <div className="md:ml-8">
            <article className="prose text-center md:text-left">
              <h1>Your servers</h1>
              <p className="mt-[-1rem] text-lg">Manage all your servers</p>
            </article>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center">
              {userServers.map((s) => {
                return <Server server={s} />;
              })}
              <CreateServer />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
