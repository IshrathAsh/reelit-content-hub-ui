
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Zap, Copy, Instagram, Clock, Sparkles } from "lucide-react";
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
      description: "Your Instagram content is ready to copy and use.",
    });
  };

  const resetToLanding = () => {
    setCurrentStep('landing');
    setGeneratedContent(null);
  };

  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <VideoUpload 
          onContentGenerated={handleVideoProcessed}
          onBack={resetToLanding}
        />
      </div>
    );
  }

  if (currentStep === 'results' && generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <ContentResults 
          content={generatedContent}
          onStartOver={resetToLanding}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Lightning bolt icon with gradient */}
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-lg flex items-center justify-center transform rotate-12">
                <Zap className="w-6 h-6 text-black fill-current" />
              </div>
            </div>
            {/* Clean logo text */}
            <h1 className="text-3xl font-bold tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                REELIT
              </span>
            </h1>
          </div>
          <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-500/50">
            MVP • Free
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-purple-900/50 text-purple-300 hover:bg-purple-900/50 border-purple-500/50">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Content Creation
          </Badge>
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              Create Instagram Content in
            </span>
            <span className="block text-yellow-400 mt-2">1 Minute</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your videos into engaging Instagram Reels content with AI-generated 
            captions, hashtags, descriptions, and transcripts. Say goodbye to hours of manual work.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-600 hover:to-fuchsia-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg border-0"
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Video
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            Upload videos up to 30 seconds • Completely free to use
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">Everything You Need for Instagram Success</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our AI analyzes your video and generates all the content you need for your Instagram Reel
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">Smart Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-300">
                Accurate speech-to-text conversion using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">Engaging Captions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-300">
                Hook-worthy captions optimized for Instagram engagement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">#</span>
              </div>
              <CardTitle className="text-lg text-white">Trending Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-300">
                Relevant hashtags to boost your content's discoverability
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white">One-Tap Copy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-300">
                Copy all generated content to clipboard with a single click
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl mx-4 p-8 border border-gray-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-white">How Reelit Works</h3>
            <p className="text-gray-300">Simple, fast, and effective content creation in 3 steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="font-semibold mb-2 text-white">Upload Video</h4>
              <p className="text-gray-300 text-sm">
                Upload your short video (up to 30 seconds) in MP4 format
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="font-semibold mb-2 text-white">AI Processing</h4>
              <p className="text-gray-300 text-sm">
                Our AI analyzes your video and generates optimized content
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="font-semibold mb-2 text-white">Copy & Post</h4>
              <p className="text-gray-300 text-sm">
                Copy all content with one click and paste directly to Instagram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Save Hours on Content Creation?</h3>
          <p className="text-gray-300 mb-8">
            Join thousands of creators who have streamlined their Instagram workflow with Reelit
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-600 hover:to-fuchsia-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg border-0"
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="font-semibold text-white">Reelit</span>
          </div>
          <p className="text-gray-400 text-sm">
            Final Year College Project • Built for Instagram Creators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
