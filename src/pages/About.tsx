import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const About = () => {
  const stats = [
    { icon: 'fas fa-users', label: 'Community Members', value: '500+' },
    { icon: 'fas fa-calendar', label: 'Events Organized', value: '150+' },
    { icon: 'fas fa-heart', label: 'Years of Unity', value: '25+' },
    { icon: 'fas fa-globe', label: 'Global Reach', value: '15 Cities' }
  ];

  const values = [
    {
      icon: 'fas fa-handshake',
      title: 'Unity',
      description: 'We believe in the strength of togetherness and mutual support within our community.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Tradition',
      description: 'Preserving our cultural heritage while embracing modern values and progress.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Education',
      description: 'Promoting learning and development for all generations in our community.'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Service',
      description: 'Dedicated to serving our community and contributing to society at large.'
    }
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">About Our Samaj</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are a vibrant community united by shared values, traditions, and a commitment to supporting each other. 
            Our digital platform connects families across the globe, fostering relationships and preserving our cultural heritage.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <i className={`${stat.icon} text-3xl text-primary mb-3`}></i>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              To create a strong, connected community that celebrates our heritage while embracing the future. 
              We strive to provide a platform where families can connect, share experiences, support each other, 
              and work together towards the betterment of our community and society as a whole.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <i className={`${value.icon} text-3xl text-primary mb-4`}></i>
                  <h3 className="text-lg font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* History Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">Our Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">A Legacy of Unity</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Founded over 25 years ago, our samaj has grown from a small group of families to a 
                    thriving community spanning multiple cities and countries. What started as informal 
                    gatherings has evolved into a comprehensive support system.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, we continue to honor our founders' vision of unity, cultural preservation, 
                    and mutual support while adapting to the needs of modern families.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-lg p-8">
                    <i className="fas fa-tree text-6xl text-primary mb-4"></i>
                    <p className="text-primary font-semibold">Growing Together Since 1999</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="mb-6 opacity-90">
                Become part of our extended family and experience the joy of community connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:info@samaj.org" 
                  className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Contact Us
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="bg-transparent border border-primary-foreground text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;