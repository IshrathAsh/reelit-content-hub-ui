import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Zap, Copy, Clock, Sparkles, Play, MessageSquare, Hash, FileText } from "lucide-react";
import { VideoUpload } from "@/components/VideoUpload";
import { ContentResults } from "@/components/ContentResults";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type GeneratedContent = {
  transcript: string;
  caption: string;
  hashtags: string[];
  description: string;
  videoFile?: File;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'results'>('landing');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const handleVideoProcessed = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setCurrentStep('results');
    toast({
      title: "Content Generated!",
      description: "Your short video content is ready to copy and use.",
    });
  };

  const resetToLanding = () => {
    setCurrentStep('landing');
    setGeneratedContent(null);
  };

  if (currentStep === 'upload') {
    return (
      <VideoUpload 
        onContentGenerated={handleVideoProcessed}
        onBack={resetToLanding}
      />
    );
  }

  if (currentStep === 'results' && generatedContent) {
    return (
      <ContentResults 
        content={generatedContent}
        onStartOver={resetToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Reelit Logo" className="w-32 h-auto" />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="bg-white/5 text-white border border-white/10">
                  Beta
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a beta version - we're still testing and improving features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 relative overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 w-full h-[120%] -top-20 pointer-events-none">
          <iframe 
            src='https://my.spline.design/hypnotism-n9xoBObAfvQiYOW4eDYDGtST/' 
            frameBorder='0' 
            className="w-full h-full opacity-70"
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-cyan-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Animated Illustration */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-30 -z-10">
          <div className="relative w-full h-full">
            {/* Camera Body */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-32 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 animate-pulse-slow" />
            
            {/* Camera Lens */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-400/30 backdrop-blur-sm border border-white/20 animate-pulse-slow" />
            
            {/* Floating Elements */}
            <div className="absolute left-1/4 top-1/4 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 animate-float" />
            <div className="absolute right-1/4 top-1/3 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-400/20 backdrop-blur-sm border border-white/20 animate-float-delayed" />
            <div className="absolute left-1/3 bottom-1/4 w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400/20 to-pink-500/20 backdrop-blur-sm border border-white/20 animate-float" />
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
              <path
                d="M250,250 L200,200 M250,250 L300,200 M250,250 L200,300 M250,250 L300,300"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                fill="none"
                className="animate-draw-line"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-16 max-w-4xl mx-auto relative z-10">
          <div className="relative perspective-1000">
            <h2 className="text-5xl md:text-6xl font-light mb-6 text-white leading-tight transform-gpu hover:scale-105 transition-transform duration-500">
              Create stunning
              <span className="block font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x hover:scale-110 transition-transform duration-500">
                short video content
              </span>
              in seconds
            </h2>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto transform-gpu hover:translate-y-1 transition-transform duration-300">
            Transform your videos into engaging content with AI-powered captions, hashtags, and descriptions for all short video platforms.
          </p>
        </div>

        {/* Main Bento Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            
            {/* Main Upload CTA - Medium */}
            <Card 
              className="md:col-span-2 lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group"
              onClick={() => setCurrentStep('upload')}
            >
              <CardContent className="p-6 h-48 flex flex-col justify-center items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Video</h3>
                <p className="text-sm text-gray-400">Start creating amazing content</p>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-48 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Smart Captions</h4>
                <p className="text-xs text-gray-400">AI-generated captions that engage across all platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-48 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-400 flex items-center justify-center mb-3">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Trending Tags</h4>
                <p className="text-xs text-gray-400">Hashtags that boost reach on all platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-48 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Transcripts</h4>
                <p className="text-xs text-gray-400">Accurate speech-to-text for accessibility</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-48 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center mb-3">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">One-Click Copy</h4>
                <p className="text-xs text-gray-400">Copy all content instantly</p>
              </CardContent>
            </Card>
          </div>

          {/* Platforms Support - Full Width */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Works with all platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-3">
                    <span className="text-red-400 font-bold text-lg">YT</span>
                  </div>
                  <p className="text-sm text-white">YouTube Shorts</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-3">
                    <span className="text-pink-400 font-bold text-lg">TT</span>
                  </div>
                  <p className="text-sm text-white">TikTok</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold text-lg">IG</span>
                  </div>
                  <p className="text-sm text-white">Instagram Reels</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3">
                    <span className="text-blue-400 font-bold text-lg">FB</span>
                  </div>
                  <p className="text-sm text-white">Facebook Reels</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-3">
                    <span className="text-yellow-400 font-bold text-lg">SC</span>
                  </div>
                  <p className="text-sm text-white">Snapchat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">How it works</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-white mb-2">Upload</h4>
                  <p className="text-sm text-gray-400">Upload your short video file</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-white mb-2">Process</h4>
                  <p className="text-sm text-gray-400">AI analyzes and generates content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-white mb-2">Copy & Post</h4>
                  <p className="text-sm text-gray-400">Copy content to any platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <h4 className="text-2xl font-bold text-white mb-1">50MB</h4>
                <p className="text-xs text-gray-400">Max file size</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <h4 className="text-2xl font-bold text-white mb-1">1min</h4>
                <p className="text-xs text-gray-400">Processing time</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <h4 className="text-2xl font-bold text-white mb-1">Free</h4>
                <p className="text-xs text-gray-400">Always free</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <h4 className="text-2xl font-bold text-white mb-1">MP4</h4>
                <p className="text-xs text-gray-400">Supported format</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Save Hours on Content Creation?</h3>
          <p className="mb-8 text-gray-400">
            Join thousands of creators who have streamlined their short video workflow with Reelit
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg rounded-2xl font-bold transition-all duration-300"
            style={{
              background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
              color: 'white',
              border: 'none'
            }}
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo.png" alt="Reelit Logo" className="w-24 h-auto" />
          </div>
          <p className="text-sm text-gray-400">
            Student Project • Built for Short Video Creators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
