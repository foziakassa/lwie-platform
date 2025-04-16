"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Edit, LogOut, Mail, MapPin, Phone, User, Calendar, Package, Repeat } from "lucide-react"
import Cookies from 'js-cookie';
import { cookies } from "next/headers"
export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const userInfoStr = Cookies.get('authToken');

    let userInfo = null;

    if (userInfoStr) {
        try {
            userInfo = JSON.parse(userInfoStr); // Parse the string back to an object
        } catch (error) {
            console.error("Failed to parse user info:", error);
        }
    }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    Cookies.remove('authToken')
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#1f2937] py-8"> 
    
     {userInfo ? (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Cover Image and Profile Section */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden bg-gradient-to-r bg-gray-200">
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-12 px-4">
            <div>
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
                <AvatarFallback className="text-4xl font-bold">{userInfo.firstName}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{userInfo.lastName}</h1>
                  <p className="text-gray-500 dark:text-gray-400">@{userInfo.email}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-gray-800 dark:text-gray-200">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Bio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.bio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Phone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-gray-800 dark:text-gray-200">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Member Since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.memberSince}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-teal-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Items Listed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.itemsListed}</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4 text-teal-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Successful Swaps</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.successfulSwaps}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="items">
              <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger
                  value="items"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  My Items
                </TabsTrigger>
                <TabsTrigger
                  value="swaps"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  My Swaps
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">My Listed Items</h2>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200">
                    <Camera className="h-4 w-4 mr-2" />
                    Post New Item
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card
                      key={item}
                      className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                        <Image src="/placeholder.svg" alt={`Item ${item}`} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Item Title {item}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Listed on: April 1, 2023</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge
                            variant="outline"
                            className="border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
                          >
                            For Swap
                          </Badge>
                          <span className="text-teal-600 dark:text-teal-400 font-medium">5,000 ETB</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="swaps" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Swap History</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((swap) => (
                    <Card
                      key={swap}
                      className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Swap #{swap}</CardTitle>
                          <Badge className="bg-teal-500 hover:bg-teal-600 text-white transition-colors">Completed</Badge>
                        </div>
                        <CardDescription>Completed on April {swap * 3}, 2023</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                            <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">You Swapped:</p>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <Image src="/placeholder.svg" alt="Your item" fill className="object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Vintage Camera</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Value: 3,000 ETB</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                            <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">You Received:</p>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <Image src="/placeholder.svg" alt="Their item" fill className="object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Bluetooth Speaker</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Value: 2,800 ETB</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <CardTitle className="text-gray-800 dark:text-gray-200">Profile Settings</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue={userInfo.firstName + " " + userInfo.lastName}
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                          Username
                        </Label>
                        <Input
                          id="username"
                          defaultValue={userInfo.username}
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={userInfo.email}
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          defaultValue={userInfo.phone}
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        defaultValue={userInfo.bio}
                        rows={4}
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                        Location
                      </Label>
                      <Input
                        id="location"
                        defaultValue={userInfo.location}
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200">
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <CardTitle className="text-gray-800 dark:text-gray-200">Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive email notifications about swaps and messages
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        defaultChecked
                        className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="swap-requests" className="text-gray-700 dark:text-gray-300">
                          Swap Requests
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified when someone wants to swap with you
                        </p>
                      </div>
                      <Switch
                        id="swap-requests"
                        defaultChecked
                        className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="messages" className="text-gray-700 dark:text-gray-300">
                          Messages
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified when you receive a new message
                        </p>
                      </div>
                      <Switch
                        id="messages"
                        defaultChecked
                        className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing" className="text-gray-700 dark:text-gray-300">
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch
                        id="marketing"
                        className="data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200">
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <CardTitle className="text-gray-800 dark:text-gray-200">Security</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300">
                        Current Password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200">
                      Update Password
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
     ):(
      <div className="">not login yet</div>
     )}
    </div>
  )
}