
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, ArrowLeft, Download, Share2, FileText, Hash, MessageCircle, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentResultsProps {
  content: {
    transcript: string;
    caption: string;
    hashtags: string[];
    description: string;
    videoFile?: File;
  };
  onStartOver: () => void;
}

export const ContentResults = ({ content, onStartOver }: ContentResultsProps) => {
  const [copiedItems, setCopiedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => [...prev, itemType]);
      setTimeout(() => {
        setCopiedItems(prev => prev.filter(item => item !== itemType));
      }, 2000);
      
      toast({
        title: "Copied!",
        description: `${itemType} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const copyAllContent = async () => {
    const allContent = `
CAPTION:
${content.caption}

HASHTAGS:
${content.hashtags.join(' ')}

DESCRIPTION:
${content.description}

TRANSCRIPT:
${content.transcript}
    `.trim();

    await copyToClipboard(allContent, "All Content");
  };

  const formatHashtags = (hashtags: string[]) => {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onStartOver} className="mr-4 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Content Ready!</h1>
              <p className="text-sm text-gray-400">Copy and paste to any short video platform</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
            <Check className="w-4 h-4 mr-1" />
            Ready
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Button
            size="lg"
            onClick={copyAllContent}
            className="h-16 text-lg font-semibold rounded-2xl transition-all duration-300"
            style={{
              background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
              color: 'white',
              border: 'none'
            }}
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy All Content
          </Button>
          <Button variant="outline" size="lg" className="h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl">
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" size="lg" className="h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl">
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Caption Card - Large */}
          <Card className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Universal Caption</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.caption, "Caption")}
                className="text-white hover:bg-white/10"
              >
                {copiedItems.includes("Caption") ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-white leading-relaxed text-lg">{content.caption}</p>
              <div className="mt-4 text-xs text-gray-400">
                {content.caption.length} characters • Works on all platforms
              </div>
            </CardContent>
          </Card>

          {/* Hashtags Card */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-400 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Hashtags</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatHashtags(content.hashtags), "Hashtags")}
                className="text-white hover:bg-white/10"
              >
                {copiedItems.includes("Hashtags") ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white border-none">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-400">
                {content.hashtags.length} hashtags
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Description</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.description, "Description")}
                className="text-white hover:bg-white/10"
              >
                {copiedItems.includes("Description") ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-white leading-relaxed">{content.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                {content.description.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Video Preview */}
          {content.videoFile && (
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Video className="w-5 h-5" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded-lg p-6 text-center">
                  <Video className="w-16 h-16 mx-auto text-white/20 mb-4" />
                  <p className="text-white">{content.videoFile.name}</p>
                  <p className="text-sm text-white/50">
                    {(content.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transcript Card */}
          <Card className="lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Full Transcript</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.transcript, "Transcript")}
                className="text-white hover:bg-white/10"
              >
                {copiedItems.includes("Transcript") ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-white leading-relaxed">{content.transcript}</p>
              <div className="mt-4 text-xs text-gray-400">
                {content.transcript.length} characters • Full audio transcription
              </div>
            </CardContent>
          </Card>

          {/* Platform Tips */}
          <Card className="lg:col-span-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">💡 Platform Tips</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-red-400 mb-2">YouTube Shorts</h4>
                <p className="text-xs text-gray-400">Use description for context</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-pink-400 mb-2">TikTok</h4>
                <p className="text-xs text-gray-400">Keep caption short & punchy</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-purple-400 mb-2">Instagram</h4>
                <p className="text-xs text-gray-400">Add hashtags in comments</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-blue-400 mb-2">Facebook</h4>
                <p className="text-xs text-gray-400">Use full description</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-yellow-400 mb-2">Snapchat</h4>
                <p className="text-xs text-gray-400">Focus on visual appeal</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center space-y-4">
          <Separator className="bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={copyAllContent}
              className="h-14 text-lg rounded-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(45deg, #FF007A, #FF6F00, #00DDEB)',
                color: 'white',
                border: 'none'
              }}
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy All Content
            </Button>
            <Button variant="outline" size="lg" className="h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl" onClick={onStartOver}>
              Create Another
            </Button>
          </div>
          <p className="text-sm text-white/60">
            Content generated and ready to share!
          </p>
        </div>
      </div>
    </div>
  );
};
