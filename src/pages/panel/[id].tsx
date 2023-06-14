import { GetStaticProps, NextPage } from "next";
import Navbar from "~/components/Navbar";
import { generateSSGHelper } from "~/helpers/ssgHelper";
import { api } from "~/utils/api";
import { useEffect, useState, PropsWithChildren } from "react";
import LoadingSpinner from "~/components/Loader";
import { toast } from "react-hot-toast";
import Link from "next/link";
import constants from "~/constants";
import Card from "~/components/Card";

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

  const ctx = api.useContext();

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
    const { mutate } = api.servers.resetKey.useMutation({
      onSuccess: () => {
        void ctx.servers.getSpecific.invalidate();
        toast.success("Successfully reset!");
      },
    });

    if (!data || !data.apiKey) return <></>;
    return (
      <Card title="API Key" size="w-fit">
        <p className="blur transition-all duration-300 hover:blur-none">
          {data.apiKey}
        </p>
        <div className="mt-4">
          <button
            className="btn-error btn capitalize"
            onClick={() => {
              mutate({
                id: data.id,
              });
            }}
          >
            Reset
          </button>
        </div>
      </Card>
    );
  };

  const InviteBot = () => {
    if (!data || !data.id) return <></>;

    if (data.inGuild) return <></>;

    return (
      <Card title="Invite the bot" size="w-72">
        <div className="mt-4">
          <Link
            href={`https://discord.com/oauth2/authorize?client_id=${constants.BOT_ID}&permissions=268435456&scope=bot&disable_guild_select=true&guild_id=${data.id}`}
            passHref
          >
            <button className="btn-primary btn capitalize">Invite</button>
          </Link>
        </div>
      </Card>
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
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-8">
              <APIKey />
              <InviteBot />
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
