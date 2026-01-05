
import React, { useState } from 'react';
import { useProductStore } from '../../../store/useProductStore';
import { Product, ProductStatus } from '../../../types';
import { categories } from '../../../data/mockData';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ProductFormModal from './ProductFormModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { products, deleteProduct, toggleProductStatus } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này không?')) {
      deleteProduct(productId);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Không rõ';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const statusMap = {
      [ProductStatus.AVAILABLE]: {text: 'Đang bán', color: 'text-green-600'},
      [ProductStatus.UNAVAILABLE]: {text: 'Tạm ngưng', color: 'text-gray-500'},
      [ProductStatus.SOLD_OUT]: {text: 'Hết hàng', color: 'text-red-600'},
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Quản lý thực đơn</h2>
        <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm món mới
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Món ăn</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => toggleProductStatus(product.id)}>
                    <span className={`font-semibold px-2 py-1 rounded-full ${statusMap[product.status].color} bg-opacity-20`}>
                      {statusMap[product.status].text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </div>
  );
};

export default MenuManagement;
