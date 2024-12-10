import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  // In a real application, you would fetch the users data here
  const user = {
    name: "John Doe",
    email: "john@example.com",
    readingHistory: [
      { id: "1", title: "Comic 1", lastRead: "2023-05-15" },
      { id: "2", title: "Comic 2", lastRead:"2023-05-14" },
      { id: "3", title: "Comic 3", lastRead: "2023-05-13" },
    ],
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {user.readingHistory.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.title}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.lastRead}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button>Edit Profile</Button>
      </div>
    </div>
  )
}

