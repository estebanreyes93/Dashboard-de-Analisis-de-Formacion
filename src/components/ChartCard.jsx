import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;

