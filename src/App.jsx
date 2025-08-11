import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const toolkitData = [
  {
    tool: "Leonardo.AI",
    characteristics: "Feature rich platform. Very limited free credits.",
    howTo: "https://leonardo.ai/learn/",
    icon: "https://github.com/Thomas-Amann-IPAustralia/CreateImageGuide/blob/main/leonardo.png?raw=true",
    site: "https://leonardo.ai/"
  },
  {
    tool: "ChatGPT-5",
    characteristics: "Among highest fidelity. Very slow. Daily upload limits.",
    howTo: "https://help.openai.com/en/articles/8932459-creating-images-with-chatgpt",
    icon: "https://github.com/Thomas-Amann-IPAustralia/CreateImageGuide/blob/main/chatgpt.png?raw=true",
    site: "https://chatgpt.com/"
  },
  {
    tool: "Gemini",
    characteristics: "Fastest outputs. Generally lower quality.",
    howTo: "https://support.google.com/gemini/answer/14286376",
    icon: "https://github.com/Thomas-Amann-IPAustralia/CreateImageGuide/blob/main/gemini.png?raw=true",
    site: "https://gemini.google.com/"
  },
  {
    tool: "Bing Image Creator",
    characteristics: "Ability to switch models. Unlimited generations.",
    howTo: "https://www.microsoft.com/en-us/bing/features/bing-image-creator",
    icon: "https://github.com/Thomas-Amann-IPAustralia/CreateImageGuide/blob/main/bing.png?raw=true",
    site: "https://www.bing.com/create"
  },
  {
    tool: "PhotoPea",
    characteristics: "Not an AI image tool. Use for photo editing.",
    howTo: "https://www.photopea.com/learn/",
    icon: "https://github.com/Thomas-Amann-IPAustralia/CreateImageGuide/blob/main/photopea.png?raw=true",
    site: "https://www.photopea.com/"
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">AI Image Tools Dashboard</h1>
      <Card className="shadow-lg">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Characteristics</TableHead>
                <TableHead>How To</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toolkitData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell><img src={item.icon} alt={item.tool} className="h-10 w-10" /></TableCell>
                  <TableCell className="font-semibold">{item.tool}</TableCell>
                  <TableCell>{item.characteristics}</TableCell>
                  <TableCell><a href={item.howTo} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Guide</a></TableCell>
                  <TableCell><a href={item.site} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Visit</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
