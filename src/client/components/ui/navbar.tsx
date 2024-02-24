import { cn } from "@client/lib/utils";
import { useStoreState } from "@client/store";
import { Link, useMatch } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage } from "./avatar";
import { discordAvatarUrl } from "@client/lib/discordAvatarUrl";

type NavbarItemProps = {
  to: string;
  children: React.ReactNode;
};

const NavbarItem = ({ to, children }: NavbarItemProps) => {
  const match = useMatch(to);

  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        {
          "text-primary": match,
          "text-muted-foreground": !match,
        },
      )}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const auth = useStoreState((state) => state.auth)!;
  const meta = useStoreState((state) => state.meta)!;

  return (
    <nav className="border-b flex justify-between h-14">
      <div className="flex items-center pl-4">
        <h1>{meta.name}</h1>
      </div>

      <div className="flex items-center justify-end pr-4 space-x-4 lg:space-x-6 ">
        <NavbarItem to="/">Home</NavbarItem>
        <NavbarItem to="/upload">Upload</NavbarItem>
        {auth.admin == true && <NavbarItem to="/users">Users</NavbarItem>}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>{auth.username}</span>
              <Avatar>
                <AvatarImage
                  src={discordAvatarUrl(auth.id, auth.discord.avatar)}
                />
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Manage account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/tokens">API Tokens</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/api/auth/logout">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export { Navbar };
