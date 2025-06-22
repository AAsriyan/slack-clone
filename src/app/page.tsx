"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const Home = () => {
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default Home;
