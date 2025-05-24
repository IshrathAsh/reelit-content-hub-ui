
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <VideoUpload 
          onContentGenerated={handleVideoProcessed}
          onBack={resetToLanding}
        />
      </div>
    );
  }

  if (currentStep === 'results' && generatedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <ContentResults 
          content={generatedContent}
          onStartOver={resetToLanding}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Reelit
            </h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            MVP • Free
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Content Creation
          </Badge>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Instagram Content in
            <span className="block text-orange-500">1 Minute</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your videos into engaging Instagram Reels content with AI-generated 
            captions, hashtags, descriptions, and transcripts. Say goodbye to hours of manual work.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Video
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Upload videos up to 30 seconds • Completely free to use
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Everything You Need for Instagram Success</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your video and generates all the content you need for your Instagram Reel
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Smart Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Accurate speech-to-text conversion using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Engaging Captions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Hook-worthy captions optimized for Instagram engagement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">#</span>
              </div>
              <CardTitle className="text-lg">Trending Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Relevant hashtags to boost your content's discoverability
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">One-Tap Copy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Copy all generated content to clipboard with a single click
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">How Reelit Works</h3>
          <p className="text-gray-600">Simple, fast, and effective content creation in 3 steps</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1
            </div>
            <h4 className="font-semibold mb-2">Upload Video</h4>
            <p className="text-gray-600 text-sm">
              Upload your short video (up to 30 seconds) in MP4 format
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2
            </div>
            <h4 className="font-semibold mb-2">AI Processing</h4>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your video and generates optimized content
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3
            </div>
            <h4 className="font-semibold mb-2">Copy & Post</h4>
            <p className="text-gray-600 text-sm">
              Copy all content with one click and paste directly to Instagram
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Save Hours on Content Creation?</h3>
          <p className="text-gray-600 mb-8">
            Join thousands of creators who have streamlined their Instagram workflow with Reelit
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Reelit</span>
          </div>
          <p className="text-gray-600 text-sm">
            Final Year College Project • Built for Instagram Creators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
