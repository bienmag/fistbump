import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

export default function SelfReview({ user }) {
  return (
    <div className="bg-white">
      <div className="grid grid-cols-8 gap-4 border-b p-2 items-center">
        <p className="font-semibold col-span-2">{user.title}</p>
        <p className="col-span-2">{user.fullName}</p>
        <p className="col-span-2">{user.teamName}</p>
        <Button
          href={`/employee/${user._id}/new-review`}
          variant='outline'
          className='bg-blue-500 text-white'>
          Write a review
        </Button>
      </div>
    </div>
  )

}