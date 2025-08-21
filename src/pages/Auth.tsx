import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showEmailSent, setShowEmailSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        setMessage({
          type: 'error',
          text: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message
        });
        toast({
          title: "Sign In Failed",
          description: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message,
          variant: "destructive",
        });
      } else {
        setMessage({ type: 'success', text: 'Successfully signed in! Redirecting...' });
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (signUpData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
      
      if (error) {
        setMessage({
          type: 'error',
          text: error.message.includes('User already registered') 
            ? 'An account with this email already exists. Please sign in instead.'
            : error.message
        });
        toast({
          title: "Sign Up Failed",
          description: error.message.includes('User already registered') 
            ? 'An account with this email already exists. Please sign in instead.'
            : error.message,
          variant: "destructive",
        });
      } else {
        setShowEmailSent(true);
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! Please check your email to verify your account.' 
        });
        toast({
          title: "Account Created!",
          description: "Please check your email for verification instructions.",
        });
        // Reset form
        setSignUpData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showEmailSent) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
                  <p className="text-muted-foreground mb-4">
                    We've sent a verification link to <strong>{signUpData.email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to activate your account. You can close this page.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEmailSent(false);
                    setMessage(null);
                  }}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Samaj Setu</h1>
          <p className="text-muted-foreground">Connect with your community</p>
        </div>

        {message && (
          <Alert className={`mb-4 ${message.type === 'error' ? 'border-destructive' : message.type === 'success' ? 'border-green-500' : 'border-blue-500'}`}>
            <div className="flex items-center gap-2">
              {message.type === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
              {message.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertDescription className={message.type === 'error' ? 'text-destructive' : message.type === 'success' ? 'text-green-600' : 'text-blue-600'}>
                {message.text}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => {
                        setSignInData({...signInData, email: e.target.value});
                        setMessage(null);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData({...signInData, password: e.target.value});
                        setMessage(null);
                      }}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Demo Accounts</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can create a new account or use these demo credentials:
                  </p>
                  <div className="text-sm space-y-1">
                    <div><strong>Admin:</strong> admin@demo.com / admin123</div>
                    <div><strong>User:</strong> user@demo.com / user123</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => {
                        setSignUpData({...signUpData, fullName: e.target.value});
                        setMessage(null);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => {
                        setSignUpData({...signUpData, email: e.target.value});
                        setMessage(null);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({...signUpData, password: e.target.value});
                        setMessage(null);
                      }}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => {
                        setSignUpData({...signUpData, confirmPassword: e.target.value});
                        setMessage(null);
                      }}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">Note for testing:</p>
            <p>Email verification is required. Check your email after signing up to activate your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;