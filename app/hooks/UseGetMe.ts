import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import React from "react";

function UseGetMe() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getMe, { isLoading, isAuthenticated });

  return { user };
}

export default UseGetMe;
