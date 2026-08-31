import React, { FC, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getPfp } from "../../hooks-apiCalls/getPfpHook";
import { CiCamera } from "react-icons/ci";
import { Button } from "../ui/button";
import { UserUpdateInterface } from "../../interfaces/UserUpdateInterface";
import api from "../../auth/api";
import { Card, CardContent } from "../ui/card";

const UserUpdateForm: FC = () => {
  const userpfp = getPfp();
  const [user, setUser] = useState<UserUpdateInterface>({
    Username: userpfp?.user?.Username,
    FName: userpfp?.user?.FName,
    LName: userpfp?.user?.LName,
    Email: userpfp?.user?.Email,
    Phone: userpfp?.user?.Phone,
    Address: userpfp?.user?.Address,
    Bio: userpfp?.user?.Bio,
  });

  const userId = userpfp?.user?.id;

  const updateUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.patch(`/users/${userId}`, user);
      console.log("user updated successfully:", user);
    } catch (error: any) {
      console.error(error.response.data, "error.message");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6 sm:p-8">
        <form className="flex flex-col gap-8" onSubmit={updateUser}>
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 bg-muted rounded-full grid place-items-center text-2xl font-semibold cursor-pointer group transition-all hover:ring-2 hover:ring-ring">
              <Input
                type="file"
                id="pImage"
                placeholder="Product Images"
                className="h-full absolute inset-0 opacity-0 cursor-pointer"
              />
              <h2 className="text-muted-foreground uppercase">
                {userpfp.userInitials}
              </h2>
              <CiCamera className="absolute z-10 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h3 className="text-sm text-muted-foreground">
              {userpfp?.user?.role.RoleName}
            </h3>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={user.Username}
                onChange={(e) => {
                  setUser({ ...user, Username: e.target.value });
                }}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={user.Email}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                type="text"
                placeholder="First Name"
                value={user.FName}
                onChange={(e) => {
                  setUser({ ...user, FName: e.target.value });
                }}
              />
            </div>
            <div>
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                type="text"
                placeholder="Last Name"
                value={user.LName}
                onChange={(e) => {
                  setUser({ ...user, LName: e.target.value });
                }}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Phone Number"
                value={user.Phone}
                onChange={(e) => {
                  setUser({ ...user, Phone: e.target.value });
                }}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Address"
                value={user.Address}
                onChange={(e) => {
                  setUser({ ...user, Address: e.target.value });
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself..."
              className="flex h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 resize-none"
              value={user.Bio}
              onChange={(e) => {
                setUser({ ...user, Bio: e.target.value });
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-primaryBlue hover:bg-darkBlue text-white self-start"
          >
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserUpdateForm;
