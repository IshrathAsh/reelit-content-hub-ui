import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, ArrowLeft, Video, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onContentGenerated: (content: {
    transcript: string;
    caption: string;
    hashtags: string[];
    description: string;
    videoFile?: File;
  }) => void;
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
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP4, MOV, or AVI video file.",
          variant: "destructive",
        });
        return;
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      // If all validations pass, set the file
      setSelectedFile(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to process.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      // Create form data
      const formData = new FormData();
      formData.append('video', selectedFile);
      if (customPrompt) {
        formData.append('prompt', customPrompt);
      }

      // Make API call to backend
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const data = await response.json();

      // Update progress based on processing steps
      const steps = [
        { message: "Analyzing video...", progress: 10 },
        { message: "Extracting audio...", progress: 25 },
        { message: "Generating transcript...", progress: 40 },
        { message: "Creating caption...", progress: 60 },
        { message: "Finding hashtags...", progress: 75 },
        { message: "Optimizing for platforms...", progress: 90 },
        { message: "Finalizing content...", progress: 100 },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(step.progress);
        toast({
          title: step.message,
          description: "Processing your video...",
        });
      }

      // Pass the generated content to parent component
      onContentGenerated({
        transcript: data.transcription,
        caption: data.generatedContent.caption,
        hashtags: data.generatedContent.hashtags,
        description: data.generatedContent.description,
        videoFile: selectedFile
      });

    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Reelit Logo" className="w-32 h-auto" />
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Video</h1>
              <p className="text-sm text-gray-400">Upload your video and let AI create content for all platforms</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {/* Upload Section - Large */}
          <Card className="md:col-span-2 lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Video className="w-5 h-5" />
                Video Upload
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload an MP4 video (max 50MB) for YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, Snapchat & more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo"
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
          <Card className="md:col-span-2 lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl">
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
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
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
