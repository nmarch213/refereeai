import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function UserDataPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">User Data Management</h1>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Request Data Deletion</CardTitle>
          <CardDescription>
            Submit a request to delete your user data. We will process your
            request within 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/delete-user-data" method="POST">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input id="userId" name="userId" type="text" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Deletion Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
