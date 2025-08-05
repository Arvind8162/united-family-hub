import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SearchFilter from '@/components/SearchFilter';
import ImageUpload from '@/components/ImageUpload';

interface Photo {
  id: number;
  title: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  likes: number;
  comments: number;
  image: string;
}

const PhotoGallery = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [photos] = useState<Photo[]>([
    {
      id: 1,
      title: 'Family Gathering 2024',
      category: 'events',
      uploadedBy: 'Rajesh Patel',
      uploadDate: '2024-01-15',
      likes: 25,
      comments: 8,
      image: 'https://via.placeholder.com/400x300/E74C3C/ffffff?text=Family+Gathering'
    },
    {
      id: 2,
      title: 'Community Service Day',
      category: 'community',
      uploadedBy: 'Priya Sharma',
      uploadDate: '2024-01-10',
      likes: 18,
      comments: 5,
      image: 'https://via.placeholder.com/400x300/3498DB/ffffff?text=Service+Day'
    },
    {
      id: 3,
      title: 'Traditional Celebration',
      category: 'festivals',
      uploadedBy: 'Amit Kumar',
      uploadDate: '2024-01-05',
      likes: 42,
      comments: 15,
      image: 'https://via.placeholder.com/400x300/F39C12/ffffff?text=Festival'
    },
    {
      id: 4,
      title: 'Youth Sports Tournament',
      category: 'sports',
      uploadedBy: 'Sunita Verma',
      uploadDate: '2024-01-02',
      likes: 31,
      comments: 12,
      image: 'https://via.placeholder.com/400x300/27AE60/ffffff?text=Sports'
    }
  ]);

  const categories = [
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' },
    { value: 'festivals', label: 'Festivals' },
    { value: 'sports', label: 'Sports' },
    { value: 'family', label: 'Family' }
  ];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (photoId: number) => {
    toast({
      title: "Photo Liked",
      description: "Thank you for your feedback!",
    });
  };

  const handleUpload = (file: File, preview: string) => {
    toast({
      title: "Photo Uploaded",
      description: "Your photo has been uploaded successfully!",
    });
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Photo Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capture and share precious moments from our community events and gatherings.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterValue={filterCategory}
              onFilterChange={setFilterCategory}
              filterOptions={categories}
              placeholder="Search photos..."
              className="flex-1"
            />
            
            {isAdmin && (
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <i className="fas fa-upload mr-2"></i>
                    Upload Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload New Photo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <ImageUpload onImageSelect={handleUpload} />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <i className="fas fa-search-plus text-white text-2xl"></i>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    {photo.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary mb-1 truncate">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">by {photo.uploadedBy}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button 
                        onClick={() => handleLike(photo.id)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <i className="fas fa-heart"></i>
                        <span>{photo.likes}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <i className="fas fa-comment"></i>
                        <span>{photo.comments}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(photo.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-images text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No photos found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Uploaded by <span className="font-semibold">{selectedPhoto.uploadedBy}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedPhoto.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="outline" onClick={() => handleLike(selectedPhoto.id)}>
                      <i className="fas fa-heart mr-2"></i>
                      {selectedPhoto.likes}
                    </Button>
                    <Button size="sm" variant="outline">
                      <i className="fas fa-comment mr-2"></i>
                      {selectedPhoto.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;