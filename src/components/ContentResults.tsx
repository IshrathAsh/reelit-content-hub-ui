import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, ArrowLeft, Download, Share2, FileText, Hash, MessageCircle, Video, Sparkles } from "lucide-react";
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

    try {
      await navigator.clipboard.writeText(allContent);
      setCopiedItems(prev => [...prev, "All Content"]);
      setTimeout(() => {
        setCopiedItems(prev => prev.filter(item => item !== "All Content"));
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatHashtags = (hashtags: string[]) => {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C2526' }}>
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[100]">
        <div className="space-y-2">
          {copiedItems.map((item) => (
            <div
              key={item}
              className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in backdrop-blur-sm"
            >
              <Check className="w-4 h-4" />
              <span>{item} copied to clipboard</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onStartOver} className="mr-4 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Reelit Logo" className="w-32 h-auto" />
            <div>
              <h1 className="text-2xl font-bold text-white">Content Ready!</h1>
              <p className="text-sm text-gray-400">Copy and paste to any short video platform</p>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
          <Button 
            variant="outline" 
            size="lg" 
            className="h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl"
            onClick={() => {
              const exportContent = `=== REELIT CONTENT EXPORT ===

CAPTION:
${content.caption}

HASHTAGS:
${content.hashtags.join(' ')}

DESCRIPTION:
${content.description}

TRANSCRIPT:
${content.transcript}

=== END OF EXPORT ===`;

              const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reelit-content.txt';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);

              toast({
                title: "Content Exported!",
                description: "Your content has been downloaded as a text file.",
              });
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            Export as Text
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Caption Card - Large */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl">
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
            </CardContent>
          </Card>

          {/* Hashtags Card - Medium */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl">
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
            </CardContent>
          </Card>

          {/* Description Card - Medium */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl">
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
            </CardContent>
          </Card>

          {/* Transcript Card - Medium */}
          <Card className="md:col-span-2 lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg text-white">Transcript</CardTitle>
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
            </CardContent>
          </Card>

          {/* Platform Tips - Full Width */}
          <Card className="col-span-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Platform Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-sm">YT</span>
                    </div>
                    <h4 className="font-semibold text-white">YouTube Shorts</h4>
                  </div>
                  <p className="text-sm text-gray-400">Use the full description for better SEO and context</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <span className="text-pink-400 font-bold text-sm">TT</span>
                    </div>
                    <h4 className="font-semibold text-white">TikTok</h4>
                  </div>
                  <p className="text-sm text-gray-400">Keep captions short and engaging for better reach</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400 font-bold text-sm">IG</span>
                    </div>
                    <h4 className="font-semibold text-white">Instagram</h4>
                  </div>
                  <p className="text-sm text-gray-400">Add hashtags in the first comment for cleaner look</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">FB</span>
                    </div>
                    <h4 className="font-semibold text-white">Facebook</h4>
                  </div>
                  <p className="text-sm text-gray-400">Use the full description for better engagement</p>
              </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-sm">SC</span>
              </div>
                    <h4 className="font-semibold text-white">Snapchat</h4>
              </div>
                  <p className="text-sm text-gray-400">Focus on visual appeal and quick engagement</p>
              </div>
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
