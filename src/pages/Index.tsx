
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Zap, Copy, Clock, Sparkles } from "lucide-react";
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
      <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
        <VideoUpload 
          onContentGenerated={handleVideoProcessed}
          onBack={resetToLanding}
        />
      </div>
    );
  }

  if (currentStep === 'results' && generatedContent) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
        <ContentResults 
          content={generatedContent}
          onStartOver={resetToLanding}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono" style={{ backgroundColor: '#1C2526' }}>
      {/* Header */}
      <header className="border-b border-gray-700 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Lightning bolt icon with neon gradient */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transform rotate-12"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                     boxShadow: '0 0 20px rgba(255, 0, 122, 0.3)'
                   }}>
                <Zap className="w-6 h-6 text-black fill-current" />
              </div>
            </div>
            {/* Clean logo text with neon gradient */}
            <h1 className="text-3xl font-bold tracking-wider uppercase font-mono"
                style={{
                  background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              REELIT
            </h1>
          </div>
          <Badge variant="secondary" 
                 className="bg-gray-800/80 text-white border font-mono"
                 style={{ borderColor: '#FF007A' }}>
            MVP • Free
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-gray-800/50 border font-mono"
                 style={{ 
                   borderColor: '#00DDEB',
                   color: '#B0B0B0',
                   backgroundColor: 'rgba(74, 74, 74, 0.3)'
                 }}>
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Content Creation
          </Badge>
          <h2 className="text-5xl font-bold mb-6 font-mono">
            <span style={{ 
              background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CREATE INSTAGRAM CONTENT IN
            </span>
            <span className="block text-white mt-2">1 MINUTE</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-mono"
             style={{ color: '#B0B0B0' }}>
            Transform your videos into engaging Instagram Reels content with AI-generated 
            captions, hashtags, descriptions, and transcripts. Say goodbye to hours of manual work.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg rounded-xl font-bold uppercase font-mono transition-all duration-300 hover:shadow-neon"
            style={{
              background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
              color: 'white',
              border: 'none'
            }}
            onClick={() => setCurrentStep('upload')}
          >
            <Upload className="w-5 h-5 mr-2" />
            UPLOAD YOUR VIDEO
          </Button>
          <p className="text-sm mt-4 font-mono"
             style={{ color: '#B0B0B0' }}>
            Upload videos up to 30 seconds • Completely free to use
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white font-mono uppercase">
            Everything You Need for Instagram Success
          </h3>
          <p className="max-w-2xl mx-auto font-mono"
             style={{ color: '#B0B0B0' }}>
            Our AI analyzes your video and generates all the content you need for your Instagram Reel
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-neon-card"
                style={{ 
                  backgroundColor: 'rgba(74, 74, 74, 0.2)',
                  borderImage: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB) 1'
                }}>
            <CardHeader className="text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #FF6F00)',
                     boxShadow: '0 0 15px rgba(255, 0, 122, 0.3)'
                   }}>
                <Copy className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white font-mono font-bold uppercase">
                Smart Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-center font-mono"
                               style={{ color: '#B0B0B0' }}>
                Accurate speech-to-text conversion using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-neon-card"
                style={{ 
                  backgroundColor: 'rgba(74, 74, 74, 0.2)',
                  borderImage: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB) 1'
                }}>
            <CardHeader className="text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF6F00, #00DDEB)',
                     boxShadow: '0 0 15px rgba(255, 111, 0, 0.3)'
                   }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white font-mono font-bold uppercase">
                Engaging Captions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-center font-mono"
                               style={{ color: '#B0B0B0' }}>
                Hook-worthy captions optimized for Instagram engagement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-neon-card"
                style={{ 
                  backgroundColor: 'rgba(74, 74, 74, 0.2)',
                  borderImage: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB) 1'
                }}>
            <CardHeader className="text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                   style={{ 
                     background: 'linear-gradient(45deg, #00DDEB, #FF007A)',
                     boxShadow: '0 0 15px rgba(0, 221, 235, 0.3)'
                   }}>
                <span className="text-white font-bold text-lg">#</span>
              </div>
              <CardTitle className="text-lg text-white font-mono font-bold uppercase">
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-center font-mono"
                               style={{ color: '#B0B0B0' }}>
                Relevant hashtags to boost your content's discoverability
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-neon-card"
                style={{ 
                  backgroundColor: 'rgba(74, 74, 74, 0.2)',
                  borderImage: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB) 1'
                }}>
            <CardHeader className="text-center p-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #00DDEB)',
                     boxShadow: '0 0 15px rgba(255, 0, 122, 0.3)'
                   }}>
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg text-white font-mono font-bold uppercase">
                One-Tap Copy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-center font-mono"
                               style={{ color: '#B0B0B0' }}>
                Copy all generated content to clipboard with a single click
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl mx-4 p-8 border-2"
             style={{ 
               backgroundColor: 'rgba(74, 74, 74, 0.1)',
               borderImage: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB) 1'
             }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-white font-mono uppercase">
              How Reelit Works
            </h3>
            <p className="font-mono" style={{ color: '#B0B0B0' }}>
              Simple, fast, and effective content creation in 3 steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl font-mono"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #FF6F00)',
                     boxShadow: '0 0 20px rgba(255, 0, 122, 0.4)'
                   }}>
                1
              </div>
              <h4 className="font-semibold mb-2 text-white font-mono uppercase">Upload Video</h4>
              <p className="text-sm font-mono" style={{ color: '#B0B0B0' }}>
                Upload your short video (up to 30 seconds) in MP4 format
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl font-mono"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF6F00, #00DDEB)',
                     boxShadow: '0 0 20px rgba(255, 111, 0, 0.4)'
                   }}>
                2
              </div>
              <h4 className="font-semibold mb-2 text-white font-mono uppercase">AI Processing</h4>
              <p className="text-sm font-mono" style={{ color: '#B0B0B0' }}>
                Our AI analyzes your video and generates optimized content
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl font-mono"
                   style={{ 
                     background: 'linear-gradient(45deg, #00DDEB, #FF007A)',
                     boxShadow: '0 0 20px rgba(0, 221, 235, 0.4)'
                   }}>
                3
              </div>
              <h4 className="font-semibold mb-2 text-white font-mono uppercase">Copy & Post</h4>
              <p className="text-sm font-mono" style={{ color: '#B0B0B0' }}>
                Copy all content with one click and paste directly to Instagram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-white font-mono uppercase">Ready to Save Hours on Content Creation?</h3>
          <p className="mb-8 font-mono" style={{ color: '#B0B0B0' }}>
            Join thousands of creators who have streamlined their Instagram workflow with Reelit
          </p>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg rounded-xl font-bold uppercase font-mono transition-all duration-300 hover:shadow-neon"
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
      <footer className="border-t border-gray-700 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded flex items-center justify-center"
                 style={{ 
                   background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)'
                 }}>
              <Zap className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="font-semibold text-white font-mono">Reelit</span>
          </div>
          <p className="text-sm font-mono" style={{ color: '#B0B0B0' }}>
            Final Year College Project • Built for Instagram Creators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
