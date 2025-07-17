import { FC, useEffect } from "react";
import UserUpdateForm from "../components/settings/UserUpdateForm";

const SettingsPage: FC = function () {
  useEffect(() => {});

  return (
    <div className="py-5 px-10 font-NunitoSans">
      <h1 className="text-[1.8rem] font-semibold capitalize">
        General settings
      </h1>
      <UserUpdateForm />
      {/* <div className="w-full my-5 py-14 flex flex-col items-center gap-10 bg-gray-200 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 bg-gray-300 rounded-full grid place-items-center text-3xl font-semibold cursor-pointer brightness-[0.7] group transition">
            <Input
              type="file"
              id="pImage"
              placeholder="Product Images"
              className="h-full absolute inset-0 opacity-0 cursor-pointer"
            />
            <h2 className="opacity-[0.4] text-5xl uppercase group">
              {user.userInitials}
            </h2>
            <CiCamera className="absolute z-50 text-gray-300 group-hover:brightness-125 transition" />
          </div>
          <h3 className="text-gray-600">{user?.user?.role.RoleName}</h3>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col items-center gap-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="w-[330px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                type="text"
                placeholder="First Name"
                className="w-[330px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                type="text"
                placeholder="Last Name"
                className="w-[330px] h-12"
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-primaryBlue mt-6">
              Save Info
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Phone Number"
                className="w-[330px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Address"
                className="w-[330px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                placeholder="Bio"
                className="flex h-24 w-[330px] rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SettingsPage;
