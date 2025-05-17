"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/schema";

// TODO: Replace with actual restaurant ID, possibly from context or props
const RESTAURANT_ID_PLACEHOLDER = "68280f5f6356a8b6e49d1414";
const API_URL = "https://localhost:7046/api/Menu";

export default function MenuManagementPage() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming API returns items for all restaurants, filter by our placeholder ID
        // And map ImageUrl to image
        const filteredData = data
          .filter(
            (item: any) => item.restaurantId === RESTAURANT_ID_PLACEHOLDER
          )
          .map((item: any) => ({
            ...item,
            id: item.id?.toString(), // Ensure id is a string
            image: item.imageUrl, // Map ImageUrl to image
            // price: parseFloat(item.price) // Ensure price is a number if API returns string
          }));
        setMenuItems(filteredData);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast({
          title: "Error fetching menu items",
          description: (error as Error).message || "Could not load menu data.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchMenuItems();
  }, [toast]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    // Prepare payload, mapping frontend 'image' to backend 'imageUrl'
    const payload: any = {
      restaurantId: RESTAURANT_ID_PLACEHOLDER,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      isAvailable: true, // Assuming default, add to form if configurable
      imageUrl: formData.get("image") as string, // Map to imageUrl
    };

    try {
      let response;
      if (editingItem && editingItem.id) {
        // Update existing item
        response = await fetch(`${API_URL}/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingItem.id }), // Backend expects id in body for PUT
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorData}`
          );
        }
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...editingItem, ...payload, image: payload.imageUrl }
              : item
          )
        );
        toast({
          title: "Menu item updated",
          description: "The menu item has been updated successfully.",
        });
      } else {
        // Add new item
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorData}`
          );
        }
        const newItemData = await response.json();
        setMenuItems((prev) => [
          ...prev,
          {
            ...newItemData,
            id: newItemData.id?.toString(),
            image: newItemData.imageUrl,
          },
        ]);
        toast({
          title: "Menu item added",
          description: "The new menu item has been added successfully.",
        });
      }
    } catch (error) {
      console.error("Error submitting menu item:", error);
      toast({
        title: "Error submitting menu item",
        description: (error as Error).message || "Could not save menu item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorData}`
        );
      }
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Menu item deleted",
        description: "The menu item has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error deleting menu item",
        description: (error as Error).message || "Could not delete menu item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openNewItemDialog = () => {
    setEditingItem(null); // Ensure form is for new item
    setIsDialogOpen(true);
  };

  if (isFetching) {
    return (
      <div className="container max-w-6xl py-12 mx-auto text-center">
        Loading menu items...
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) setEditingItem(null); // Reset editing item when dialog closes
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openNewItemDialog}>
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingItem?.price?.toString()}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={editingItem?.image}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingItem(null);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : (editingItem ? "Update" : "Add") + " Item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {menuItems.length === 0 && !isFetching && (
        <div className="text-center text-muted-foreground">
          No menu items found for this restaurant. Add your first item!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <div className="aspect-video relative">
              <img
                src={item.image || "/placeholder-image.jpg"} // Use placeholder if image is missing
                alt={item.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.category}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  ${item.price?.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                {item.description}
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
