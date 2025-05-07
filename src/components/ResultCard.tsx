
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Result } from "@/services/resultService";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResultCardProps {
  result: Result;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800";
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{result.studentName}</CardTitle>
            <CardDescription>ID: {result.studentId} • {result.examName} • {result.semester}</CardDescription>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Overall Grade:</span>
              <Badge className={`text-sm font-bold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Published: {new Date(result.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Performance</span>
            <span>
              {result.obtainedMarks} / {result.totalMarks} ({result.percentage.toFixed(2)}%)
            </span>
          </div>
          <Progress value={result.percentage} className="h-2" />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Marks</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.subjects.map((subject) => (
                <TableRow key={subject.name}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell className="text-right">
                    {subject.marks} / {subject.totalMarks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={`${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">
                  {result.obtainedMarks} / {result.totalMarks}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={`${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
