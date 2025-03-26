"use client"
import { useState, useEffect } from 'react';

interface Promotion {
  id: number;
  title: string;
  description: string;
  // ... other fields
}

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPromotions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <div>Loading promotions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          {/* ... other columns */}
        </tr>
      </thead>
      <tbody>
        {promotions.map((promotion) => (
          <tr key={promotion.id}>
            <td>{promotion.id}</td>
            <td>{promotion.title}</td>
            <td>{promotion.description}</td>
            {/* ... other cells */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PromotionManagementPage;
