
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onStartOver} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Your Content is Ready! 🎉</h1>
            <p className="text-gray-600">Copy and paste directly to Instagram</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700">
          <Check className="w-4 h-4 mr-1" />
          Generated in ~1 minute
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Button
          size="lg"
          onClick={copyAllContent}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Copy className="w-5 h-5 mr-2" />
          Copy All Content
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="w-5 h-5 mr-2" />
          Share Results
        </Button>
        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Export as Text
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Content Cards */}
        <div className="space-y-6">
          {/* Caption Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Instagram Caption</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.caption, "Caption")}
              >
                {copiedItems.includes("Caption") ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed">{content.caption}</p>
              <div className="mt-2 text-xs text-gray-500">
                {content.caption.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Hashtags Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Hashtags</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatHashtags(content.hashtags), "Hashtags")}
              >
                {copiedItems.includes("Hashtags") ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {content.hashtags.length} hashtags
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Description</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.description, "Description")}
              >
                {copiedItems.includes("Description") ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed">{content.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {content.description.length} characters
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transcript and Video Preview */}
        <div className="space-y-6">
          {/* Video Preview */}
          {content.videoFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">{content.videoFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(content.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transcript Card */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg">Full Transcript</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.transcript, "Transcript")}
              >
                {copiedItems.includes("Transcript") ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed text-sm">{content.transcript}</p>
              <div className="mt-2 text-xs text-gray-500">
                {content.transcript.length} characters • Full audio transcription
              </div>
            </CardContent>
          </Card>

          {/* Usage Tips */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">💡 Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-purple-700">
                • Copy the caption first, then add hashtags in comments
              </p>
              <p className="text-sm text-purple-700">
                • Use the description for your bio or story
              </p>
              <p className="text-sm text-purple-700">
                • Save the transcript for future reference
              </p>
              <p className="text-sm text-purple-700">
                • Post during peak hours for maximum engagement
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 text-center space-y-4">
        <Separator />
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={copyAllContent}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy All Content
          </Button>
          <Button variant="outline" size="lg" onClick={onStartOver}>
            Create Another
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Content generated and ready for Instagram! 🚀
        </p>
      </div>
    </div>
  );
};
