import { GetStaticProps, NextPage } from "next";
import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/helpers/ssgHelper";
import { api } from "~/utils/api";
import { useEffect, useState, PropsWithChildren } from "react";
import LoadingSpinner from "~/components/Loader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Page = (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className="flex h-screen justify-center">
        <div className="flex flex-col items-center justify-center">
          {props.children}
        </div>
      </main>
    </>
  );
};

const ServerPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading, isError, error } = api.servers.getSpecific.useQuery({
    id,
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isError) setErrorMsg(error.message);
  }, [isError]);

  if (errorMsg !== null) {
    return (
      <Page>
        <article className="prose text-center">
          <h1>There was an error.</h1>
          <h3>{errorMsg}</h3>
        </article>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page>
        <LoadingSpinner />
        <article className="prose">
          <h3>Loading server data..</h3>
        </article>
      </Page>
    );
  }

  const APIKey = () => {
    return (
      <div className="flex w-fit flex-col items-center justify-center rounded-lg bg-base-200 p-4">
        <label className="mb-2 text-sm text-gray-500">Your API Key:</label>
        <div className="w-80 text-center blur transition-all duration-300 hover:blur-none">
          {data?.apiKey!!}
        </div>
        <div
          className="mt-2"
          onClick={() => {
            navigator.clipboard.writeText(data?.apiKey!!);
            toast.success("Successfully copied!", {
              position: "bottom-center",
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 hover:cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="flex justify-center">
        <div className="flex h-full w-full flex-col px-8 py-8 md:px-32 md:py-12">
          <div className="md:ml-8">
            <article className="prose">
              <h1>{data?.name}</h1>
            </article>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center">
              <APIKey />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.servers.getSpecific.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ServerPage;
