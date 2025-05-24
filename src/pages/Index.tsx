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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                   }}>
                <Zap className="w-5 h-5 text-black fill-current" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-wide uppercase"
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
                 className="bg-white/5 text-white border border-white/10 backdrop-blur-sm">
            Beta
          </Badge>
        </div>
      </header>

      {/* Hero Section with Bento Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-6xl font-light mb-6 text-white leading-tight">
            Create stunning
            <span className="block font-bold"
                  style={{ 
                    background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
              short video content
            </span>
            in seconds
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: '#B0B0B0' }}>
            Transform your videos into engaging content with AI-powered captions, hashtags, and descriptions for YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, Snapchat, and more.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          
          {/* Main CTA - Large Card */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group"
                onClick={() => setCurrentStep('upload')}>
            <CardContent className="p-8 h-64 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                   style={{ 
                     background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                   }}>
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload Video</h3>
              <p className="text-sm" style={{ color: '#B0B0B0' }}>
                Start creating amazing content
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: 'linear-gradient(45deg, #FF007A, #FF6F00)' }}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Smart Captions</h4>
              <p className="text-xs" style={{ color: '#B0B0B0' }}>
                AI-generated captions that engage across all platforms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: 'linear-gradient(45deg, #FF6F00, #00DDEB)' }}>
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Trending Tags</h4>
              <p className="text-xs" style={{ color: '#B0B0B0' }}>
                Hashtags that boost reach on all platforms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: 'linear-gradient(45deg, #00DDEB, #FF007A)' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Transcripts</h4>
              <p className="text-xs" style={{ color: '#B0B0B0' }}>
                Accurate speech-to-text for accessibility
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 h-64 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: 'linear-gradient(45deg, #FF007A, #00DDEB)' }}>
                <Copy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">One-Click Copy</h4>
              <p className="text-xs" style={{ color: '#B0B0B0' }}>
                Copy all content instantly
              </p>
            </CardContent>
          </Card>

          {/* Platforms Support - Wide Card */}
          <Card className="md:col-span-4 lg:col-span-6 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Works with all platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-2">
                    <span className="text-red-400 font-bold text-lg">YT</span>
                  </div>
                  <p className="text-sm text-white">YouTube Shorts</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-2">
                    <span className="text-pink-400 font-bold text-lg">TT</span>
                  </div>
                  <p className="text-sm text-white">TikTok</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-2">
                    <span className="text-purple-400 font-bold text-lg">IG</span>
                  </div>
                  <p className="text-sm text-white">Instagram Reels</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-2">
                    <span className="text-blue-400 font-bold text-lg">FB</span>
                  </div>
                  <p className="text-sm text-white">Facebook Reels</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-2">
                    <span className="text-yellow-400 font-bold text-lg">SC</span>
                  </div>
                  <p className="text-sm text-white">Snapchat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it works - Wide Card */}
          <Card className="md:col-span-4 lg:col-span-6 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">How it works</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
                       style={{ background: 'linear-gradient(45deg, #FF007A, #FF6F00)' }}>
                    1
                  </div>
                  <h4 className="font-semibold text-white mb-2">Upload</h4>
                  <p className="text-sm" style={{ color: '#B0B0B0' }}>
                    Upload your short video file
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
                       style={{ background: 'linear-gradient(45deg, #FF6F00, #00DDEB)' }}>
                    2
                  </div>
                  <h4 className="font-semibold text-white mb-2">Process</h4>
                  <p className="text-sm" style={{ color: '#B0B0B0' }}>
                    AI analyzes and generates content
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
                       style={{ background: 'linear-gradient(45deg, #00DDEB, #FF007A)' }}>
                    3
                  </div>
                  <h4 className="font-semibold text-white mb-2">Copy & Post</h4>
                  <p className="text-sm" style={{ color: '#B0B0B0' }}>
                    Copy content to any platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
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
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-24">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-5 h-5 rounded flex items-center justify-center"
                 style={{ 
                   background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)'
                 }}>
              <Zap className="w-3 h-3 text-black fill-current" />
            </div>
            <span className="font-semibold text-white">Reelit</span>
          </div>
          <p className="text-sm" style={{ color: '#B0B0B0' }}>
            Student Project • Built for Short Video Creators
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
