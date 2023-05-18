import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  const { isLoaded, user } = useUser();

  const UserDropdown = () => {
    return (
      <>
        <div className="dropdown-end dropdown">
          <UserButton
            appearance={{
              elements: {
                userButtonBox: "scale-125",
                user,
              },
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="ml-12 mr-24 md:ml-24">
      <div className="navbar bg-base-100">
        <div className="md:ml-none ml-12 flex-1">
          <Image src="/link.png" width={64} height={64} alt="Link image" />
          <Link href={"/"} passHref>
            <button className="btn-ghost btn text-xl normal-case">Linky</button>
          </Link>
        </div>
        <div className="ml-20 flex-none md:ml-0">
          {isLoaded ? <UserDropdown /> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
