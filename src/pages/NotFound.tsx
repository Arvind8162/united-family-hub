import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <i className="fas fa-exclamation-triangle text-6xl text-primary mb-4"></i>
            <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full">
                <i className="fas fa-home mr-2"></i>
                Return to Dashboard
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="w-full">
                <i className="fas fa-info-circle mr-2"></i>
                Learn About Us
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
