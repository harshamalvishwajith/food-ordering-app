"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const PORT = process.env.USER_SERVICE_API_PORT;

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  passwordHash: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().optional(),
});

// Extended schema for restaurant owners
const restaurantSchema = registerSchema.extend({
  restaurantName: z.string().min(2, { message: "Restaurant name is required" }),
  cuisineType: z.string().min(2, { message: "Cuisine type is required" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userType, setUserType] = useState<
    "customer" | "restaurant" | "delivery"
  >("customer");

  const form = useForm<
    z.infer<typeof registerSchema> | z.infer<typeof restaurantSchema>
  >({
    resolver: zodResolver(
      userType === "restaurant" ? restaurantSchema : registerSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      passwordHash: "",
      phone: "",
      ...(userType === "restaurant"
        ? { restaurantName: "", cuisineType: "" }
        : {}),
    },
  });

  // const onSubmit = async (values: any) => {
  //   try {
  //     // Simulate API call
  //     console.log("Registration attempt", { ...values, userType });

  //     // Mock successful registration
  //     toast({
  //       title: "Registration successful",
  //       description: "Your account has been created successfully.",
  //     });

  //     // Redirect to login
  //     router.push("/auth/login");
  //   } catch (error) {
  //     toast({
  //       title: "Registration failed",
  //       description: "There was a problem creating your account.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // here is the actual function to handle the registration
  const onSubmit = async (values: any) => {
    try {
      // Create the payload to send to the backend
      const payload = { ...values, userType };

      // Send the request to the backend (replace the URL with your actual backend endpoint)
      const response = await fetch(`http://localhost:3009/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Registration attempt", payload);

      // Check if the response is successful
      if (response.ok) {
        // Mock successful registration
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });

        // Redirect to the login page
        router.push("/auth/login");
      } else {
        // Handle server errors or validation errors
        const errorData = await response.json();
        toast({
          title: "Registration failed",
          description:
            errorData.message || "There was a problem creating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Catch any unexpected errors, like network issues
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-md py-10 mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join FoodHub today and start enjoying delicious meals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="customer"
            className="mb-8"
            onValueChange={(value) => {
              setUserType(value as any);
              form.reset();
            }}
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to order food from your favorite restaurants.
              </p>
            </TabsContent>

            <TabsContent value="restaurant">
              <p className="text-sm text-muted-foreground mb-4">
                Partner with FoodHub to reach more customers and grow your
                business.
              </p>
            </TabsContent>

            <TabsContent value="delivery">
              <p className="text-sm text-muted-foreground mb-4">
                Join our delivery team to earn money on your own schedule.
              </p>
            </TabsContent>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === "restaurant" && (
                <>
                  <FormField
                    control={form.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Italian Bistro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cuisineType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Italian, American, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
