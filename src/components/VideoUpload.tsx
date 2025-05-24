
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, ArrowLeft, Video, Loader2, CheckCircle } from "lucide-react";
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
      if (file.size > 50 * 1024 * 1024) {
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

    const mockContent = {
      transcript: "Hey everyone! Today I'm sharing my morning routine that has completely transformed my productivity. Starting with a 5-minute meditation, then a quick workout, and finishing with a healthy breakfast. Try it out and let me know how it works for you!",
      caption: "✨ Morning routine that changed my life! Who else loves starting the day right? 🌅",
      hashtags: ["#morningroutine", "#productivity", "#wellness", "#motivation", "#lifestyle", "#selfcare", "#healthyhabits", "#mindfulness"],
      description: "Transform your mornings with this simple routine! Meditation + exercise + healthy breakfast = unstoppable energy all day long.",
      videoFile: selectedFile
    };

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
    <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload Video</h1>
            <p className="text-sm text-gray-400">Upload your video and let AI create content for all platforms</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Upload Section - Takes 2 columns */}
          <Card className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Video className="w-5 h-5" />
                Video Upload
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload an MP4 video (max 30 seconds, 50MB) for YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, Snapchat & more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-2xl p-12 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                         style={{ 
                           background: selectedFile 
                             ? 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)' 
                             : 'rgba(255, 255, 255, 0.1)'
                         }}>
                      {selectedFile ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <Upload className="w-8 h-8 text-white/60" />
                      )}
                    </div>
                    <p className="text-white font-medium mb-2">
                      {selectedFile ? selectedFile.name : "Click to select video"}
                    </p>
                    <p className="text-sm text-gray-400">
                      MP4 format, up to 50MB
                    </p>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400">{selectedFile.name}</p>
                      <p className="text-sm text-green-300">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Customize</CardTitle>
              <CardDescription className="text-gray-400">
                Optional platform-specific instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white mb-2 block">Custom Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., 'TikTok style', 'YouTube tone', 'Professional'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-medium mb-3 text-white">You'll get:</h4>
                <ul className="text-sm space-y-2 text-gray-400">
                  <li>• Video transcript</li>
                  <li>• Platform-ready caption</li>
                  <li>• Relevant hashtags</li>
                  <li>• Short description</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processing Section */}
        {isProcessing && (
          <Card className="mt-8 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-white" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Processing Your Video</h3>
                  <p className="text-sm text-gray-400">
                    This usually takes about 1 minute
                  </p>
                </div>
                <Progress value={progress} className="w-full max-w-md mx-auto h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!selectedFile || isProcessing}
            className="px-12 py-4 text-lg font-semibold rounded-2xl disabled:opacity-50 transition-all duration-300"
            style={{
              background: selectedFile && !isProcessing 
                ? 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none'
            }}
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
    </div>
  );
};
