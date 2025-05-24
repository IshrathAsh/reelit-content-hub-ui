
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Zap, Copy, Clock, Sparkles, Play, MessageSquare, Hash, FileText } from "lucide-react";
import { VideoUpload } from "@/components/VideoUpload";
import { ContentResults } from "@/components/ContentResults";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'results'>('landing');
  const [generatedContent, setGeneratedContent] = useState(null);
  const { toast } = useToast();

  const handleVideoProcessed = (content: any) => {
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
    <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ 
                   background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                 }}>
              <Zap className="w-5 h-5 text-black fill-current" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide uppercase text-white">
              REELIT
            </h1>
          </div>
          <Badge variant="secondary" className="bg-white/5 text-white border border-white/10">
            Beta
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light mb-6 text-white leading-tight">
            Create stunning
            <span className="block font-bold bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-400 bg-clip-text text-transparent">
              short video content
            </span>
            in seconds
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Transform your videos into engaging content with AI-powered captions, hashtags, and descriptions for all short video platforms.
          </p>
        </div>

        {/* Main Bento Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            
            {/* Main Upload CTA - Large */}
            <Card 
              className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group"
              onClick={() => setCurrentStep('upload')}
            >
              <CardContent className="p-8 h-64 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Upload Video</h3>
                <p className="text-gray-400">Start creating amazing content</p>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Smart Captions</h4>
                <p className="text-xs text-gray-400">AI-generated captions that engage across all platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-400 flex items-center justify-center mb-4">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Trending Tags</h4>
                <p className="text-xs text-gray-400">Hashtags that boost reach on all platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Transcripts</h4>
                <p className="text-xs text-gray-400">Accurate speech-to-text for accessibility</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center mb-4">
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
                <h4 className="text-2xl font-bold text-white mb-1">30s</h4>
                <p className="text-xs text-gray-400">Max video length</p>
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
            <div className="w-5 h-5 rounded bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-black fill-current" />
            </div>
            <span className="font-semibold text-white">Reelit</span>
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
