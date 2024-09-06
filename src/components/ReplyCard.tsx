import { Separator } from "@/components/ui/separator"

 function ReplyCard({ question, answer }: { question: string, answer: string}) {
  return (
    <div className="w-full max-w-md rounded-lg shadow-2xl overflow-hidden m-10 border border-b-black">
      <div className="p-6 space-y-4">
        <div className="text-gray-500 text-sm font-bold">{question}</div>
        <Separator className="my-4" />
        <div className="text-gray-500 text-sm">
          {answer}
        </div>
      </div>
    </div>
  )
}

export default ReplyCard