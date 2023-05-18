import { api } from "~/utils/api";
import * as Dialog from "@radix-ui/react-dialog";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  server: string;
}

const CreateServer = () => {
  const {
    data: userGuilds,
    isLoading: guildsLoading,
    isError: guildsError,
  } = api.discord.getServers.useQuery();

  const ctx = api.useContext();

  const { mutate: createServer, isLoading } = api.servers.create.useMutation({
    onSuccess: () => {
      // wipe trpc cache to instantly update the servers
      void ctx.servers.fetch.invalidate();
    },
  });

  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<IFormInputs>();

  const Error = () => {
    if (err === null) return <></>;
    return (
      <div className="animate-fadeIn alert alert-error mb-10 shadow-lg">
        <div>
          <IconExclamationCircle />
          <span>{err}</span>
        </div>
      </div>
    );
  };

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    // wipes previous error
    if (err !== null) setErr(null);
    console.log(data);
    const serverObject = userGuilds
      ?.filter((g) => g.id == data.server)
      .shift()!!;
    await createServer({
      serverId: data.server,
      name: serverObject.name,
    });
  };

  const ServerSelect = () => {
    if (guildsLoading || guildsError) return <></>;
    return (
      <form className="mb-[15px] flex items-center gap-5">
        <select
          className="select-secondary select w-full max-w-xs"
          {...register("server")}
        >
          <option disabled selected>
            Pick a server
          </option>
          {userGuilds!!.map((g) => {
            return <option value={g.id}>{g.name}</option>;
          })}
        </select>
      </form>
    );
  };

  return (
    <>
      <div
        className={`card mt-10 w-72 outline outline-dashed outline-2 outline-offset-2 outline-secondary md:ml-12`}
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title">Setup</h2>
          <p>Setup a new Linky instance</p>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className={`btn-secondary btn`}>Create</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="animate-fadeIn fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-base-200 p-8 focus:outline-none">
                <Dialog.Title className="m-0 text-[17px] font-medium">
                  Setting up Linky
                </Dialog.Title>
                <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal">
                  <Error />
                  Select a Discord server below
                </Dialog.Description>
                <ServerSelect />
                <div className="mt-8 flex justify-end">
                  <button
                    className={`btn-secondary btn capitalize ${
                      isLoading ? "loading" : ""
                    }`}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Create
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </>
  );
};

export default CreateServer;
