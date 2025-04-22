// src/pages/Profile.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useStore";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const Profile = () => {
  const { user, fetchUserDetails } = useUserStore();
  const navigate = useNavigate();
  console.log(user)

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  // Fetch user details on mount if not already fetched
  useEffect(() => {
    if (!user.firstname) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, user.firstname]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.img} />
                <AvatarFallback className="text-2xl">
                  {user.firstname?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">
                {user.firstname} {user.lastname}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Member since</p>
                <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Region</p>
                <p>{user.regionId || "Not specified"}</p>
              </div>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p>{user.firstname || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p>{user.lastname || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{user.phoneNumber || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};