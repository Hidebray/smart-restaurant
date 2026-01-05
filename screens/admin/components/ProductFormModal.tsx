
import React, { useState, useEffect } from 'react';
import { Product, ProductStatus } from '../../../types';
import { useProductStore } from '../../../store/useProductStore';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { categories } from '../../../data/mockData';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: categories[0]?.id || '',
    status: ProductStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/seed/newitem/400/300'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        status: product.status,
        imageUrl: product.imageUrl
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: categories[0]?.id || '',
        status: ProductStatus.AVAILABLE,
        imageUrl: 'https://picsum.photos/seed/newitem/400/300'
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      updateProduct({ ...product, ...formData });
    } else {
      addProduct(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <Input name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá (VND)</label>
          <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Danh mục</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
          <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit">{product ? 'Lưu thay đổi' : 'Thêm món'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
