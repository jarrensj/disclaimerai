"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function DisclaimerAI() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [generatedDisclaimer, setGeneratedDisclaimer] = useState("")
  const [disclaimerTopics, setDisclaimerTopics] = useState<{ id: string, label: string, blurb: string }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchDisclaimers = async () => {
      try {
        const response = await fetch('/api/disclaimers')
        const data = await response.json()
        setDisclaimerTopics(data)
      } catch (error) {
        console.error("Failed to fetch disclaimers:", error)
      }
    }
    fetchDisclaimers()
  }, [])

  const handleTopicChange = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    )
  }

  const generateDisclaimer = () => {
    const disclaimer = selectedTopics
      .map((topicId) => disclaimerTopics.find((topic) => topic.id === topicId)?.blurb)
      .filter(Boolean)
      .join("\n\n")
    setGeneratedDisclaimer(disclaimer)
  }

  const copyToClipboard = () => {
    if (!generatedDisclaimer) return
    navigator.clipboard.writeText(generatedDisclaimer)
    toast({
      title: "Copied!",
      description: "Disclaimer has been copied to clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">DisclaimerAI</CardTitle>
          <CardDescription className="text-center">
            Generate custom disclaimers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Topics:</h2>
            {disclaimerTopics.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-2">
                <Checkbox
                  id={topic.id}
                  checked={selectedTopics.includes(topic.id)}
                  onCheckedChange={() => handleTopicChange(topic.id)}
                />
                <label
                  htmlFor={topic.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {topic.label}
                </label>
              </div>
            ))}
          </div>
          <Button onClick={generateDisclaimer} className="mt-6 w-full" disabled={selectedTopics.length === 0}>
            Generate Disclaimer
          </Button>
          {generatedDisclaimer && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Generated Disclaimer:</h2>
              <Textarea value={generatedDisclaimer} readOnly className="h-40" />
              <Button onClick={copyToClipboard} className="mt-2 w-full">
                Copy to Clipboard
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Disclaimer: This is not disclaimer advice.
        </CardFooter>
      </Card>
    </div>
  )
}