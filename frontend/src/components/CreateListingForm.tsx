'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface CreateListingFormProps {
  onCreateListing?: (data: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) => void;
}

export default function CreateListingForm({ onCreateListing }: CreateListingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!onCreateListing) return;

    setIsSubmitting(true);
    try {
      const price = parseFloat(formData.price) * 1000000; // Convert to microSTX
      const duration = parseInt(formData.duration) * 144; // Convert days to blocks (approx 10 min per block)

      await onCreateListing({
        name: formData.name,
        description: formData.description,
        price,
        duration,
      });

      // Reset form and close dialog
      setFormData({ name: '', description: '', price: '', duration: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
              maxLength={64}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your item"
              maxLength={256}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (STX)</Label>
              <Input
                id="price"
                type="number"
                step="0.000001"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
