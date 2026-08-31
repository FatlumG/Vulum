import { FC, useEffect } from "react";
import UserUpdateForm from "../components/settings/UserUpdateForm";

const SettingsPage: FC = function () {
  useEffect(() => {});

  return (
    <div className="py-6 page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          General Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences and profile information.
        </p>
      </div>
      <UserUpdateForm />
    </div>
  );
};

export default SettingsPage;
