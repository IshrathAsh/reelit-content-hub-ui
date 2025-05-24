
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, ArrowLeft, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onContentGenerated: (content: any) => void;
  onBack: () => void;
}

export const VideoUpload = ({ onContentGenerated, onBack }: VideoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "video/mp4") {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP4 video file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const simulateAIProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing steps
    const steps = [
      { message: "Extracting audio...", progress: 20 },
      { message: "Generating transcript...", progress: 40 },
      { message: "Creating caption...", progress: 60 },
      { message: "Finding hashtags...", progress: 80 },
      { message: "Finalizing content...", progress: 100 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step.progress);
      toast({
        title: step.message,
        description: "Processing your video...",
      });
    }

    // Generate mock content (in real app, this would come from AI)
    const mockContent = {
      transcript: "Hey everyone! Today I'm sharing my morning routine that has completely transformed my productivity. Starting with a 5-minute meditation, then a quick workout, and finishing with a healthy breakfast. Try it out and let me know how it works for you!",
      caption: "✨ Morning routine that changed my life! Who else loves starting the day right? 🌅",
      hashtags: ["#morningroutine", "#productivity", "#wellness", "#motivation", "#lifestyle", "#selfcare", "#healthyhabits", "#mindfulness"],
      description: "Transform your mornings with this simple routine! Meditation + exercise + healthy breakfast = unstoppable energy all day long.",
      videoFile: selectedFile
    };

    // Add custom prompt influence
    if (customPrompt.toLowerCase().includes('funny')) {
      mockContent.caption = "😂 My morning routine be like: snooze, panic, coffee, pretend I'm productive ☕";
    }

    onContentGenerated(mockContent);
    setIsProcessing(false);
  };

  const handleProcess = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to process.",
        variant: "destructive",
      });
      return;
    }
    simulateAIProcessing();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Upload Your Video</h1>
          <p className="text-gray-600">Upload your video and let AI create your Instagram content</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Video className="w-5 h-5" />
              Video Upload
            </CardTitle>
            <CardDescription>
              Upload an MP4 video (max 30 seconds, 50MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-purple-400"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Click to select video"}
                  </p>
                </div>
              </Button>
            </div>

            {selectedFile && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customization (Optional)</CardTitle>
            <CardDescription>
              Add custom instructions to personalize your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="prompt">Custom Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., 'Make it funny', 'Use business tone', 'Add call to action'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will influence how AI generates your content
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">What you'll get:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accurate video transcript</li>
                <li>• Engaging Instagram caption</li>
                <li>• 5-10 relevant hashtags</li>
                <li>• Short description</li>
                <li>• One-click copy functionality</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Section */}
      {isProcessing && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
              <h3 className="font-semibold">Processing Your Video...</h3>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-600">
                This usually takes about 1 minute
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handleProcess}
          disabled={!selectedFile || isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
